const getConfig = require('./getConfig.json')
const queryindex = require('./queryindex.json')
const templateMapping = require('./templateMapping.json')
const getSatisfactionSurveyUrl = require('./getSatisfactionSurveyUrl.json')
const checkAIWhiteList = require('./checkAIWhiteList.json')
const queryActivity = require('./queryActivity.json')

module.exports = {
    '/apiProxy/psiesearchsdkserver/search/appsvc/queryindex': queryindex,
    '/apiProxy/psiesearchsdkserver/search/appsvc/getConfig': getConfig,
    '/apiProxy/psiesearchsdkserver/search/appsvc/templateMapping': templateMapping,
    '/apiProxy/psiesearchsdkserver/search/appsvc/getSatisfactionSurveyUrl': getSatisfactionSurveyUrl,
    '/apiProxy/psiesearchsdkserver/search/appsvc/checkAIWhiteList': checkAIWhiteList,
    '/apiProxy/psiesearchsdkserver/search/appsvc/queryActivity': queryActivity
}
