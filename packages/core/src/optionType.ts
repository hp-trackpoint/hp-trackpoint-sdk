import type { BaseInfo } from './lib/base'
import type { Ref } from './utils/reactivity'

/**
 * 负责 SDK 配置的类型定义
 */


export type WebTracing = {
  baseInfo: BaseInfo
  transport: any
  options: Ref<InternalOptions> // 配置信息
}

interface Error {
  core?: boolean // 是否采集异常数据
  server?: boolean // 是否采集报错接口数据
}
/**
 * sdk内部配置
 */
export type InternalOptions = {
  dsn: string // 上报地址
  appName: string // 应用名称
  appCode: string // 应用code
  appVersion: string // 应用版本
  user_id: string // 用户id(业务层)
  sdkUserUuid: string // 用户id（唯一）
  debug: boolean // 是否开启调试模式(控制台会输出sdk动作)
  error: Error//举例：是否采集异常数据
}

/**
 * sdk初始化入参配置
 */
export type InitOptions = {
  dsn: string // 上报地址
  appName: string // 应用名称
  appCode?: string // 应用code
  appVersion?: string // 应用版本
  user_id?: string // 用户id(外部填充进来的id)
  debug?: boolean // 是否开启调试模式(控制台会输出sdk动作)
  error?: Error | boolean
}


export type AnyFun = {
  (...args: any[]): any
}

export type AnyObj<T = any> = {
  [key: string]: T
}

export interface Transport {
  baseInfo: object
  eventInfo: unknown[]
}