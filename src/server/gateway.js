import CommonApi from '@/api'

// 判断token是否即将过期 true过期 false不过期
function isTokenExpired(date) {
  const curTime = new Date();
  // 判断当前时间是否大于即将过期时间
  const date1 = Date.parse(curTime);
  const date2 = Date.parse(date);
  if (date1 > date2) {
    return true;
  }
  return false;
}

// 获取网关token
async function getTokenInfo() {
  let result;
  await CommonApi.getGateWayToken().then((res) =>{
    const exdate = new Date(); // 获取时间
    exdate.setTime(exdate.getTime() + 15 * 60 * 1000); // 保存15分钟
    const date = `&${exdate.toGMTString()}`; // 把过期时间拼接到gateWayToken值中
    // 字符串拼接cookie
    window.document.cookie = `${'ordertoken' + '='}${res.resultMsg}${date};path=/;expires=${exdate.toGMTString()}`;
    result = res.resultMsg;
    return result;
  }).catch(()=>{
    console.log('getTokenInfo~~catch')
    return result;
  });
}

// 判断网关token是否有效
const getGateWayToken = async () => {
  let token = '';
  const reg = new RegExp('(^|)' + 'ordertoken' + '=([^;]*)(;|$)');
  const arr = document.cookie.match(reg);
  if (arr) {
    token = (unescape(arr[2]).split('&'))[0];
    const date = (unescape(arr[2]).split('&'))[1];
    // token过期重新获取
    if (isTokenExpired(date)) {
      console.log("token过期了");
      token = await getTokenInfo();
    }
  } else {
    return await getTokenInfo();
  }
  return token;
};

export {
  getGateWayToken,
};
