const hiddenNavigationBar = () => {
  return new Promise((resolve) => {
    cmcc.hiddenNavigationBar({
      debug: false,
      isHiddenNavigationBar: true,//bool类型，true为隐藏，false是显示
      success: function (res) {//res为空
        resolve()
      },
      error: function (res) {
        resolve()
      }
    });
  })
}

/**
 * 从客户端获取用户信息
 */
const getUserInfoFromAPP = () => {
  console.log('进入getUserInfoFromAPP方法...')
  return new Promise((resolve, reject) => {
    try {
      let hasEnd = false
      cmcc.getUserInfo({
        debug: false,
        success(res) {
          hasEnd = true
          console.log(res, 'success')
          let result = {
            xk: res.xk,
            st: res.st,
            version: res.version,
            province: res.province,
            city: res.city,
            phoneNumber: res.phoneNumber,
            loginProvince: res.loginProvince,
            loginCity: res.loginCity,
          }
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
          console.warn('getUserInfoFromAPP 超时')
          resolve([])
        }
      }, 1000)
    } catch (err) {
      console.warn('getUserInfoFromAPP error')
      console.error(err)
      resolve()
    }
  });

};

/**
 * 打开新页面
 */
const openNewWebview = (url) => {
  cmcc.newWebview({
    debug: false,
    markID: '', //字符串类型，活动 ID （活动id，4.0之后允许不传，4.0之前必填）
    type: '', //字符串类型（分享类型，内部保留字段，允许不传）  4.0 新增
    funCode: '', //字符串类型（分享业务编码，内部保留字段，允许不传）  4.0 新增 详见“统一门户客户端V4.0_接口设计说明书”
    bizCode: '', //功能编码，详见“客户端功能编码”(内部使用) V4.1 新增
    url, //字符串类型，需要打开的 url，（1、URL中不能有空格；2、参数中如果有汉字，需要对汉字进行encodeURI()编码,最终的结果页面必须对这个参数decodeURI()解码，http://www.w3school.com.cn/jsref/jsref_encodeuri.asp）
    isHiddenNavigationBar: false,//非必填项, 隐藏原生导航 bool类型，true为隐藏，false是显示  5.5 新增
    success: function (res) { },
    error: function (res) { }
  })
}

/**
 * 关闭当前webview
 */
const closeCurrentWebView = () => {
  cmcc.closeCurrentWebView({
    debug: false,
    success(res) {
      console.log('关闭成功');
    },
    error(res) {
      console.log('关闭失败');
    },
  });
};

/**
 * 清楚缓存
 */
const cleanCache = () => {
  cmcc.cleanCache({
    debug: false,
    success(res) { },
    error(res) { },
  });
};

/**
 * 打开小程序
 */
const openMinProgram = () => {
  return new Promise((resolve, reject) => {
    cmcc.openMiniProgram({
      debug: false,
      wx: {
        // 微信小程序
        userName: 'gh_77a83b24xxx', // 小程序的username
        path: '/pages/index/index', // 打开小程序指定页面路径
        miniProgramType: '0', // 0 正式版 1 开发板 2体验版
      },
      success(res) { },
      error(res) { },
    });
  });

};

/**
 * 跳转原生页面
 */
const goNativePage = (code) => {
  console.log(code, 'code')
  cmcc.goNativePage({
    debug: false,
    bizCode: code, // 功能编码，详见“客户端功能编码”
    placeholder: '', // 只搜索页面使用，用于将默认搜索词传给搜索SDK -6.0 新增

    // 新增支持倒计时浮标功能(非必填项，需要浮窗功能就填写对应参数)-6.4 新增
    // -7.1 新增 注意！！！新版插件iOS在倒计时完成会主动回调页面 cmcc.countFinished() 方法通知页面计时完成，调用方需要实现该方法以便及时去获取状态信息
    // floatWindow: {
    //   type: '1', // 0: 表示旧版，无进度条  1:表示新版，有进度条 -7.1 新增
    //   showText: '签到冲榜', // 非必填，新版进度条模式中，该字段不为空时显示该字段，该字段为空显示计时秒数 -7.1 新增
    //   code: 'xxxxxxx', // 任务编号
    //   currentUrl: 'htttp://xxxx.html', // 当前页面地址
    //   destinationPath: 'BF00901', // 用户点击浮窗跳转的目标地址,原生功能编码,详见“客户端功能编码”
    //   imgUrl: 'htttp://xxxx.png', // 展示图片地址, 图片宽高比11:4，建议尺寸 220px : 80px
    //   countDown: '10', // 倒计时秒数，大于0整数
    //   finishText: '立即抽奖', // 插件文案
    // },
    success(res) {
      // res为空
    },
    error(res) { },
  });
};

/**
 * H5存储数据到原生
 */
const saveDataToNative = () => {
  try {
    cmcc.saveDataToNative({
      debug: false,
      key: '', // 存储数据的 key, 不能为空, String 类型。必传
      value: '', // 需要存储的数据, String 类型。必传
      success(res) { },
      error(res) { },
    });
  } catch (err) {
    console.error('cmcc.saveDataToNative')
  }
};

/**
 * H5从原生获取存储的数据
 */
const getDataFromNative = () => {
  try {
    cmcc.getDataFromNative({
      debug: false,
      key: '', // 存储数据时的 key, 不能为空, String 类型。必传
      success(res) {
        const { value } = res; // 存储的 key 对应的数据。String 类型。获取不到返回空字符串。
      },
      error(res) { },
    });
  } catch (err) {
    console.error('getDataFromNative error')
  }
};

const getCatchInfo = () => {
  return new Promise((resolve, reject) => {
    try {
      let hasEnd = false
      cmcc.getCatchInfo({
        debug: false,
        //isShowLocationAlert: false,//用户禁止定位权限时，是否显示定位权限申请弹框，bool类型，默认不显示。-V5.8新增
        timeoutInterval: '5', //不填写的话默认2秒，超过时间自动触发回调
        success: function (res) {
          hasEnd = true
          resolve({
            coords: {
              latitude: res?.latitude,
              longtitude: res?.longtitude,
              locProvince: res.locProvince, //定位省份名称
              locCity: res.locCity //定位城市名称
            }
          })
        },
        error: function (res) {
          hasEnd = true
          reject(null)
        }
      })
      setTimeout(function () {
        if (!hasEnd) {
          console.warn('getCatchInfo定位 超时')
          resolve([])
        }
      }, 5000)
    } catch (err) {
      console.warn('getCatchInfo定位 error')
      console.error(err)
      resolve()
    }
  })
}

// 获取定位信息（高德定位）(9.8.5新增)
const getNewLocation = () => {
  return new Promise((resolve, reject) => {
    try {
      cmcc.getLocation({
        debug: false,
        timeoutInterval: 15,//定位超时时间，超过该时间则视为定位失败，默认为2秒
        success: function (res) {
          resolve(res)
        },
        error: function (res) {
          // -7无定位权限  -8有权限-定位失败
          console.log('getLocation定位失败===>')
          console.log(res)
          reject(res)
        }
      })
    } catch (err) {
      console.warn('getLocation定位调用 error')
      console.error(err)
      reject(err)
    }
  })
}

const navigationColorSetting = () => {
  console.log('navigationColorSetting~');
  cmcc.navigationColorSetting({
    debug: false,
    bkColor: '#333333',              //标题栏背景颜色
    txtColor: '#333333',              //标题栏文字颜色
    iconType: '1',                  //1为蓝色图标,2为白色图标
    endBkColor: '#333333',
    endTxtColor: '#333333',
    endIconType: '2',
    pageType: '1',                  //页面类型，0普通页面，1沉浸式页面。V8.6 新增
    offset: '1',

    success: function (res) {
      console.log(res, 'navigationColorSetting~success');
    },
    error: function (res) {
      console.log(res, 'navigationColorSetting~error');
    }
  });
}

// 获取客户端的登录token_id
const getAppLoginTokenId = () => {
  return new Promise((resolve, reject) => {
    try {
      let hasEnd = false
      cmcc.getConcatenationInfo({
        debug: false,
        success: function (res) {
          hasEnd = true
          console.log('获取tokenId信息===>')
          console.log(res)
          localStorage.setItem("appTokenId", res.token);
          resolve(res)
          // 安卓-鸿蒙未登录 获取token仍在success回调 返回token值为空
        },
        error(err) {
          hasEnd = true
          console.log(err, '获取客户端的登录token_id失败');
          // reject(null);
          // ios未登录时会进入异常回调
          const iosNoLoginTokenObj = {
            ichannelld: "",
            token: "",
            yx: ""
          }
          localStorage.setItem("appTokenId", iosNoLoginTokenObj.token);
          resolve(iosNoLoginTokenObj)
        },
      })
      setTimeout(function () {
        if (!hasEnd) {
          console.warn('获取客户端的登录token_id 超时')
          resolve([])
        }
      }, 1000)
    } catch (err) {
      console.warn('调用获取客户端的登录token_id失败===>')
      console.error(err)
      resolve()
    }
  })
}

// 用户标签风控分析-6.3新增
const getUserLoginAnalyse = () => {
  return new Promise((resolve, reject) => {
    try {
      cmcc.userLoginAnalyse({
        debug: false,
        success: function (res) {
          resolve(res)
        },
        error: function (err) {
          console.log('userLoginAnalyse调用失败===>', err)
          reject(err)
        }
      })
    } catch (err) {
      console.log('userLoginAnalyse调用 error', err)
      reject(err)
    }
  })
}

export {
  hiddenNavigationBar,
  getUserInfoFromAPP,
  closeCurrentWebView,
  cleanCache,
  openMinProgram,
  saveDataToNative,
  getDataFromNative,
  goNativePage,
  getCatchInfo,
  getNewLocation,
  openNewWebview,
  navigationColorSetting,
  getAppLoginTokenId,
  getUserLoginAnalyse
};
