// 核心模块入口文件
import type { InitOptions } from './optionType'//用户传入的options
import { initReplace } from './lib/replace'//SDK核心初始化方法
import { initBase } from './lib/base'
import { initSendData } from './lib/sendData'
import { initLineStatus } from './lib/line-status'
import { initOptions, options as _options } from './lib/options'
import { _global } from './utils/global'//SDK内部的全局对象，用于存储SDK的初始化状态
import { SENDID } from './common'
import { logError } from './utils/debug'//错误日志输出
import * as exportMethods from './lib/exportMethods'//包含SDK的公共API
import './src/observer/index'//用于监听事件
import { Pluginlist } from '../../plugins/src/examplePlugin';  // 导入插件
// 定义插件接口
type Plugin = {
    name: string//插件名称
    install: (core: typeof sdkCore) => void//插件接收core作为参数
}

// 定义SDK
const sdkCore = {
    init(options: InitOptions & {plugins?: Plugin[]}): void {
        if (_global.__webTracingInit__ || !initOptions(options)) return

        // 注册全局核心功能
        [initReplace, initBase, initSendData, initLineStatus].forEach(fn => fn())
        // 用户在init时传入需要的插件
        const allPlugins=[...(options.plugins||[]),...Pluginlist]
        allPlugins.forEach(plugin=>sdkCore.use(plugin))
        _global.__webTracingInit__ = true
    },

    // 注册插件
    use(plugin: Plugin) {
        if (!plugin || typeof plugin.install !== 'function') {
        console.warn(`Invalid plugin:`, plugin)
        return
        }
        plugin.install(sdkCore)
    },

    options: _options,//全局选项配置
    logError,//日志功能
    // parseError: exportMethods.parseError,
    SENDID,//用于标识某个数据发送事件
    ...exportMethods//解构导出exportMethods里所有的方法
}

export { Plugin,sdkCore as default, InitOptions, logError, SENDID, exportMethods, _options as options }
