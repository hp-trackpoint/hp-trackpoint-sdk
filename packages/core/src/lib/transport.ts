// 数据上报相关的代码
import { BaseInfo, RequestData, EventInfo } from "../types";
import { _support } from "../utils/global";

/**
 * 数据上报的配置类型定义
 */
interface TransportConfig {
  /** 上报地址 */
  url: string;
  /** 上报方式 */
  method?: "XHR" | "BEACON";
  /** 重试次数 */
  retry?: number;
  /** 批量上报的数量 */
  batchSize?: number;
  /** 防抖时间 */
  debounceTime?: number;
}

/**
 * 数据上报的类定义
 */
export class Transport {
  /** 事件队列 */
  private queue: EventInfo[] = [];
  /** 基本信息 */
  private baseInfo: BaseInfo = {
    environment: "dev",
    userId: "",
    sdkVersion: "1.0.0",
    deviceInfo: {
      browser: "chrome",
      os: "windows",
      browserVersion: "1.0.0",
      deviceType: "desktop",
      osVersion: "1.0.0",
      region: "beijing",
    },
  };
  /** 定时器 */
  private timer: ReturnType<typeof setTimeout> | null = null;
  /** 配置项 */
  private readonly config: Required<TransportConfig>;

  constructor(config: TransportConfig) {
    this.baseInfo = {
      ..._support.baseInfo.base.value,
      deviceInfo: {
        browser: "chrome",
        os: "windows",
        browserVersion: "1.0.0",
        deviceType: "desktop",
        osVersion: "1.0.0",
        region: "beijing",
      },
    };
    console.log(_support.baseInfo, "_support.baseInfo");
    this.config = {
      method: "XHR",
      retry: 3,
      batchSize: 5,
      debounceTime: 1000,
      ...config,
    };
  }

  /**
   * 发送数据
   * @param data 事件信息
   */
  public send(data: EventInfo): void {
    this.queue.push(data );
    // 如果队列中的数据达到批量上报的条数，调用flush立即上报，未达到批量上报的条数，调用防抖定时器发送函数
    if (this.queue.length >= this.config.batchSize) {
      this.flush();
    } else {
      this.debounceFlush();
    }
  }

  /**
   * 立即发送数据
   */
  private async flush(): Promise<void> {
    // 从队列中取出待上报的数据
    const sendData = [...this.queue];
    this.queue = [];
    try {
      await this.doSend(sendData);
    } catch (error) {
      // 如果上报失败，记录错误
      console.error("Send failed:", error);
    }
  }

  /**
   * 使用防抖定时器发送数据
   */
  private debounceFlush(): void {
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.flush();
    }, this.config.debounceTime);
  }

  /**
   * 实际发送数据的逻辑
   * @param eventInfos 事件信息
   * @param retryCount 重试次数
   */
  private async doSend(eventInfos: EventInfo[], retryCount = 0): Promise<void> {
    const data: RequestData = {
      baseInfo: this.baseInfo,
      eventInfo: eventInfos,
    };
    // 根据配置选择发送方式
    const { method, retry } = this.config;
    try {
      switch (method) {
        case "XHR":
          await this.sendByXHR(data);
          break;
        case "BEACON":
          await this.sendByBeacon(data);
          break;
      }
    } catch (error) {
      // 如果发送失败且未达到重试次数上限，进行重试
      if (retryCount < retry) {
        await new Promise((res) => setTimeout(res, 1000 * (retryCount + 1)));
        return this.doSend(eventInfos, retryCount + 1);
      }
      // 达到重试次数上限后，抛出错误
      throw error;
    }
  }

  /**
   * 发送数据方式 - sendByXHR
   * @param data 所有事件信息
   * @returns
   */
  private sendByXHR(data: RequestData): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log("send by xhr",data);

      const xhr = new XMLHttpRequest();
      console.log("Request URL:", this.config.url);
      xhr.open("POST", this.config.url);
      xhr.setRequestHeader("Content-Type", "application/json");

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve();
        } else {
          reject(new Error(`XHR failed with status ${xhr.status}`));
        }
      };

      xhr.onerror = () => {
        reject(new Error("XHR failed"));
      };

      xhr.send(JSON.stringify(data));
    });
  }

  /**
   * 发送数据方式 - sendByBeacon
   * @param data 所有事件信息
   * @returns
   */
  private sendByBeacon(data: RequestData): Promise<void> {
    const { url } = this.config;
    return new Promise((resolve, reject) => {
      if (navigator.sendBeacon) {
        console.log("send by beacon");

        const isSuccess = navigator.sendBeacon(url, JSON.stringify(data));
        if (isSuccess) {
          resolve();
        } else {
          reject(new Error("Beacon failed"));
        }
      } else {
        reject(new Error("Beacon is not supported"));
      }
    });
  }
}

// by ls,创建一个Transport实例
export let transport: Transport;

/**
 * 初始化Transport实例
 */
export function initTransport() {
  _support.transport = new Transport({
    url: _support.options.value.dsn, // 这里要修改,initTransport要初始化一个空的transport对象
    method: _support.options.value.methods, // 或 'BEACON'
    retry: 3,
    batchSize: 10,
    debounceTime: 1000,
  });
  transport = _support.transport;
}
