import { _support } from "../utils/global";
import { DEVICE_KEY, SDK_VERSION } from "../common";
import {
  uuid,
  getPlatform,
  getCookieByName,
  getOSVersion,
  getUserDeviceType,
  getBrowserInfo,
} from "../utils";
import { options } from "./options";
import { computed } from "../utils/reactivity";
import type { Ref } from "../utils/reactivity";
import { _global } from "../utils/global";
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
  constructor() {
    this.initIP();
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
  private async initIP() {
    try {
      const ips = (await getIPs()) as any[];
      this.ip = ips[0] || "";
    } catch (error) {
      console.error("Failed to get IP:", error);
      this.ip = "";
    }
  }
  private initDevice(): DeviceInfo {
    const { screen } = _global;
    const { clientWidth, clientHeight } = document.documentElement;
    const { width, height } = screen;
    const [browserName, browserVersion] = getBrowserInfo();
    let deviceId = getCookieByName(DEVICE_KEY);
    if (!deviceId) {
      deviceId = `t_${uuid()}`;
      document.cookie = `${DEVICE_KEY}=${deviceId};path=/;`;
    }
    return {
      clientHeight, // 网页可见区高度
      clientWidth, // 网页可见区宽度
      device_id: deviceId, // id
      screenWidth: width, // 显示屏幕的宽度
      screenHeight: height, // 显示屏幕的高度
      os: getPlatform(), // 操作系统
      os_version: getOSVersion(), // 操作系统版本
      browser: browserName, // 浏览器信息
      browser_version: browserVersion, // 浏览器版本 (需要进一步解析)
      device_type: getUserDeviceType(), // 设备类型
      region: "unknown", // 地区 (需要进一步解析)
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
