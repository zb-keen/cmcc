const queryWordStatus = require('./queryWordStatus.json')
const queryThreeEntries = require('./queryThreeEntries.json')
const queryAccountManagerAppointmentStatus = require('./queryAccountManagerAppointmentStatus.json')
const saveUserAuthorize = require('./saveUserAuthorize.json')
const phoneEncrypt = require('./phoneEncrypt.json')

module.exports = {
    '/apiProxy/psiesearchsdkserver/search/threeEntries/queryThreeEntries': queryThreeEntries,
    '/apiProxy/psiesearchsdkserver/search/threeEntries/queryWordStatus': queryWordStatus,
    '/apiProxy/psiesearchsdkserver/search/threeEntries/queryAccountManagerAppointmentStatus': queryAccountManagerAppointmentStatus,
    '/apiProxy/psiesearchsdkserver/search/threeEntries/saveUserAuthorize': saveUserAuthorize,
    '/apiProxy/psiesearchsdkserver/search/threeEntries/phoneEncrypt': phoneEncrypt
}
