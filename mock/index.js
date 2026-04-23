
const appsvc = require('./apiProxy/psiesearchsdkserver/search/appsvc')
const external = require('./apiProxy/psiesearchsdkserver/api/external')
const associative = require('./apiProxy/psiesearchsdkserver/search/associative')
const appsvc1 = require('./apiProxy/psiesearchsdkserver/category/appsvc')
const operatespace = require('./apiProxy/psiesearchsdkserver/search/operatespace')
const threeEntries = require('./apiProxy/psiesearchsdkserver/search/threeEntries')
const homePage = require('./apiProxy/psiesearchsdkserver/search/homePage')
const keyword = require('./apiProxy/psiesearchsdkserver/search/keyword')
const iop = require('./apiProxy/psiesearchsdkserver/innerapi/iop') // 后端调用的客群匹配
const oauth = require('./apiProxy/psiesso/oauth')

module.exports = {
    ...appsvc,
    ...external,
    ...associative,
    ...appsvc1,
    ...operatespace,
    ...threeEntries,
    ...homePage,
    ...keyword,
    ...iop,
    ...oauth
}
