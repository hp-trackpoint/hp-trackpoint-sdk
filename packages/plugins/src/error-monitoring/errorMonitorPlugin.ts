import { exportMethods } from "../../../core/src/index";
import type { Plugin } from "@tracking-sdk/core/src";
import type { ExceptionMetrics, StackFrame } from "./type";
import { mechanismType } from "./type";
import { parseStackFrames } from "./utils/stackParser";

export class ErrorMonitoringPlugin implements Plugin {
  name = "error-monitoring";
  private core: any;
  private reportedErrors = new Map<string, number>();
  private DEBOUNCE_TIME = 1000;

  install(core: any): void {
    this.core = core;

    // 处理 JS 错误
    window.onerror = (message, source, lineno, colno, error) => {
      console.log("Error triggered", { message, source, lineno, colno, stack: error?.stack });
      let errorMessage = typeof message === "string" ? message : "Unknown error";
      let errorSource = typeof source === "string" ? source : "Unknown source";
      if (!(error instanceof Error)) {
        error = new Error(errorMessage);
      }
      const errorUid = `${Date.now()}`;
      if (this.isRecentlyReported(errorUid)) return;
      
      const frames = parseStackFrames(error) as StackFrame[];
      const nodeModulesPattern = /\/node_modules\//;
      if (typeof errorSource === "string" && nodeModulesPattern.test(errorSource)) {

        console.log("过滤");
        return; // 过滤掉 node_modules 里的错误
      }

      const data: ExceptionMetrics = {
        mechanism: mechanismType.JS,
        type: "js-error",
        value: errorMessage,
        stackTrace: frames.length > 0 ? frames[0] : undefined, // 修复点：检查 frames 是否为空
        errorUid,
        eventTime: Date.now(),
      };
      
      

      this.errorSendHandler(data);
    };

    // 处理未捕获的 Promise 错误
    window.addEventListener("unhandledrejection", (event) => {
      const { reason } = event;
      const errorUid = `${Date.now()}`;
      if (this.isRecentlyReported(errorUid)) return;

      const frames = (reason instanceof Error ? parseStackFrames(reason) : [] )as StackFrame[];
      const data: ExceptionMetrics = {
        mechanism: mechanismType.UJ,
        type: "promise-error",
        value: reason.message || "Unhandled Promise Rejection",
        stackTrace: frames[0],
        errorUid,
        eventTime: Date.now(),
      };

      this.errorSendHandler(data);
    });

    // 处理资源加载错误
    window.addEventListener(
      "error",
      (event: Event) => {
        const target = event.target as HTMLElement;
        if (!(target instanceof HTMLImageElement || target instanceof HTMLScriptElement || target instanceof HTMLLinkElement)) {
          return;
        }

        const errorUid = `${Date.now()}`;
        if (this.isRecentlyReported(errorUid)) return;

        const data: ExceptionMetrics = {
          mechanism: mechanismType.RS,
          type: "resource-error",
          value: `资源加载错误: ${target instanceof HTMLLinkElement ? target.href : target.src}`,
          errorUid,
          eventTime: Date.now(),
        };

        this.errorSendHandler(data);
      },
      true
    );

    console.log("错误监控插件已安装");
  }

  private errorSendHandler(data: ExceptionMetrics): void {
    exportMethods.transportData("error", data.eventTime, data.type, {
      common: Number(data.errorUid),
      event: data.value as string,
    });
  }

  private isRecentlyReported(errorUid: string): boolean {
    const lastReportedTime = this.reportedErrors.get(errorUid);
    if (lastReportedTime && Date.now() - lastReportedTime < this.DEBOUNCE_TIME) {
      return true;
    }
    this.reportedErrors.set(errorUid, Date.now());
    return false;
  }
}
