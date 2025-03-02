import sdkCore from "../../core/src/index";

// plugins/examplePlugin.ts

export type Plugin = {
  name: string;
  install: (core: typeof sdkCore) => void;
};

const examplePlugin: Plugin = {
  name: "examplePlugin",
  install(core) {
    //   core.logUserAction = (action: string) => {
    //     console.log(`User performed action: ${action}`);
    //   }
    core.logError("111");
  },
};

// 插件列表
const Pluginlist = [examplePlugin];

// 导出插件和插件列表
export default examplePlugin;
export { Pluginlist };
