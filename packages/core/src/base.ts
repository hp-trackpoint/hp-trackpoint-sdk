import { DeviceInfo, AnyObj, ObserverValue } from "./types";
import { DEVICE_KEY, SDK_VERSION } from "./common";
import { type EventData } from "./types";
import { getCookieByName, uuid } from "./utils";
import { getSessionId } from "./utils/session";
import { getGlobal, isTestEnv } from "./utils/global";
import { load } from "./utils/fingerprintjs";
import { getIPs } from "./utils/getIps";
import { transport } from "./transport";
import { computed } from "./observer"; //observer为SDK实现响应式特点
interface Base extends DeviceInfo {
  userUuid: string;
  sdkUserUuid: string;
  ext: AnyObj;
  appName: string;
  appCode: string;
  pageId: string;
  sessionId: string;
  sdkVersion: string;
  ip: string;
}
export const tempTemplateEvent: EventData = {
  // TODO 后续会陆续实现方法以实现SDK挂载后初始信息的上报
  environment: "test",
  event_name: "pageView",
  event_time: 1698765432000,
  user_id: 12345,
  cid: "123-bs",
  device_info: {
    os: "Windows",
    os_version: "10",
    browser: "Chrome",
    browser_version: "",
    device_type: "Desktop",
    region: "beijing",
    clientHeight: 0,
    clientWidth: 0,
    screenWidth: 0,
    screenHeight: 0,
    device_id: "",
  },
  bid: "default-bid",
  page_info: {
    page_url: "https://example.com/home",
    referrer: "https://example.com/login",
  },
  extra_info: {
    common: 1,
    event: "bar",
  },
  sdk_version: "1.0.0",
};
export class BaseInfo {
  public base: ObserverValue<Base> | undefined;
  public pageId: string;
  private sdkUserUuid = "";
  private device: DeviceInfo | undefined;
  // 基础信息是否初始化成功
  public _initSuccess = false;

  constructor() {
    this.pageId = uuid(); // 当前应用ID，在整个页面生命周期内不变，单页应用路由变化也不会改变；加载SDK时创建且只创建一次

    this.initSdkUserUuid()
      .then(() => {
        this.initDevice();
        this.initBase();
      })
      .finally(() => {
        this._initSuccess = true;
        transport.send(tempTemplateEvent);
      });
  }
  private initDevice() {
    const { screen } = getGlobal();
    const { clientWidth, clientHeight } = document.documentElement;
    const { width, height } = screen;
    let deviceId = getCookieByName(DEVICE_KEY);
    if (!deviceId) {
      deviceId = `t_${uuid()}`;
      document.cookie = `${DEVICE_KEY}=${deviceId};path=/;`;
    }
    this.device = {
      clientHeight, // 网页可见区高度
      clientWidth, // 网页可见区宽度
      device_id: deviceId, // id
      screenWidth: width, // 显示屏幕的宽度
      screenHeight: height, // 显示屏幕的高度
      os: getPlatform(), // 操作系统
      os_version: getOSVersion(), // 操作系统版本
      browser: navigator.userAgent, // 浏览器信息
      browser_version: "", // 浏览器版本 (需要进一步解析)
      device_type: "Desktop", // 设备类型
      region: "unknown", // 地区 (需要进一步解析)
    };
  }
  /**
   * 初始化 base 数据
   */
  private initBase() {
    // 与一般业务上理解的sessionId做区分,此session与业务无关,单纯就是浏览器端和后端直接的联系
    const sessionId = getSessionId();
    let ip = "";

    this.base = computed<Base>(() => ({
      ...this.device!,
      userUuid: "temp",
      sdkUserUuid: this.sdkUserUuid,
      ext: "temp",
      appName: "temp",
      appCode: "temp",
      pageId: this.pageId,
      sessionId,
      sdkVersion: SDK_VERSION,
      ip,
    }));

    if (!isTestEnv) {
      getIPs().then((res: any) => {
        this.base!.value.ip = res[0];
        ip = res[0];
      });
    }
  }
  /**
   * 初始化sdk中给用户的唯一标识
   */
  private initSdkUserUuid() {
    return isTestEnv
      ? Promise.resolve().then(() => {
          this.sdkUserUuid = "unit-test-id";
          //   options.value.sdkUserUuid = "unit-test-id";
        })
      : load({})
          .then((fp: any) => fp.get())
          .then((result: any) => {
            const visitorId = result.visitorId;
            this.sdkUserUuid = visitorId;
            // options.value.sdkUserUuid = visitorId;
          });
  }
}
function getPlatform() {
  const ua = navigator.userAgent;
  if (ua.includes("Mac")) return "MacOS";
  if (ua.includes("Win")) return "Windows";
  if (ua.includes("Linux")) return "Linux";
  if (ua.includes("iPhone")) return "iOS";
  if (ua.includes("Android")) return "Android";
  return "Unknown";
}
function getOSVersion(): string {
  const ua = navigator.userAgent;
  // Windows
  const windowsMatch = ua.match(/Windows NT (\d+\.?\d*)/);
  if (windowsMatch) {
    const versions: { [key: string]: string } = {
      "10.0": "Windows 10",
      "6.3": "Windows 8.1",
      "6.2": "Windows 8",
      "6.1": "Windows 7",
      "6.0": "Windows Vista",
      "5.2": "Windows XP 64-bit",
      "5.1": "Windows XP",
    };
    return versions[windowsMatch[1]] || `Windows NT ${windowsMatch[1]}`;
  }

  // macOS
  const macMatch = ua.match(/Mac OS X (\d+[._]\d+[._]\d+)/);
  if (macMatch) {
    return `macOS ${macMatch[1].replace(/_/g, ".")}`;
  }

  // iOS
  const iosMatch = ua.match(/OS (\d+[._]\d+[._]?\d*).*like Mac OS X/);
  if (iosMatch) {
    return `iOS ${iosMatch[1].replace(/_/g, ".")}`;
  }

  // Android
  const androidMatch = ua.match(/Android (\d+\.?\d*\.?\d*)/);
  if (androidMatch) {
    return `Android ${androidMatch[1]}`;
  }

  return "Unknown OS Version";
}
