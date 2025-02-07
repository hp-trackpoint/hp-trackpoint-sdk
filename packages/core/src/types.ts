interface DeviceInfo {
  os: string;
  os_version: string;
  browser: string;
  browser_version: string;
  device_type: string;
  region: string;
}

// 定义 page_info 对象的类型
interface PageInfo {
  page_url: string;
  referrer: string;
}

// 定义 extra_info 对象的类型
interface ExtraInfo {
  common: number;
  event: string;
}

// 定义整个数据对象的类型
export interface EventData {
  environment: string;     // TODO 待枚举
  event_name: string;
  event_time: number;
  user_id: number;
  cid: string;
  bid: string;
  device_info: DeviceInfo;
  page_info: PageInfo;
  extra_info: ExtraInfo;
  sdk_version: string;
}