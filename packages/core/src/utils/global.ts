import { WebTracing } from '../optionType'

declare global {
  interface Window {
    __webTracingInit__?: boolean;
    __webTracing__?: WebTracing;
  }
}

/**
 * 获取全局变量（直接使用 window）
 */
const _global = window

/**
 * 获取 WebTracing 全局对象
 */
const _support = _global.__webTracing__ || (_global.__webTracing__ = {} as WebTracing)

/**
 * 判断 SDK 是否初始化
 */
export function isInit(): boolean {
  return !!_global.__webTracingInit__
}

export { _global, _support }
