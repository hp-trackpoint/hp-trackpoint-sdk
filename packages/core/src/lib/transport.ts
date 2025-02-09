// 数据上报相关的代码
import { type EventData } from "../types";
import { _support, _global } from '../utils/global'

// 数据上报的配置类型定义
interface TransportConfig {
  url: string;
  method?: 'POST' | 'BEACON';
  // 重试次数
  retry?: number;
  // 批量发送的数量
  batchSize?: number;
  // 防抖时间
  debounceTime?: number;
}

export class Transport {
  // ... 数据上报的实现
  private queue: EventData[] = [];
  private timer: ReturnType<typeof setTimeout> | null = null;
  private readonly config: Required<TransportConfig>;

  constructor(config: TransportConfig) {
    this.config = {
      method: 'POST',
      retry: 3,
      batchSize: 5,
      debounceTime: 1000,
      ...config
    }
  }

  /**
   * 暴露给外部的上报方法
   */
  public send(data: EventData): void {
    // TODO 存入队列中，等待发送
    this.queue.push(data);
    // 直接调用 flush 方法强制发送
    this.flush();
  }

  /**
   * 强制发送数据
   */
  private async flush(): Promise<void> {
    const transport = [...this.queue];
    this.queue = [];
    try {
      await this.doSend(transport);
    } catch (error) {
      // 如果上报失败，记录错误
      console.error('Send failed:', error);
    }
  }

  /**
   * 记录需要发送的埋点数据
   * @param data 需要发送的事件信息
   * @param flush 是否立即发送
   */
  public emit(data: EventData) {
    //构建eventlist
  }
  /**
   * 实际发送数据的逻辑
   */
  private async doSend(data: EventData[], retryCount = 0): Promise<void> {
    // 根据配置选择发送方式
    const { method,retry } = this.config;
    try {
      switch (method) {
        case 'POST':
          await this.sendByXHR(data);
          break;
        case 'BEACON':
          await this.sendByBeacon(data);
          break;
      }
    } catch (error) {
      // TODO 如果发送失败且未达到重试次数上限，进行重试
      // if (retryCount < retry) {
      //   await new Promise(res => setTimeout(res, 1000 * (retryCount + 1)));
      //   return this.doSend(data, retryCount + 1);
      // }
      // 达到重试次数上限后，抛出错误
      throw error;
    }
  }

  /**
   * 发送数据方式 sendByXHR
   */
  private sendByXHR(data: EventData[]): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log('send by xhr');
      
      const xhr = new XMLHttpRequest();
      xhr.open(this.config.method, this.config.url);
      xhr.setRequestHeader('Content-Type', 'application/json');

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve();
        } else {
          reject(new Error(`XHR failed with status ${xhr.status}`));
        }
      }

      xhr.onerror = () => {
        reject(new Error('XHR failed'));
      }

      xhr.send(JSON.stringify(data));
    })
  }

  /**
   * 发送数据方式 sendByBeacon
   */
  private sendByBeacon(data: EventData[]): Promise<void> {
    const { url } = this.config;
    return new Promise((resolve, reject) => {
      if (navigator.sendBeacon) {
        console.log('send by beacon');  
        
        const isSuccess = navigator.sendBeacon(url, JSON.stringify(data));
        if (isSuccess) {
          resolve();
        } else {
          reject(new Error('Beacon failed'));
        }
      } else {
        reject(new Error('Beacon is not supported'));
      }
    })
  }

}
export let transport: Transport

export function initTransport() {
  _support.transport = new Transport({
    url: 'https://your-api.com/track', // 这里要修改,initTransport要初始化一个空的transport对象
    method: 'POST', // 或 'BEACON'
    retry: 3,
    batchSize: 5,
    debounceTime: 1000
  })
  transport = _support.transport
}