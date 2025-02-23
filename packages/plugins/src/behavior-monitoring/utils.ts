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
