# hp-trackpoint-sdk

埋点SDK

#### 目录结构

```
/hp-trackpoint-sdk
├── /packages
│   ├── /core                    # 核心模块，包含与平台无关的公共逻辑
│   │   ├── transport.ts          # 数据上报相关的代码
│   │   ├── utils.ts              # 工具函数，日志格式化、数据处理等
│   │   ├── logger.ts             # 日志记录与错误捕获
│   │   └── config.ts             # 配置初始化与管理
│   ├── /plugins                  # 插件模块，用于功能扩展
│   │   ├── /performance          # 性能监控插件
│   │   │   ├── index.ts
│   │   │   ├── monitor.ts        # 性能数据采集与上报
│   │   ├── /error-monitoring     # 错误监控插件
│   │   │   ├── index.ts
│   │   │   ├── errorHandler.ts   # 错误捕获与上报
│   │   └── /custom-behaviors    # 自定义行为插件（比如用户点击行为）
│   ├── /platforms                # 平台特定的实现代码（如Web, Node.js, React等）
│   │   ├── /web                  # 针对Web平台的实现
│   │   │   ├── webSdk.ts
│   │   ├── /node                 # 针对Node平台的实现
│   │   │   ├── nodeSdk.ts
│   │   └── /react                # 针对React平台的实现
│   │       ├── reactSdk.ts
│   ├── /types                    # 类型定义
│   │   ├── index.d.ts            # SDK公共类型
│   │   ├── transport.d.ts        # 上报数据结构类型
│   │   ├── plugin.d.ts           # 插件类型定义
│   ├── index.ts                  # SDK 入口文件，初始化与配置
│   └── /tests                    # 单元测试与集成测试
│       ├── transport.test.ts
│       ├── performance.test.ts
│       └── errorHandler.test.ts
├── /dist                         # 编译后的输出目录
├── /public                       # 公共资源目录（如果有）
└── package.json                  # SDK的包管理与配置
```

#### 开发规范

- 使用 `pnpm` 作为包管理工具
- 使用 `husky` 进行代码提交规范检查
- 使用 `commitlint` 进行提交信息格式化

---

正在完善中...
