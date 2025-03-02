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
  userId: string;
  environment: "test" | "dev" | "production";
  sdkVersion: string;
}

export class BaseInfo {
  public base: Ref<Base>;
  public pageId: string = uuid();
  private sdkUserUuid: string = "unit-test-id";
  private device: DeviceInfo = {
    os: "",
    osVersion: "",
    browser: "",
    browserVersion: "",
    deviceType: "unknown",
    region: "pendding", // 给个初始值
  };
  private ip: string = ""; //暂时仅用于获取
  constructor() {
    this.initIP(); // 当前公参没用到IP，可考虑删去
    this.initRegion();
    this.device = this.initDevice();

    this.base = computed<Base>(() => ({
      ...this.device,
      environment: "test",
      userId: uuid(),
      sdkVersion: SDK_VERSION,
    }));

    options.value.sdkUserUuid = this.sdkUserUuid;
    this.reportInit(); // 可添加上报逻辑
  }
  private async initRegion() {
    try {
      const { region } = await getUserLocation();
      this.device.region = region || "unknown";
    } catch (error) {
      console.error("Failed to get region:", error);
      this.device.region = "";
    }
  }
  private async initIP() {
    try {
      const ips = await getIPs().IPv4(2000);
      // const ips = (await getIPs()) as any[];
      this.ip = ips[0] || "";
    } catch (error) {
      console.error("Failed to get IP:", error);
      this.ip = "";
    }
  }
  private initDevice(): DeviceInfo {
    this.initRegion();
    const [browserName, browserVersion] = getBrowserInfo();
    return {
      os: getPlatform(), // 操作系统
      osVersion: getOSVersion(), // 操作系统版本
      browser: browserName, // 浏览器信息
      browserVersion: browserVersion, // 浏览器版本 (需要进一步解析)
      deviceType: getUserDeviceType(), // 设备类型
      region: this.device.region ?? "unknown", // 地区 (需要进一步解析)
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
