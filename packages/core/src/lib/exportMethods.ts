import type { InternalOptions } from "../optionType";
import { options } from "./options";
import { _support } from "../utils/global";
import { getIPs as _getIPs } from "../utils/getIps";
import { validateMethods, deepCopy } from "../utils/index";
import { transport } from "./transport";

/**
 * TODO 测试完可以删除
 * 测试发送数据
 * 直接在项目中调用此方法实现数据上报
 */
export const transportData = (
    eventName:string = "default_event",
    eventTime:number = Date.now(),
    eventType:string = "default_type",
    extraInfo: { common: number; event: string } = { common: 1, event: "default_event" }
  ) => {
  transport.send({
    bid: "222",
    cid: "home_page",
    eventName,
    eventTime,
    eventType,
    extraInfo,
    pageInfo: {
      pageUrl: "http://localhost:3000/",
      referrer: "http://localhost:3000/",
    },
  });
};

type ExportMethodsType = {
  transportData: () => void;
  setUserUuid: (id: string) => void;
  getUserUuid: () => string | void;
  getBaseInfo: () => object | void;
  getOptions: () => InternalOptions;
};

// 确保 exportMethods 类型符合定义的结构
export const exportMethods: ExportMethodsType = {
  transportData,
  setUserUuid,
  getUserUuid,
  getBaseInfo,
  getOptions,
};

/**
 * 设置用户id
 * @param id 用户id
 */
export function setUserUuid(id: string): void {
  if (!validateMethods("setUserUuid")) return;

  options.value.user_id = id;
}

/**
 * 获取用户id（此id是手动设置的id）
 */
export function getUserUuid(): string | void {
  if (!validateMethods("getUserUuid")) return;

  return options.value.user_id;
}

/**
 * 获取sdk中的用户id
 */
export function getSDKUserUuid(): string | void {
  if (!validateMethods("getSDKUserUuid")) return;

  return options.value.sdkUserUuid;
}

/**
 * 获取在sdk中记录的所有基础的信息（包括硬件，地理位置等等）
 */
export function getBaseInfo(): object | void {
  if (!validateMethods("getBaseInfo")) return;

  return {
    ..._support.baseInfo.base,
    user_id: options.value.user_id,
  };
}

/**
 * 获取sdk内部的参数配置
 * 这个参数配置并不是入参配置，sdk内部的参数是整理过后的
 */
export function getOptions(): InternalOptions {
  return deepCopy(options.value);
}

export type { ExportMethodsType };
