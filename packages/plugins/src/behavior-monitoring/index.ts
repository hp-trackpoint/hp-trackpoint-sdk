import type { Plugin } from "@tracking-sdk/core/src";

import type { BehaviorMonitoringOptions } from "./types";
import { initClickMonitor } from "./handlers/click";
import { initPVMonitor } from "./handlers/pv";
import { initRouteMonitor } from "./handlers/route";
import { setIgnoreUrls } from "./utils";

export class BehaviorMonitoringPlugin implements Plugin {
  name = "BehaviorMonitor";
  private options: BehaviorMonitoringOptions;
  private core: any;

  constructor(options: BehaviorMonitoringOptions = {}) {
    this.options = {
      enableClick: true,
      enablePV: true,
      enableRoute: true,
      ignoreUrls: [""],
      ...options,
    };
  }

  /**
   * 安装插件
   */
  install(core: any): void {
    this.core = core;
    // 设置忽略的url列表
    setIgnoreUrls(this.options.ignoreUrls || []);
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
    if (this.options.enablePV) {
      initPVMonitor();
    }
    if (this.options.enableRoute) {
      initRouteMonitor();
    }
  }
}

export * from "./types";
