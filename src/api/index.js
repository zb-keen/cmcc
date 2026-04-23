import request from '@/server/request';

class CommonApi {
  /**
   * 获取token
   */
  getGateWayToken(param) {
    return request({
      url: `${process.env.VUE_APP_API_TOKEN_URL}/psiesso/oauth/ordertoken`,
      method: 'post',
      bodyType: 0
    });
  }

  /**
   * 搜索默认页接口
   * @param {*} param
   * @returns
   */
  appSearch(param) {
    return request({
      url: `${process.env.VUE_APP_API_URL}/psiesearchsdkserver/api/external/appSearch`,
      method: 'post',
      data: param,
      bodyType: 1
    });
  }

  /**
 * 搜索默认页页重构--搜索框默认词匹配回显-移动优选
 * @param {*} param
 * @returns
 */
  moveSelect(param) {
    return request({
      url: `${process.env.VUE_APP_API_URL}/psiesearchsdkserver/search/homePage/mobilePreferenceInfo`,
      method: 'post',
      data: param,
      bodyType: 1
    });
  }

  /**
  * 搜索默认页页重构--搜索发现
  * @param {*} param
  * @returns
  */
  searchIndex(param) {
    return request({
      url: `${process.env.VUE_APP_API_URL}/psiesearchsdkserver/search/homePage/searchIndex`,
      method: 'post',
      data: param,
      bodyType: 1
    });
  }

  /**
  * 搜索默认页页重构--热门搜索
  * @param {*} param
  * @returns
  */
  hotSearch(param) {
    return request({
      url: `${process.env.VUE_APP_API_URL}/psiesearchsdkserver/search/homePage/hotSearch`,
      method: 'post',
      data: param,
      bodyType: 1
    });
  }

  /**
    * 搜索默认页页重构--精选推荐
    * @param {*} param
    * @returns
    */
  selectRecommend(param) {
    return request({
      url: `${process.env.VUE_APP_API_URL}/psiesearchsdkserver/search/homePage/listSelectRecommend`,
      method: 'post',
      data: param,
      bodyType: 1
    });
  }

  /**
    * 搜索默认页页重构--客群匹配
    * @param {*} param
    * @returns
    */
  queryCustomerMatch(param) {
    return request({
      // url: `${process.env.VUE_APP_API_URL}/psiesearchsdkserver/innerapi/iop/queryCustomerMatch`, // 后端调用该接口 前端不调用
      url: `${process.env.VUE_APP_API_URL}/psiesearchsdkserver/search/homePage/queryCustomerMatch`,
      method: 'post',
      data: param,
      bodyType: 1
    });
  }

  /**
   * 搜索默认页页重构--精彩内容
   * @param {*} param
   * @returns
   */
  listFeedVideo(param) {
    return request({
      url: `${process.env.VUE_APP_API_URL}/psiesearchsdkserver/search/homePage/listFeedVideo`,
      method: 'post',
      data: param,
      bodyType: 1
    });
  }

  /**
   * 搜索默认页页重构--周边生活
   * @param {*} param
   * @returns
   */
  listNearbyLife(param) {
    return request({
      url: `${process.env.VUE_APP_API_URL}/psiesearchsdkserver/search/homePage/listSurroundingLife`,
      method: 'post',
      data: param,
      bodyType: 1
    });
  }

  /**
  * 默认页接入ai搜索大模型
  * @param {*} param
  * @returns
  */
  aiSearchJoin(param) {
    let joinUrl = ''
    const nowTime = Date.now()
    if (process.env.NODE_ENV === 'development') {
      joinUrl = `https://wx.10086.cn/zxkfService/jssdk/version?grayscale=grayscale&t=${nowTime}`
    } else if (process.env.NODE_ENV === 'gray') {
      joinUrl = `https://wx.10086.cn/zxkfService/jssdk/version?grayscale=grayscale&t=${nowTime}`
    } else if (process.env.NODE_ENV === 'production') {
      joinUrl = `https://wx.10086.cn/zxkfService/jssdk/version?t=${nowTime}`
    }
    return request({
      url: joinUrl,
      method: 'post',
      data: param,
      bodyType: 2  // 是否对请求参数加密
    });
  }

  /**
  * 默认页校验ai搜索大模型白名单
  * @param {*} param
  * @returns
  */
  aiCheck(param) {
    return request({
      url: `${process.env.VUE_APP_API_URL}/psiesearchsdkserver/search/appsvc/checkAIWhiteList`,
      method: 'post',
      data: param,
      bodyType: 1
    });
  }

  /**
  * 默认页校验ai搜索大模型白名单
  * @param {*} param
  * @returns
  */
  aiSearchTest() {
    return request({
      url: `https://wx.10086.cn/apihd/nguac/model/sso/sdk`,
      method: 'post',
      data: { authCode: "O2oGau8AQKzd0WlzLNAkMCn12LaB8a8sEzoCqDjOm9PMQD4x1rv5BN1EK1SqCBvW0Ic3ryH8K8a_hHqFGvi4gw" },
      bodyType: 2
    });
  }

  /**
   * 默认页调研问卷入口
   * @param {*} param
   * @returns
   */
  querySurveyUrl(param) {
    return request({
      url: `${process.env.VUE_APP_API_URL}/psiesearchsdkserver/search/appsvc/getSatisfactionSurveyUrl`,
      method: 'post',
      data: param,
      bodyType: 1
    });
  }

  /**
   * 搜索联想接口
   * @param {*} param
   * @returns
   */
  queryindex(param) {
    return request({
      url: `${process.env.VUE_APP_API_URL}/psiesearchsdkserver/search/associative/queryindex`,
      method: 'post',
      data: param,
      bodyType: 1
    });
  }

  /**
   * 搜索直达
   * @param {*} param 
   */
  queryDirect(param) {
    return request({
      url: `${process.env.VUE_APP_API_URL}/psiesearchsdkserver/search/operatespace/queryDirect`,
      method: 'post',
      data: param,
      bodyType: 1
    });
  }

  /**
  * 搜索合大三个入驻--搜索关键字匹配卡片tab页
  * @param {*} param 
  */
  queryThreeWords(param) {
    return request({
      url: `${process.env.VUE_APP_API_URL}/psiesearchsdkserver/search/threeEntries/queryWordStatus`,
      method: 'post',
      data: param,
      bodyType: 1
    });
  }

  /**
   * 搜索合大三个入驻--查询客户经理-爱家工程师
   * @param {*} param 
   */
  queryThreeEntries(param) {
    return request({
      url: `${process.env.VUE_APP_API_URL}/psiesearchsdkserver/search/threeEntries/queryThreeEntries`,
      method: 'post',
      data: param,
      bodyType: 1
    });
  }

  /**
  * 搜索合大三个入驻--查询客户经理预约状态
  * @param {*} param 
  */
  queryAppointStatus(param) {
    return request({
      url: `${process.env.VUE_APP_API_URL}/psiesearchsdkserver/search/threeEntries/queryAccountManagerAppointmentStatus`,
      method: 'post',
      data: param,
      bodyType: 1
    });
  }

  /**
  * 搜索合大三个入驻--爱家工程师呼叫授权
  * @param {*} param 
  */
  threeUserAuthorize(param) {
    return request({
      url: `${process.env.VUE_APP_API_URL}/psiesearchsdkserver/search/threeEntries/saveUserAuthorize`,
      method: 'post',
      data: param,
      bodyType: 1
    });
  }

  /**
  * 搜索合大三个入驻--附近营业厅手机号加密
  * @param {*} param 
  */
  threePhoneEncrypt(param) {
    return request({
      url: `${process.env.VUE_APP_API_URL}/psiesearchsdkserver/search/threeEntries/phoneEncrypt`,
      method: 'post',
      data: param,
      bodyType: 1
    });
  }

  /**
   * 搜索结果查询
   */
  //  http://testpsie.op.coc.10086.cmos:8080/psiesdkserver/search/appsvc/queryindex
  queryResult(param) {
    const url = `${process.env.VUE_APP_API_URL}/psiesearchsdkserver/search/appsvc/queryindex`;
    return request({
      url,
      method: 'post',
      data: param,
      bodyType: 1
    });
  }

  /**
  * 活动推荐-与搜索查询接口一样
  */
  queryActivity(param) {
    // const url = `${process.env.VUE_APP_API_URL}/psiesearchsdkserver/search/appsvc/queryActivity`; // 开发环境mock数据使用
    const url = `${process.env.VUE_APP_API_URL}/psiesearchsdkserver/search/appsvc/queryindex`; // 发布使用这个请求地址
    return request({
      url,
      method: 'post',
      data: param,
      bodyType: 1
    });
  }

  /**
  * 大家都在搜
  */
  queryTriggerWord(param) {
    const url = `${process.env.VUE_APP_API_URL}/psiesearchsdkserver/search/keyword/queryTriggerWord`;
    return request({
      url,
      method: 'post',
      data: param,
      bodyType: 1
    });
  }

  //  http://testpsie.op.coc.10086.cmos:8080/psiesearchsdkserver/category/appsvc/templateMapping
  /**
   * 模板id与页面匹配
   * @param {*} param
   * @returns
   */
  queryTemplateMap(param) {
    const url = `${process.env.VUE_APP_API_URL}/psiesearchsdkserver/category/appsvc/templateMapping`;
    return request({
      url,
      method: 'post',
      data: param,
      bodyType: 1
    });
  }

  /**
   * 客服
   * @param {*} param
   * @returns
   */
  queryOnlineCustomerInfo(param) {
    const url = `${process.env.VUE_APP_API_URL}/psiesearchsdkserver/api/external/queryOnlineCustomerInfo`;
    return request({
      url,
      method: 'post',
      data: param,
      bodyType: 1
    });
  }

  /**
   * 点击搜索结果记录埋点
   */
  querySaveClickInfo(param) {
    const url = `${process.env.VUE_APP_API_URL}/psiesearchsdkserver/search/appsvc/saveClickInfo`;
    return request({
      url,
      method: 'post',
      data: param,
      bodyType: 1
    });
  }

  /**
   * 查询筛选条件
   */
  queryGetConfig(param) {
    const url = `${process.env.VUE_APP_API_URL}/psiesearchsdkserver/search/appsvc/getConfig`;
    return request({
      url,
      method: 'post',
      data: param,
      bodyType: 1
    });
  }

  /**
   * 为你推荐查询接口
   */
  queryRecommend(param) {
    const url = `${process.env.VUE_APP_API_URL}/psiesearchsdkserver/search/operatespace/queryRecommend`;
    return request({
      url,
      method: 'post',
      data: param,
      bodyType: 1
    });
  }

  /**
  * 搜索专区查询接口
  */
  queryZone(param) {
    const url = `${process.env.VUE_APP_API_URL}/psiesearchsdkserver/search/operatespace/queryZone`;
    return request({
      url,
      method: 'post',
      data: param,
      bodyType: 1
    });
  }

  /**
   * 搜索专区查询接口(有卡槽工单)
   */
  queryCardslotZone(param) {
    const url = `${process.env.VUE_APP_API_URL}/psiesearchsdkserver/search/operatespace/queryCardslotZone`;
    return request({
      url,
      method: 'post',
      data: param,
      bodyType: 1
    });
  }

  /**
    * 首页查询热销套餐接口--热销套卡
    * @param {*} param
    * @returns
  */
  queryHotMobilePlan(param) {
    return request({
      url: `${process.env.VUE_APP_API_URL}/psiesearchsdkserver/search/homePage/queryHotMobilePlan`,
      method: 'post',
      data: param,
      bodyType: 1
    });
  }

  /**
    * 首页查询热销号卡接口--热销套卡
    * @param {*} param
    * @returns
    */
  queryHotMobileNum(param) {
    return request({
      url: `${process.env.VUE_APP_API_URL}/psiesearchsdkserver/search/homePage/queryHotMobileNum`,
      method: 'post',
      data: param,
      bodyType: 1
    });
  }

  /**
  * 结果页查询热销号卡接口--热销套卡
  * @param {*} param 
  */
  queryResultHotMobileNum(param) {
    return request({
      url: `${process.env.VUE_APP_API_URL}/psiesearchsdkserver/search/resultPage/queryHotMobileNum`,
      method: 'post',
      data: param,
      bodyType: 1
    });
  }

  /**
  * 结果页查询热销套餐接口--热销套卡
  * @param {*} param 
  */
  queryResultHotMobilePlan(param) {
    return request({
      url: `${process.env.VUE_APP_API_URL}/psiesearchsdkserver/search/resultPage/queryHotMobilePlan`,
      method: 'post',
      data: param,
      bodyType: 1
    });
  }

  // 精选推荐新接口
  querySelectedRecommendNew(param) {
    const url = `${process.env.VUE_APP_API_URL}/psiesearchsdkserver/search/homePage/querySelectedRecommendNew`;
    return request({
      url,
      method: 'post',
      data: param,
      bodyType: 1
    });
  }
}

export default new CommonApi();
