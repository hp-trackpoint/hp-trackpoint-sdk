//lcp,fcp
import { onFCP, onLCP } from "web-vitals";
import { transport } from "@tracking-sdk/core/src/lib/transport";
import { EventInfo } from "@tracking-sdk/core/src/types";
import { AnyFun } from "core/src/optionType";

function getWebVitals(callback: AnyFun): void {
  onLCP((res) => {
    callback(res);
  });
  onFCP((res) => {
    callback(res);
  });
}
export default function basicPerMonitor(): void {
  window.addEventListener("load", () => setTimeout(sendData, 5000));
  function sendData() {
    const currentTime = Date.now();
    const basicPerData: EventInfo = {
      eventName: "performance_basic",
      eventType: "performance",
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
    };
    getWebVitals((res: any) => {
      // name指标名称、rating 评级、value数值
      const { name, rating, value } = res;
      console.log("performance_basic", name, rating, value);
      transport.send({
        ...basicPerData,
        extra: {
          perName: name,
          rating: rating,
          perValue: value,
        },
      });
    });
  }
}
