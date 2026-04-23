/**
 * 搜索结果 appsvc/queryindex（CommonApi.queryResult）业务码
 * 限流 / 熔断时使用，与联想 associative/queryindex 无关。
 */
export const QUERYINDEX_TRAFFIC_PEAK_CODE = "100003";
export const QUERYINDEX_HTTP_TRAFFIC_PEAK_CODES = ["408", "429"];

export function isQueryIndexTrafficPeak(res) {
  return String(res && res.code) === QUERYINDEX_TRAFFIC_PEAK_CODE;
}

/**
 * catch(err) 场景下用于判断 HTTP 状态码是否属于限流/超时。
 */
export function isQueryIndexTrafficPeakByError(err) {
  const statusCode = String(err?.response?.status || "");
  return QUERYINDEX_HTTP_TRAFFIC_PEAK_CODES.includes(statusCode);
}
