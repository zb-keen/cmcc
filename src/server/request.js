import axios from 'axios';
import { Toast } from 'vant';
import { getUUID, getQueryString, isApp } from '@/utils/tool';
// import { getGateWayToken } from '@/server/gateway';
import { encryptByAES, decryptByAES } from '@/utils/crypto';

let currentToast = null;

function showToast(message) {
  if (currentToast) {
    Toast.clear(); // 清除当前显示的Toast
  }
  currentToast = Toast({
    message: message,
    duration: 1000
  });
}

const service = axios.create({
  headers: {
    'Content-Type': 'text/plain;charset=UTF-8'
  },
  timeout: 10000, // request timeout
});

// 添加请求拦截器
service.interceptors.request.use(async (config) => {
  let xk = getQueryString('xk');
  let isGetTokeUrl = config.url.includes('ordertoken');
  let token = '';
  if (!isGetTokeUrl) {
    config.data.xk = xk || JSON.parse(localStorage.getItem('userInfo')).xk || getUUID();
    //token = await getGateWayToken();//疑问？需不需要处理token过期的场景，目前是走老方法本地按时间校验
  }
  // if (token == 'undefined' || token == undefined) {//再次校验防止token没拿到的情况出现
  //   token = await getGateWayToken();
  // }
  if (isApp()) {
    const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;
    xk = userInfo?.xk;
  }
  // //TODO:临时关闭加密
  // config.bodyType = 0

  config.headers['body-type'] = config.bodyType;

  // if (config.url.indexOf("?") == -1) {
  //   config.url = !isGetTokeUrl ? config.url + "?token=" + token : config.url
  // } else {
  //   config.url = config.url + "&token=" + token
  // }

  config.data = config.data ? (config.bodyType === 1 ? encryptByAES(JSON.stringify(config.data)) : config.data) : '';
  return config;
}, (error) => {
  Toast.fail(error);
  return Promise.reject(error);
});

// 添加响应拦截器
service.interceptors.response.use((response) => {
  const res = response.data;
  console.log('返回数据===>')
  console.log(res)
  if (response.config.bodyType === 1) {
    console.log('解密==>')
    if (res.data && typeof res.data === 'string') {
      let temp = decryptByAES(res.data);
      res.data = temp ? JSON.parse(temp) : null
    }
  }
  return res
  // Toast.fail(res.msg);
}, (error) => {
  console.log('响应异常===>')
  console.log(error.response);
  let loadingDom = document.querySelectorAll('.my-loading');
  if (loadingDom && loadingDom.length > 0) {
    loadingDom.forEach((element, index) => {
      element.style.display = 'none';
    })
  }
  if (error.response.status === 504) {
    // showToast('请求超时，请稍后重试！');
    console.log('请求超时，请稍后重试！');
  } else {
    // showToast('网络故障，请稍后再试！');
    console.log('网络故障，请稍后再试！');
  }
  return Promise.reject(error);
});

export default service;
