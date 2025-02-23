import { EventInfo } from "@tracking-sdk/core/src/types";

import { getXPath, reportData } from "../utils";

export const initClickMonitor = (): void => {
  document.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;
    if (!target) return;

    const clickData: EventInfo = {
      eventName: "click",
      eventType: "click",
      eventTime: new Date().getTime(),
      cid: "home_page",
      bid: "",
      pageInfo: {
        pageUrl: "",
        referrer: "",
      },
      extraInfo: {
        common: 1,
        event: "",
      },
      target: {
        tagName: target.tagName.toLowerCase(),
        className: target.className,
        id: target.id,
        innerText: target.innerText?.slice(0, 50),
        xpath: getXPath(target),
      },
    };

    reportData(clickData);
  });
};
