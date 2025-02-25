//dns查询时间，tcp连接时间，ssl连接时间，解析dom树时间
interface navigationPer {
  dnsTime: number;
  tcpConnect: number;
  sslConnect: number;
  parseDomTree: number;
}
export function navigation(): navigationPer {
  const {
    domainLookupEnd,
    domainLookupStart,
    connectEnd,
    connectStart,
    secureConnectionStart,
    domInteractive,
    responseEnd,
  } = performance.getEntriesByType(
    "navigation"
  )[0] as PerformanceNavigationTiming;
  return {
    dnsTime: domainLookupEnd - domainLookupStart,
    tcpConnect: connectEnd - connectStart,
    sslConnect: connectEnd - secureConnectionStart,
    parseDomTree: domInteractive - responseEnd,
  };
}
