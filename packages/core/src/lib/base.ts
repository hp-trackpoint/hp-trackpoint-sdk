import { DeviceInfo, AnyObj, ObserverValue } from "../types";
import { DEVICE_KEY, SDK_VERSION } from "../common";
import { SDKENVIRONMENT } from "../common/constant";
import { type EventData } from "../types";
import {
  getCookieByName,
  uuid,
  getBrowserInfo,
  getOSVersion,
  getOsName,
  getUserLocation,
  getUserDeviceType,
  getLocationHref,
} from "../utils";
import { getSessionId } from "../utils/session";
import { getGlobal, isTestEnv, _support } from "../utils/global";
import { load } from "../utils/fingerprintjs";
import { getIPs } from "../utils/getIps";
import { transport } from "../transport";
import { computed } from "../observer"; //observer为SDK实现响应式特点
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
const tempTemplateEvent: EventData = {
  // TODO 后续会陆续实现方法以实现SDK挂载后初始信息的上报
  environment: SDKENVIRONMENT.TEST,
  event_name: "pageView", // 是否用constant.ts？ 如SEDNEVENTTYPES.pv
  event_time: Date.now(), // 是否需要约束时间格式
  user_id: 12345, // SDK 初始化时配置项中获取？ 看web-tracing是这样
  cid: "123-bs", // 页面id
  device_info: {
    os: getOsName(),
    os_version: getOSVersion(),
    browser: getBrowserInfo()[0],
    browser_version: getBrowserInfo()[1],
    device_type: getUserDeviceType(),
    region: "getuserlocation func",
    clientHeight: 0,
    clientWidth: 0,
    screenWidth: 0,
    screenHeight: 0,
    device_id: "", // getCookieByName(DEVICE_KEY)
  },
  bid: "temp", // 埋点模块
  page_info: {
    page_url: getLocationHref(), // 当前页面的url
    referrer: document.referrer, // 上一个页面的url,没有则值为''
  },
  extra_info: {
    common: 1,
    event: "bar",
  },
  sdk_version: SDK_VERSION, //根目录 pacages.json
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
  private async initDevice() {
    const { screen } = getGlobal();
    const { clientWidth, clientHeight } = document.documentElement;
    const { width, height } = screen;
    const [browserName, browserVersion] = getBrowserInfo();
    const locationData = await getUserLocation();
    const { region } = locationData;
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
      os: getOsName(), // 操作系统
      os_version: getOSVersion(), // 操作系统版本
      browser: browserName, // 浏览器 产品名称
      browser_version: browserVersion, // 浏览器版本
      device_type: getUserDeviceType(), // 设备类型
      region: region, // 地区 通过ip获取
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
export let baseInfo: BaseInfo;

export function initBase() {
  baseInfo = new BaseInfo();
  _support.baseInfo = baseInfo;
}
