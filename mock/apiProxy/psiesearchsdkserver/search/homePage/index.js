const moveSelect = require('./moveSelect.json') // 默认词匹配回显+移动优选
const searchIndex = require('./searchIndex.json') // 搜索发现
const hotSearch = require('./hotSearch.json') // 热门搜索
const selectRecommend = require('./selectRecommend.json') // 精选推荐
const listFeedVideo = require('./listFeedVideo.json') // 精彩内容
const listSurroundingLife = require('./listSurroundingLife.json') // 周边生活
const queryCustomerMatch = require('./queryCustomerMatch.json') // 客群匹配

module.exports = {
    '/apiProxy/psiesearchsdkserver/search/homePage/mobilePreferenceInfo': moveSelect,
    '/apiProxy/psiesearchsdkserver/search/homePage/searchIndex': searchIndex,
    '/apiProxy/psiesearchsdkserver/search/homePage/hotSearch': hotSearch,
    '/apiProxy/psiesearchsdkserver/search/homePage/listSelectRecommend': selectRecommend,
    '/apiProxy/psiesearchsdkserver/search/homePage/listFeedVideo': listFeedVideo,
    '/apiProxy/psiesearchsdkserver/search/homePage/listSurroundingLife': listSurroundingLife,
    '/apiProxy/psiesearchsdkserver/search/homePage/queryCustomerMatch': queryCustomerMatch
}
