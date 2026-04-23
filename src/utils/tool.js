import CommonApi from '@/api/index';
import { openNewWebview, goNativePage } from './native';
import CONSTANTS from '@/utils/constants';
import { Dialog } from "vant";

const ua = window.navigator.userAgent;
const isIOS = ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
const isAndroid = ua.indexOf('Android') > -1 || ua.indexOf('Adr') > -1;

const trim = (str) => {
  return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}

const getUUID = () => {
  const temp_url = URL.createObjectURL(new Blob())
  const uuid = temp_url.toString()
  URL.revokeObjectURL(temp_url) // 释放这个url
  return uuid.substring(uuid.lastIndexOf('/') + 1)
}

/**
 * encode url参数
 * @param {*} url
 */
const encodeUrlParam = (url) => {
  let paramStrList = url?.slice(url?.indexOf('?') + 1, url.length)?.split('&')
  if (!paramStrList || (!url.includes('{') && !url.includes('busiurl'))) {
    return url
  }
  let encodeParamStrList = paramStrList.map((paramStr, index) => {
    if (paramStr.includes('{')) {
      let encodeValue = encodeURIComponent(paramStr.split('=')[1])
      return [paramStr.split('=')[0], encodeValue].join('=')
    } else if (paramStr.includes('busiurl')) {
      let encodeValue = encodeURIComponent(paramStr?.slice(paramStr?.indexOf('=') + 1, url.length - 1))
      return [paramStr.split('=')[0], encodeValue].join('=')
    }
    else {
      return paramStr
    }
  }).join('&')
  return url?.split('?')[0] + '?' + encodeParamStrList
}

/**
 * 获取历史搜索
 * @param {*} userId 用户唯一标识
 * @param {*} pageEntrance 栏目标识
 * @returns
 */
const getHistoryData = (pageEntrance) => {
  return new Promise((resolve, reject) => {
    try {
      if (!isApp()) {
        const xkTag = JSON.parse(localStorage.getItem('userInfo')) && JSON.parse(localStorage.getItem('userInfo')).xk ? JSON.parse(localStorage.getItem('userInfo')).xk : '';
        let configList = sessionStorage.configListSes ? JSON.parse(sessionStorage.configListSes) : {};
        let pageColumnTagArr = configList.UNIFY_ENTRY_PAGE_COLUMN || [];
        let pageColumnWriteTag = [];
        let pageColumnReadTag = [];
        if (pageColumnTagArr && pageColumnTagArr.length > 0) {
          pageColumnTagArr.forEach((item, index) => {
            if (item.write == true) {
              pageColumnWriteTag.push(item.column);
            }
            if (item.read == true) {
              pageColumnReadTag.push(item.column);
            }
          })
        }
        let pageColumnTag = pageColumnReadTag[0];
        const historyDataTemp = localStorage.getItem(pageColumnTag);
        const historyData = historyDataTemp ? JSON.parse(historyDataTemp) : [];
        const result = historyData.reverse();
        resolve(result)
        // if (pageColumnWriteTag && pageColumnWriteTag.length > 0) {
        //   for (let i = 0; i < pageColumnWriteTag.length; i++) {
        //     let pageColumnTag = pageColumnReadTag[0];
        //     let pageEntranceFlag = '';
        //     if (pageEntrance == '6' || pageEntrance == '8') {
        //       pageEntranceFlag = pageEntrance + '_pageColumn_' + '_' + pageColumnTag + '_' + xkTag + '';
        //     } else {
        //       pageEntranceFlag = '_pageColumn_' + '_' + pageColumnWriteTag[i] + '_' + xkTag + '';
        //     }
        //   }
        // }
      } else {
        const xkTag = JSON.parse(localStorage.getItem('userInfo')) && JSON.parse(localStorage.getItem('userInfo')).xk ? JSON.parse(localStorage.getItem('userInfo')).xk : '';
        let configList = sessionStorage.configListSes ? JSON.parse(sessionStorage.configListSes) : {};
        let pageColumnTagArr = configList.UNIFY_ENTRY_PAGE_COLUMN || [];
        let pageColumnWriteTag = [];
        let pageColumnReadTag = [];
        if (pageColumnTagArr && pageColumnTagArr.length > 0) {
          pageColumnTagArr.forEach((item, index) => {
            if (item.write == true) {
              pageColumnWriteTag.push(item.column);
            }
            if (item.read == true) {
              pageColumnReadTag.push(item.column);
            }
          })
        }
        // if (pageColumnWriteTag && pageColumnWriteTag.length > 0) {
        //   for (let i = 0; i < pageColumnWriteTag.length; i++) {
        //   }
        // }
        let pageColumnTag = pageColumnReadTag[0];
        // let pageEntranceFlag = '';
        // if (pageEntrance == '6' || pageEntrance == '8') {
        //   pageEntranceFlag = pageEntrance + '_pageColumn_' + '_' + pageColumnTag + '_' + xkTag + '';
        // } else {
        //   pageEntranceFlag = '_pageColumn_' + '_' + pageColumnWriteTag[i] + '_' + xkTag + '';
        // }
        console.log("getHistoryData+pageColumnTag++++" + pageColumnTag);
        let hasEnd = false
        cmcc.getDataFromNative({
          debug: false,
          key: pageColumnTag, // 存储数据时的 key, 不能为空, String 类型。必传
          success(res) {
            hasEnd = true
            console.log(("getDataFromNative+++++" + JSON.stringify(res)))
            const historyDataTemp = res.value; // 存储的 key 对应的数据。String 类型。获取不到返回空字符串。
            localStorage.setItem(pageColumnTag, historyDataTemp);
            const historyData = historyDataTemp ? JSON.parse(historyDataTemp) : [];
            const result = historyData.reverse();
            resolve(result);
          },
          error(res) {
            hasEnd = true
            console.log('getHistoryData---失败')
            resolve([])
          },
        });
        setTimeout(function () {
          if (!hasEnd) {
            console.warn('getHistoryData 超时')
            resolve([])
          }
        }, 1000)
      }
    } catch (err) {
      console.warn('getHistoryData error')
      console.error(err)
      resolve()
    }
  })
};

const updateHistoryData = (pageEntrance, data) => {
  const xkTag = JSON.parse(localStorage.getItem('userInfo')).xk || '';
  let configList = sessionStorage.configListSes ? JSON.parse(sessionStorage.configListSes) : {};
  let pageColumnTagArr = configList.UNIFY_ENTRY_PAGE_COLUMN || [];
  let pageColumnWriteTag = [];
  let pageColumnReadTag = [];
  if (pageColumnTagArr && pageColumnTagArr.length > 0) {
    pageColumnTagArr.forEach((item, index) => {
      if (item.write == true) {
        pageColumnWriteTag.push(item.column);
      }
      if (item.read == true) {
        pageColumnReadTag.push(item.column);
      }
    })
  }
  let pageColumnTag = pageColumnReadTag[0];
  let pageEntranceFlag = '';
  // if (pageEntrance == '6' || pageEntrance == '8') {
  //   pageEntranceFlag = pageEntrance + '_pageColumn_' + '_' + pageColumnTag + '_' + xkTag + '';
  // } else {
  //   pageEntranceFlag = '1' + '_pageColumn_' + '_' + pageColumnTag + '_' + xkTag + '';
  // }
  // let historyData6And8 = [];
  // if (pageEntrance == '6' || pageEntrance == '8') {
  //   let titleTmp = pageEntrance + '_pageColumn_' + '_' + pageColumnTag + '_' + xkTag + '';
  //   let historyDataTemp = ''
  //   if (localStorage.getItem(titleTmp) != '' && localStorage.getItem(titleTmp) != null && localStorage.getItem(titleTmp) != undefined) {
  //     historyDataTemp = JSON.parse(localStorage.getItem(pageEntrance + '_pageColumn_' + '_' + pageColumnTag + '_' + xkTag + ''));
  //   } else {
  //     historyDataTemp = []
  //   }
  //   // const historyDataTemp = localStorage.getItem(pageEntrance + '_pageColumn_' +'_'+ pageColumnTag +'_'+ xkTag + '')?
  //   // JSON.parse(localStorage.getItem(pageEntrance + '_pageColumn_' +'_'+ pageColumnTag +'_'+ xkTag + '')) : '';
  //   historyData6And8 = historyDataTemp ? historyDataTemp : [];
  //   const index = historyData6And8.findIndex((e) => e.markName === data.markName);
  //   if (index !== -1) {
  //     historyData6And8.splice(index, 1);
  //   }
  //   historyData6And8.push({
  //     ...data,
  //     time: new Date().getTime(),
  //   });
  // }
  for (let i = 0; i < pageColumnWriteTag.length; i++) {
    let historyData = [];
    let historyWordsForPageEntrance1And6And8 = [];

    // for (const pageEntranceTemp of [1,6,8]) {
    let storageArr = [];
    let addStr = '_pageColumn_' + '_' + pageColumnWriteTag[i] + '_' + xkTag;

    // console.log("localStorage.getItem(addStr)+" + localStorage.getItem(addStr));

    if (localStorage.getItem(addStr) != '' && localStorage.getItem(addStr) != null && localStorage.getItem(addStr) != undefined) {
      storageArr = JSON.parse(localStorage.getItem(addStr));
    } else {
      storageArr = [];
    }

    if (storageArr && storageArr.length > 0) {
      historyWordsForPageEntrance1And6And8.push(...storageArr);
    }
    // }

    const uniqueArr = historyWordsForPageEntrance1And6And8.reduce((acc, item) => {
      const existingItem = acc.find((i) => i.markName === item.markName);
      if (!existingItem) {
        acc.push(item);
      }
      return acc;
    }, []);
    historyData = uniqueArr || [];
    const index = historyData.findIndex((e) => e.markName === data.markName);
    if (index !== -1) {
      historyData.splice(index, 1);
    }
    historyData.push({
      ...data,
      time: new Date().getTime(),
    });
    // if(pageEntrance == '6' || pageEntrance == '8'){
    //   localStorage.setItem(pageEntrance + '_pageColumn_' +'_'+ pageColumnTag +'_'+ xkTag + '', JSON.stringify(historyData6And8));
    //   localStorage.setItem('1' + '_pageColumn_' +'_'+ pageColumnWriteTag[i] +'_'+ xkTag + '', JSON.stringify(historyData));
    // }else{
    localStorage.setItem(addStr, JSON.stringify(historyData));
    // }
    const storageEvent = new Event('storage');

    Object.defineProperty(storageEvent, 'key', {
      value: pageEntranceFlag,
      enumerable: true,
    });
    Object.defineProperty(storageEvent, 'newValue', {
      value: JSON.stringify(historyData),
      enumerable: true,
    });
    window.dispatchEvent(storageEvent);
    if (isApp()) {
      console.log("pageEntranceFlag+" + addStr);
      console.log("saveDataToNative+" + JSON.stringify(historyData));
      // let pageEntranceFlagApp = '';
      // pageEntranceFlagApp = '_pageColumn_' +'_'+ pageColumnWriteTag[i] +'_'+ xkTag + '';
      try {
        cmcc.saveDataToNative({
          debug: false,
          key: addStr, // 存储数据的 key, 不能为空, String 类型。必传
          value: JSON.stringify(historyData), // 需要存储的数据, String 类型。必传
          success(res) {
            console.log("111" + JSON.stringify(res));
          },
          error(res) {
          },
        });
      } catch (err) {
        console.error('cmcc.saveDataToNative')
      }
    }
  }
  // localStorage.setItem(pageEntrance, JSON.stringify(historyData));
};

const deleteHistoryData = (pageEntrance, historyData) => {
  console.log("deleteHistoryData++++" + pageEntrance + "++++++" + historyData)
  const xkTag = JSON.parse(localStorage.getItem('userInfo')).xk || '';
  let configList = sessionStorage.configListSes ? JSON.parse(sessionStorage.configListSes) : {};
  let pageColumnTagArr = configList.UNIFY_ENTRY_PAGE_COLUMN || [];
  let pageColumnWriteTag = [];
  let pageColumnReadTag = [];
  if (pageColumnTagArr && pageColumnTagArr.length > 0) {
    pageColumnTagArr.forEach((item, index) => {
      if (item.write == true) {
        pageColumnWriteTag.push(item.column);
      }
      if (item.read == true) {
        pageColumnReadTag.push(item.column);
      }
    })
  }
  if (pageColumnWriteTag && pageColumnWriteTag.length > 0) {
    for (let i = 0; i < pageColumnWriteTag.length; i++) {
      let pageColumnTag = pageColumnReadTag[0];
      let pageEntranceFlag = '';
      // if(pageEntrance == '6' || pageEntrance == '8'){
      //   pageEntranceFlag = pageEntrance + '_pageColumn_' +'_'+ pageColumnTag +'_'+ xkTag + '';
      // }else{
      pageEntranceFlag = '_pageColumn_' + '_' + pageColumnWriteTag[i] + '_' + xkTag + '';
      // }
      if (!isApp()) {
        localStorage.setItem(pageEntranceFlag, JSON.stringify(historyData));
      } else {
        console.log("进入cmcc.saveDataToNative");
        localStorage.setItem(pageEntranceFlag, JSON.stringify(historyData));
        try {
          cmcc.saveDataToNative({
            debug: false,
            key: pageEntranceFlag, // 存储数据的 key, 不能为空, String 类型。必传
            value: JSON.stringify(historyData), // 需要存储的数据, String 类型。必传
            success(res) {
            },
            error(res) {
            },
          });
        } catch (err) {
          console.error('cmcc.saveDataToNative')
        }
      }
    }
  }
};

/**
 * 缓存展开折叠数据
 * @param {*} key
 * @returns
 */
const getShowStatus = () => {
  return new Promise((resolve, reject) => {
    try {
      if (isApp()) {
        let hasEnd = false
        cmcc.getDataFromNative({
          debug: false,
          key: 'status',//存储数据时的 key, 不能为空, String 类型。必传
          success: function (res) {
            hasEnd = true
            console.log('获取状态成功', JSON.stringify(res))
            let result = res.value ? JSON.parse(res.value) : {
              discoveryShowStatus: false,
              hotShowStatus: false,
              guessShowStatus: false,
            };//存储的 key 对应的数据。String 类型。获取不到返回空字符串。
            localStorage.setItem('status', JSON.stringify(result))
            resolve()
          },
          error: function (res) {
            hasEnd = true
            console.log(res, '失败了')
            resolve()
          }
        });
        setTimeout(function () {
          if (!hasEnd) {
            console.warn('getShowStatus 超时')
            resolve()
          }
        }, 1000)
      } else {
        const status = localStorage.getItem('status');
        let result = status ? JSON.parse(status) : {
          discoveryShowStatus: false,
          hotShowStatus: false,
          guessShowStatus: false,
        };
        localStorage.setItem('status', JSON.stringify(result))
        resolve(result);
      }
    } catch (err) {
      console.warn('getShowStatus error')
      console.error(err)
      resolve()
    }
  })
};

const updateShowStatus = (name, value) => {
  let temp = localStorage.getItem('status');
  let data = temp ? JSON.parse(temp) : {
    discoveryShowStatus: false,
    hotShowStatus: false,
    guessShowStatus: false,
  };
  data[name] = value;
  localStorage.setItem('status', JSON.stringify(data));
  if (isApp()) {
    try {
      cmcc.saveDataToNative({
        debug: false,
        key: 'status', // 存储数据的 key, 不能为空, String 类型。必传
        value: JSON.stringify(data), // 需要存储的数据, String 类型。必传
        success(res) { },
        error(res) {
          console.log('updateShowStatus 失败')
        },
      });
    } catch (err) {
      console.error('cmcc.saveDataToNative')
    }
  }
};

/**
 * 获取地址栏参数
 * @param {*} param
 * @param {*} name
 * @returns
 */
const getQueryString = (param, name) => {
  const reg = new RegExp(`(^|&)${param}=([^&]*)(&|$)`, 'i');
  const r = window.location.search.substr(1).match(reg);
  let data;
  if (r != null) {
    try {
      data = JSON.parse(decodeURIComponent(r[2]));
      console.log('getQueryString方法获取==>')
      console.log(data)
    } catch (error) {
      data = decodeURIComponent(r[2]);
      console.log('getQueryString异常==>')
      console.log(data)
    }
  } else {
    data = null;
  }
  if (data && (typeof data === 'object')) {
    return data[name] || null;
  }
  return data;
};

const flat = function (prop = 1, arr) {
  if (typeof (prop) !== 'number') {
    throw new TypeError('prop need Number');
  }
  const that = arr;
  if (!Array.isArray(that)) {
    throw new TypeError('Data type is not Array');
  }
  let target = [];
  if (prop === Infinity) {
    target = that;
    do {
      target = flat(1, target);
    } while (target.some(d => Array.isArray(d)));
    return target
  }
  if (prop <= 0) return that;
  if (that.every(i => !Array.isArray(i))) return that;
  prop--;
  that.forEach(item => {
    if (Array.isArray(item) && item.some(t => Array.isArray(t))) {
      target = target.concat(flat(prop, item));
    } else if (Array.isArray(item)) {
      target = target.concat(flat(1, item))
    } else {
      target.push(item)
    }
  })
  return target
}

const flatMap = function (mapper, arr) {
  return flat(1, arr.map(mapper));
};

/**
 * url根据app端的新解析方法
 */
let Base64 = require('js-base64').Base64;

const getQueryStringNew = () => {
  // const query = "markId=102026&markName=5pyI5YyF6L+UM+WFgw==&pageEntrance=1";
  // console.log(parent.location.href, 'parent.location.href')
  const queryTrans = parent.location.href.split('?')[1];
  sessionStorage.setItem("newUrl", queryTrans);

  if (queryTrans) {
    // 将字符串按照 '?' 分割成数组
    const arr = queryTrans.split('?');
    // 将数组中每个元素按照 '&' 分割，并将所有分割后的元素放入一个新数组
    const flattenedArr = flatMap((item => item.split('&')), arr);
    // 去掉数组中重复的元素
    const uniqueArr = Array.from(new Set(flattenedArr));
    console.log('uniqueArr==>')
    console.log(uniqueArr)

    const params = {};
    for (let i = 0; i < uniqueArr.length; i++) {
      const pair = uniqueArr[i].split("=");
      if (pair[0] == 'markName') {
        params[pair[0]] = decodeURIComponent(pair[1]);
      } else if (pair[0] == 'keyword') {
        // params[pair[0]] = (decodeURI(decodeURIComponent(encodeURIComponent(pair[1].replace(/%20/g, '+'))))); // 对接方说加密用的encodeURI
        // keyword参数以后用和markname一样的解码方式base64
        params[pair[0]] = Base64.decode(decodeURIComponent(encodeURIComponent(pair[1].replace(/%20/g, '+'))))
      }
      else {
        params[pair[0]] = decodeURIComponent(encodeURIComponent(pair[1].replace(/%20/g, '+')));
      }
    }

    // if(!['1','2','3','4'].includes(params.pageEntrance) || isIOS || isHarmony()){
    //   params.markName = params.markName && Base64.decode(decodeURIComponent(encodeURIComponent(params.markName).replace(/%20/g, '+')))
    // }

    // if (isIOS || isHarmony()) {
    //   params.markName = params.markName && Base64.decode(decodeURIComponent(encodeURIComponent(params.markName).replace(/%20/g, '+')))
    // }

    // app搜索框默认搜索词加解密需求
    // 页面入口枚举,1:普通版首页,2:PLUS 版首页,3:全球通首页,4:动感地带首页,5:分类页,6:权益页,7:探索页,8:商城页
    // console.log('页面入口===>', params.pageEntrance)
    // console.log('是否商城H5===>', params.sourceFrom)
    const userInfo = localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")) : null;
    // console.log('用户信息===>');
    // console.log(userInfo);
    const version = userInfo?.version ? userInfo?.version.split('_')[1] : '';
    // console.log('版本信息===>', version);
    const versionArr = version.split('.')
    // console.log('是否ios===>', isIOS)
    // console.log('是否鸿蒙===>', isHarmony())
    // APP搜索框默认搜索词加密传输需求文档
    if (params.pageEntrance === '5') {
      console.log('分类页全部解密处理===>')
      params.markName = params.markName && Base64.decode(decodeURIComponent(encodeURIComponent(params.markName).replace(/%20/g, '+')))
    } else if (params.pageEntrance === '8') {
      console.log('商城页区分H5和原生===>')
      if (params.sourceFrom === '1') {
        console.log('商城-H5解密处理===>')
        params.markName = params.markName && Base64.decode(decodeURIComponent(encodeURIComponent(params.markName).replace(/%20/g, '+')))
      } else {
        if (isIOS || isHarmony()) {
          console.log('商城-ios-鸿蒙-解密处理===>')
          params.markName = params.markName && Base64.decode(decodeURIComponent(encodeURIComponent(params.markName).replace(/%20/g, '+')))
        } else {
          if (versionArr[0] > 11) {
            console.log('商城-安卓-11以上版本解密处理===>')
            params.markName = params.markName && Base64.decode(decodeURIComponent(encodeURIComponent(params.markName).replace(/%20/g, '+')))
          } else if (versionArr[0] == 11 && versionArr[1] >= 3) {
            console.log('商城-安卓-11.3及以上解密处理===>')
            params.markName = params.markName && Base64.decode(decodeURIComponent(encodeURIComponent(params.markName).replace(/%20/g, '+')))
          } else {
            console.log('商城-安卓-低于11.3不处理')
          }
        }
      }
    } else {
      if (isIOS || isHarmony()) {
        console.log('非分类和商城-ios||鸿蒙解密处理===>')
        params.markName = params.markName && Base64.decode(decodeURIComponent(encodeURIComponent(params.markName).replace(/%20/g, '+')))
      } else {
        if (versionArr[0] > 11) {
          console.log('非分类和商城-安卓-11以上版本解密处理===>')
          params.markName = params.markName && Base64.decode(decodeURIComponent(encodeURIComponent(params.markName).replace(/%20/g, '+')))
        } else if (versionArr[0] == 11 && versionArr[1] >= 3) {
          console.log('非分类和商城-安卓-11.3及以上解密处理===>')
          params.markName = params.markName && Base64.decode(decodeURIComponent(encodeURIComponent(params.markName).replace(/%20/g, '+')))
        } else {
          console.log('非分类和商城-安卓-低于11.3不处理')
        }
      }
    }
    // app搜索框默认搜索词加解密需求
    // console.log('url解析后的数据信息==>')
    // console.log(params)
    sessionStorage.setItem('pageEntrance', params.pageEntrance)
    sessionStorage.setItem('newUrlParams', JSON.stringify(params))
    return params;
  } else {
    return {};
  }
};

/**
 * 点击搜索结果记录埋点
 */
const handleSaveClickInfo = (item, keywords) => {
  const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;
  // 从会话中获取页面入口信息
  // const pageEntrance = getQueryStringNew().pageEntrance;
  const pageEntrance = sessionStorage.getItem("pageEntrance");

  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const dates = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const nowday = `${year}-${month}-${dates} ${hours}:${minutes}:${seconds}`;
  const params = {
    phone: userInfo?.phoneNumber || '',
    // userSourceProvCode: userInfo.loginProvince,
    loginProvince: userInfo?.loginProvince || '',
    platform: pageEntrance,
    clientVersion: userInfo?.version ? `10_10,${userInfo?.version}` : '10_10',
    transactionId: sessionStorage.transactionIdSes ? sessionStorage.transactionIdSes : '',
    searchInfo: [
      {
        searchKeyword: keywords,
        dataId: item.dataNo,
        title: item.title,
        time: nowday,
        sourceProvCode: item.sourceProvCode,
        userChooseProvCode: userInfo?.province || '',
      },
    ],
  };
  return new Promise((resolve, reject) => {
    CommonApi.querySaveClickInfo(params).then((res) => {
      resolve('0');
      if (res.code == '000000') {
        console.log('querySaveClickInfo接口调用成功');
      } else {
        console.log('querySaveClickInfo接口调用返回异常');
      }
    }).catch(() => {
      resolve('1');
      console.log('querySaveClickInfo接口调用失败');
    });
  })

};

const handleGetUrlParam = () => {
  const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;
  // 从会话存储中获取pageEntrance信息
  // const pageEntrance = getQueryStringNew().pageEntrance;
  const pageEntrance = sessionStorage.getItem("pageEntrance");

  const paramData = {
    busiCode: 'SEARCH_INDEX_BY_ALL',
    params: {
      keyWord: '',
    },
    page: '1',
    size: 10,
    categoryCode: '',
    parentCode: '',
    templateId: '',
    sortField: '',
    location: '',
    provCode: '',
    clientVersion: '10_10',
    phoneNum: '',
    userSourceProvCode: '',
    platform: '1',
    loginFlg: '1',
    minPrice: '',
    maxPrice: '',
    beans: [],
    networkStd: '', // 网络制式
    buyWay: '', // 购机方式
    loginProvince: '',
    loginCity: ''
  };
  paramData.provCode = userInfo?.province || '';
  paramData.phoneNum = userInfo?.phoneNumber || '';
  paramData.userSourceProvCode = userInfo?.loginProvince || '';
  paramData.clientVersion = userInfo?.version ? `10_10,${userInfo?.version}` : '10_10';
  paramData.platform = pageEntrance || '';
  paramData.entryPage = pageEntrance || '';
  paramData.loginFlg = userInfo?.phoneNumber ? '1' : '0';
  paramData.loginProvince = userInfo?.loginProvince || '';
  paramData.loginCity = userInfo?.loginCity || '';
  return paramData;
};

/**
 * 防抖
 * @param {*} fn
 * @param {*} t
 * @returns
 */
const Debounce = (fn, delay = 500) => {
  let timer;
  return function () {
    const args = arguments;
    if (timer) {
      clearTimeout(timer);
      console.log('debounce1')
    }

    timer = setTimeout(() => {
      // console.log(fn)
      timer = null;
      fn.apply(this, args);
    }, delay);
  };
};

/**
 * 字符长度处理 超出指定长度...
 * @param {*} str
 * @param {*} len
 * @returns
 */
const handleChar = (str, len = 11) => {
  if (str.length >= len) {
    str = str.substr(0, len - 1);
    str += '...';
  }
  return str;
};

/**
 * 首页跳转页面方法
 * @param {*} actionType 跳转类型 1：H5页面扩展,  4：客户端原生功能,5：小程序链接,11：无跳转
 * @param {*} actionUrl 跳转地址
 */
const goPage = (actionType, actionUrl) => {
  if (isApp()) {
    try {
      cmcc.saveDataToNative({
        debug: false,
        key: 'permissKeyGoPage', // 存储数据的 key, 不能为空, String 类型。必传
        value: '9', // 需要存储的数据, String 类型。必传
        success(res) {
        },
        error(res) {
        },
      });
    } catch (err) {
      console.error('cmcc.saveDataToNative')
    }
  }
  setTimeout(() => {
    switch (actionType) {
      case '1':
        if (isApp()) {
          // openNewWebview(actionUrl)
          openNewWebview(encodeUrlParam(actionUrl))
        } else {
          window.onpageshow = null;
          window.onpageshow = function (event) {
            window.location.reload();
          }
          if (actionUrl) {
            window.location.href = actionUrl;
          }
        }
        break;
      // 测试新电商原生链接--11.7版本后新增的一种跳转链接方式
      // case '3':
      // openNewWebview(actionUrl);
      // goNativePage("", actionUrl);
      // break;
      case '4':
        goNativePage(actionUrl);
        break;
      case '5':
        openNewWebview(actionUrl);
        break;
      default:
        console.log("goPage");//sonar扫描显示default与case1方法重复
        break;
    }
  }, 500);
};

const pageType = (url) => {
  // 如果不是http\https说明是原生，如果是http或者https并且地址栏中有appId的参数说明是小程序，否则为H5
}

/**
 * 结果页跳转页面方法
 * @param {*} jumpType 跳转类型 1:原生跳转goNativePage; 2:http/https 跳转 (H5链接 ); 3:原生化链接; 30:小程序链接openNewWebview; 40:政企视频
 * @param {*} jumpUrl 跳转地址
 */
const goPageUrl = (jumpType, jumpUrl) => {
  // 1、先加第1个兜底逻辑，跳转类型是1且链接是http开头的按H5跳转处理
  // 非小程序的且是http开头的按H5跳转处理；非小程序且非http开头的当原生跳转处理
  // 针对第1点；我还漏了1点，如果传的类型是1，链接又是http开头的。还是得判断是否小程序，是走小程序否走H5
  // var jumpUrl = 'https://app.10086.cn/activity/transferXcx/index.html?platform=cmcc&appId=1668638971797480&path=pages%2Ftearbox%2Findex%3FactivitvId%3D10230324208channelId-00000011020'
  // var jumpUrl = "https://wap.js.10086.cn/vw/navbar/GMZ0/index?ch=7x&jtNeedLog=1";
  if (isApp()) {
    try {
      cmcc.saveDataToNative({
        debug: false,
        key: 'permissKeyGoPage', // 存储数据的 key, 不能为空, String 类型。必传
        value: '9', // 需要存储的数据, String 类型。必传
        success(res) {
        },
        error(res) {
        },
      });
    } catch (err) {
      console.error('cmcc.saveDataToNative')
    }
  }
  const regex = /\/activity\/transferXcx\/index\.html/;
  const isMatch = regex.test(jumpUrl);
  if (isMatch) {
    if (getQueryParams(jumpUrl).platform && getQueryParams(jumpUrl).appId) {//小程序两层判断
      openNewWebview(jumpUrl);
    } else {
      if (jumpUrl.replace(' ', '').split(":")[0] == 'http' || jumpUrl.replace(' ', '').split(":")[0] == 'https') {//h5
        if (isApp()) {
          // openNewWebview(jumpUrl)
          openNewWebview(encodeUrlParam(jumpUrl))
        } else {
          window.onpageshow = null;
          window.onpageshow = function (event) {
            window.location.reload();
          }
          if (jumpUrl) {
            window.location.href = jumpUrl;
          }
        }
      } else {//原生
        goNativePage(jumpUrl);
      }
    }
  } else {//不是小程序
    if (jumpUrl.replace(' ', '').split(":")[0] == 'http' || jumpUrl.replace(' ', '').split(":")[0] == 'https') {
      if (isApp()) {
        // openNewWebview(jumpUrl)
        openNewWebview(encodeUrlParam(jumpUrl))
      } else {
        window.onpageshow = null;
        window.onpageshow = function (event) {
          window.location.reload();
        }
        if (jumpUrl) {
          window.location.href = jumpUrl;
        }
      }
    } else {
      if (jumpUrl === 'myPackage') {
        const userInfo = localStorage.getItem("userInfo")
          ? JSON.parse(localStorage.getItem("userInfo"))
          : null;
        const version = userInfo?.version ? userInfo?.version.split("_")[1] : "";
        if (compareVersion(version, '11.8.0') !== -1) {
          console.log('我的套餐-异常原生化链接地址匹配重写-客户端版本11.8.0校验通过===>')
          openNewWebview(encodeUrlParam('https://chinamobileapp/rn/common/myPackage'))
        }
      } else {
        goNativePage(jumpUrl);
      }
    }
  }
};

/**
 * 跳转原生化链接页面
 * @param {*} jumpUrl 跳转地址
 */
const goProtogenesisPage = (jumpUrl) => {
  if (isApp()) {
    try {
      cmcc.saveDataToNative({
        debug: false,
        key: 'permissKeyGoPage', // 存储数据的 key, 不能为空, String 类型。必传
        value: '9', // 需要存储的数据, String 类型。必传
        success(res) {
        },
        error(res) {
        },
      });
    } catch (err) {
      console.error('cmcc.saveDataToNative')
    }
  }
  console.log('这是原生化链接的跳转====>')
  if (isApp()) {
    openNewWebview(jumpUrl);
  } else {
    console.log('原生化链接的跳转,但不是app====>')
  }
};

/**
 * 获取字符串的长度
 * @param {*} str
 */
const getConWidth = (str) => {
  const showStr = handleChar(str);
  const { offsetWidth } = document.body;
  const fontSize = (offsetWidth * 24) / 750;
  const padding = (offsetWidth * 29) / 750;
  const height = (offsetWidth * 60) / 750;
  const container = document.createElement('div');
  container.style.cssText = `float:left;font-size:${fontSize}px;font-weight:500;padding:0 ${padding}px;height:${height}px;display:flex;align-items:center;`;
  const innerCon = `<span>${showStr}</span>`;
  container.innerHTML = innerCon;
  document.body.appendChild(container);
  const width = container.clientWidth;
  document.body.removeChild(container);
  return width;
};

/**
 * 判断是否是APP环境
 */
const isApp = () => {
  const ua = navigator.userAgent.toLowerCase();
  return ua.indexOf('leadeon') > -1;
};

/**
 * 判断是否是harmony环境
 */
const isHarmony = () => {
  const ua = navigator.userAgent.toLowerCase();
  return ua.indexOf('harmony') > -1;
};

/**
 * 获取用户信息
 * 用户信息中省份首次下载是北京，后续是上次登录号码的归属地
 * @return
 */
const getUserInfo = () => {
  return new Promise((resolve, reject) => {
    try {
      if (isApp()) {
        let hasEnd = false
        cmcc.getUserInfo({
          debug: false,
          success(res) {
            console.log('调用原生获取用户全部信息==>')
            console.log(res)
            hasEnd = true
            let result = {
              cid: res.cid || '',  // 推送标识
              clientID: res.clientID || '',  // 客户端唯一标识
              userBrand: res.userBrand || '',  //推送标识
              xk: res?.xk || '',
              st: res?.st || '',
              osType: res?.osType || '',
              version: res?.version || '',
              province: res?.province || '', // 首次下载是北京，后续是上次登录号码的归属地
              city: res?.city || '',
              phoneNumber: res?.phoneNumber || '',
              loginProvince: res?.loginProvince || '',
              loginCity: res?.loginCity || '',
              gsmState: res?.gsmState || '',
              birthday: res?.birthday || '',
            }
            if (result.version) {
              result.version = result.osType === 'android' ? '1_' + result.version : (result.osType === 'ios' ? '2_' + result.version : (result.osType === 'HarmonyOS' ? '10_' + result.version : result.version))
            }
            localStorage.setItem('userInfo', JSON.stringify(result));
            resolve(result);
          },
          error() {
            hasEnd = true
            console.log(res, '获取用户信息失败');
            reject(null);
          },
        });
        setTimeout(function () {
          if (!hasEnd) {
            console.warn('getUserInfo 超时')
            resolve([])
          }
        }, 1000)
      } else {
        let result = getQueryString('sendParam', 'userInfo');
        if (result?.version) {
          result.version = isIOS ? '2_' + result.version : (isAndroid ? '1_' + result.version : '10_' + result.version); // 鸿蒙：10_
        }
        localStorage.setItem('userInfo', JSON.stringify(result));
        resolve(result);
      }
    } catch (err) {
      console.warn('getUserInfo error')
      console.error(err)
      resolve()
    }
  })

};

/**
 * 获取经纬度
 */
const getLocation = () => {
  return new Promise((resolve, reject) => {
    if (isApp()) {
      let hasEnd = false
      console.log('开始调用位置权限JS')
      cmcc.getCatchInfo({
        debug: false,
        isShowLocationAlert: true,//用户禁止定位权限时，是否显示定位权限申请弹框，bool类型，默认不显示。-V5.8新增
        timeoutInterval: '30', // 不填写的话默认2秒，超过时间自动触发回调
        success: function (res) {
          sessionStorage.initGetLocationFlag = '2';
          console.log('cmcc获取定位成功', res)
          const locationState = res.locationState // 拒绝时才有这个字段

          refuseTimeSave('0').then(() => {
            console.log('清除拒绝时间成功')
            // 成功
            localStorage.removeItem('locationRefuseTime')
            if (locationState && locationState.toString() === '-7') {
              // 拒绝
              // 获取当前时间戳 并存储
              const nowTime = Date.now()
              console.log(nowTime, '拒绝时间戳')
              console.log(timestampToTime(nowTime), '拒绝时间')

              localStorage.setItem('locationRefuseTime', nowTime);
              refuseTimeSave(nowTime).then(() => {
                console.log('存储拒绝时间成功')
              }) // 拒绝时间存储
            }
          }).catch(err => {

          })

          resolve({
            coords: {
              latitude: res?.latitude,
              longtitude: res?.longtitude
            }
          })
          hasEnd = true
        },
        error: function (res) {
          hasEnd = true
          console.log('cmcc获取定位失败', res)
          reject(null)
        }
      })
      // setTimeout(function() {
      //   if(!hasEnd){
      //     console.warn('获取定位 超时')
      //     resolve([])
      //   }
      // },10000)
    } else {
      if (navigator.geolocation) {
        console.log('浏览器获取定位~~')
        navigator.geolocation.getCurrentPosition(function (postion) {
          resolve(postion)
        }, function () {
          resolve(0)
        }, {
          timeout: process.env.NODE_ENV === 'development' ? 100 : 8000
        });
      } else {
        console.log('浏览器不支持获取定位~~')
        reject("Geolocation is not supported by this browser.");
      }
    }
  });
}

const refuseTimeSave = (refuseTime) => {
  return new Promise((resolve, reject) => {
    if (isApp()) {
      try {
        cmcc.saveDataToNative({
          debug: false,
          key: 'locationRefuseTime', // 存储数据的 key, 不能为空, String 类型。必传
          value: refuseTime.toString(), // 需要存储的数据, String 类型。必传
          success(res) {
            console.log('locationRefuseTime 位置定位拒绝时间存储成功', res)
            resolve(1)
          },
          error(res) {
            reject(null)
            console.log('locationRefuseTime 位置定位拒绝时间存储失败', res)
          },
        });
      } catch (err) {
        console.error('cmcc.saveDataToNative')
        reject(null)
      }
    }
  })
}

// permissionIsEnable：获取掌厅某系统权限是否开启
// location：获取掌厅是否开启定位服务，“0”表示已授权， “-5”表示暂无权限（权限错误，上下文场景错误）,“-3”表示参数非法
const isPermission = () => {
  return new Promise((resolve, reject) => {
    if (isApp()) {
      try {
        if (isIOS) {
          cmcc.permissionIsEnable({
            debug: false,
            permissionName: 'location',
            // 成功回调 resCode:成功编号, message:消息内容
            success: function (res) {
              var resCode = res.resCode; // 0：已授权
              console.log(res, '获取位置权限ios')
              if (resCode === '0') {
                resolve(1)
              } else {
                reject(0)
              }
            },
            // 失败回调  error:错误编号, errorMsg:错误内容
            error: function (res) {
              var error = res.errCode; //  -5：未授权  -3: 参数非法
              var errorMsg = res.errorMsg;
              console.log(res, '获取位置权限ios')
              reject(0)
            }
          })
        } else {
          // reject(0)
          // android.permission.ACCESS_FINE_LOCATION
          cmcc.permissionIsEnable({
            debug: false,
            permission: 'android.permission.ACCESS_FINE_LOCATION',
            // 成功回调 resCode:成功编号, message:消息内容
            success: function (res) {
              var resCode = res.resCode; // 0：已授权
              console.log(res, '获取位置权限adroid')
              if (resCode === '0' || resCode === 0) {
                resolve(1)
              } else {
                reject(0)
              }
            },
            // 失败回调  error:错误编号, errorMsg:错误内容
            error: function (res) {
              var error = res.errCode;//  -5：未授权  -3: 参数非法
              var errorMsg = res.errorMsg;
              console.log(res, '获取位置权限adroid')
              reject(0)
            }
          })
        }
      } catch {
        reject(0)
      }
    } else {
      reject(0)
    }
  })
}

// 获取拒绝时间
const getRefuseTime = () => {
  return new Promise((resolve, reject) => {
    if (isApp()) {
      try {
        cmcc.getDataFromNative({
          debug: false,
          key: 'locationRefuseTime', // 存储数据时的 key, 不能为空, String 类型。必传
          success(res) {
            let locationRefuseTime = res.value; // 存储的 key 对应的数据。String 类型。获取不到返回空字符串。
            console.log('获取定位拒绝时间成功', res)
            localStorage.setItem('locationRefuseTime', locationRefuseTime);
            const status = locationRefuseTimeCompare()
            resolve(status)
          },
          error(res) {
            console.log('获取定位拒绝时间失败', res)
            const status = locationRefuseTimeCompare()
            resolve(status)
          },
        });
      } catch (err) {
        console.error('getDataFromNative error')
        const status = locationRefuseTimeCompare()
        resolve(status)
      }
    }
  })
}

// 定位拒绝时间是否超过48小时
const locationRefuseTimeCompare = () => {
  // getRefuseTime()
  const refuseTime = localStorage.getItem('locationRefuseTime');
  console.log(refuseTime, '======拒绝时间戳')
  const now = Date.now()
  console.log(timestampToTime(Date.now()), '当前时间')
  const oneMinute = 60 * 1000; // 1分钟的毫秒数
  if (refuseTime && refuseTime != '0') {
    console.log(timestampToTime(parseInt(refuseTime)), '======拒绝时间')
    const difference = Math.abs(now - parseInt(refuseTime));
    console.log(difference, '时间差')
    return difference > 48 * 60 * oneMinute;
  }
  return true
}

const timestampToTime = (timestamp) => {
  let formattedDate = ''
  try {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    const seconds = ('0' + date.getSeconds()).slice(-2);
    formattedDate = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
  } catch {
    console.log('时间转换出错')
  }
  console.log(formattedDate);
  return formattedDate
}

/**
 * 公共方法之获取静态资源
 */
const handleQueryGetConfig = (parmas) => {
  // const that = this;
  // const parmas = {
  //   paramTypes: [
  //     'UNIFY_SEARCH_NETWORK_STD',
  //     'UNIFY_SEARCH_BUY_WAY',
  //   ],
  // };
  const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;
  parmas.loginProvince = userInfo?.loginProvince || '';
  parmas.provCode = userInfo?.province || '';
  let pageEntrance = getQueryStringNew().pageEntrance;
  parmas.entryPage = pageEntrance || '';
  parmas.deviceType = userInfo?.osType || '';
  parmas.clientVersion = userInfo?.version || '';

  return new Promise((resolve, reject) => {
    CommonApi.queryGetConfig(parmas).then((res) => {
      if (res.code == '000000') {
        resolve(res);
      }
    }).catch(() => {
      resolve({});
      console.log('GetConfig接口调用失败');
    });
  })
}

/**
 * 区域曝光
 * @param {*} target 曝光元素
 * @param {*} obj 上报数据
 * @param {*} name 存到缓存中的变量值
 */
const intersectionObserver = (target, obj, name) => {
  const observer = new IntersectionObserver(
    entries => {
      if (entries[0].isIntersecting) {
        let temp = localStorage.getItem('observertimes');
        let observertimes = temp ? JSON.parse(temp) : {};
        let times = observertimes[name]
        // 标识未在本地存储时-更新本地存储
        if (times !== '1') {
          // 元素进入可视区域
          observertimes[name] = '1';
          localStorage.setItem('observertimes', JSON.stringify(observertimes))
          console.log(name, '------------区域曝光采集---------------')
          console.log(JSON.stringify(obj))
          // console.log(obj)
          if (isApp()) {
            gdp("track", "imp", obj);
          }
        }
      } else {
        console.log('元素离开可视区域');
      }
    },
    { threshold: 0 }
  );
  // 观察目标元素
  observer.observe(target);
}

/**
 * 搜索结果-触点曝光
 * @param {*} obj 上报数据
 */
const handleGdpImp = (target, obj, type, name, pos) => {
  // gdp("track", "imp", obj);
  const observer = new IntersectionObserver(
    entries => {
      if (entries[0].isIntersecting) {
        let temp = sessionStorage.getItem('observertimes' + type);
        let observertimes = temp ? JSON.parse(temp) : {};
        let times = observertimes[name]
        if (times !== '1') {
          // 元素进入可视区域
          observertimes[name] = '1';
          sessionStorage.setItem('observertimes' + type, JSON.stringify(observertimes))
          console.log('------------' + pos + '--触点曝光采集---------------')
          console.log(JSON.stringify(obj), '------------' + pos + '--触点曝光采集---------------')
          if (isApp()) {
            gdp("track", "imp", obj);
          }
        }
      } else {
        console.log('元素离开可视区域');
      }
    },
    { threshold: 0 }
  );
  // 观察目标元素
  observer.observe(target);
}

const updateSessionStorage = (name, newVal) => {
  sessionStorage.setItem(name, newVal);
  const storageEvent = new Event('storage');
  Object.defineProperty(storageEvent, 'key', {
    value: name,
    enumerable: true
  })
  Object.defineProperty(storageEvent, 'newValue', {
    value: newVal,
    enumerable: true
  })
  window.dispatchEvent(storageEvent)
}

/**
 * IOP需求，存储关键字对应信息
 */
const getKeywordsFromSession = (type = 1) => {
  let sessionKey = type === 1 ? 'iopSearchKeywords' : 'zoneIopSearchKeywords'
  const keywordsString = sessionStorage.getItem(sessionKey);
  return keywordsString ? JSON.parse(keywordsString) : [];
}
const saveKeywordsToSession = (keywords, type = 1) => {
  let sessionKey = type === 1 ? 'iopSearchKeywords' : 'zoneIopSearchKeywords'
  sessionStorage.setItem(sessionKey, JSON.stringify(keywords));
}
const checkoutKeywordsToSession = (searchContent, type = 1) => {
  const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;
  let sessionArray = getKeywordsFromSession(type);
  let phoneNumber = userInfo?.phoneNumber || '';
  let checkString = `${phoneNumber}_${searchContent}`;
  let checkArray = [];
  if (sessionArray && sessionArray.length > 0) {
    sessionArray.forEach((item) => {
      if (item.label == checkString) {
        checkArray.push(item);
      }
    });
    if (checkArray && checkArray.length > 0) {
      return (checkArray[0].value);
    } else {
      return '999999';
    }
  } else {
    return '999999';
  }
}

/**
 * 搜索专区
 */
const handleQuerySearchZone = (searchContent, correctionFlag, params = {}) => {
  let getUrlParam = handleGetUrlParam();
  let pageEntrance = getQueryStringNew().pageEntrance;
  const { userState = '' } = params;
  let paramData = {
    params: {
      keyWord: ''
    }
  };
  const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;
  paramData.page = 1;
  paramData.size = 50;// 多请求一些
  paramData.provCode = getUrlParam.provCode;
  // paramData.clientVersion = getUrlParam.clientVersion;
  paramData.clientVersion = userInfo?.version ? `10_10,${userInfo?.version}` : '10_10';
  paramData.beans = getUrlParam.beans;
  paramData.entryPage = pageEntrance;
  paramData.loginProvince = getUrlParam.loginProvince;
  paramData.loginCity = getUrlParam.loginCity;
  paramData.params.keyWord = searchContent;
  paramData.phoneNum = userInfo?.phoneNumber || ''
  paramData.cid = userInfo?.cid || ''
  paramData.xk = userInfo?.xk || ''
  paramData.osType = userInfo?.osType || '' // android和ios
  let iopResultRes = checkoutKeywordsToSession(searchContent, 2) != '999999' ? checkoutKeywordsToSession(searchContent, 2) : null;
  paramData.iopResult = iopResultRes;
  paramData.correctionFlag = correctionFlag
  paramData.cityCode = userInfo?.city || ''
  paramData.userState = userState;
  console.log('查询专区zone传参===>', paramData)

  return new Promise((resolve, reject) => {
    // 先清除之前的缓存
    sessionStorage.setItem("searchZoneResultListSes", '');
    CommonApi.queryZone(paramData).then((res) => {
      console.log('获取专区接口数据===>', res)

      if (res.code == '000000') {
        let searchZoneResult = [];
        if (res.data && res.data.isCardSlot && res.data.isCardSlot === '1') {
          // 卡槽精准工单为1
          // let isCardPermission = '0'
          // 调取获取卡槽信息
          handleSlotZone(true).then(status => {
            console.log(status, '获取卡槽授权状态')
            const cardParams = JSON.parse(JSON.stringify(paramData))
            cardParams['isCardPermission'] = status
            const voData = JSON.parse(JSON.stringify(res.data))
            delete voData.isCardSlot;
            cardParams['appCardslotVO'] = voData
            console.log('获取卡槽工单传参===>', cardParams)
            // 获取带有卡槽的专区列表
            CommonApi.queryCardslotZone(cardParams).then((cardRes) => {
              console.log('获取卡槽工单结果====>', cardRes,)
              if (cardRes.code == '000000') {
                searchZoneResult = cardRes.data.result;
                handleZoneData(searchZoneResult, cardRes, paramData, searchContent)
                resolve(cardRes);
                // 防截屏/录屏
                // getRecordingOrScreenshotStatus(searchZoneResult)
              } else {
                resolve(cardRes);
              }
            })
          }).catch(err => {
            console.log(err, '卡槽授权失败')
          })

        } else {
          if (res.data && res.data.result) {
            searchZoneResult = res.data.result;
          }
          handleZoneData(searchZoneResult, res, paramData, searchContent)
          resolve(res);
        }
      } else {
        resolve(res);
      }
    }).catch((err) => {
      sessionStorage.setItem("searchZoneResultListSes", '');
      resolve();
      console.log('handleQuerySearchZone接口调用失败', err);
    });
  })
}

// 格式化专区或卡槽专区数据
const handleZoneData = (searchZoneResult, res, paramData, searchContent) => {
  if (searchZoneResult.length > 0) {
    searchZoneResult.forEach(obj => {
      if (obj.data) {
        // 把数据的分类信息透传至显示层
        obj.data.map(item => {
          item.wt_area_name = obj.categoryName
        })
        obj.searchZoneDataPre = obj.data;
        obj.data = [];
      }
      if (obj.subList && obj.subList.length > 0) {
        obj.subList.forEach((itemSub) => {
          if (itemSub.data) {
            // 把数据的分类信息透传至显示层
            itemSub.data.map(item => {
              item.wt_area_name = `${obj.categoryName}_${itemSub.categoryName}`
            })
            itemSub.searchZoneDataPre = itemSub.data;
            itemSub.data = [];
          }
        })
      }
    });
  }
  console.log('格式化后专区数据===>')
  console.log(searchZoneResult)
  if (searchZoneResult) {
    sessionStorage.setItem("searchZoneResultListSes", JSON.stringify(searchZoneResult));
  } else {
    sessionStorage.setItem("searchZoneResultListSes", '');
  }
  // 存储IOP缓存
  const keyword = `${paramData.phoneNum}_${searchContent}`; // 拼接搜索关键字
  const keywords = getKeywordsFromSession(2); // 获取当前缓存的搜索关键字数组
  let obj = {};
  // obj.value = res.info || null;
  obj.value = res.info || null
  obj.label = keyword;
  keywords.push(obj); // 将新的关键字推入数组
  if (keywords.length > 500) {
    keywords.splice(0, 100); // 删除前100个关键字
  }
  const uniqueA = Array.from(new Set(keywords.map(item => JSON.stringify(item)))).map(item => JSON.parse(item));
  console.log('uniqueA===>')
  console.log(uniqueA)
  saveKeywordsToSession(uniqueA, 2); // 缓存更新后保存到 Session Storage
  // console.log('专区数据', res)
  // 防截屏
  handleScreenData('CSRDC_ALL', '')
}

// 此方法无调用
const handleCardslotZone = (searchContent, correctionFlag) => {
  let getUrlParam = handleGetUrlParam();
  let pageEntrance = getQueryStringNew().pageEntrance;
  let paramData = {
    params: {
      keyWord: ''
    }
  };
  const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;
  paramData.page = 1;
  paramData.size = 50;//多请求一些
  paramData.provCode = getUrlParam.provCode;
  // paramData.clientVersion = getUrlParam.clientVersion;
  paramData.clientVersion = userInfo?.version ? `10_10,${userInfo?.version}` : '10_10';
  paramData.beans = getUrlParam.beans;
  paramData.entryPage = pageEntrance;
  paramData.loginProvince = getUrlParam.loginProvince;
  paramData.loginCity = getUrlParam.loginCity;
  paramData.params.keyWord = searchContent;
  paramData.phoneNum = userInfo?.phoneNumber || ''
  paramData.cid = userInfo?.cid || ''
  paramData.osType = userInfo?.osType || '' // android和ios
  let iopResultRes = checkoutKeywordsToSession(searchContent, 2) != '999999' ? checkoutKeywordsToSession(searchContent, 2) : null;
  paramData.iopResult = iopResultRes;
  paramData.correctionFlag = correctionFlag
  paramData.cityCode = userInfo?.city || ''
  console.log(paramData, 'zone传参')
  return new Promise((resolve, reject) => {
    CommonApi.queryCardslotZone(paramData).then((res) => {
      // var res = {"code":"100002","msg":"搜索关键词是敏感词","info":null,"data":null};
      if (res.code == '000000') {
        let searchZoneResult = [];
        if (res.data && res.data.result && res.data.result.length > 0) {
          // console.log('录屏监听方法开始')
          // getRecordingOrScreenshotStatus()
          searchZoneResult.forEach(obj => {
            if (obj.data) {
              obj.searchZoneDataPre = obj.data;
              obj.data = [];
            }
            if (obj.subList && obj.subList.length > 0) {
              obj.subList.forEach((itemSub) => {
                if (itemSub.data) {
                  itemSub.searchZoneDataPre = itemSub.data;
                  itemSub.data = [];
                }
              })
            }
          });
        }
        if (searchZoneResult) {
          sessionStorage.setItem("searchZoneResultListSes", JSON.stringify(searchZoneResult));
        } else {
          sessionStorage.setItem("searchZoneResultListSes", '');
        }
        //存储IOP缓存
        const keyword = `${paramData.phoneNum}_${searchContent}`; // 拼接搜索关键字
        const keywords = getKeywordsFromSession(2); // 获取当前缓存的搜索关键字数组
        let obj = {};
        obj.value = res.info || null;
        obj.label = keyword;
        keywords.push(obj); // 将新的关键字推入数组
        if (keywords.length > 500) {
          keywords.splice(0, 100); // 删除前100个关键字
        }
        const uniqueA = Array.from(new Set(keywords.map(item => JSON.stringify(item)))).map(item => JSON.parse(item));
        saveKeywordsToSession(uniqueA, 2); // 缓存更新后保存到 Session Storage
        resolve(res);
      } else {
        resolve(res);
      }
    }).catch((err) => {
      sessionStorage.setItem("searchZoneResultListSes", '');
      resolve();
      console.log('handleCardslotZone接口调用失败');
    });
  })
}

// 调用原生方法获取卡槽专区
const handleSlotZone = (slotZoneFlag) => {
  return new Promise((resolve, reject) => {
    // const isCardPermission = '1'
    if (slotZoneFlag) {
      // 标识为true时
      try {
        if (isApp()) {
          console.log('获取卡槽信息getMobileCardSlotInformation')
          cmcc.getMobileCardSlotInformation({
            debug: false,
            pageName: '搜索结果页',
            success: function (res) {
              // 如果授权成功 则正常展示卡槽数据；否则不展示卡槽数据
              console.log(res, '获取卡槽信息成功')
              resolve('1')
            },
            error: function (res) {
              console.log(res, '获取卡槽信息失败')
              const errCode = res.errCode // -5 用户未授权 -1 未获取到卡槽信息
              if (errCode === -5) {
                // isCardPermission = '0'
                resolve('0')
              } else {
                resolve('1')
              }
            }
          })
        } else {
          resolve('0')
          console.log('调用cmcc.getMobileCardSlotInformation失败，不是app')
        }
      } catch {
        resolve('0')
        console.log('调用cmcc.getMobileCardSlotInformation失败')
      }
    }
  })
}

// 防截屏
const handleScreenData = (categoryCode, subCategoryCode) => {
  console.log('防截屏传参===>')
  console.log(categoryCode, subCategoryCode)
  let subCode = subCategoryCode
  const zoneList = sessionStorage.searchZoneResultListSes && JSON.parse(sessionStorage.searchZoneResultListSes)
  if (!subCode || subCode === '') {
    if (zoneList) {
      const zoneData = zoneList.find(ite => categoryCode === ite.categoryCode)
      if (zoneData && zoneData.subList && zoneData.subList.length > 0) {
        subCode = zoneData.subList[0].categoryCode
      }
    }
  }
  console.log('防截屏Code', categoryCode, subCode)
  console.log('防截屏数据', zoneList, categoryCode)
  if (zoneList) {
    const zoneData = zoneList.find(ite => categoryCode === ite.categoryCode)
    if (zoneData) {
      if (zoneData.searchZoneDataPre && zoneData.searchZoneDataPre.length > 0) {
        console.log('防截屏', zoneData)
        getRecordingOrScreenshotStatus(zoneData.searchZoneDataPre)
      } else {
        if (subCode && zoneData.subList) {
          const subZoneList = zoneData.subList.find(ite => subCode === ite.categoryCode)
          if (subZoneList && subZoneList.searchZoneDataPre) {
            console.log('子元素防截屏', subZoneList)
            getRecordingOrScreenshotStatus(subZoneList.searchZoneDataPre)
          }
        }
      }
    }
  }
}

// 获取截屏录屏监听方法
var flag = true
const getRecordingOrScreenshotStatus = (zoneDataList) => {
  // 最终有可以展示的卡槽工单且有防截屏/录屏为是的卡槽工单
  console.log(zoneDataList, '卡槽专区数据')
  const slotZoneList = zoneDataList.filter(item => item.isCardSlot === '1')
  const antiScreenshotList = slotZoneList.filter(item => item.isAllowedScreenShot === '0')
  // ios 需要调用截屏录屏监听方法
  const status = sessionStorage.getItem('RecordingOrScreenshotStatus')
  if (isApp() && isIOS && antiScreenshotList.length > 0 && status != '1') {
    console.log('开始调用截屏录屏监听方法')
    sessionStorage.setItem('RecordingOrScreenshotStatus', '1')
    cmcc.getRecordingOrScreenshotStatus({
      debug: false,
      success: function (res) {
        console.log(res, '获取截屏录屏信息成功')
        var status = res.status; //0截屏 1处于录屏状态 2退出录屏状态
        if (status === '0') {
          flag = true
          Dialog.alert({
            message: '检测到正在截屏，请注意个人信息安全。',
            confirmButtonText: '知道了'
          }).then(() => {
            // on close
          });
        } else if (status === '1') {
          flag = true
          Dialog.alert({
            message: '检测到正在录屏，请注意个人信息安全。',
            confirmButtonText: '知道了'
          }).then(() => {
            // on close
          });
        }

      },
      error: function (res) {
        flag = true
        console.log(res, '获取截屏录屏信息失败')
      }
    })
  } else {
    flag = true
  }
}

const getQueryParams = (url) => {
  const query = url.split('?')[1];
  if (query) {
    const vars = query.split("&");
    const params = {};
    for (let i = 0; i < vars.length; i++) {
      const pair = vars[i].split("=");
      params[pair[0]] = decodeURIComponent(pair[1]);
    }
    return params;
  } else {
    return {};
  }
}

/**
 * 判断当前页面是否是回退过来的
 * @returns
 */
const isBack = () => {
  if (window.PerformanceNavigationTiming) {
    // 获取导航相关的性能数据
    var perfEntries = performance.getEntriesByType("navigation");
    if (perfEntries.length > 0) {
      var navigationEntry = perfEntries[0];
      // 判断是否是通过回退按钮返回的
      return navigationEntry.type === "back_forward"
    }
  } else {
    return window.performance.navigation.type === 2
  }
}
/**
 * 根据经纬度计算距离
 * @param {*} lat1
 * @param {*} lon1
 * @param {*} lat2
 * @param {*} lon2
 * @returns
 */
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // 地球半径（单位：km）

  // 将经纬度转换为弧度
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  // 应用 Haversine 公式计算距离
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance.toFixed(2); // 返回距离保留两位小数
}

/**
 * 页面入口枚举转化
 */
const handlePageEntranceTrans = (entranceItem, fieldName) => {
  // console.log("页面入口枚举转化传参==>" + entranceItem + "+" + fieldName);
  let configList = sessionStorage.configListSes ? JSON.parse(sessionStorage.configListSes) : [];
  var array = configList.UNIFY_ENTRY_PAGE_LIST;
  // var array = [
  //   { pageCode: '1', pageName: '普通版首页' ,includedPage: "1,2"},
  //   { pageCode: '2', pageName: 'PLUS版首页' ,includedPage: "1,2" },
  //   { pageCode: '3', pageName: '全球通首页' ,includedPage: "1,2" },
  //   { pageCode: '4', pageName: '动感地带首页',includedPage: "1,2"},
  //   { pageCode: '5', pageName: '分类页' ,includedPage: "1,2"},
  //   { pageCode: '6', pageName: '权益页',includedPage: "2" },
  //   { pageCode: '7', pageName: '探索页',includedPage: "1,2" },
  //   { pageCode: '8', pageName: '商城页' ,includedPage: "2"},
  // ];

  return array.find(item => item.pageCode === entranceItem)?.[fieldName]

  // for (const key in array) {
  //   if (array.hasOwnProperty(key) && array[key].pageCode === entranceItem) {
  //     return array[key][fieldName];
  //   }
  // }
}

/**
 * sdk方法 权限是否可用
 */
const handleCheckSdkPermission = () => {
  return new Promise((resolve, reject) => {
    try {
      if (isApp()) {

        if (isIOS) {
          console.log('调用result-permissionIsEnable-ios');
          let posIos = '';
          if (localStorage.locationStateIos) {
            posIos = localStorage.locationStateIos
          }
          console.log('调用result-permissionIsEnable-ios=' + posIos);
          // if(posIos != '0'){
          let hasEnd = false
          cmcc.permissionIsEnable({
            debug: true,
            permissionName: 'location',
            // 成功回调  resCode:成功编号, message:消息内容
            success: function (res) {
              hasEnd = true
              var resCode = res.resCode; //0：已授权
              var message = res.message;
              localStorage.setItem('locationStateIos', res.resCode);
              localStorage.setItem('locationStateIosString', JSON.stringify(res));
              // if(resCode == 0){
              // }
              resolve(res.resCode);
            },
            // 失败回调  error:错误编号, errorMsg:错误内容
            error: function (res) {
              hasEnd = true
              var error = res.errCode;//  -5：未授权  -3: 参数非法
              var errorMsg = res.errorMsg;
              localStorage.setItem('locationStateIos', res.errCode);
              localStorage.setItem('locationStateIosString', JSON.stringify(res));
              resolve(res.errCode);
            }
          })
          setTimeout(function () {
            if (!hasEnd) {
              console.warn('permissionIsEnable 超时')
              resolve([])
            }
          }, 1000)
          // }else if(posIos == '0'){
          //   resolve('0');
          // }
        } else {
          let posAndroid = '';
          if (localStorage.locationStateAndroid) {
            posAndroid = localStorage.locationStateAndroid
          }
          console.log('调用result-permissionIsEnable-android');
          // if(posAndroid != '0'){
          cmcc.permissionIsEnable({
            debug: false,
            permission: 'android.permission.ACCESS_FINE_LOCATION',
            // 成功回调  resCode:成功编号, message:消息内容
            success: function (res) {
              var resCode = res.resCode; //0：已授权
              var message = res.message;
              // if(resCode == 0){
              localStorage.setItem('locationStateAndroid', res.resCode);
              localStorage.setItem('locationStateAndroidString', JSON.stringify(res));
              // }
              resolve(res.resCode);
            },
            // 失败回调  error:错误编号, errorMsg:错误内容
            error: function (res) {
              var error = res.errCode;//  -5：未授权  -3: 参数非法
              var errorMsg = res.errorMsg;
              localStorage.setItem('locationStateAndroid', res.errCode);
              localStorage.setItem('locationStateAndroidString', JSON.stringify(res));
              resolve(res.errCode);
            }
          })
          // }else if(posAndroid == '0'){
          //   resolve('0');
          // }

        }
      } else {
        resolve('0');
      }
    } catch (err) {
      console.warn('permissionIsEnable error')
      console.error(err)
      resolve()
    }
  })
}

/**
 * 生成去重字段
 * @param {string[]} tempList 模板
 * @returns
 */
const getDeduplicationKey = (tempList) => {
  const KEY_LIST_DEFAULT = ['title', 'subTitle']
  const KEY_LIST = ['title', 'subTitle', 'actor', 'author', 'merchantName']
  if (!tempList) return KEY_LIST_DEFAULT
  return KEY_LIST.filter(key => tempList.includes(key))
}



/**
 *
 * @param {any[]} arr 要去重的数组
 * @param {string[]} tempList 模板
 * @param {boolean} isDistinct 去重开关
 * @returns
 */
const getMap = function (arrTrim, tempList, isDistinct) {
  let arr = arrTrim
  if (Array.isArray(arrTrim)) {
    arr = arr.map(item => {
      if (item.title && typeof item.title === 'string') {
        item.title = item.title.trim()
      }
      if (item.subTitle && typeof item.subTitle === 'string') {
        item.subTitle = item.subTitle.trim()
      }
      return item
    })
  }
  let keys = getDeduplicationKey(tempList)
  if (isDistinct) return arr
  const map = new Map();
  const result = [];
  arr.forEach(item => {
    const i = keys.map(key => item[key]).join('_');
    if (!map.has(i)) {
      map.set(i, item);
      result.push(item);
    } else {
      const preObj = map.get(i)
      let preUpdateTime = new Date(preObj.originalUpdateTime)
      let curUpdateTime = new Date(item.originalUpdateTime)
      // 有重复的取最新时间的
      if (preUpdateTime < curUpdateTime) {
        map.set(i, item);
        result.forEach((val, ind) => {
          if (val._id === preObj._id) {
            result[ind] = item
          }
        })
      }
    }
  });
  return result;
}

const getMap1 = function (arr, key, isDistinct) {
  if (isDistinct) return arr
  let map = new Map();
  for (let item of arr) {
    let value = item[key].replace(' ', '')
    if (!map.has(value)) {
      map.set(value, item);
    };
  };
  return [...map.values()]
}

/**
 *
 * @param {String} tempId 模板ID
 */
const generateTempIconClass = function (tempId) {
  let img = '', def = ''
  switch (tempId) {
    // 商品-会员权益
    case CONSTANTS.TEMPLATEPAGE.PRODMB0050:
    case CONSTANTS.TEMPLATEPAGE.PRODMB0051:
    case CONSTANTS.TEMPLATEPAGE.PRODMB0052:
    case CONSTANTS.TEMPLATEPAGE.PRODMB005:
    // 业务
    case CONSTANTS.TEMPLATEPAGE.BIZ003:
      img = 'img-2'
      def = 'default-2'
      break
    // 活动
    case CONSTANTS.TEMPLATEPAGE.ACTI002:
      img = 'img-4'
      def = 'default-4'
      break
    // 商品-话费购
    case CONSTANTS.TEMPLATEPAGE.PRODMS012:
    // 生活-视频
    case CONSTANTS.TEMPLATEPAGE.LIFEVD010:
    // 商品-手机硬件
    case CONSTANTS.TEMPLATEPAGE.PRODHW004:
    // 江苏权益-周边好生活
    case CONSTANTS.TEMPLATEPAGE.PRODMB0053:
      img = 'img-1'
      def = 'default-1'
      break
    // 商品-无忧行
    case CONSTANTS.TEMPLATEPAGE.PRODNR011:
    // 商品-扶贫商城
    case CONSTANTS.TEMPLATEPAGE.PRODHP007:
    // 生活-音乐
    case CONSTANTS.TEMPLATEPAGE.LIFEMU009:
    // 生活-游戏
    case CONSTANTS.TEMPLATEPAGE.LIFEGM011:
    // 商品-积分兑换
    case CONSTANTS.TEMPLATEPAGE.PRODPT006:
      img = 'img-3'
      def = 'default-3'
      break
    // 生活-阅读
    case CONSTANTS.TEMPLATEPAGE.LIFERD008:
      img = 'img-5'
      def = 'default-5'
      break
    // 生活-直播
    case CONSTANTS.TEMPLATEPAGE.LIFELB012:
      img = 'img-6'
      def = 'default-6'
      break
    // 政企-案例
    case CONSTANTS.TEMPLATEPAGE.SLSRC308:
      img = 'img-11'
      def = 'default-11'
      break
    // 政企-新闻
    case CONSTANTS.TEMPLATEPAGE.SLSRC309:
      img = 'img-12'
      def = 'default-12'
      break
    // 政企-视频
    case CONSTANTS.TEMPLATEPAGE.SLSRC310:
      img = 'img-13'
      def = 'default-13'
      break
    default:
      img = 'img-2'
      def = 'default-2'
  }
  return { img, def }
}

/**
 * 联想词插码上报
 * @param {*} obj 联想词对象
 * @param {*} eventType 事件类型
 * @param {*} index 联想词位置
 * @param {*} nextUrl 下一跳链接
 * @param {*} type 曝光类型
 * @param {*} areaId 区域ID
 */
const associationEscalation = function (obj, eventType, index, nextUrl, type, areaId) {
  const option = {
    XY_transaction_id: obj.searchUUID,
    WT_et: eventType,
    area_id: areaId,
    type: type,
    WT_event: "P00000082783",
    WT_envName: obj.titleSuggest,
    WT_plat: sessionStorage.pagePlat || '',
    WT_es: sessionStorage.pageUrl || '', // 页面路径
    WT_ti: '搜索输入页', // 页面名称
    XY_pageEntry: sessionStorage.pageEntrance || '', // 页面入口
    WT_next_url: nextUrl,
    XY_point_position: index + 1, // 搜索联想词位置
    XY_asword_type: obj.contactType, // 联想词类型
    XY_asword_id: obj.dataNo, // 联想词ID
  }
  console.log('搜索联想词插码上报', JSON.stringify(option))
  if (isApp()) {
    gdp("track", eventType, option);
  }
}

const encodeTemp = () => {
  const tempList = [
    40, 72, 36, 44,
    33, 40, 70, 66,
    70, 37, 64, 45,
    43, 35, 73, 69
  ];
  const numTemp = '1717385563099275';
  let list = [];
  for (let i = 0; i < tempList.length; i++) {
    let num = Number(tempList[i]) - Number(numTemp[i]);
    list.push(String.fromCharCode(parseInt(num, 16)));
  }
  return list.join('');
}

// ai搜索大模型接入
const appAiSwitchIn = () => {
  console.log('开始请求搜索ai大模型接入路径地址==>')
  console.log("当前环境==>")
  console.log(process.env.NODE_ENV)

  let joinUrl = ''
  const nowTime = Date.now()
  if (process.env.NODE_ENV === 'development') {
    joinUrl = "./zxkf_AI_sdk.js"
  } else if (process.env.NODE_ENV === 'gray') {
    joinUrl = `https://wx.10086.cn/zxkfService/assets/zxkf_jssdk/zxkf_AI_sdk.js?v=${nowTime}&grayscale=grayscale`
  } else if (process.env.NODE_ENV === 'production') {
    joinUrl = "https://app.online-cmcc.cn/zxkfService/assets/zxkf_jssdk/zxkf_AI_sdk.js?v=20250619"
  }

  return new Promise((resolve, reject) => {
    // 接入sdk地址先写死
    var s = document.createElement('script');
    s.async = true;
    s.src = joinUrl
    s.onload = function () {
      console.log('ai大模型接入完成===>')
      console.log('ai大模型挂载到window上==>')
      console.log(window.zxkf_AI_sdk)
      resolve();
    };
    var t = document.getElementsByTagName('script')[0]
    t.parentNode.insertBefore(s, t)
    // 接入sdk地址先写死
  });
}

// 版本判断
const compareVersion = (version1, version2) => {
  console.log('用户版本===>')
  console.log(version1)
  console.log('最低适配版本===>')
  console.log(version2)
  const v1 = version1.split('.').map(Number);
  const v2 = version2.split('.').map(Number);
  const len = Math.max(v1.length, v2.length);
  for (let i = 0; i < len; i++) {
    const num1 = v1[i] || 0;
    const num2 = v2[i] || 0;
    if (num1 > num2) {
      return 1;
    } else if (num1 < num2) {
      return -1;
    }
  }
  return 0;
}

// 判断是否是原生化跳转
const isProtogenesisSkip = (itemObj) => {
  let returnFlag = false
  const userInfo = localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null;
  const version = userInfo?.version ? userInfo?.version.split("_")[1] : "";
  if (itemObj.linkAdress1) {
    if (itemObj.jumpType1 === '3') {
      if (isIOS) {
        if (compareVersion(version, itemObj.iosVersion1) !== -1) {
          console.log('原生化跳转ios校验通过===>')
          returnFlag = true
        }
      } else if (isHarmony()) {
        // if (compareVersion(version, itemObj.harmonyVersion1) !== -1) {
        //   console.log('原生化跳转鸿蒙校验通过===>')
        //   returnFlag = true
        // }
        // 鸿蒙不做原生化链接跳转
        returnFlag = false
      } else {
        if (compareVersion(version, itemObj.androidVersion1) !== -1) {
          console.log('原生化跳转安卓校验通过===>')
          returnFlag = true
        }
      }
    }
  }
  return returnFlag
}

// 获取默认页缓存数据信息
const getDefaultPageLocalInfo = (keyFlag) => {
  let localDataObj = null
  const userInfo = localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null;
  // 首选登录省份-次选上次登录省份--无省份信息
  const loginProvince =
    userInfo?.loginProvince ||
    (userInfo?.province ? userInfo?.province : ""); // 省份参数兜底优化
  const pageEntrance = sessionStorage.getItem("pageEntrance");
  const getKey =
    keyFlag + "_" + loginProvince + "_" + pageEntrance; // 本地存储的key值
  localDataObj = JSON.parse(localStorage.getItem(getKey));
  return localDataObj
}

// SkyNet
const sendSkyNet = (errStr) => {
  try {
    if (window.__SKYNET && window.__SKYNET.send) {
        window.__SKYNET.send(errStr)
    }
  } catch (error) {
    console.log(error)
  }
}

/**
 * 链接规范化函数：将不同形式的 URL 转换为统一的规范格式，用于链接去重
 * 
 * @param {string} link - 待规范化的链接
 * @returns {string|null} 规范化后的链接，无效输入返回 null
 */
const normalizeLink = (link) => {
    if (!link) return null;
    try {
      let u;
      try {
        u = new URL(link);
      } catch (err) {
        try {
          u = new URL(link, window.location.origin);
        } catch (err2) {
          return link.split('#')[0];
        }
      }

      // 兼容 hash 路由链接：例如 https://a.com/path?x=1#/route?y=2
      // hash 中也可能携带查询参数，需要与 search 中的参数合并
      let routePath = u.pathname || '';
      let searchStr = u.search || '';
      const hash = u.hash || '';
      if (hash && hash.startsWith('#/')) {
        const hashBody = hash.slice(1);
        const qIndex = hashBody.indexOf('?');
        if (qIndex >= 0) {
          routePath = hashBody.slice(0, qIndex) || routePath;
          const hashQuery = hashBody.slice(qIndex + 1);
          searchStr = searchStr ? searchStr + '&' + hashQuery : '?' + hashQuery;
        } else {
          routePath = hashBody || routePath;
        }
      }

      // 移除跟踪参数，这些参数不影响链接的实际内容
      const params = new URLSearchParams((searchStr || '').replace(/^\?/, ''));
      const REMOVE_KEYS = ['channelId', 'yx', 'sellerId', 'secondChannel', 'forwardapp', 'WT.ac', 'xparam'];
      REMOVE_KEYS.forEach(k => {
        if (params.has(k)) params.delete(k);
      });

      // 参数按字母顺序排序，保证相同参数不同顺序能匹配
      const entries = Array.from(params.entries()).sort((a, b) => a[0].localeCompare(b[0]));
      const search = entries.map(([k, v]) => `${k}=${v}`).join('&');
      
      // 返回规范化后的链接（不包含 hash 部分，因为 hash 参数已合并到 search 中）
      return (u.origin || '') + routePath + (search ? ('?' + search) : '');
    } catch (e) {
      return link.split('#')[0];
    }
};

/**
 * 合并搜索结果数据和专区数据，按链接+省份维度去重，保留先出现的
 * @param {Array} searchResults 搜索结果数据数组 (yList/xList)
 * @param {boolean} isProvinceDistinct 是否在去重key中加入省份信息（true: 链接+省份去重，false: 仅链接去重）
 * @returns {Array} 合并去重后的数据
 */
const mergeSearchAndZoneData = (searchResults = [], isProvinceDistinct = false) => {
  // 如果未开启去重，直接返回原搜索结果
  if (!isProvinceDistinct) {
    console.log('去重开关未开启，直接返回原数据');
    return searchResults;
  }
  
  console.log('=== mergeSearchAndZoneData 开始执行 ===');
  console.log('isProvinceDistinct:', isProvinceDistinct);
  console.log('searchResults 数量:', searchResults.length);

  /**
   * 构造去重key：链接 + province（当启用省份维度去重时）
   * 对于原生编码（非HTTP链接），直接返回编码值作为去重key
   */
  const buildDeduplicationKey = (link, item) => {
    // 判断是否为原生编码（非HTTP/HTTPS链接）
    const isNativeCode = link && !link.match(/^https?:\/\//i);
    
    // 对于原生编码，将编码值作为key参与去重
    if (isNativeCode) {
      let key = link.trim();
      if (isProvinceDistinct) {
        const province = item.provinceCode || item.province || item.dispProvince || '';
        key = province ? `${key}::${province}` : key;
      }
      return key;
    }
    
    // HTTP链接进行规范化处理
    let key = normalizeLink(link) || JSON.stringify(item);
    if (isProvinceDistinct) {
      const province = item.provinceCode || item.province || item.dispProvince || '';
      key = province ? `${key}::${province}` : key;
    }
    return key;
  };
  
  // 获取专区数据的所有链接集合
  const zoneLinksSet = new Set();
  let zoneList = [];
  try {
    const zoneDataStr = sessionStorage.getItem("searchZoneResultListSes");
    if (zoneDataStr) {
      zoneList = JSON.parse(zoneDataStr);
      if (!Array.isArray(zoneList)) {
        console.warn("searchZoneResultListSes is not an array, resetting to empty");
        zoneList = [];
      }
    }
  } catch (error) {
    console.error("Failed to parse searchZoneResultListSes:", error);
    zoneList = [];
  }
  
  try {
    zoneList.forEach((zone) => {
      try {
        if (zone && zone.searchZoneDataPre && Array.isArray(zone.searchZoneDataPre)) {
          zone.searchZoneDataPre.forEach((item) => {
            try {
              const link = item.linkAdress || item.linkAddress || item.link || '';
              const key = buildDeduplicationKey(link, item);
              if (key) {
                zoneLinksSet.add(key);
              }
            } catch (itemError) {
              console.error("Error processing zone item:", itemError);
            }
          });
        }
        if (zone && zone.subList && Array.isArray(zone.subList)) {
          zone.subList.forEach((subZone) => {
            try {
              if (subZone && subZone.searchZoneDataPre && Array.isArray(subZone.searchZoneDataPre)) {
                subZone.searchZoneDataPre.forEach((item) => {
                  try {
                    const link = item.linkAdress || item.linkAddress || item.link || '';
                    const key = buildDeduplicationKey(link, item);
                    if (key) {
                      zoneLinksSet.add(key);
                    }
                  } catch (itemError) {
                    console.error("Error processing subzone item:", itemError);
                  }
                });
              }
            } catch (subZoneError) {
              console.error("Error processing subzone:", subZoneError);
            }
          });
        }
      } catch (zoneError) {
        console.error("Error processing zone:", zoneError);
      }
    });
  } catch (zoneListError) {
    console.error("Error processing zone list:", zoneListError);
  }
  
  /**
   * 统一的去重逻辑：无论是否有专区数据，都对所有linkAdress进行全局去重
   * 去重规则：
   * 1. 过滤掉在专区数据中出现过的链接
   * 2. 一级分类与二级分类共用同一去重集合，跨所有分类全局去重
   */
  const globalSeen = new Set(); // 用于所有分类（含子分类）的全局去重
  const deduped = [];
  
  // 异常处理包装
  if (!Array.isArray(searchResults)) {
    console.warn("searchResults is not an array, returning empty array");
    return deduped;
  }
  
  searchResults.forEach((result) => {
    try {
      const dedupedResult = {
        ...result,
        data: [],
        subList: []
      };
      
      console.log(`处理一级分类: ${result.categoryName}, 数据量: ${result.data ? result.data.length : 0}`);
      
      // 处理主数据列表（根据是否有子分类决定去重策略）
      if (result && result.data && Array.isArray(result.data)) {
        dedupedResult.data = result.data.filter((item) => {
          try {
            const link = item.linkAdress || item.linkAddress || item.link || '';
            const key = buildDeduplicationKey(link, item);
            
            console.log(`处理item: ${item.title || item._id}, 原始链接: ${link}`);
            console.log(`规范化后key: ${key}`);
            
            // 无效的key直接过滤
            if (!key) {
              console.log(`  -> 过滤: key为空`);
              return false;
            }
            
            // 1. 如果该链接在专区中出现过，过滤掉它
            if (zoneLinksSet.has(key)) {
              console.log(`  -> 过滤: 在专区数据中出现过`, zoneLinksSet);
              return false;
            }
            
            // 2. 如果该链接已经在全局去重集合中出现过，过滤掉它
            if (globalSeen.has(key)) {
              console.log('  -> 过滤: 在全局分类中重复');
              return false;
            }
            
            // 3. 新链接，加入全局去重集合并保留
            globalSeen.add(key);
            console.log(`  -> 保留: 新链接`);
            return true;
          } catch (itemError) {
            console.error("Error processing data item:", itemError);
            return true; // 异常时保留项，避免丢失数据
          }
        });
      }
      
      console.log(`一级分类 ${result.categoryName} 去重后主数据量: ${dedupedResult.data.length}`);
    
      // 处理子分类数据列表（与一级分类共用全局去重）
      if (result && result.subList && Array.isArray(result.subList)) {
        dedupedResult.subList = result.subList
          .map((sub) => {
            try {
              const dedupedSub = {
                ...sub,
                data: []
              };
              
              console.log(`开始处理二级分类: ${sub.categoryName}, 数据量: ${sub.data ? sub.data.length : 0}`);
              
              if (sub && sub.data && Array.isArray(sub.data)) {
                dedupedSub.data = sub.data.filter((item) => {
                  try {
                    const link = item.linkAdress || item.linkAddress || item.link || '';
                    const key = buildDeduplicationKey(link, item);
                    
                    console.log(`处理item: ${item.title || item._id}, 原始链接: ${link}`);
                    console.log(`规范化后key: ${key}`);
                    
                    // 无效的key直接过滤
                    if (!key) {
                      console.log(`  -> 过滤: key为空`);
                      return false;
                    }
                    
                    // 1. 如果该链接在专区中出现过，过滤掉它
                    if (zoneLinksSet.has(key)) {
                      console.log(`  -> 过滤: 在专区数据中出现过`);
                      return false;
                    }
                    
                    // 2. 如果该链接在全局去重集合中已经出现过，过滤掉它
                    if (globalSeen.has(key)) {
                      console.log('  -> 过滤: 在全局分类中重复');
                      return false;
                    }
                    
                    // 3. 新链接，加入全局去重集合并保留
                    globalSeen.add(key);
                    console.log(`  -> 保留: 新链接`);
                    return true;
                  } catch (itemError) {
                    console.error("Error processing sublist item:", itemError);
                    return true; // 异常时保留项，避免丢失数据
                  }
                });
              }
              
              console.log(`二级分类 ${sub.categoryName} 去重后数据量: ${dedupedSub.data.length}`);
              
              return dedupedSub;
            } catch (subError) {
              console.error("Error processing sublist:", subError);
              return sub; // 异常时保留原始subList
            }
          })
          .filter(sub => sub && sub.data && sub.data.length > 0);
      }
      
      // 只有当data或subList不为空时才添加到结果中
      if ((dedupedResult.data && dedupedResult.data.length > 0) || 
          (dedupedResult.subList && dedupedResult.subList.length > 0)) {
        deduped.push(dedupedResult);
      }
    } catch (resultError) {
      console.error("Error processing search result:", resultError);
      // 异常分类直接添加，避免整个分类丢失
      deduped.push(result);
    }
  });
  console.log('=== mergeSearchAndZoneData 执行结束 ===', deduped);
  return deduped;
};

export {
  isIOS,
  isHarmony,
  trim,
  getUUID,
  getHistoryData,
  updateHistoryData,
  deleteHistoryData,
  getShowStatus,
  updateShowStatus,
  getQueryString,
  handleSaveClickInfo,
  handleGetUrlParam,
  Debounce,
  handleChar,
  goPage,
  getConWidth,
  isApp,
  getUserInfo,
  getLocation,
  handleQueryGetConfig,
  intersectionObserver,
  handleGdpImp,
  updateSessionStorage,
  handleQuerySearchZone,
  goPageUrl,
  getQueryParams,
  isBack,
  getQueryStringNew,
  calculateDistance,
  handlePageEntranceTrans,
  handleCheckSdkPermission,
  getKeywordsFromSession,
  saveKeywordsToSession,
  checkoutKeywordsToSession,
  getMap,
  getMap1,
  generateTempIconClass,
  associationEscalation,
  encodeTemp,
  locationRefuseTimeCompare,
  timestampToTime,
  refuseTimeSave,
  getRefuseTime,
  isPermission,
  getRecordingOrScreenshotStatus,
  handleSlotZone,
  handleCardslotZone,
  handleZoneData,
  handleScreenData,
  appAiSwitchIn,
  isProtogenesisSkip,
  goProtogenesisPage,
  getDefaultPageLocalInfo,
  sendSkyNet,
  normalizeLink,
  mergeSearchAndZoneData
};
