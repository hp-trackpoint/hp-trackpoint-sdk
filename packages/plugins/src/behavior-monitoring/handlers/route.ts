import { EventInfo } from "@tracking-sdk/core/src/types";
import { reportData } from "../utils";

let lastPageUrl: string;

export function initRouteMonitor(): void {
  lastPageUrl = window.location.href;

  const handleRouteChange = () => {
    const currentUrl = window.location.href;
    if (lastPageUrl === currentUrl) return;

    const routeData: EventInfo = {
      eventName: "route",
      eventType: "route",
      eventTime: Date.now(),
      pageInfo: {
        pageUrl: currentUrl,
        referrer: lastPageUrl,
      },
      bid: "",
      cid: "home_page",
      extraInfo: {
        common: 1,
        event: "",
      },
    };

    reportData(routeData);
    lastPageUrl = currentUrl;
  };

  // 监听路由变化
  window.addEventListener("popstate", handleRouteChange);
  window.addEventListener("hashchange", handleRouteChange);

  // 重写 history 方法
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;

  history.pushState = function (...args) {
    originalPushState.apply(this, args);
    handleRouteChange();
  };

  history.replaceState = function (...args) {
    originalReplaceState.apply(this, args);
    handleRouteChange();
  };
}
