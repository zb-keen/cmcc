const queryZone = require('./queryZone.json')
const queryDirect = require('./queryDirect.json')
const queryCardslotZone = require('./queryCardslotZone.json')

module.exports = {
    '/apiProxy/psiesearchsdkserver/search/operatespace/queryZone': queryZone,
    '/apiProxy/psiesearchsdkserver/search/operatespace/queryDirect': queryDirect,
    '/apiProxy/psiesearchsdkserver/search/operatespace/queryCardslotZone': queryCardslotZone
}
