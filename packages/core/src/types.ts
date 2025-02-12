type DeviceType = "desktop" | "mobile" | "unknown";

// export interface DeviceInfo {
//   device_id: string;
//   os: string;
//   os_version: string;
//   browser: string;
//   browser_version: string;
//   device_type: DeviceType;
//   region: string;
//   clientHeight: number;
//   clientWidth: number; // 网页可见区宽度
//   screenWidth: number;
//   screenHeight: number; // 显示屏幕的高度
// }

/**
 * 设备信息类型声明
 */
export interface DeviceInfo {
  device_id: string;
  os: string;
  os_version: string;
  browser: string;
  browser_version: string;
  device_type: DeviceType;
  region: string;
  clientHeight: number;
  clientWidth: number; // 网页可见区宽度
  screenWidth: number;
  screenHeight: number; // 显示屏幕的高度
}

/**
 * 事件信息中的页面信息类型声明
 */
interface PageInfo {
  /** 当前页面的 URL */
  pageUrl: string;
  /** 来源页面的 URL */
  referrer: string;
}

/**
 * 事件信息中的额外信息类型声明
 */
interface ExtraInfo {
  /** 自定义通用参数，给业务用的参数 */
  common: number;
  /** 自定义事件信息 */
  event: string;
}

/**
 * 事件信息中的单个事件类型声明
 */
export interface EventInfo {
  /** 事件类型，例：click、page */
  eventType: string;
  /** 事件名称，例：pageView */
  eventName: string;
  /** 事件时间，时间戳，单位为毫秒 */
  eventTime: number;
  /** 埋点平台对应事件ID，用于区分不同埋点事件 */
  cid: string;
  /** 业务ID，用于标识不同的业务 */
  bid: string;
  /** 页面信息对象 */
  pageInfo: PageInfo;
  /** 额外信息对象 */
  extraInfo: ExtraInfo;
}

/**
 * 基本信息类型声明
 */
export interface BaseInfo {
  /** 环境信息 */
  environment: "test" | "dev" | "production";
  /** 用户ID */
  userId: string;
  /** 设备信息对象 */
  deviceInfo: DeviceInfo;
  /** SDK版本号，例：1.0.0 */
  sdkVersion: string;
}

/**
 * 整个请求数据类型声明
 */
export interface RequestData {
  /** 基本信息对象 */
  baseInfo: BaseInfo;
  /** 事件信息数组，包含多个事件对象 */
  eventInfo: EventInfo[];
}

interface Pv {
  core?: boolean; // 是否发送页面跳转相关数据
}

/**
 * sdk内部配置
 */
export type InternalOptions = {
  dsn: string; // 上报地址
  appName: string; // 应用名称
  appCode: string; // 应用code
  appVersion: string; // 应用版本
  userUuid: string; // 用户id(外部填充进来的id)
  sdkUserUuid: string; // 用户id(sdk内部生成的id)
  debug: boolean; // 是否开启调试模式(控制台会输出sdk动作)
  pv: Pv;
  performance?: Performance;
  error: Error;
  event: Event;
  ext: AnyObj; // 自定义全局附加参数(放在baseInfo中)
  tracesSampleRate: number; // 抽样发送
  cacheMaxLength: number; // 上报数据最大缓存数
  cacheWatingTime: number; // 上报数据最大等待时间
  ignoreErrors: Array<string | RegExp>; // 错误类型事件过滤
  ignoreRequest: Array<string | RegExp>; // 请求类型事件过滤
  scopeError: boolean; // 当某个时间段报错时，会将此类错误转为特殊错误类型，会新增错误持续时间范围
  localization: boolean; // 是否本地化：sdk不再主动发送事件，事件都存储在本地，由用户手动调用方法发送
  sendTypeByXmlBody?: boolean; // 是否强制指定发送形式为xml，body请求方式
  // whiteScreen: boolean // 开启白屏检测
  beforePushEventList: AnyFun[]; // 添加到行为列表前的 hook (在这里面可以给出错误类型，然后就能达到用户想拿到是何种事件类型的触发)
  beforeSendData: AnyFun[]; // 数据上报前的 hook
  afterSendData: AnyFun[]; // 数据上报后的 hook
  localizationOverFlow: VoidFun; // 本地化存储溢出后的回调
  recordScreen: boolean; // 是否启动录屏
};

/**
 * sdk初始化入参配置
 */
export type InitOptions = {
  dsn: string; // 上报地址
  appName: string; // 应用名称
  appCode?: string; // 应用code
  appVersion?: string; // 应用版本
  userUuid?: string; // 用户id(外部填充进来的id)
  debug?: boolean; // 是否开启调试模式(控制台会输出sdk动作)
  pv?: Pv | boolean;
  performance?: Performance | boolean;
  error?: Error | boolean;
  event?: Event | boolean;
  ext?: { [key: string]: any }; // 自定义全局附加参数(放在baseInfo中)
  tracesSampleRate?: number; // 抽样发送
  cacheMaxLength?: number; // 上报数据最大缓存数
  cacheWatingTime?: number; // 上报数据最大等待时间
  ignoreErrors?: Array<string | RegExp>; // 错误类型事件过滤
  ignoreRequest?: Array<string | RegExp>; // 请求类型事件过滤
  scopeError?: boolean; // 当某个时间段报错时，会将此类错误转为特殊错误类型，会新增错误持续时间范围
  localization?: boolean; // 是否本地化：sdk不再主动发送事件，事件都存储在本地，由用户手动调用方法发送
  sendTypeByXmlBody?: boolean; // 是否强制指定发送形式为xml，body请求方式
  // whiteScreen?: boolean // 开启白屏检测
  beforePushEventList?: (data: any) => any; // 添加到行为列表前的 hook (在这里面可以给出错误类型，然后就能达到用户想拿到是何种事件类型的触发)
  beforeSendData?: (data: any) => any; // 数据上报前的 hook
  afterSendData?: (data: any) => void; // 数据上报后的 hook
  recordScreen?: boolean; // 是否启动录屏
};

// 功能实现无关或弱相关
export type AnyObj<T = any> = {
  [key: string]: T;
};
export interface ObserverValue<T> {
  value: T;
}
export type AnyFun = {
  (...args: any[]): any;
};
export type VoidFun = {
  (...args: any[]): void;
};
