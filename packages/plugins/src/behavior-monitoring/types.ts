import { EventInfo } from "core/src/types";

/**
 * 行为监控插件配置选项
 */
export interface BehaviorMonitoringOptions {
  /** 是否启用点击监控 */
  enableClick?: boolean;
  /** 是否启用页面浏览监控 */
  enablePV?: boolean;
  /** 是否启用路由监控 */
  enableRoute?: boolean;
  /** 忽略的URL列表 */
  ignoreUrls?: string[];
}

/**
 * 点击事件数据类型
 */
export interface ClickEventData extends EventInfo {
  /** 点击目标 */
  target: {
    /** 标签名 */
    tagName: string;
    /** 类名 */
    className: string;
    /** ID */
    id: string;
    /** 文本内容 */
    innerText: string;
    /** xpath路径 */
    xpath: string;
  };
}

/**
 * 页面访问数据类型
 */
export interface PVEventData {
  /** 访问开始时间 */
  startTime: number;
  /** 访问来源 */
  referrer: string;
  /** 页面停留时间 */
  stayTime?: number;
}

/**
 * 路由变化数据类型
 */
export interface RouteEventData {
  /** 路由来源 */
  from: string;
  /** 路由目标 */
  to: string;
}

// 所有事件数据类型
export type EventData = PVEventData | ClickEventData | RouteEventData;
