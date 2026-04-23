<template>
  <div
    ref="searchMain"
    class="search-main"
    :class="bgClass"
    :style="{ 'padding-top': paddingTop + 'px' }"
    @scroll="onScroll()"
  >
    <!-- 搜索框 -->
    <div class="search-con">
      <div class="icon" @click="onBack()">
        <img src="@/assets/images/left-arow.png" alt="" />
      </div>
      <div class="input-con">
        <input
          type="text"
          autocomplete="off"
          ref="myInput"
          enterkeyhint="search"
          :placeholder="placeholder.markName"
          v-model="searchContent"
          @keyup.enter="onSearch('1')"
          @focus="onFocus()"
          @blur="onBlur()"
        />
        <div class="operate-con">
          <span
            class="icon s-iconfont ic-icon-clean"
            v-if="searchContent"
            @click="onClear()"
          ></span>
        </div>
      </div>
      <div class="btn-con" @click="onSearch('1')">搜索</div>
    </div>
    <!-- 下面的内容 1. 默认搜索页 2. 搜索文字页 3. 搜索确定页 -->
    <div :class="mainCon" ref="mainConRef">
      <keep-alive>
        <component
          :is="currentCom"
          :ref="resultRef"
          :computedHeight.sync="computedHeight"
        ></component>
      </keep-alive>
    </div>
    <!-- 加载动画 切换查询结果tab调用 -->
    <Loadding ref="loading" />
    <!-- v-show="isApp && showVoice"  -->
    <!-- 语音输入 注意手机系统 注意切换输入法时键盘高度变化 -->
    <voice-input
      ref="voiceInput"
      v-show="
        (isApp &&
          showVoice &&
          isIOS &&
          keyBoardHeight &&
          UNIFY_VOICE_SHOW_BUTTON) ||
        (!isIOS && showVoice && isApp && UNIFY_VOICE_SHOW_BUTTON)
      "
      :showVoice.sync="showVoice"
      :keyBoardHeight="keyBoardHeight"
      @onSearch="onSearch('1')"
    ></voice-input>
    <!-- 满意度调查入口 -->
    <SatisfactionEnter
      v-show="currentCom === 'default'"
      :keyBoardHeight="keyBoardHeight"
    />
    <offline v-if="isOffline"></offline>
  </div>
</template>

<script>
import {
  updateHistoryData,
  getUUID,
  getQueryString,
  isApp,
  trim,
  goPageUrl,
  isBack,
  goPage,
  isIOS,
  getQueryStringNew,
  handleQuerySearchZone,
  handleCheckSdkPermission,
  isProtogenesisSkip,
  goProtogenesisPage,
  isHarmony,
  isAndroid
} from "@/utils/tool";
import { closeCurrentWebView } from "@/utils/native";
import DefaultCom from "@/components/default/index.vue";
import SearchAssociation from "@/components/SearchAssociation.vue";
import NoData from "@/components/NoData.vue";
import ResultCom from "@/components/result/index.vue";
import { Toast } from "vant";
import CommonApi from "@/api/index";
import VoiceInput from "@/components/VoiceInput.vue";
import SatisfactionEnter from "@/components/SatisfactionEnter.vue";
import Loadding from "../components/Loadding.vue";
import Correction from "../components/result/TemplatePage/correction";
import offline from "./offline.vue"

export default {
  name: "search-main",
  // directives: {
  //   focus: {
  //     inserted: function(el) {
  //       el.focus()
  //     }
  //   }
  // },
  components: {
    default: DefaultCom,
    searchAssociation: SearchAssociation,
    noData: NoData,
    result: ResultCom,
    VoiceInput,
    SatisfactionEnter,
    Loadding,
    offline
  },
  inject: ["userLoginState"],
  data() {
    return {
      isIOS: isIOS,
      computedHeight: false,
      showVoice: false,
      offsetWidth: null,
      offsetHeight: null,
      userInfo: null,
      placeholder: {
        markName: "",
      }, // 默认搜索词
      currentCom: "default", // 当前展示的组件
      resultRef: "resultRef",
      searchContent: "", // 搜索框中的内容
      pageEntrance: "1", // 当前栏目标识，用户通过地址栏传过来
      defaultWord: null, // 搜索默认此，用户通过地址栏传过来
      associationData: [], // 搜索页结果数据
      isApp: isApp(),
      directParam: {
        params: {
          keyWord: "",
        },
        provCode: "351",
        clientVersion: "10_10",
        entryPage: "1",
        beans: [],
        loginProvince: "", // 用户归属地-省份
        loginCity: "", // 用户归属地-地市
      },
      keyBoardHeight: 0,
      visualViewportHeight: 0,
      outerHeight: window.outerHeight,
      hasScroll: false,
      interval: null,
      isAllowStop: false,
      innerHeight: window.innerHeight,
      keywordGD: "", //广东商城关键字
      permissionFlag: false, //全局定位授权判断
      UNIFY_VOICE_SHOW_BUTTON: true,
      searchUUID: "",
      correctionFlag: true, // 是否纠错，默认进行纠错
      wordType: 4, // 搜索词类型(1:用户输入的查询词、2:搜索联想词、3:默认搜索词、4:其他)
      associationFlag: true, // 联想词查询开关
      isOffline: false,
      offlineTimer: null,
    };
  },
  provide() {
    return {
      getSearchContent: () => this.searchContent,
      getDefaultWord: () => this.defaultWord,
      getPlaceholder: () => this.placeholder,
      getCurrentCom: () => this.currentCom,
      getAssociationData: () => this.associationData,
      getKeyBoardHeight: () => this.keyBoardHeight,
      getShowVoice: () => this.showVoice,
      updatePlaceholder: this.updatePlaceholder,
      updateDefaultWord: this.updateDefaultWord,
      updateCurrentCom: this.updateCurrentCom,
      updateSearchContent: this.updateSearchContent,
      updateAssociationData: this.updateAssociationData,
      // getResult: this.getResult,
      getResult: this.getResultNew,
      handleBlur: this.handleBlur,
      showLoading: () => this.$refs.loading.loadingShow(),
      hideLoading: () => this.$refs.loading.loadingHide(),
      updateSearchUUID: this.updateSearchUUID,
      getSearchUUID: () => this.searchUUID,
      getWordType: () => this.wordType,
      updateWordType: this.updateWordType,
      updateCorrectionFlag: this.updateCorrectionFlag,
      getCorrectionFlag: () => this.correctionFlag,
      getAssociationFlag: () => this.associationFlag, // 联想词查询开关
      updateAssociationFlag: this.updateAssociationFlag,
      updateInputState: this.updateInputState, // 更新输入框聚焦/失焦状态 修补Ios调研入口在键盘唤起状态点击跳转 键盘非正常关闭 主动触发输入框失焦
    };
  },
  watch: {
    searchContent(newVal, oldVal) {
      this.directParam.params.keyWord = newVal;
      if (newVal !== oldVal) {
        this.correctionFlag = true;
        this.currentCom = newVal === "" ? "default" : "searchAssociation";
      }
    },
    computedHeight(newVal) {
      if (newVal) {
        this.hasScroll =
          this.$refs.mainConRef.scrollHeight >
          this.$refs.mainConRef.clientHeight;
      }
    },
    keywordGD(newVal) {
      if (newVal) {
        let hisData = {
          markName: newVal,
          actionUrl: "",
          actionType: "",
        };
        updateHistoryData(this.pageEntrance, hisData);
        this.updateSearchContent(newVal);
        this.currentCom = "result";
        this.$nextTick(() => {
          this.updateCurrentCom("result");
          this.updateSearchUUID();
          // 更新搜索类型
          this.updateWordType(1);
          // this.getResult();
          this.getResultNew();
        });
      }
    },
    currentCom(newVal) {
      if (newVal === "result") {
        this.$refs.loading.loadingShow();
      }
      sessionStorage.removeItem("observertimesassociationList");
      this.$nextTick(() => Correction.clearCorrection());
    },
  },
  computed: {
    paddingTop() {
      return isApp()
        ? (this.offsetWidth * 100) / 750
        : (this.offsetWidth * 40) / 750;
    },
    bgClass() {
      if (this.currentCom === "result") {
        return "F7F7F7-bg";
      } else {
        return "FFFF-bg";
      }
    },
    mainCon() {
      if (this.currentCom === "result") {
        this.showVoice = false;
        this.$refs.voiceInput.showStatus = false;
        return "main-con-hidden mt-0";
      } else if (this.currentCom === "searchAssociation") {
        return "main-con-new";
      } else {
        return "main-con mt-46";
      }
    },
  },

  mounted() {
    console.log("打印--进入searchmain页面-没有请求接口====>");
    console.time("defaultShow");
    const that = this;
    // 移动设备上弹出键盘-先注释
    // this.$nextTick(() => {
    //   that.$refs.myInput.focus();
    // });
    // if (isApp()) {
    //   this.$nextTick(() => {
    //     that.$refs.myInput.focus();
    //   });
    // }
    if (isApp()) {
      this.getNetInfo();
    }

    let configList = sessionStorage.configListSes
      ? JSON.parse(sessionStorage.configListSes)
      : {};
    that.UNIFY_VOICE_SHOW_BUTTON =
      configList.UNIFY_VOICE_SHOW_BUTTON === false ? false : true;

    sessionStorage.setItem("currentComSes", "default");
    sessionStorage.setItem("pageUrl", document.location.href);
    // sessionStorage.setItem("pagePlat", "000_JTAPP");
    // 插码方案修改2025-1-16
    sessionStorage.setItem("pagePlat", "30011");

    window.addEventListener("scroll", function () {
      console.log("scroll~");
      if (that.$refs.voiceInput) {
        that.$refs.voiceInput.showStatus = false;
      }
      that.$refs.myInput.blur();
    });

    window.addEventListener("resize", this.onResize);

    // 此处逻辑判断主要用于以下场景:
    // 1.查询结果页点击产品进入详情页 再返回查询结果页时会出发:
    // 2.进入端内后--如果要开启设置权限-进入手机原生配置权限--再返回移动app
    // 3.类似于2 手机主界面按钮退出 后台再进入移动app
    // 4.待发掘
    document.addEventListener("visibilitychange", function () {
      console.log("visibilitychange===>", document.visibilityState);

      let vocieStatus = localStorage.getItem("vocieStatus");
      console.log("vocieStatus===>", vocieStatus);

      if (document.visibilityState === "hidden") {
        // 页面进入后台
        console.log("页面进入后台");
        if (vocieStatus === "4" && !isIOS) {
          // 关闭当前的webview
          // cmcc.closeCurrentWebView({
          //   debug: false,
          //   success: function(res) {},
          //   error: function(res) {}
          // })
        }
      } else {
        console.log("页面进入显示");
        if (isApp()) {
          try {
            cmcc.getDataFromNative({
              debug: false,
              key: "permissKeyGoPage", // 存储数据时的 key, 不能为空, String 类型。必传
              success(res) {
                console.log(
                  "permissKeyGoPageTemp+" +
                    JSON.stringify(res) +
                    "----" +
                    res.value
                );
                let permissKeyGoPageTemp = res.value; // 存储的 key 对应的数据。String 类型。获取不到返回空字符串。
                localStorage.setItem(
                  "permissKeyGoPageTemp",
                  permissKeyGoPageTemp
                );
              },
              error(res) {},
            });
          } catch (err) {
            console.error("getDataFromNative error");
          }
          if (isIOS) {
            // 如果当前展示的是结果页-调用result中三个入驻组件更新方法-目的是为了更新客户经理预约状态
            // 多级组件调用--待优化
            if (sessionStorage.currentComSes == "result") {
              if (that.$refs.resultRef) {
                that.$refs.resultRef.refreshTreeCard();
              }
            }
            // 首页重构周边生活定位权限设置后-重新请求--详情页返回不请求
            if (sessionStorage.currentComSes == "default") {
              if (that.$refs.resultRef) {
                that.$refs.resultRef.refreshNearbyLife();
              }
            }
            handleCheckSdkPermission().then((permisRes) => {
              if (isIOS) {
                console.log(
                  "进入searchmain的handleCheckSdkPermission1+" +
                    permisRes +
                    "+local+" +
                    localStorage.locationStateIos
                );
              } else {
                console.log(
                  "进入searchmain的handleCheckSdkPermission+" +
                    permisRes +
                    "+local+" +
                    localStorage.locationStateAndroid
                );
              }
              if (permisRes == "-5") {
                if (localStorage.permissKeyGoPageTemp == "9") {
                  //
                } else {
                  // cmcc.closeCurrentWebView({
                  //   debug: false,
                  //   success: function(res) {},
                  //   error: function(res) {}
                  // })
                }
                cmcc.saveDataToNative({
                  debug: false,
                  key: "permissKeyGoPage", // 存储数据的 key, 不能为空, String 类型。必传
                  value: "-1", // 需要存储的数据, String 类型。必传
                  success() {},
                  error(res) {},
                });
              } else if (permisRes == "0") {
                if (
                  localStorage.permissKeyGoPageTemp != "9" &&
                  sessionStorage.currentComSes == "result"
                ) {
                  sessionStorage.setItem("initGetLocationFlag", "1");
                  that.updateCurrentCom("result");
                  // this.updateSearchUUID()
                  // 更新搜索类型
                  // this.updateWordType(1)
                  // that.getResult();
                  that.getResultNew();
                }
              }
            });
          } else {
            console.log("不是ios==>当前组件==>");
            console.log(sessionStorage.currentComSes);
            if (sessionStorage.currentComSes == "result") {
              sessionStorage.setItem("initGetLocationFlag", "1");
              that.updateCurrentCom("result");
              // this.updateSearchUUID()
              // that.getResult();
              that.getResultNew();
            }
            // 首页重构周边生活定位权限设置后-重新请求--详情页返回不请求
            if (sessionStorage.currentComSes == "default") {
              if (that.$refs.resultRef) {
                that.$refs.resultRef.refreshNearbyLife();
              }
            }
          }
          if (vocieStatus === "4" && !isIOS) {
            localStorage.setItem("vocieStatus", "");
            cmcc.closeCurrentWebView({
              debug: false,
              success: function (res) {},
              error: function (res) {},
            });
          }
          // if(vocieStatus === '4' && !isIOS){
          //   location.reload();
          //   localStorage.setItem('vocieStatus', '');
          // }
        } else {
          console.log("不是app");
          console.log("会话里的组件===>", sessionStorage.currentComSes);
          console.log("this里的组件===>", that.currentCom);
        }
      }
    });

    // 1210
    // 1.尝试使用onPageActive方法插入localstorage的99，让他回来之后权限变成0之后，就变为99 就不要再调用关闭webview方法
    // 2.通过判断导航栏的高度，作为唯一标识
    // 页面浏览采集

    // 插码方案修改2025-1-16
    const pageShowGdpObj = {
      WT_et: "pageview",
      WT_event: "H5PageShow",
      WT_plat: sessionStorage.pagePlat || "",
      WT_es: sessionStorage.pageUrl || "", // 页面路径
      WT_ti:
        sessionStorage.currentComSes == "result" ? "搜索结果页" : "搜索默认页",
      XY_visit_source: sessionStorage.pageEntrance || "", // 访问来源
      XY_scene: "",
      XY_transaction_id: this.searchUUID,
    };
    console.log("-----这里是H5PageShow的上报===>");
    console.log(pageShowGdpObj);
    if (isApp()) {
      // gdp("track", "pageview", {
      //   XY_transaction_id: this.searchUUID,
      //   WT_et: "pageview",
      //   WT_event: "H5PageShow",
      //   WT_plat: sessionStorage.pagePlat || "",
      //   WT_es: sessionStorage.pageUrl || "",
      //   WT_ti:
      //     sessionStorage.currentComSes == "result"
      //       ? "搜索结果页"
      //       : "搜索默认页",
      // });
      gdp("track", "pageview", pageShowGdpObj);
    }

    let directName = localStorage.getItem("directName");
    if (isBack() && directName) {
      this.searchContent = directName;
      localStorage.setItem("directName", "");
    }
    this.offsetWidth = document.body.offsetWidth;
    this.offsetHeight = document.body.offsetHeight;
    sessionStorage.setItem("initGetLocationFlag", "1");

    // 整合根据url获取信息的方法调用-调用一次即可
    // const urlInfoObj = getQueryStringNew();
    // this.pageEntrance = getQueryStringNew().pageEntrance;
    // this.defaultWord = getQueryString("sendParam", "searchData");
    // this.pageEntrance = getQueryStringNew().pageEntrance;
    // const markId = getQueryStringNew().markId;
    // const markName = getQueryStringNew().markName;
    const urlInfoObj = sessionStorage.getItem("newUrlParams")
      ? JSON.parse(sessionStorage.getItem("newUrlParams"))
      : null;
    // 此处逻辑迁移至default组件
    // console.log("获取会话中存储的url携带参数信息===>");
    // console.log(urlInfoObj);
    this.pageEntrance = urlInfoObj?.pageEntrance;
    // const markId = urlInfoObj.markId;
    // const markName = urlInfoObj.markName;
    // const obj = {};
    // obj.markId = markId;
    // obj.markName = markName;

    // this.defaultWord = obj;
    // this.placeholder = this.defaultWord
    //   ? this.defaultWord
    //   : {
    //       markName: "",
    //     };

    const userInfo = localStorage.getItem("userInfo")
      ? JSON.parse(localStorage.getItem("userInfo"))
      : null;
    this.userInfo = userInfo;

    const version = this.userInfo?.version
      ? this.userInfo?.version.split("_")[1]
      : "";
    console.log("版本信息===>", version);
    const versionArr = version.split(".");
    if (versionArr[0] > 9) {
      this.isAllowStop = true;
    } else if (versionArr[0] == 9 && versionArr[1] >= 1) {
      this.isAllowStop = true;
    } else {
      this.isAllowStop = false;
    }
    // this.isAllowStop = version >= "9.1.0" ? true : false;
    console.log("this.isAllowStop===>", this.isAllowStop);

    if (this.userInfo?.osType === "ios") {
      this.interval = setInterval(() => {
        let visualViewportHeight = window.visualViewport.height;
        if (this.visualViewportHeight !== visualViewportHeight) {
          this.visualViewportHeight = visualViewportHeight;
          this.keyBoardHeight = window.innerHeight - this.visualViewportHeight;
        }
      }, 10);
    }
    this.directParam.provCode = userInfo?.province || "";
    this.directParam.clientVersion = userInfo?.version
      ? `10_10,${userInfo?.version}`
      : "10_10";
    this.directParam.entryPage = this.pageEntrance;
    this.directParam.params.keyWord = this.searchContent;
    this.directParam.loginProvince = userInfo?.loginProvince || "";
    this.directParam.loginCity = userInfo?.loginCity || "";
    // this.keywordGD = getQueryStringNew().keyword || "";
    this.keywordGD = urlInfoObj.keyword || "";

    this.$nextTick(() => {
      // html中的遮罩层元素隐藏
      document.querySelector("#preLoading").style.display = "none";
      console.log("打印--searchmain页面遮罩层消失==>能看到默认组件");
      console.timeEnd("defaultShow");
    });
  },
  // updated(){
  //   let isDefaulWordThirdPage = localStorage.getItem('isDefaulWordThirdPage');
  //   if(isDefaulWordThirdPage === '1'){
  //     this.showVoice = false;
  //     isApp() && this.$refs.voiceInput.status === 4 && this.isAllowStop ? this.$refs.voiceInput.stopVoiceRecognizer(true) : '';
  //     localStorage.setItem('isDefaulWordThirdPage','')
  //   }
  // },
  destroyed() {
    clearInterval(this.interval);
    if (this.offlineTimer) {
      clearTimeout(this.offlineTimer);
      this.offlineTimer = null;
    }
  },
  created() {
    this.updateSearchUUID();
  },
  methods: {
    getNetInfo() {
      this.isOffline = false
      cmcc.getNetInfo({
        debug: false,
        success: (res) => {
          console.log("getNetInfo success+" + JSON.stringify(res), res.nt);
          if (res.nt == -1 && isAndroid || res.net == 4 && isHarmony()) {
            this.isOffline = true;
            if (this.offlineTimer) {
              clearTimeout(this.offlineTimer);
            }
            this.offlineTimer = setTimeout(() => {
              this.isOffline = false;
              this.offlineTimer = null;
            }, 3000);
          } else {
            this.isOffline = false;
            if (this.offlineTimer) {
              clearTimeout(this.offlineTimer);
              this.offlineTimer = null;
            }
          }
        },
        error: (err) => {
          console.log('error', err)
        }
      })
    },
    updateCorrectionFlag(flag) {
      this.correctionFlag = flag;
    },
    updateSearchUUID() {
      this.searchUUID = getUUID();
    },
    updateWordType(val) {
      this.wordType = val;
    },
    updateAssociationFlag(flag) {
      this.associationFlag = flag;
    },
    onScroll() {
      console.log("onScroll~~~~~");
      if (this.$refs.voiceInput) {
        this.$refs.voiceInput.showStatus = false;
      }
      this.$refs.myInput.blur();
    },
    // 注释多余函数--影响到筛选里的输入框
    // emptyFun() {},
    onResize() {
      console.log("onResize~");
      console.log(window.visualViewport.height, "window.visualViewport.height");
      console.log(window.innerHeight, "window.innerHeight");
      let innerHeight = window.innerHeight;
      if (innerHeight < this.innerHeight) {
        if (this.currentCom === "result") {
          this.showVoice = false;
          this.$refs.voiceInput.showStatus = false;
        } else {
          this.keyBoardHeight = 0;
          this.showVoice = true;
        }
      } else {
        this.showVoice = false;
        this.$refs.voiceInput.showStatus = false;
      }
    },
    onFocus() {
      if (this.searchContent) {
        // 开启联想词查询开发
        this.associationFlag = true;

        this.currentCom = "searchAssociation";
        this.$nextTick(() => {
          this.$refs.resultRef.getData();
        });
      }
      // 获取键盘高度，展示语音入口
      if (this.userInfo.osType === "ios") {
        // 异步是因为键盘唤起有动画时间
        setTimeout(() => {
          this.visualViewportHeight = window.visualViewport.height;
          const keyBoardHeight = window.innerHeight - this.visualViewportHeight;
          this.keyBoardHeight = keyBoardHeight;
          console.log(this.keyBoardHeight, "ios-keyboardheight");
          this.showVoice = this.keyBoardHeight ? true : false;
        }, 300);
      } else if (this.userInfo.osType === "android") {
        setTimeout(() => {
          this.keyBoardHeight = 0;
          console.log(this.keyBoardHeight, "android-keyboardheight");
          this.showVoice = true;
        }, 300);
      } else {
        this.keyBoardHeight = 200;
        this.showVoice = true;
      }
    },
    onBlur() {
      console.log("onBlur");
      this.showVoice = false;
      this.$refs.voiceInput.showStatus = false;
      isApp() &&
      ((isIOS && this.$refs.voiceInput.status === 4 && this.isAllowStop) ||
        (!isIOS && this.$refs.voiceInput.status === 4))
        ? this.$refs.voiceInput.stopVoiceRecognizer(true)
        : "";
    },
    updateInputState() {
      console.log("主动触发失焦");
      this.showVoice = false;
      this.$refs.voiceInput.showStatus = false;
      isApp() &&
      ((isIOS && this.$refs.voiceInput.status === 4 && this.isAllowStop) ||
        (!isIOS && this.$refs.voiceInput.status === 4))
        ? this.$refs.voiceInput.stopVoiceRecognizer(true)
        : "";
    },
    handleBlur() {
      console.log("handelbluer~");
      this.$refs.myInput.blur();
    },
    updateAssociationData(newVal) {
      this.associationData = newVal;
    },
    updateSearchContent(newVal) {
      this.searchContent = newVal;
      this.directParam.params.keyWord = newVal;
    },
    updateCurrentCom(newVal) {
      console.log("currnetCom+" + newVal);
      if (newVal == "default") {
        sessionStorage.currentComSes = "default";
      } else {
        sessionStorage.currentComSes = "result";
      }
      this.currentCom = newVal;
    },
    updatePlaceholder(newVal) {
      this.placeholder = newVal;
    },
    updateDefaultWord(newVal) {
      this.defaultWord = newVal;
    },
    onBack() {
      if (
        this.currentCom === "result" ||
        this.currentCom === "searchAssociation"
      ) {
        this.currentCom = "default";
        this.searchContent = "";
        console.log("currnetCom+" + "default");
        sessionStorage.currentComSes = "default";
      } else {
        if (isApp()) {
          closeCurrentWebView();
        } else {
          window.history.back();
        }
      }
    },
    onSearch(type) {
      console.log("点击搜索按钮", type);
      this.showVoice = false;
      this.$refs.voiceInput.showStatus = false;

      // 首先关闭ai的dom展示
      console.log("结果页组件展示===>");
      console.log(this.$refs.resultRef.tabsList);
      if (this.$refs.resultRef) {
        this.$refs.resultRef.showAiFlag = false;
      }

      // 搜索时关闭联想词查询
      this.associationFlag = false;

      this.$refs.myInput.blur();
      isApp() && this.$refs.voiceInput.status === 4 && this.isAllowStop
        ? this.$refs.voiceInput.stopVoiceRecognizer(true)
        : "";
      if (this.searchContent === "") {
        this.updateWordType(3);
        if (this.placeholder?.actionUrl) {
          let hisData = {
            markName: this.placeholder?.markName || "",
            actionUrl: this.placeholder?.actionUrl || "",
            actionType: this.placeholder?.actionType || "",
          };
          updateHistoryData(this.pageEntrance, hisData);

          // 插码方案修改2025-1-16
          const clickGdpObj = {
            WT_et: "clk",
            WT_area_type_1: "搜索框",
            areaid: "",
            WT_area_type_2: "搜索框",
            WT_area_name: "搜索框",
            XY_env_type: "",
            XY_point_position: "",
            WT_event: "P00000049488",
            XY_gd_source: "搜索平台",
            WT_markId: "",
            WT_next_url: "",
            WT_envName: this.placeholder.markName,
            XY_scene: this.placeholder.markName,
            WT_es: sessionStorage.pageUrl || "", // 页面路径
            WT_ti: "搜索结果页", // 页面名称
            XY_visit_source: sessionStorage.getItem("pageEntranceName") || "", // 访问来源
            WT_plat: sessionStorage.pagePlat || "", // 渠道
            XY_transaction_id: this.searchUUID,
          };
          console.log("点击搜索按钮上报===>");
          console.log(clickGdpObj);
          if (isApp()) {
            // gdp("track", "clk", {
            //   XY_transaction_id: this.searchUUID,
            //   WT_et: "clk",
            //   WT_event: "P00000049488",
            //   WT_envName: this.placeholder.markName,
            //   WT_next_url: this.placeholder?.actionUrl || "",
            //   WT_plat: sessionStorage.pagePlat || "",
            //   WT_es: sessionStorage.pageUrl || "",
            //   WT_ti: "搜索结果页",
            //   XY_pageEntry: sessionStorage.pageEntrance || "",
            // });
            gdp("track", "clk", clickGdpObj);
          }
          localStorage.setItem("isDefaulWordThirdPage", "1");
          goPage(this.placeholder?.actionType, this.placeholder?.actionUrl);
          return;
        } else {
          // 此处给输入框赋值(默认页面无输入回显的是输入框的placeholder)--会出发联想词组件的watch监听方法--最终会额外调用一次联想词查询接口--待优化
          this.searchContent = this.placeholder.markName;
        }
      } else {
        this.updateWordType(1);
      }
      this.$nextTick(() => {
        console.log("搜索内容", this.searchContent);
        let temp = trim(this.searchContent);

        if (temp !== "") {
          // 插码方案修改2025-1-16
          const clickGdpObj = {
            WT_et: "clk",
            WT_area_type_1: "搜索框",
            areaid: "",
            WT_area_type_2: "搜索框",
            WT_area_name: "搜索框",
            XY_env_type: "",
            XY_point_position: "",
            WT_event: "P00000049488",
            XY_gd_source: "搜索平台",
            WT_markId: "",
            WT_next_url: "",
            WT_envName: this.searchContent,
            XY_scene: this.searchContent,
            WT_es: sessionStorage.pageUrl || "", // 页面路径
            WT_ti: "搜索结果页", // 页面名称
            XY_visit_source: sessionStorage.pageEntrance || "", // 访问来源
            WT_plat: sessionStorage.pagePlat || "", // 渠道
            XY_transaction_id: this.searchUUID,
          };
          console.log("点击搜索按钮上报===>");
          console.log(clickGdpObj);
          if (isApp()) {
            // gdp("track", "clk", {
            //   XY_transaction_id: this.searchUUID,
            //   WT_et: "clk",
            //   WT_event: "P00000049488",
            //   WT_envName: this.searchContent,
            //   WT_plat: sessionStorage.pagePlat || "",
            //   WT_es: sessionStorage.pageUrl || "",
            //   WT_ti: "搜索结果页",
            //   XY_pageEntry: sessionStorage.pageEntrance || "",
            // });
            gdp("track", "clk", clickGdpObj);
          }

          // 每次查询都显示loading动画
          // 1.直达跳转前关闭
          // 2.在查询结果请求方法里关闭了
          // this.$refs.loading.loadingShow();

          // 为保证搜索-点击事件源id一致--此处不再更新UUID
          // this.updateSearchUUID()
          this.getDirectData(type);

          // 根据联想词的会话存储判断是否要调用直达数据接口
          // console.log("联想词存储信息===>");
          // console.log(sessionStorage.associationWord);
          // console.log(
          //   sessionStorage.associationArr
          //     ? JSON.parse(sessionStorage.associationArr)
          //     : []
          // );
          // if (sessionStorage.associationWord === this.searchContent) {
          //   const associationData = sessionStorage.associationArr
          //     ? JSON.parse(sessionStorage.associationArr)
          //     : [];
          //   let skipDirectFlag = false;
          //   for (let index = 0; index < associationData.length; index++) {
          //     const associationItem = associationData[index];
          //     if (
          //       associationItem.titleSuggest === this.searchContent &&
          //       associationItem.contactType === "7"
          //     ) {
          //       skipDirectFlag = true;
          //       break; // 当存储的联想词信息中的直达词与搜索词一致 跳出循环
          //     }
          //   }
          //   if (skipDirectFlag) {
          //     // 当前输入词有直达数据--沿用以前逻辑
          //     this.getDirectData(type);
          //   } else {
          //     // 当前输入词无直达数据--搬用查询直达词数据无直达数据结果逻辑--直接显示结果页组件-历史词要更新
          //     let hisData = {
          //       markName: this.searchContent,
          //       actionUrl: "",
          //       actionType: "",
          //     };
          //     this.currentCom = "result";
          //     this.updateCurrentCom("result");
          //     updateHistoryData(this.pageEntrance, hisData);
          //     // this.getResult(type);
          //     this.getResultNew(type);
          //   }
          // } else {
          //   // 搜索词与直达词不一致--沿用以前逻辑
          //   this.getDirectData(type);
          // }
        } else {
          Toast("请输入搜索内容");
        }
      });
    },
    /**
     * 搜索直达，如果有url跳转搜索直达页面，如果没有则到搜索结果页
     */
    getDirectData(type) {
      CommonApi.queryDirect(this.directParam)
        .then((res) => {
          if (res.data && res.data.linkAdress) {
            let url = res.data.linkAdress;
            let jumpType = res.data.jumpType;
            let hisData = {
              markName: this.searchContent,
              actionUrl: url || "",
              actionType: jumpType || "",
              isDirect: true,
            };
            updateHistoryData(this.pageEntrance, hisData);
            localStorage.setItem("directName", this.searchContent);
            this.handleBlur();

            // 直达查询成功-跳转详情页前-关闭页面的loading效果
            // this.$refs.loading.loadingHide();

            if (isProtogenesisSkip(res.data)) {
              goProtogenesisPage(res.data.linkAdress1);
            } else {
              setTimeout(() => {
                goPageUrl(jumpType, url);
              }, 500);
            }
          } else {
            let hisData = {
              markName: this.searchContent,
              actionUrl: "",
              actionType: "",
            };
            this.currentCom = "result";
            this.updateCurrentCom("result");
            updateHistoryData(this.pageEntrance, hisData);
            // this.getResult(type);
            this.getResultNew(type);
          }
        })
        .catch((error) => {
          console.log("直达词查询失败===>");
          console.log(error);
          let hisData = {
            markName: this.searchContent,
            actionUrl: "",
            actionType: "",
          };
          this.currentCom = "result";
          this.updateCurrentCom("result");
          updateHistoryData(this.pageEntrance, hisData);
          // this.getResult(type);
          this.getResultNew(type);
          console.log("请求直达接口失败");
        });
    },

    // 此方法已废弃
    getResult(type) {
      this.$refs.myInput.blur();
      this.$nextTick(async () => {
        // 点击搜索查询结果
        if (this.$refs.resultRef) {
          //移除曝光记录
          sessionStorage.removeItem("observertimessearchZone");
          sessionStorage.removeItem("observertimesrecommendList");
          sessionStorage.removeItem("observertimeslevelOneTab");
          sessionStorage.removeItem("observertimesenterY");
          sessionStorage.removeItem("observertimesjsright");
          sessionStorage.removeItem("observertimeshdzwp");
          sessionStorage.removeItem("observertimesywzwp");
          sessionStorage.removeItem("observertimesmoreX");
          sessionStorage.removeItem("observertimesmoreY");
          sessionStorage.removeItem("observertimesradiusTab");
          // 取消搜索骨架屏
          // this.$refs.resultRef.resultSkeletonShow = true;
          this.$refs.resultRef.nowCategoryCode = "CSRDC_ALL";
          this.$refs.resultRef.nowTemplateId = "CATEALL";
          this.$refs.resultRef.searchZoneHasData = false;
          await this.$refs.resultRef.queryTemplateMap();
          this.$refs.resultRef.activeTabMove = -1;
          this.$refs.resultRef.currentCompList = [];
          this.$refs.resultRef.searchTable = [];
          this.$refs.resultRef.tabsList = [];
          this.$refs.resultRef.allBtShow = false;
          this.$refs.resultRef.noDataShow = false;
          this.$refs.resultRef.totalPage = null;
          handleQuerySearchZone(this.searchContent, this.correctionFlag).then(
            (searchZoneResult) => {
              if (
                searchZoneResult &&
                searchZoneResult.code == "000000" &&
                searchZoneResult.data
              ) {
                console.log(
                  "搜索专区数据最终结果===>",
                  searchZoneResult.data.result
                );
                sessionStorage.setItem(
                  "searchZoneResultListSes",
                  JSON.stringify(searchZoneResult.data.result)
                );
                // this.$refs.resultRef.handleZoneResult('CSRDC_ALL', type);
              }
              this.$refs.resultRef.verticalFlag = "";
              this.$refs.resultRef.handleQueryResult("CSRDC_ALL", type);
            }
          );
          // 此处注释代码可随getResult方法一起去除
          // 此处注释方法里的handleTab-vertical6影响result组件内的数据回显(未追溯到缘由-方法已废弃可不追究)--可一并优化去除
          // if(!sessionStorage.pageEntranceIncludedPage.includes('1')){
          //   if(sessionStorage.pageEntrance == '6'){
          //     this.$refs.resultRef.verticalFlag = 'vertical6';
          //     this.$refs.resultRef.handleTab(0,'vertical6');
          //   }else if(sessionStorage.pageEntrance == '8'){
          //
          // this.$refs.resultRef.verticalFlag = '';
          // this.$refs.resultRef.handleQueryResult('CSRDC_ALL');
          // }
          // }else{
          // this.$refs.resultRef.verticalFlag = '';
          // this.$refs.resultRef.handleQueryResult('CSRDC_ALL', type);
          // }
        }
      });
    },

    // 点击搜索后 新的查询方法-并行调用各接口
    getResultNew(type) {
      // 每次查询都显示loading动画(在查询结果请求方法里关闭了)--方法挪到获取直达数据前(掩盖直达跳转500ms的timeout)
      // 不再掩盖直达跳转500ms的页面停滞
      this.$refs.loading.loadingShow();

      console.log("结果页是否还有数据===>");
      console.log(this.$refs.resultRef.tabsList);

      this.$refs.myInput.blur();

      this.$nextTick(async () => {
        // 点击搜索查询结果
        if (this.$refs.resultRef) {
          //移除曝光记录
          sessionStorage.removeItem("observertimessearchZone");
          sessionStorage.removeItem("observertimesrecommendList");
          sessionStorage.removeItem("observertimeslevelOneTab");
          sessionStorage.removeItem("observertimesenterY");
          sessionStorage.removeItem("observertimesjsright");
          sessionStorage.removeItem("observertimeshdzwp");
          sessionStorage.removeItem("observertimesywzwp");
          sessionStorage.removeItem("observertimesmoreX");
          sessionStorage.removeItem("observertimesmoreY");
          sessionStorage.removeItem("observertimesradiusTab");
          // 取消搜索骨架屏
          // this.$refs.resultRef.resultSkeletonShow = true;
          this.$refs.resultRef.nowCategoryCode = "CSRDC_ALL";
          this.$refs.resultRef.nowTemplateId = "CATEALL";
          this.$refs.resultRef.searchZoneHasData = false;
          this.$refs.resultRef.activeTabMove = -1;
          this.$refs.resultRef.currentCompList = [];
          this.$refs.resultRef.searchTable = [];
          this.$refs.resultRef.tabsList = [];
          // 控制结果页一级tab曝光标识
          this.$refs.resultRef.oneLevelTabInitFlag = false;

          // 把结果页置空后就可以开启ai开关了
          console.log("把结果页置空后就可以开启ai开关了");
          this.$refs.resultRef.showAiFlag = true;

          this.$refs.resultRef.allBtShow = false;
          this.$refs.resultRef.noDataShow = false;
          this.$refs.resultRef.totalPage = null;
          this.$refs.resultRef.verticalFlag = "";
          // 并行查询数据
          this.parallelQuery(type);
        }
      });
    },

    onClear() {
      this.searchContent = "";
      this.currentCom = "default";
      this.updateCurrentCom("default");
      this.associationData = [];
    },

    // 查询时调用接口顺序:直达数据->模板数据->专区数据->卡槽工单-查询内容
    // 调整查询方法调用为并行:直达数据->模板数据||专区数据->卡槽工单||查询内容
    parallelTemplate() {
      return this.$refs.resultRef.getTemplateData();
    },

    parallelZone() {
      const userState = this.userLoginState();
      return handleQuerySearchZone(this.searchContent, this.correctionFlag, {
        userState
      });
    },

    parallelContent(type) {
      return this.$refs.resultRef.getContentData("CSRDC_ALL", type);
    },

    parallelHotPlan() {
      return this.$refs.resultRef.getHotPlan()
    },

    parallelQuery(type) {
      Promise.all([
        this.parallelTemplate(),
        this.parallelZone(),
        this.parallelContent(type),
        this.parallelHotPlan()
      ])
        .then((results) => {
          console.log("全部执行完===>", results);
          const [templateData, zoneData, contentData] = results;
          if (templateData) {
            this.$refs.resultRef.handleTemplateData(templateData);
          }
          if (zoneData) {
            // 此处存储的会话searchZoneResultListSes信息在tooljs中已存储--待优化
            if (zoneData && zoneData.code == "000000" && zoneData.data) {
              console.log("搜索专区数据最终结果===>", zoneData.data.result);
              sessionStorage.setItem(
                "searchZoneResultListSes",
                JSON.stringify(zoneData.data.result)
              );
            }
          }
          if (contentData) {
            this.$refs.resultRef.handleContenData(contentData, "CSRDC_ALL");
          }
        })
        .catch(function (err) {
          console.log("并行查询有异常===>", err);
        });
    },
  },
};
</script>

<style scoped lang="scss">
.search-main {
  height: 100%;
  display: flex;
  flex-direction: column;

  .search-con {
    height: 76px;
    display: flex;
    padding: 5px 30px;
    align-items: center;
    font-size: 26px;

    .icon {
      width: 48px;
      height: 48px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 12px;

      img {
        width: 100%;
      }
    }

    .input-con {
      flex: 1;
      height: 60px;
      background: #ffffff;
      border-radius: 30px;
      border: 2px solid #2892ff;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 19px 0 27px;

      input {
        flex: 1;
        background: transparent;
        border: none;
      }

      .operate-con {
        display: flex;
        align-items: center;

        span {
          font-size: 32px;
          color: #b3b3b3;
          margin: 0;
        }

        img {
          width: 32px;
        }

        .line {
          width: 1px;
          height: 20px;
          background: #cccccc;
          border-radius: 1px;
          margin: 0 16px;
        }
      }
    }

    .btn-con {
      margin-left: 19px;
      font-weight: 500;
      display: flex;
      justify-content: center;
    }
  }

  .main-con {
    height: calc((100% - 96px));
    padding: 0px 30px;
    overflow-y: auto;
  }

  .main-con-new {
    height: calc((100% - 50px));
    padding: 0px 30px;
    overflow-y: auto;
  }

  .main-con-hidden {
    height: calc((100% - 96px));
    padding: 0px 30px;
    overflow: hidden;
  }
}

.mt-46 {
  margin-top: 46px;
}

.mt-0 {
  margin-top: 0px;
}

input::placeholder {
  font-size: 26px;
  font-weight: 500;
  color: #999999;
}

</style>
