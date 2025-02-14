import type { InternalOptions, InitOptions } from '../optionType'
import { typeofAny, deepAssign } from '../utils/index'
import { _support } from '../utils/global'
import { ref } from '../utils/reactivity'
import type { Ref } from '../utils/reactivity'

/**
 * 管理全局的参数，负责 SDK 配置的管理
 */


export class Options implements InternalOptions {
  dsn = '' // 上报地址
  methods: 'XHR' | 'BEACON' = 'XHR' // 上报方式
  appName = '' // 应用名称
  appCode = '' // 应用code
  appVersion = '' // 应用版本
  user_id = '' // 用户id(外部填充进来的id)
  sdkUserUuid = '' // 用户id(sdk内部生成的id)
  debug = false // 是否开启调试模式(控制台会输出sdk动作)
  error = {
    core: false, // 是否采集异常数据(ps: 资源引入错误,promise错误,控制台输出错误)
    server: false // 接口请求-是否采集报错接口数据
  }

  constructor(initOptions: InitOptions) {
    const _options = this.transitionOptions(initOptions)
    deepAssign<Options>(this, _options)
  }

  /**
   * 对入参配置项进行转换
   */
  private transitionOptions(options: InitOptions): Options {
    const _options = deepAssign<Options>({}, this, options)
    const { error } = _options
    if (typeof error === 'boolean') {
      _options.error = {
        core: error,
        server: error
      }
    }
    return _options
  }
}

export let options: Ref<InternalOptions>

/**
 * 初始化参数
 * @param initOptions 原始参数
 * @returns 是否初始化成功
 */
export function initOptions(initOptions: InitOptions): boolean {
  options = ref(new Options(initOptions))
  _support.options = options
  return true
}