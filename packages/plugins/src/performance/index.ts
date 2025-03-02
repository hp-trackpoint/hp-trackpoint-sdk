// 性能监控插件
import type { Plugin } from "@tracking-sdk/core/src";
import getBasic from "./libs/basic";
import { PerformanceOptions } from "./types";

export class PerformancePlugin implements Plugin {
  name = "PerformancePlugin";
  private options: PerformanceOptions;
  private core: any;

  constructor(options: PerformanceOptions = {}) {
    this.options = {
      enableBasic: true,
    };
  }
  install(core: any): void {
    this.core = core;
    this.initializePerformance();
  }
  private initializePerformance(): void {
    if (this.options.enableBasic) {
      console.log(getBasic());
    }
  }
}
