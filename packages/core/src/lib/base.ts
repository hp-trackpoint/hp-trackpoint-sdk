import { _support } from "../utils/global";
import { SDK_VERSION } from "../common";
import {
  uuid,
  getPlatform,
  getOSVersion,
  getUserDeviceType,
  getUserLocation,
  getBrowserInfo,
} from "../utils";
import { options } from "./options";
import { computed } from "../utils/reactivity";
import type { Ref } from "../utils/reactivity";
import { DeviceInfo } from "../types";
import { getIPs } from "../utils/getIps";

interface Base extends DeviceInfo {
  user_id: string;
  sdkUserUuid: string;
  appName: string;
  appCode: string;
  pageId: string;
  sdkVersion: string;
  ip: string;
}

export class BaseInfo {
  public base: Ref<Base>;
  public pageId: string = uuid();
  private sdkUserUuid: string = "unit-test-id";
  private device: DeviceInfo;
  private ip: string = "";
  private region: string = "";
  constructor() {
    this.initIP();
    this.initRegion();
    this.device = this.initDevice();

    this.base = computed<Base>(() => ({
      ...this.device,
      user_id: options.value.user_id,
      sdkUserUuid: this.sdkUserUuid,
      appName: options.value.appName,
      appCode: options.value.appCode,
      pageId: this.pageId,
      sdkVersion: SDK_VERSION,
      ip: this.ip,
    }));

    options.value.sdkUserUuid = this.sdkUserUuid;
    this.reportInit(); // 可添加上报逻辑
  }
  private async initRegion() {
    try {
      const { region } = await getUserLocation();
      this.region = region || "unknown";
    } catch (error) {
      console.error("Failed to get region:", error);
      this.region = "";
    }
  }
  private async initIP() {
    try {
      const ips = (await getIPs()) as any[];
      this.ip = ips[0] || "";
    } catch (error) {
      console.error("Failed to get IP:", error);
      this.ip = "";
    }
  }
  private async getUserLocation() {
    try {
      const { region } = await getUserLocation();
      return region;
    } catch (error) {
      console.error("Failed to get user location:", error);
      return "";
    }
  }
  private initDevice(): DeviceInfo {
    this.getUserLocation();
    const [browserName, browserVersion] = getBrowserInfo();
    return {
      os: getPlatform(), // 操作系统
      os_version: getOSVersion(), // 操作系统版本
      browser: browserName, // 浏览器信息
      browser_version: browserVersion, // 浏览器版本 (需要进一步解析)
      device_type: getUserDeviceType(), // 设备类型
      region: this.region, // 地区 (需要进一步解析)
    };
  }

  private reportInit() {
    // TODO: transport.emit({}) // 上报初始化事件
    // 例如transport要构建空的事件队列
  }
}
export let baseInfo: BaseInfo;

export function initBase() {
  baseInfo = new BaseInfo();
  _support.baseInfo = baseInfo;
}
