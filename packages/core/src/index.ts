// 核心模块入口文件
import type { InitOptions } from './optionType'//用户传入的options
import { initBase } from './lib/base'//初始化 SDK 的基础信息
import { initTransport } from './lib/transport'//初始化上报
import { initOptions, options as _options } from './lib/options'
import { _global } from './utils/global'//SDK内部的全局对象，用于存储SDK的初始化状态
import { logError } from './utils/debug'//错误日志输出
import type { ExportMethodsType } from './lib/exportMethods';  // 导入类型
import * as exportMethods from './lib/exportMethods'//SDK的公共API
import { Pluginlist } from '../../plugins/src/examplePlugin';  // 导入插件
// 定义插件接口
type Plugin = {
    name: string//插件名称
    install: (core: typeof sdkCore) => void//插件接收core作为参数
}

// 定义 SDK 核心类
class SDK {
    options: typeof _options
    logError: typeof logError
    plugins: Plugin[]
    exportMethods: ExportMethodsType; 
    
    constructor() {
      this.options = _options
      this.logError = logError
      this.plugins = []
      this.exportMethods = exportMethods; 
    }
  
    // 初始化方法
    init(options: InitOptions & { plugins?: Plugin[] }): void {
      if (_global.__webTracingInit__ || !initOptions(options)) return
      [initBase, initTransport].forEach(fn => fn())
      
      // 用户在init时传入需要的插件
      const allPlugins = [...(options.plugins || []), ...Pluginlist]
      allPlugins.forEach(plugin => this.use(plugin))
      
      _global.__webTracingInit__ = true
      console.log(_global.__webTracingInit__,"SDK初始化成功",options,this.plugins);
    }
  
    // 注册插件
    use(plugin: Plugin) {
      if (!plugin || typeof plugin.install !== 'function') {
        console.warn(`Invalid plugin:`, plugin)
        return
      }
      plugin.install(this)
      this.plugins.push(plugin) 
    }

  }
  
  // 创建 SDK 实例
  const sdkCore = new SDK()

export { Plugin,sdkCore as default, InitOptions, logError,  exportMethods, _options as options }
export * from './lib/exportMethods';
