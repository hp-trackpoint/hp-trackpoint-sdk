import { EventInfo } from "@tracking-sdk/core/src/types";
import { transport } from "@tracking-sdk/core/src/lib/transport";

let startTime: number;
let currentPath: string;

export function initPVMonitor(): void {
  startTime = Date.now();
  currentPath = window.location.pathname;

  // 初始化路由监听
  initRouteListener();

  // 页面加载完成时发送PV数据
  window.addEventListener("load", () => {
    sendPVData("pv_load");
  });

  // 页面离开时记录停留时间
  window.addEventListener("beforeunload", () => {
    sendPVData("pv_leave");
  });

  // 路由监听的初始化
  function initRouteListener(): void {
    // 监听 popstate 事件（浏览器前进后退按钮）
    window.addEventListener("popstate", () => {
      handleRouteChange();
    });

    // 重写原始的history方法，处理编程式导航的路由变化
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function (...args) {
      // 调用原始的pushState方法
      originalPushState.apply(this, args);
      // 通过编程式导航改变路由时，手动触发路由变化
      handleRouteChange();
    };

    history.replaceState = function (...args) {
      originalReplaceState.apply(this, args);
      handleRouteChange();
    };
  }

  // 发送PV数据
  function sendPVData(eventName: "pv_load" | "pv_leave"): void {
    const currentTime = Date.now();
    const pvData: EventInfo = {
      eventName,
      eventType: "pv",
      eventTime: currentTime,
      cid: "home_page",
      bid: "",
      extraInfo: {
        common: 1,
        event: "",
      },
      pageInfo: {
        pageUrl: window.location.href,
        referrer: document.referrer,
      },
      startTime,
      referrer: document.referrer,
      ...(eventName === "pv_leave" && { startTime: currentTime - startTime }),
    };
    console.log(`${eventName} Data:`, pvData);
    transport.send(pvData);
  }

  // 路由发生变化
  function handleRouteChange(): void {
    const newPath = window.location.pathname;
    if (newPath !== currentPath) {
      // 发生离开旧页面的数据
      sendPVData("pv_leave");

      // 重置记时来发送新页面的PV数据
      startTime = Date.now();
      currentPath = newPath;
      sendPVData("pv_load");
    }
  }
}
