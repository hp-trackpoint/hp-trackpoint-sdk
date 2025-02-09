// import { DEVICE_KEY, SDK_VERSION } from '../common'
import { _support } from "../utils/global";
import { uuid } from "../utils/index";
import { options } from "./options";
import { computed } from "../utils/reactivity";
import type { Ref } from "../utils/reactivity";

interface DeviceInfo {
  os: string;
  os_version: string;
  browser: string;
  browser_version: string;
  device_type: string;
  region: string;
}

interface Base extends DeviceInfo {
  user_id: string;
  sdkUserUuid: string;
  appName: string;
  appCode: string;
  pageId: string;
  // sdkVersion: string
  ip: string;
}

export class BaseInfo {
  public base: Ref<Base>;
  public pageId: string = uuid();
  private sdkUserUuid: string = "unit-test-id";
  private device: DeviceInfo;

  constructor() {
    this.device = this.initDevice();

    this.base = computed<Base>(() => ({
      ...this.device,
      user_id: options.value.user_id,
      sdkUserUuid: this.sdkUserUuid,
      appName: options.value.appName,
      appCode: options.value.appCode,
      pageId: this.pageId,
      // sdkVersion: SDK_VERSION,
      ip: "",
    }));

    options.value.sdkUserUuid = this.sdkUserUuid;
    this.reportInit(); // 可添加上报逻辑
  }

  private initDevice(): DeviceInfo {
    return {
      os: navigator.platform || "unknown",
      os_version: navigator.userAgent || "unknown",
      browser: navigator.vendor || "unknown",
      browser_version: navigator.userAgent || "unknown",
      device_type: "unknown",
      region: "unknown",
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
