<template>
  <div id="app">
    <!-- 骨架屏 -->
    <!-- <div class="default-con" v-show="isShowSkeleton">
      <default-skeleton ></default-skeleton>
    </div> -->
    <router-view v-if="isShowChild" />
    <!-- <keep-alive>
      <router-view v-if="isShowChild" />
    </keep-alive> -->
  </div>
</template>

<script>
import {
  getUserInfo,
  handleQueryGetConfig,
  isApp,
  getShowStatus,
  getQueryString,
  getHistoryData,
  handlePageEntranceTrans,
  getQueryStringNew,
  isIOS,
  handleCheckSdkPermission,
  encodeTemp,
  appAiSwitchIn,
} from "@/utils/tool";
import {
  hiddenNavigationBar,
  navigationColorSetting,
  getAppLoginTokenId,
  getUserLoginAnalyse
} from "@/utils/native";
import { getGateWayToken } from "@/server/gateway";
import CryptoJS from "crypto-js";
import Vue from 'vue';
import CommonApi from "@/api/index";
// import DefaultSkeleton from './components/default/skeleton.vue'

export default {
  name: "app-page",
  components: {
    // DefaultSkeleton
  },
  provide() {
    return {
      userLoginState: () => this.userLoginState
    };
  },
  data() {
    return {
      // isShowSkeleton: true,
      isShowChild: false,
      configParams: {
        paramTypes: [
          "UNIFY_SEARCH_NETWORK_STD",
          "UNIFY_SEARCH_BUY_WAY",
          "UNIFY_SEARCH_BUYWAY_URL",
          "UNIFY_SEARCH_CORNERMARK_URL",
          "UNIFY_SHIP_CITY_CODE",
          // "UNIFY_GUANGDONG_CITY_CODE", // 广东省地市查询
          "UNIFY_ENTRY_PAGE_LIST", // 页面入口
          "UNIFY_ENTRY_PAGE_COLUMN",
          "UNIFY_VOICE_SHOW_BUTTON",
        ],
        provCode: "",
        loginProvince: "",
        deviceType: "",
        clientVersion: "",
      },
      pageEntrance: null,
      pageEntranceName: "",
      pageEntranceIncludedPage: "",
      isIOS: isIOS,
      userLoginState: "",
    };
  }, 
  async created() {
    // if (!isApp() && process.env.NODE_ENV === "production") return;
    console.log("打印--跳转页面进入===>");
    console.log("打印--app.vue===>开始");
    console.time("routerIn");
    if (isApp()) {
      console.log("测试获取用户信息");
      console.log("打印--是app加载开始");
      console.time("threeJs");
      const scripts = [
        // "https://res.app.coc.10086.cn/appother/js/public/cmcc.js",
        // "https://testh.app.coc.10086.cn/cmcc-app-gray/appother/js/public/cmcc.js",
        "https://res.app.coc.10086.cn/appother/js/public/cmcc-v1.0.6.js",
        // "./gdp-full.js",
        "https://res.coc.10086.cn/res/res1/chama-h5sdk/gdp-full-es5.js"
      ];
      const loadScripts = scripts.map(this.loadScript);
      Promise.all(loadScripts)
        .then(() => {
          // 所有第三方库加载完成
          // 在这里可以执行需要使用第三方库的代码
          console.log("第三方js库完成");
          console.timeEnd("threeJs");
          console.time("onScriptLoad");
          this.onScriptLoad();
        })
        .catch((error) => {
          // 处理加载错误
          console.error("第三方js加载失败", error);
        });
    } else {
      console.log("打印--不是app加载开始");
      console.time("onScriptLoad");
      this.onScriptLoad();
    }
  },
  methods: {
    loadScript(src) {
      return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = src;
        script.addEventListener("load", resolve);
        script.addEventListener("error", resolve);
        document.head.appendChild(script);
      });
    },

    async onScriptLoad() {
      // console.time("getGateWayToken");
      // 第三方库已加载完成，可以使用了
      // await getGateWayToken();
      // console.timeEnd("getGateWayToken");

      // 清空区域曝光标识存储
      localStorage.setItem("observertimes", "");
      localStorage.setItem("vocieStatus", "");

      if (isApp()) {
        // 隐藏头部导航
        // setTimeout(() => {
        //   console.log("隐藏头部导航1");
        //   this.nextTick(() => {
        //     console.log("隐藏头部导航2");
        hiddenNavigationBar();
        //   });
        // }, 500);

        // 设置导航栏颜色
        // navigationColorSetting();

        // 初始化插码配置
        this.initGdpFull();

        // 获取搜索发现、全网热搜、猜你喜欢显示隐藏状态值
        console.time("getShowStatus");
        await getShowStatus();
        console.timeEnd("getShowStatus");

        // 获取历史搜索数据
        // await getHistoryData(this.pageEntrance);
      } else {
        document.title = "搜索";
      }

      const statusBarStyle = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "black"
        : "black";

      document
        .querySelector('meta[name="apple-mobile-web-app-status-bar-style"]')
        ?.setAttribute("content", statusBarStyle);

      // 禁止用户缩放
      this.forbidScale();
      
      // 获取用户状态
      if (isApp()) {
        this.getUserLoginAnalyseUserState();
      }
      // 获取用户信息
      console.time("getUserInfo");
      // 手动清除上一次的用户信息
      localStorage.removeItem("userInfo");
      await getUserInfo().then((res) => {
        // 插码新方案需要新添加一个app登录tokenId参数-所以此处逻辑挪到成功获取登录tokenId后
        // if (isApp()) {
        //   this.setGeneralProps(res);
        // }
        console.log("获取用户信息成功==>");
        console.log(res);
      });
      console.timeEnd("getUserInfo");

      // 插码方案变更2025-1-16 需要获取app登录的tokenid 添加新的await
      // 手动清除上一次的token信息
      localStorage.removeItem("appTokenId");
      if (isApp()) {
        console.time("getAppLoginTokenId");
        await getAppLoginTokenId().then((res) => {
          console.log("获取app登录的tokenId成功===>");
          console.log(res);
          this.setGeneralProps();
        });
        console.timeEnd("getAppLoginTokenId");
      }

      // 获取静态资源
      // 此方法最终在toolJs里调用了getQueryStringNew方法-->处理默认词加解密-存储newurl信息在会话中
      // 后续组件内部不再从getQueryStringNew中获得pageEntrance等信息
      console.time("getConfig");
      await this.getConfig();
      console.timeEnd("getConfig");

      // 此处的this.pageEntrance未设置值--待确认--方法内页面入口参数已不使用-无需处理
      // 是app调用原生方法获取历史数据 然后存入localstorage
      // 在历史搜索组件直接从本地存储获取历史数据-增删改可逆推
      if (isApp()) {
        // 获取历史搜索数据
        console.time("getHistoryData");
        await getHistoryData(this.pageEntrance);
        console.timeEnd("getHistoryData");
      }

      // 需记录用户唯一标识、栏目标识、搜索词、搜索时间，存储存储周期为 3 个月:
      const storedTimestamp = localStorage.getItem("timeKey");
      if (!storedTimestamp) {
        localStorage.setItem("timeKey", Date.now());
      }
      // 每当访问该 key 时，检查当前时间戳与存储的时间戳之间的差值
      const now = Date.now();
      const diff = now - localStorage.getItem("timeKey");
      // 如果差值大于三个月，则清除该 key
      if (diff > 3 * 30 * 24 * 60 * 60 * 1000) {
        // if (diff > 3* 60 * 1000) {
        console.log("存储周期已到");
        const keys = Object.keys(localStorage);
        // 过滤掉不包含 "_pageColumn_" 的 key
        const keysToRemove = keys.filter((key) => key.includes("_pageColumn_"));
        // 使用 localStorage.removeItem() 方法删除过滤后的 key
        keysToRemove.forEach((key) => {
          localStorage.removeItem(key);
        });
        localStorage.removeItem("timeKey");
        localStorage.setItem("timeKey", Date.now());
      } else {
        console.log("存储周期正常");
      }
      
      // AI模型初始化
      this.initAI()

      this.$nextTick(() => {
        // 此处路由开始显示
        this.isShowChild = true;
        console.timeEnd("onScriptLoad");
        console.log("打印--开始searchmain路由");
        console.timeEnd("routerIn");

        // this.isShowSkeleton = false;
        // 这里存储pageEntrance信息--组件内部调用不再从getQueryStringNew中获得
        // this.pageEntrance = getQueryStringNew().pageEntrance;
        // sessionStorage.setItem("pageEntrance", this.pageEntrance);
        this.pageEntrance = sessionStorage.getItem("pageEntrance");

        // pageEntranceName的会话存储未发现调用--可优化
        this.pageEntranceName = handlePageEntranceTrans(
          this.pageEntrance,
          "pageName"
        );
        // console.log("this.pageEntranceName+" + this.pageEntranceName);
        sessionStorage.setItem("pageEntranceName", this.pageEntranceName);

        this.pageEntranceIncludedPage = handlePageEntranceTrans(
          this.pageEntrance,
          "includedPage"
        );
        sessionStorage.setItem(
          "pageEntranceIncludedPage",
          this.pageEntranceIncludedPage
        );
      });
    },

    /**
     * 静态资源查询--默认图，筛选里的网络制式，购买方式等
     * 使用前端缓存--20241212优化上线
     */
    async getConfig() {
      // 整理查询参数
      const pageEntrance = getQueryStringNew().pageEntrance;
      const userInfo = localStorage.getItem("userInfo")
        ? JSON.parse(localStorage.getItem("userInfo"))
        : null;
      const loginProvince =
        userInfo?.loginProvince ||
        (userInfo?.province ? userInfo?.province : ""); // 省份参数兜底优化
      this.configParams.loginProvince = loginProvince;
      this.configParams.provCode = userInfo?.province || "";
      this.configParams.entryPage = pageEntrance || "";
      this.configParams.deviceType = userInfo?.osType || "";
      this.configParams.clientVersion = userInfo?.version || "";

      return new Promise((resolve, reject) => {
        const getKey =
          "local_config" + "_" + loginProvince + "_" + pageEntrance; // 本地存储的key值
        const localConfigData = JSON.parse(localStorage.getItem(getKey));
        const nowTime = Date.now();
        // 为了保证数据一致性
        // 本地存储有效 存入会话(后续组件调用) 接口请求不再更新会话 只更新本地存储
        // 本次存储无效 接口请求 存入会话(后续组件调用) 更新本地存储
        // 保证后续组件调用的会话存储数据只存入一次
        let updateFlag = true; // 定义一个是否更新缓存的标记
        let diffTime = 0; // 定义过期时间与当前时间差值
        if (localConfigData && localConfigData.expiredTime > nowTime) {
          sessionStorage.setItem(
            "configListSes",
            JSON.stringify(localConfigData)
          );
          updateFlag = false;
          diffTime = localConfigData.expiredTime - nowTime;
          console.log("默认配置缓存优化-本地存储");
          resolve();
        }

        // 不管有没有缓存数据 都请求接口获取最新的后端数据
        // 修改为过期时间小于两分钟和没有缓存数据 请求接口
        // 暂定全部请求后端
        try {
          // if (!localConfigData || diffTime < 2 * 60 * 1000) {
          CommonApi.queryGetConfig(this.configParams)
            .then((configRes) => {
              if (configRes.code == "000000") {
                this.$isProvinceDistinct = configRes.data && configRes.data?.distinctLinkAddr || false
                // 同步到全局开关，方便其他模块（组件）能够读取到该配置
                if (typeof Vue !== 'undefined' && Vue.prototype) {
                  Vue.prototype.$isProvinceDistinct = this.$isProvinceDistinct;
                }
                console.log("省份维度去重配置", this.$isProvinceDistinct);
                // 根据标记判断是否更新会话存储
                if (updateFlag) {
                  console.log("默认配置缓存优化-接口返回");
                  sessionStorage.setItem(
                    "configListSes",
                    JSON.stringify(configRes.data)
                  );
                }
                // 更新本地存储--分页面入口
                const setKey =
                  "local_config" + "_" + loginProvince + "_" + pageEntrance; // 本地存储的key值
                localStorage.setItem(
                  setKey,
                  JSON.stringify({
                    ...configRes.data,
                    expiredTime: Date.now() + 5 * 60 * 1000,
                  })
                );
                resolve();
                // 获取历史搜索数据方法内的this.pageEntrance无值-可在此处赋值
                // this.pageEntrance = sessionStorage.getItem("pageEntrance");
              } else {
                console.error("app组件请求接口查询失败");
                if (localConfigData) {
                  if (updateFlag) {
                    sessionStorage.setItem(
                      "configListSes",
                      JSON.stringify(localConfigData)
                    );
                  }
                } else {
                  console.error("app组件请求接口失败--也没有缓存");
                }
                // 此处查询报错未给客户提示-后续可考虑Toast提示
                // 模拟场景:链接地址的loginProvince设置为空即可复现接口报错情况
                // 实际情况省份信息从app侧获取 不会出现省份为空情况
                // console.log(configRes.msg);
                // 接口查询失败-promise依然需要返回-保证后续代码执行
                // 可提示用户配置查询失败--提示文案需与产品确认
                resolve();
              }
            })
            .catch((error) => {
              console.error("请求接口失败===>");
              console.log(error);
              if (localConfigData) {
                if (updateFlag) {
                  sessionStorage.setItem(
                    "configListSes",
                    JSON.stringify(localConfigData)
                  );
                }
              } else {
                console.error("app组件请求接口失败--也没有缓存");
              }
              resolve();
            });
          // }
        } catch (err) {
          console.error(
            "app组件调用getConfig失败==>直接使用缓存数据-不管时间是否过期"
          );
          if (localConfigData) {
            if (updateFlag) {
              sessionStorage.setItem(
                "configListSes",
                JSON.stringify(localConfigData)
              );
            }
          } else {
            console.error("app组件调用getConfig失败--也没有缓存");
          }
          resolve();
        }
      });
    },

    // ai白名单校验 手机号和省份是或的关系
    async getAiCheck() {
      const userInfo = localStorage.getItem("userInfo")
        ? JSON.parse(localStorage.getItem("userInfo"))
        : null;
      const checkPhone = userInfo?.phoneNumber || "";
      const checkProvince = userInfo?.loginProvince || "";
      return new Promise((resolve, reject) => {
        // 测试用
        // if (checkPhone) {
        //   sessionStorage.setItem("aiPhoneStatus", true);
        //   resolve();
        //   return
        // }
        if (!checkPhone) {
          sessionStorage.setItem("aiPhoneStatus", false);
          resolve();
          return;
        }
        try {
          CommonApi.aiCheck({
            phone: checkPhone,
            loginProvince: checkProvince,
          })
            .then((checkres) => {
              console.log("ai白名单返回===>");
              console.log(checkres);
              if (checkres.code === "000000" && checkres.info) {
                console.log("ai白名单查询成功==>");
                sessionStorage.setItem("aiPhoneStatus", true);
                resolve();
              } else {
                console.log("ai白名单查询失败==>");
                sessionStorage.setItem("aiPhoneStatus", false);
                resolve();
              }
            })
            .catch((error) => {
              console.log("ai白名单请求失败==>");
              console.log(error);
              sessionStorage.setItem("aiPhoneStatus", false);
              resolve();
            });
        } catch (err) {
          console.log("ai白名单调用失败==>");
          console.log(err);
          sessionStorage.setItem("aiPhoneStatus", false);
          resolve();
        }
      });
    },
    // AI模型初始化
    async initAI() {
      try {
        console.time("getAiCheck");
        // 接入ai大模型-根据用户手机号白名单判断
        await this.getAiCheck();
        console.log("ai白名单校验接口状态====>");
        console.log(JSON.parse(sessionStorage.getItem("aiPhoneStatus")));
        const checkState = JSON.parse(sessionStorage.getItem("aiPhoneStatus"));
        if (checkState) {
          appAiSwitchIn();
        }
        console.timeEnd("getAiCheck");
      } catch (error) {
        console.log(error);
      }
    },
    forbidScale() {
      let lastTouchEnd = 0;
      document.documentElement.addEventListener(
        "touchend",
        function (event) {
          let now = Date.now();
          if (now - lastTouchEnd <= 300) {
            event.preventDefault();
          }
          lastTouchEnd = now;
        },
        {
          passive: false,
        }
      );
    },

    initGdpFull() {
      // console.log('-----初始化配置--------')
      // 初始化H5插码
      gdp("init", "9e4e5fa7244c6b6e", "b95440ef47ec01fc", {
        host: "jiguang.coc.10086.cn",
        autotrack: false, // 关闭无埋点事件发送，生产环境设置为关闭。
        compress: false, // 开启数据压缩模式，整体报文加密，生产环境设置为开启。
        debug: false,
        hashtag: true, // 开启页面URL混淆采集，生产环境设置为开启。
        scheme: "https",
      });
    },

    encryptionHandler(word) {
      var encodeStr = encodeTemp();
      var key = CryptoJS.enc.Utf8.parse(encodeStr);
      var srcs = CryptoJS.enc.Utf8.parse(word);
      var encrypted = CryptoJS.AES.encrypt(srcs, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
      });
      return encrypted.toString();
    },

    setGeneralProps() {
      console.log("-----全局变量采集------");
      console.log("从本地存储获取用户信息和app登录token_id");
      const localUserInfo = JSON.parse(localStorage.getItem("userInfo"));
      const localAppToken = localStorage.getItem("appTokenId") || "";
      console.log(localUserInfo);
      console.log(localAppToken);
      // 全局变量采集
      gdp(
        "setUserId",
        this.encryptionHandler(localUserInfo?.phoneNumber || "")
      ); // 此处填写用户手机号
      gdp("setGeneralProps", {
        // "userId": localUserInfo?.phoneNumber,
        WT_cid: localUserInfo?.cid,
        WT_clientID: localUserInfo?.clientID,
        WT_prov: localUserInfo?.province, //用户登陆省份和定位省份取最新值，例如：311
        WT_city: localUserInfo?.city, //用户登陆地市和定位地市取最新值，例如：0310
        WT_userBrand: localUserInfo?.userBrand, //用户的品牌，01、全球通 02、神州行 03、动感地带 09、其他品牌
        WT_loginProvince: localUserInfo?.loginProvince, // 登录号码归属地省编码，例如：311
        WT_loginCity: localUserInfo?.loginCity, // 登录号码归属地市编码，例如：0310
        WT_token_id: localAppToken, // 客户端的登录token_id  2025-1-16新增
        // WT_es: "", // 页面路径
        WT_ti: "端内搜索", // 页面名称--添加一个默认值（ai查询使用了此全局参数字段）
        WT_page_type: "搜索页", // 页面类型 按照页面功能划分页面类型，如：首页、服务功能页、探索页等
        // WT_appId: "", // 小程序特有参数-小程序id
        // WT_appqry: "", // 小程序特有参数-来源信息，拉端场景
        // WT_pageid: "", // 小程序和H5传参-标识页面的唯一id
        // WT_channelid: "", // 小程序和H5传参-四级渠道号
        // WT_channel: "", // 原生特有参数-安装包渠道编码
        // XY_visit_source: "", // 访问来源-具体页面入口-如：普通版首页、PLUS版首页、全球通首页、动感地带首页、分类页
        WT_aav: localUserInfo?.version, // 客户端版本号
        // dataSourceId: "b95440ef47ec01fc", // 数据源id--待确认是否是初始化的init参数
        // WT_plat: "", // 渠道
      });
      // 全局参数中以下参数需要根据端内特定场景修改覆盖
      // {
      //   WT_es: sessionStorage.pageUrl, // 页面路径
      //   WT_ti: "", // 页面名称
      //   XY_visit_source: sessionStorage.pageEntrance, // 访问来源
      //   WT_plat: sessionStorage.pagePlat, // 渠道
      //   XY_transaction_id: this.searchUUID, // 事务流水号
      // }
      // const aa = {
      //   WT_es: sessionStorage.pageUrl, // 页面路径
      //   WT_ti: "", // 页面名称
      //   XY_visit_source: sessionStorage.pageEntrance || "", // 访问来源
      //   WT_plat: sessionStorage.pagePlat, // 渠道
      //   XY_transaction_id: this.searchUUID, // 事务流水号
      // };
    },
    async getUserLoginAnalyseUserState(){
      try {
        const res = await getUserLoginAnalyse();
        this.userLoginState = res.userState + "";
      } catch (error) {
        console.log("getUserLoginAnalyse调用失败", err);
        this.userLoginState = "";
      }
    }
  },

  // activated() {
  //   console.log("组件被激活");
  // },

  // deactivated() {
  //   console.log("组件被停用");
  // },
};
</script>

<style>
.van-dialog__confirm,
.van-dialog__confirm:active {
  color: #2892ff;
}
</style>
