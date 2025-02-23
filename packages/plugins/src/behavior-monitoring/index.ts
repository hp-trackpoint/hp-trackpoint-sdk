import type { Plugin } from "core/src";
import type { BehaviorMonitoringOptions } from "./types";
import { initClickMonitor } from "./handlers/click";

export class BehaviorMonitoringPlugin implements Plugin {
  name = "BehaviorMonitor";
  private options: BehaviorMonitoringOptions;
  private core: any;

  constructor(options: BehaviorMonitoringOptions = {}) {
    this.options = {
      enableClick: true,
      enablePV: true,
      enableRoute: true,
      ...options,
    };
  }

  /**
   * 安装插件
   */
  install(core: any): void {
    this.core = core;
    // 初始化各个监控模块
    this.initializeBehaviorMonitoring();
  }

  /**
   * 初始化行为监控
   */
  private initializeBehaviorMonitoring(): void {
    // 初始化点击监控
    if (this.options.enableClick) {
      initClickMonitor();
    }
  }
}

export * from "./types";
