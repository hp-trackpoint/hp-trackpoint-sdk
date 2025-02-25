export enum PerformanceFeat {
  BASIC = "basic",
  RESOURCE = "resource",
  FMP = "fmp",
  FPS = "fps",
  VITALS = "vitals",
}

export interface PerformanceOptions {
  enableBasic?: boolean;
}
