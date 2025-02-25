//lcp,fcp
import { onFCP, onLCP } from "web-vitals";
import { transport } from "@tracking-sdk/core/src/lib/transport";
import { EventInfo } from "@tracking-sdk/core/src/types";

interface BasicType {
  fcp: number;
}

export default function basicPerMonitor(): void {
  window.addEventListener("load", () => setTimeout(sendData, 1000));
  const res = {
    fcp: 0,
    lcp: 0,
  };
  onFCP((metric) => {
    res.fcp = metric.value;
  });
  onLCP((metric) => {
    res.lcp = metric.value;
  });
  function sendData() {
    const currentTime = Date.now();
    const basicPerData: EventInfo = {
      eventName: "performance_basic",
      eventType: "performance",
      eventTime: currentTime,
      cid: "home_page",
      bid: "",
      extra: {},
      extraInfo: {
        common: 1,
        event: "",
      },
      pageInfo: {
        pageUrl: window.location.href,
        referrer: document.referrer,
      },
    };
    console.log("performance_basic", basicPerData);
    transport.send(basicPerData);
  }
}
