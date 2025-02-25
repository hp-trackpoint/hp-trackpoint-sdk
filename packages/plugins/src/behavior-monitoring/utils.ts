import { EventInfo } from "@tracking-sdk/core/src/types";
import { transport } from "@tracking-sdk/core/src/lib/transport";

// 忽略的url列表
let globalIgnoreUrls: string[] = [];

/**
 * 获取元素的XPath
 * @param element HTML元素
 * @returns 返回元素的XPath
 */
export function getXPath(element: HTMLElement): string {
  if (!element) return "";
  if (element.id) return `//*[@id="${element.id}"]`;

  // 保存元素的路径
  const paths: string[] = [];
  // 从当前元素开始，逐级向上查找父元素，直到根元素
  while (element.nodeType === Node.ELEMENT_NODE) {
    let index = 1;
    let hasNextSibling = false;

    // 查找当前元素的前面有多少个相同的兄弟元素
    for (
      let sibling = element.previousSibling;
      sibling;
      sibling = sibling.previousSibling
    ) {
      if (
        sibling.nodeType === Node.ELEMENT_NODE &&
        sibling.nodeName === element.nodeName
      ) {
        index++;
      }
    }

    // 查找当前元素的后面有多少个相同的兄弟元素
    for (
      let sibling = element.nextSibling;
      sibling && !hasNextSibling;
      sibling = sibling.nextSibling
    ) {
      if (sibling.nodeName === element.nodeName) {
        hasNextSibling = true;
      }
    }

    // 获取当前元素的标签名
    const tagName = element.nodeName.toLowerCase();
    // 如果当前元素有相同的兄弟元素，或者当前元素是第一个元素，则添加索引
    const pathIndex = index || hasNextSibling ? `[${index}]` : "";
    // 将当前元素的标签名和索引添加到路径中
    paths.unshift(tagName + pathIndex);

    element = element.parentNode as HTMLElement;
  }

  // 最终保持的路径格式为：/html/body/div[1]/div[2]/div[3]/span[1]
  return "/" + paths.join("/");
}

/**
 * 检查URL是否需要被忽略
 * @param url 当前url
 * @param ignoreUrls 忽略的url列表
 * @returns 布尔值 是否忽略当前url
 */
export function shouldIgnoreUrl(url: string, ignoreUrls: string[]): boolean {
  if (!ignoreUrls?.length) return false;

  return ignoreUrls.some((ignorePattern) => {
    // 支持正则表达式字符串
    if (ignorePattern.startsWith("/") && ignorePattern.endsWith("/")) {
      const regex = new RegExp(ignorePattern.slice(1, -1));
      return regex.test(url);
    }
    // 支持通配符 *
    if (ignorePattern.includes("*")) {
      const regexPattern = ignorePattern
        .replace(/[.+?^${}()|[\]\\]/g, "\\$&") // 转义特殊字符
        .replace(/\*/g, ".*"); // 将 * 转换为 .*
      const regex = new RegExp(`^${regexPattern}$`);
      return regex.test(url);
    }
    // 普通字符串匹配
    return url.includes(ignorePattern);
  });
}

export function setIgnoreUrls(ignoreUrls: string[]): void {
  globalIgnoreUrls = ignoreUrls;
}

/**
 * 上报数据（过滤忽略的url）
 * @param eventData 事件数据
 * @param ignoreUrls 忽略的url列表
 * @returns void
 */
export function reportData(eventData: EventInfo): void {
  // 检查当前URL是否需要被忽略
  if (shouldIgnoreUrl(window.location.href, globalIgnoreUrls)) {
    return;
  }
  // 上报数据
  transport.send(eventData);
}
