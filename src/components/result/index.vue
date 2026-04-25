<template>
  <div
    :class="noDataShow || trafficPeakFallback ? 'h100 mt-30' : 'h100'"
    ref="resultRef"
  >
    <result-skeleton v-show="false"></result-skeleton>
    <traffic-peak-fallback v-if="trafficPeakFallback" ref="trafficPeakRef" />
    <div
      class="cover"
      v-if="!noDataShow && !trafficPeakFallback && tabsList && tabsList.length > 5"
    >
      <span
        class="left-cover"
        v-if="activeTab != 0 && activeTab > 2 && tabsList.length > 6"
      >
      </span>
      <span
        class="right-cover"
        v-if="tabsList.length > 6 && activeTab !== tabsList.length - 1"
      >
      </span>
    </div>
    <!-- tab曝光触点位置 -->
    <template v-if="!trafficPeakFallback">
      <div
        v-for="(item, index) in tabsList"
        :key="index"
        class="imp-attrs-tabs"
        :imp-position-id="index + 1"
        imp-type="once"
        imp-track="imp"
        :imp-attrs="item.impAttrsTabs"
        :data-value="JSON.stringify(item.impAttrsTabs)"
      ></div>
    </template>
    <!-- tab曝光触点位置 -->
    <van-tabs
      v-if="
        !noDataShow &&
        !trafficPeakFallback &&
        tabsList &&
        tabsList.length &&
        verticalFlag !== 'vertical6'
      "
      v-model="activeTab"
      :swipeable="true"
      @change="handleTab"
      @click="handleTab"
      :ellipsis="false"
    >
      <van-tab
        v-for="(tab, indexD) in tabsList"
        :key="tab.categoryCode"
        :title="tab.categoryName"
      >
        <!-- Ai大模型 -->
        <AiSearch
          v-if="tab.categoryCode == 'CSRDC_ALL' && showAiFlag"
          ref="aiSearchRef"
        >
        </AiSearch>
        <!-- 热销套卡 -->
        <HotSellingCardSet
          v-if="tab.categoryCode == 'CSRDC_ALL' && showHotMobilePlan"
          ref="hotSellingCardSetRef"
          :nowCategoryCode="nowCategoryCode"
          @refreshHotMobileNumRequest="refreshHotMobileNum" 
          :hotMobileNumData ="hotMobileNumData"
        >
        </HotSellingCardSet>
        <!-- 合大三个入驻 -->
        <ThreeCardEnter
          v-if="tab.categoryCode == 'CSRDC_ALL'"
          ref="threeCardRef"
        >
        </ThreeCardEnter>
        <no-data
          v-if="
            noDataShow_All &&
            tab.categoryCode == 'CSRDC_ALL' &&
            !searchZoneResult_All
          "
          ref="noDataRef"
        ></no-data>

        <search-zone
          v-if="
            tab.wholeTemplateId == 'CATEALL' && tab.categoryCode == 'CSRDC_ALL'
          "
          ref="searchZoneIndxRef"
          :nowCategoryCode="nowCategoryCode"
          :nowTemplateId="tab.wholeTemplateId"
        >
        </search-zone>
        <!-- 运营位 -->
        <!-- <div
          v-if="tab.categoryCode == 'CSRDC_ALL' && matchActivePhone()"
          class="mb18"
        >
          <OperatingPosition />
        </div> -->
        <div v-if="tab.categoryCode == 'CSRDC_ALL'" class="mb18">
          <OperatingPosition />
        </div>
        <component
          v-if="activeTab === indexD"
          :is="currentCom"
          :ref="currentRef"
          :searchZoneHasData.sync="searchZoneHasData"
          :categoryCode.sync="nowCategoryCode"
        ></component>
        <div
          v-if="allBtShow && !noDataShow_All && !searchZoneResult_All"
          class="bottom-line"
        >
          我是有底线的
        </div>
      </van-tab>
    </van-tabs>
    <div
      class="vertical-content"
      v-if="verticalFlag == 'vertical6' && !trafficPeakFallback"
    >
      <component
        :is="currentCom"
        :ref="currentRef"
        :searchZoneHasData.sync="searchZoneHasData"
        :categoryCode.sync="nowCategoryCode"
      ></component>
    </div>
    <!-- 加载中 -->
    <no-data
      v-if="noDataShow && !searchZoneHasData && !trafficPeakFallback"
      ref="noDataRef"
    ></no-data>
    <Loadding ref="loading" />
  </div>
</template>

<script>
import CommonApi from "@/api/index";
import {
  handleGetUrlParam,
  Debounce,
  updateHistoryData,
  isApp,
  isIOS,
  isHarmony,
  handleGdpImp,
  getLocation,
  handleQuerySearchZone,
  updateSessionStorage,
  calculateDistance,
  getQueryString,
  getQueryStringNew,
  getConWidth,
  handleCheckSdkPermission,
  getKeywordsFromSession,
  saveKeywordsToSession,
  checkoutKeywordsToSession,
  handleScreenData,
  getRefuseTime,
  isPermission,
  sendSkyNet,
  mergeSearchAndZoneData
} from "@/utils/tool";
import NoData from "@/components/NoData.vue";
import TrafficPeakFallback from "@/components/TrafficPeakFallback.vue";
import {
  isQueryIndexTrafficPeak,
  isQueryIndexTrafficPeakByError,
} from "@/utils/queryIndexResponse";
// import EnterXList from "./EnterList/EnterX.vue"; // 全部页的横向展示
import EnterYList from "./EnterList/EnterY.vue"; // 全部页展示

import IconThree from "./TemplatePage/IconThree.vue";
import Loadding from "../Loadding.vue";
import MoreYList from "./MoreList/MoreYList.vue"; // 垂直页纵向展示
import MoreXList from "./MoreList/MoreXList.vue"; // 垂直页横向展示--目前只有服务页
import SearchZone from "./TemplatePage/SearchZone.vue"; //搜索专区轮播图
import ResultSkeleton from "./ResultSkeleton.vue"; //骨架屏
import Correction from "./TemplatePage/correction";
import AiSearch from "./AiSearch";
import ThreeCardEnter from "./ThreeCardEnter";
import OperatingPosition from "./TemplatePage/OperatingPosition.vue";
import HotSellingCardSet from "./HotSellingCardSet";
import { checkHighlightNumber } from "@/utils/phoneNumberHighlight";
// import { ActivePhoneList } from "../default/HomeNewPhoneList.js"; // 全部页活动分类改版白名单

export default {
  name: "result-all",
  components: {
    // EnterXList,
    EnterYList,
    IconThree,
    NoData,
    TrafficPeakFallback,
    Loadding,
    MoreYList,
    MoreXList,
    SearchZone,
    ResultSkeleton,
    AiSearch,
    ThreeCardEnter,
    OperatingPosition,
    HotSellingCardSet
  },
  inject: [
    "getSearchContent",
    "updateSearchContent",
    "showLoading",
    "hideLoading",
    "getSearchUUID",
    "getWordType",
    "getResult",
    "updateCurrentCom",
    "getCorrectionFlag",
    "updateCorrectionFlag",
    "updateWordType",
    "updateSearchUUID",
    "userLoginState"
  ],
  computed: {
    searchContent() {
      return this.getSearchContent();
    },
  },
  watch: {
    searchContent: {
      handler(newVal, oldVal) {
        // this.paramData.params.keyWord = newVal;
        if (newVal && newVal !== oldVal) {
          // this.getData();
          // this.handleQueryResult('');
        }
      },
      immediate: true,
    },
    /**
     * 埋点-插码-上报
     * 曝光事件采集
     * 搜索结果页_全部
     */
    tabsList: {
      handler(newVal, oldVal) {
        // if (newVal && newVal.length && oldVal.length === 0) {

        if (newVal && newVal.length && !this.oneLevelTabInitFlag) {
          this.$nextTick(() => {
            this.oneLevelTabInitFlag = true;

            this.updateTabVisibility();
            // if (this.initFlag) { // 初始化的时候才进行曝光
            const elements = document.querySelectorAll(".imp-attrs-tabs");
            const elementsTab = document.querySelectorAll(".van-tab");

            // 遍历所有元素
            elementsTab.forEach((elementT, indexT) => {
              elements.forEach((elementE, indexE) => {
                // 判断当前元素是否是需要的元素
                let obj = {};
                if (elementE.dataset.value) {
                  obj = JSON.parse(elementE.dataset.value);
                }
                if (elementT.textContent == obj.WT_envName) {
                  // const attr = elementE.getAttribute("imp-attrs");
                  // if(sessionStorage.initGetLocationFlag && sessionStorage.initGetLocationFlag !== '1'){
                  //   console.log(obj,'-------------搜索结果tab-曝光事件传参----------------');
                  // if(isApp()){
                  // handleGdpImp(JSON.parse(obj));
                  // gdp("track", "imp", obj);
                  obj.XY_transaction_id = this.getSearchUUID();
                  handleGdpImp(
                    elementT,
                    obj,
                    "levelOneTab",
                    obj.WT_envName +
                      obj.XY_point_position +
                      obj.XY_point_position,
                    "搜索结果tab"
                  );
                  // }
                  // }
                }
              });
            });

            /**
             * 埋点-插码-上报
             * 点击事件采集
             * 搜索结果页_TAB标签
             */
            // console.log(JSON.stringify(newVal[0].impAttrsTabs),'-------------搜索结果tab-默认第一个全部-点击事件传参----------------');
            // console.log("-----tabposition-----"+1);
            // if(isApp()){
            //   gdp('track',"clk", {
            //     "WT_et":"clk",
            //     "WT_envName": newVal[0].categoryName,
            //     "WT_event": newVal[0].pCode,
            //     "WT_markId": newVal[0].categoryCode,
            //     "XY_point_position":1
            //   });
            // }
            // }
          });
        }
      },
      deep: true,
    },
  },
  provide() {
    return {
      getSearchTable: () => this.searchTable,
      updateActiveTab: this.updateActiveTab,
      updateCategoryCodeMore: this.updateCategoryCodeMore,
      updateCategoryCodeParentMore: this.updateCategoryCodeParentMore,
      updateTemplateIdMore: this.updateTemplateIdMore,
      getSearchTabsList: () => this.tabsList,
      getActiveTab: () => this.activeTab,
      updateSearchZoneHasData: this.updateSearchZoneHasData,
      getLocationInfo: () => this.locationInfo,
      updateRefresh: this.refreshHotMobileNum
    };
  },
  data() {
    return {
      hasLocation: true,
      allBtShow: false,
      noDataShow: false,
      trafficPeakFallback: false,
      currentCom: "", //当前组件
      currentRef: "", //当前ref
      currentCompList: [], // 当前组件
      tabsList: [], // tab切换list
      activeTab: 0,
      searchTable: [], // 接口查询结果
      templateList: [], // 模板id
      initFlag: false,
      paramData: {},
      latitude: "",
      longtitude: "",
      configList: {},
      startX: 0,
      endX: 0,
      activeTabMove: -1,
      searchTabsConcat: [], //合并处理后的数组
      categoryCodeMore: "",
      categoryCodeParentMore: "",
      templateIdMore: "",
      searchZoneResultList: [], //搜索专区结果
      searchZoneResultFlag: false, //只有搜索专区有返回，搜索结果没有
      searchZoneHasData: false, //搜索专区有值
      nowCategoryCode: "CSRDC_ALL",
      tabListCodeString: "", //当前tab的code
      noDataShow_All: false, //全部里的无数据
      searchZoneResult_All: false, //专区-全部有数据
      resultSkeletonShow: false, //骨架屏默认展示
      loaded: false,
      isIOS: isIOS,
      tabVisible: true,
      locationInfo: { latitude: "", longtitude: "" },
      verticalFlag: "", //只有垂直页标识
      zoneFlag: false,
      showAiFlag: false, // 是否显示ai区域
      oneLevelTabInitFlag: false, // 一级tab渲染曝光标识
      showHotMobilePlan: false,
      paramsPlan: {
        params: {
          keyWord: ""
        },
      },
      hotMobileNumData: [], //号卡接口数据
    };
  },
  mounted() {
    this.nowCategoryCode = "CSRDC_ALL";
    this.searchZoneHasData = false;
    updateSessionStorage("longtitude", "");
    updateSessionStorage("latitude", "");
    sessionStorage.setItem("initGetLocationFlag", "1");
    this.paramData = handleGetUrlParam();
  },
  methods: {
    // matchActivePhone() {
    //   const userInfomethods = localStorage.getItem("userInfo")
    //     ? JSON.parse(localStorage.getItem("userInfo"))
    //     : null;
    //   if (
    //     userInfo?.phoneNumber &&
    //     ActivePhoneList.indexOf(userInfo?.phoneNumber) !== -1
    //   ) {
    //     return true;
    //   } else {
    //     return false;
    //   }
    // },
    updateTabVisibility() {
      // 根据 tabsList 数组的 showFlag 更新 tabVisible 数组
      this.tabVisible = this.tabsList.every((item) => !item.showFlag);
      if (this.tabVisible) {
        this.$nextTick(() => {
          const tabsDom = document.querySelectorAll(".van-tabs__wrap");
          if (tabsDom && tabsDom.length > 0) {
            tabsDom.forEach((element, index) => {
              element.style.display = "none";
              document.querySelectorAll(
                ".van-tabs__content"
              )[0].style.marginTop = "27px";
            });
          }
        });
      }
    },
    updateSearchZoneHasData(val) {
      this.searchZoneHasData = val;
    },
    updateCategoryCodeMore(val) {
      this.categoryCodeMore = val;
    },
    updateCategoryCodeParentMore(val) {
      this.categoryCodeParentMore = val;
    },
    updateActiveTab(newVal) {
      this.activeTab = newVal;
      this.handleTab(newVal, "more");
    },
    updateTemplateIdMore(val) {
      this.templateIdMore = val;
    },
    /**
     * 切换tab方法
     * @param {*} indexD
     * @param {*} more //来源
     */
    handleTab(indexD, from) {
      console.log(indexD, from, "切换tab");
      const that = this;
      that.initFlag = false;
      that.activeTab = indexD;
      that.searchZoneHasData = false;
      let noVerCategoryCode = "";
      if (from == "vertical6") {
        that.verticalFlag = "vertical6";
        let tempList = JSON.parse(sessionStorage.templateListSes);
        tempList.forEach((item) => {
          if (
            item.verticalTemplateId &&
            item.verticalTemplateId == that.CONSTANTS.TEMPLATEPAGE.PRODMB0052
          ) {
            noVerCategoryCode = item.displayCategoryCode;
          }
        });
        that.nowCategoryCode = noVerCategoryCode;
        that.nowTemplateId = that.CONSTANTS.TEMPLATEPAGE.PRODMB0052;
      } else {
        that.verticalFlag = "";
        that.nowCategoryCode = that.tabsList[indexD].categoryCode;
      }
      console.log(that.tabsList);
      //移除曝光记录
      sessionStorage.removeItem("observertimessearchZone");
      // sessionStorage.removeItem('observertimeslevelOneTab');
      sessionStorage.removeItem("observertimesrecommendList");
      sessionStorage.removeItem("observertimesenterY");
      sessionStorage.removeItem("observertimesjsright");
      sessionStorage.removeItem("observertimeshdzwp");
      sessionStorage.removeItem("observertimesywzwp");
      sessionStorage.removeItem("observertimesmoreX");
      sessionStorage.removeItem("observertimesmoreY");
      sessionStorage.removeItem("observertimesradiusTab");
      // this.$refs.swiper.swiper.slideTo(index, 300, false)
      if (that.activeTabMove === indexD) {
        //当前tab不刷新
        return;
      } else {
        that.activeTabMove = indexD;
      }
      let tab = {};
      that.tabsList.forEach((item, index) => {
        if (indexD == index) {
          tab = item;
        }
      });
      that.currentCompList = [];
      let tabIndex = null;
      tabIndex = indexD + 1;
      // that.activeTab = index;
      if (tab.categoryCode == "CSRDC_ALL") {
        // that.currentCompList = [];
        that.searchTable = [];
        // that.tabsList = [];
        that.currentCom = "";
        that.currentRef = "";
        that.allBtShow = false;
        that.showLoading();
        that.handleQueryResult("CSRDC_ALL");
        // 这里不能修改为统一使用新的方法
        // 新方法使用的return new promise方法
        // that.getContentData("CSRDC_ALL", "");
      } else if (
        tab.verticalTemplateId == that.CONSTANTS.TEMPLATEPAGE.SERV001
      ) {
        that.allBtShow = false;
        // that.currentCompList = [{ path: 'MoreXList', refD: 'MoreXListRef' }];
        that.currentCom = "MoreXList";
        that.currentRef = "MoreXListRef";
        that.$nextTick(() => {
          that.$refs.MoreXListRef[0].moreArrDataList = [];
          that.$refs.MoreXListRef[0].pagePage = 1;
          that.$refs.MoreXListRef[0].totalPage = null;
          if (from == "more") {
            that.$refs.MoreXListRef[0].handleQueryResult(
              that.categoryCodeMore,
              that.templateIdMore
            );
          } else {
            that.$refs.MoreXListRef[0].handleQueryResult(
              tab.categoryCode,
              tab.verticalTemplateId
            );
          }
        });
      } else {
        that.allBtShow = false;
        // that.currentCompList = [{ path: 'MoreYList', refD: 'MoreYListRef' }];
        that.currentCom = "MoreYList";
        that.currentRef = "MoreYListRef";
        that.$nextTick(() => {
          if (from == "vertical6") {
            that.$refs.MoreYListRef.moreArrList = [];
            that.$refs.MoreYListRef.moreArrDataList = [];
            that.$refs.MoreYListRef.pagePage = 1;
            that.$refs.MoreYListRef.sortField = "";
            that.$refs.MoreYListRef.totalPage = null;
            // that.$refs.MoreYListRef.paramData.maxPrice = null;
            // that.$refs.MoreYListRef.paramData.minPrice = null;
            that.$refs.MoreYListRef.paramData = handleGetUrlParam();
            that.$refs.MoreYListRef.handleQueryResult(
              noVerCategoryCode,
              noVerCategoryCode,
              that.CONSTANTS.TEMPLATEPAGE.PRODMB0052,
              "1"
            );
            that.resultSkeletonShow = false;
          } else {
            that.$refs.MoreYListRef[0].moreArrList = [];
            that.$refs.MoreYListRef[0].moreArrDataList = [];
            that.$refs.MoreYListRef[0].pagePage = 1;
            that.$refs.MoreYListRef[0].sortField = "";
            that.$refs.MoreYListRef[0].totalPage = null;
            // that.$refs.MoreYListRef[0].paramData.maxPrice = null;
            // that.$refs.MoreYListRef[0].paramData.minPrice = null;
            that.$refs.MoreYListRef[0].paramData = handleGetUrlParam();
            if (from == "more") {
              that.$refs.MoreYListRef[0].handleQueryResult(
                that.categoryCodeMore,
                that.categoryCodeParentMore,
                that.templateIdMore
              );
            } else {
              // 如果有下级分类的话==首位参数传下级subList首位分类
              if (tab.subList && tab.subList.length > 0) {
                that.$refs.MoreYListRef[0].handleQueryResult(
                  tab.subList[0].categoryCode,
                  tab.categoryCode,
                  tab.subList[0].verticalTemplateId,
                  "1"
                );
              } else {
                that.$refs.MoreYListRef[0].handleQueryResult(
                  tab.categoryCode,
                  tab.categoryCode,
                  tab.verticalTemplateId,
                  "1"
                );
              }
            }
          }
        });
      }
      console.log(
        JSON.stringify(tab.impAttrsTabs),
        "-------------搜索结果tab-点击事件传参----------------"
      );
      console.log("-----tabposition-----" + tabIndex);
      handleScreenData(that.nowCategoryCode, "");

      /**
       * 埋点-插码-上报
       * 点击事件采集
       * 搜索结果页_TAB标签
       */

      const clickGdpObj = {
        XY_transaction_id: that.getSearchUUID(),
        WT_et: "clk",
        WT_envName: tab.categoryName,
        WT_event: tab.pCode,
        WT_markId: tab.categoryCode,
        XY_point_position: tabIndex,
        WT_plat: sessionStorage.pagePlat || "",
        WT_es: sessionStorage.pageUrl || "",
        WT_ti: "搜索结果页",
        XY_pageEntry: sessionStorage.pageEntrance || "",
        // 插码方案修改2025-1-16
        WT_area_type_1: "楼层",
        areaid: "", // 父物品id信息（无父物品传空）
        WT_area_type_2: tab.categoryName,
        WT_area_name: tab.categoryName, // 若没有二级分类，此名称则记录为一级分类名称
        XY_env_type: "icon",
        WT_event: "P00000050500", // 一级tab传P00000050500  二级tab传P00000050507
        XY_gd_source: "搜索平台",
        XY_scene: this.getSearchContent() || "", // 搜索内容
        WT_si_n: "", // 物品对应的名称
        WT_goods_id: "", // 物品所对应的id信息
        XY_visit_source: sessionStorage.pageEntrance || "", // 访问来源
      };
      console.log("点击查询结果页-一级tab-上报===>");
      console.log(clickGdpObj);

      if (isApp()) {
        gdp("track", "clk", clickGdpObj);
      }

      /**
       * 埋点-插码-上报
       * 曝光事件采集-曝光当前tab//点击当前tab不用曝光了
       * 搜索结果页_全部
       */
      // const elements = document.querySelectorAll('.imp-attrs-tabs');
      // // 遍历所有元素
      // elements.forEach((elementE, indexE) => {
      //   // 判断当前元素是否是需要的元素
      //   if(indexD == indexE){
      //     const obj = elementE.dataset.value;
      //     // const attr = elementE.getAttribute("imp-attrs");
      //     console.log(obj,'-------------搜索结果tab-曝光事件传参----------------');
      //     if(isApp()){
      //       handleGdpImp(JSON.parse(obj));
      //     }
      //   }
      // });
    },

    // 此方法已不再调用
    async queryTemplateMap() {
      this.tabsList = [];
      const userInfo = localStorage.getItem("userInfo")
        ? JSON.parse(localStorage.getItem("userInfo"))
        : null;
      // 从会话中获取页面入口信息
      // let pageEntrance = getQueryStringNew().pageEntrance;
      let pageEntrance = sessionStorage.getItem("pageEntrance");

      const parmas = {
        provCode: userInfo?.province || "",
        loginProvince: userInfo?.loginProvince || "",
        entryPage: pageEntrance || "",
      };
      await CommonApi.queryTemplateMap(parmas)
        .then((res) => {
          if (res.code == "000000") {
            this.activeTab = 0;
            this.templateList = res.data;
            sessionStorage.setItem(
              "templateListSes",
              JSON.stringify(this.templateList)
            );
            this.initFlag = true;
            this.paramData.params.keyWord = this.searchContent;
            let latitude = sessionStorage.getItem("latitude");
            console.log("latitude===>", latitude);
            // handleQuerySearchZone(this.searchContent).then((searchZoneResult)=>{
            //   if(searchZoneResult && searchZoneResult.code == '000000'){
            //     sessionStorage.setItem("searchZoneResultListSes",JSON.stringify(searchZoneResult.data.result));
            //   }
            // if(this.loaded){
            // this.showLoading;
            //   this.handleQueryResult('CSRDC_ALL');
            // } else {
            //   this.handleQueryResult('CSRDC_ALL');
            // }
            // })
          } else {
            this.resultSkeletonShow = false;
            console.log("queryTemplateMap请求接口失败");
            this.noDataShow = true;
            this.$nextTick(() => {
              //为您推荐专区查询
              setTimeout(() => {
                this.$refs.noDataRef?.$refs.recommendRef?.handleQueryResult();
              }, 500);
            });
          }
        })
        .catch((err) => {
          this.resultSkeletonShow = false;
          console.log("queryTemplateMap请求接口失败");
          this.noDataShow = true;
          this.$nextTick(() => {
            //为您推荐专区查询
            setTimeout(() => {
              this.$refs.noDataRef?.$refs.recommendRef?.handleQueryResult();
            }, 500);
          });
        });
    },

    // 模板数据请求--并行调用
    getTemplateData() {
      this.tabsList = [];
      const userInfo = localStorage.getItem("userInfo")
        ? JSON.parse(localStorage.getItem("userInfo"))
        : null;
      // 从会话中获取页面入口信息
      // let pageEntrance = getQueryStringNew().pageEntrance;
      let pageEntrance = sessionStorage.getItem("pageEntrance");

      const parmas = {
        provCode: userInfo?.province || "",
        loginProvince: userInfo?.loginProvince || "",
        entryPage: pageEntrance || "",
      };
      return new Promise((resolve, reject) => {
        CommonApi.queryTemplateMap(parmas)
          .then((res) => {
            resolve(res);
          })
          .catch((err) => {
            this.resultSkeletonShow = false;
            console.log("queryTemplateMap请求接口失败");
            this.noDataShow = true;
            this.$nextTick(() => {
              // 为您推荐专区查询
              setTimeout(() => {
                this.$refs.noDataRef?.$refs.recommendRef?.handleQueryResult();
              }, 500);
            });
            reject(err);
          });
      });
    },

    // 处理模板数据--并行调用
    handleTemplateData(res) {
      if (res.code == "000000") {
        this.activeTab = 0;
        this.templateList = res.data;
        sessionStorage.setItem(
          "templateListSes",
          JSON.stringify(this.templateList)
        );
        this.initFlag = true;
        this.paramData.params.keyWord = this.searchContent;

        // 此处经纬度信息无使用-可优化
        let latitude = sessionStorage.getItem("latitude");
        console.log("latitude===>", latitude);
        // handleQuerySearchZone(this.searchContent).then((searchZoneResult)=>{
        //   if(searchZoneResult && searchZoneResult.code == '000000'){
        //     sessionStorage.setItem("searchZoneResultListSes",JSON.stringify(searchZoneResult.data.result));
        //   }
        // if(this.loaded){
        // this.showLoading;
        //   this.handleQueryResult('CSRDC_ALL');
        // } else {
        //   this.handleQueryResult('CSRDC_ALL');
        // }
        // })
      } else {
        this.resultSkeletonShow = false;
        console.log("queryTemplateMap请求接口失败");
        this.noDataShow = true;
        this.$nextTick(() => {
          //为您推荐专区查询
          setTimeout(() => {
            this.$refs.noDataRef?.$refs.recommendRef?.handleQueryResult();
          }, 500);
        });
      }
    },

    /**
     * 重新搜索
     * @param {搜索词} keyWord
     */
    handleResearch(keyWord) {
      return async () => {
        this.updateCorrectionFlag(false);
        await this.updateSearchContent(keyWord);
        let hisData = {
          markName: keyWord,
          actionUrl: "",
          actionType: "",
        };
        updateHistoryData(sessionStorage.pageEntrance, hisData);
        this.updateCurrentCom("result");
        this.getResult(true);
      };
    },

    // 此方法无调用
    handleZoneResult: Debounce(function (categoryCodeIn, type) {
      const that = this;
      that.searchZoneResultFlag =
        sessionStorage.searchZoneResultListSes &&
        JSON.parse(sessionStorage.searchZoneResultListSes).length;
      this.zoneFlag = true;
      if (that.searchZoneResultFlag) {
        that.allBtShow = true;
        this.noDataShow = false;
        that.noDataShow_All = false;
        that.searchZoneResult_All = false;
        //垂直页的时候不需要展示全部--从config接口里拿到includePage用
        if (!sessionStorage.pageEntranceIncludedPage.includes("1")) {
          // that.tabsList.unshift({ categoryCode: 'CSRDC_ALL', categoryName: '全部', pCode:'P00000050500', templateId:that.CONSTANTS.TEMPLATEPAGE.CATEALL, showFlag:false });
        } else {
          that.tabsList.unshift({
            categoryCode: "CSRDC_ALL",
            categoryName: "全部",
            pCode: "P00000050500",
            wholeTemplateId: that.CONSTANTS.TEMPLATEPAGE.CATEALL,
            showFlag: true,
          });
        }
        //组装触点曝光所需impAttrs参数
        that.tabsList.forEach((itemTab, indexTab) => {
          const impAttrs = {};
          impAttrs.XY_transaction_id = that.getSearchUUID();
          impAttrs.WT_et = "imp";
          impAttrs.WT_event = itemTab.pCode;
          impAttrs.WT_envName = itemTab.categoryName;
          impAttrs.XY_point_position = indexTab + 1;
          impAttrs.WT_markId = itemTab.categoryCode;
          impAttrs.WT_plat = sessionStorage.pagePlat || "";
          impAttrs.WT_es = sessionStorage.pageUrl || "";
          impAttrs.WT_ti = "搜索结果页";
          impAttrs.XY_pageEntry = sessionStorage.pageEntrance || ""; //新增页面入口
          itemTab.impAttrsTabs = impAttrs;
          that.tabListCodeString += itemTab.categoryCode + ",";
        });
        that.searchZoneResultList = JSON.parse(
          sessionStorage.searchZoneResultListSes
        );
        that.tabsList = that.tabsList
          .concat(that.searchZoneResultList)
          .reduce((acc, cur) => {
            if (!acc.find((item) => item.categoryCode === cur.categoryCode)) {
              acc.push(cur);
            }
            return acc;
          }, []);
        that.searchZoneResultList.forEach((szItem, szIndex) => {
          that.tabsList.forEach((tbItem, tbIndex) => {
            if (szItem.categoryCode == tbItem.categoryCode) {
              tbItem.dispOrd = szItem.dispOrd;
              if (tbItem.subList && tbItem.subList.length > 0) {
                //有二级类目的比如商品，生活，数据在sublist里
                var mergedProdArr = tbItem.subList
                  .concat(szItem.subList)
                  .reduce((acc, cur) => {
                    if (
                      !acc.find(
                        (item) => item.categoryCode === cur.categoryCode
                      )
                    ) {
                      acc.push(cur);
                    }
                    return acc;
                  }, []);
                szItem.subList.forEach((szSubItem, szSubIndex) => {
                  mergedProdArr.forEach((tbSubItem, tbSubIndex) => {
                    if (szSubItem.categoryCode == tbSubItem.categoryCode) {
                      tbSubItem.searchZoneData = szSubItem.searchZoneDataPre;
                      if (
                        tbSubItem.searchZoneData &&
                        tbSubItem.searchZoneData.length > 0
                      ) {
                        tbSubItem.subTitleFlag = tbSubItem.searchZoneData.every(
                          (item) => !item.subTitle
                        );
                        tbSubItem.eightFlag = tbSubItem.searchZoneData.some(
                          (item) => item.pCode == "P00000057388"
                        );
                      }
                      tbSubItem.searchZoneData.forEach(
                        (tbSzItem, tbSzIndex) => {
                          tbSzItem.categoryName = szItem.categoryName;
                          if (
                            tbSzItem.pCode == "P00000057388" &&
                            szItem.subList.length == 1
                          ) {
                            // 只有一个小图的场景 位置4，pCode=P00000057388
                            // 默认小图片判断 defaultUrl 待提供
                            tbSzItem.defaultUrl = require("../../assets/images/img2.png");
                          } else {
                            // 默认大图片判断 defaultUrl 待提供
                            tbSzItem.defaultUrl = require("../../assets/images/img3.png");
                          }
                          if (
                            tbSzItem.iconUrl &&
                            tbSzItem.iconUrl.replace(" ", "").split(":")[1] &&
                            tbSzItem.iconUrl
                              .replace(" ", "")
                              .split(":")[1]
                              .indexOf("10.4.160.6") != -1
                          ) {
                            tbSzItem.iconUrl = tbSzItem.defaultUrl;
                          }
                          if (
                            tbSzItem.iconUrl &&
                            tbSzItem.iconUrl.replace(" ", "").split(":")[1] &&
                            tbSzItem.iconUrl
                              .replace(" ", "")
                              .split(":")[1]
                              .indexOf("172.22.225.71") != -1
                          ) {
                            tbSzItem.iconUrl = tbSzItem.defaultUrl;
                          }
                          // }
                          const impAttrs = {};
                          impAttrs.WT_et = "imp";
                          impAttrs.WT_event = tbSzItem.pCode;
                          impAttrs.WT_envName = tbSzItem.title;
                          impAttrs.XY_first_class =
                            sessionStorage.pageEntrance == "6"
                              ? "权益"
                              : sessionStorage.pageEntrance == "8"
                                ? "商城"
                                : szItem.categoryName;
                          // impAttrs.XY_point_position = 1;
                          impAttrs.WT_markId = tbSzItem._id;
                          impAttrs.WT_next_url = tbSzItem.linkAdress;
                          impAttrs.WT_plat = sessionStorage.pagePlat || "";
                          impAttrs.WT_es = sessionStorage.pageUrl || "";
                          impAttrs.WT_ti = "搜索结果页";
                          impAttrs.XY_pageEntry =
                            sessionStorage.pageEntrance || ""; //新增页面入口
                          // 二级tab曝光插码方案修改2025-1-16
                          impAttrs.WT_area_type_1 = "楼层";
                          impAttrs.areaid = ""; // 父物品id信息（无父物品传空）
                          impAttrs.WT_area_type_2 = tbSzItem.title;
                          impAttrs.WT_area_name = itemTab.categoryName; // 若没有二级分类，此名称则记录为一级分类名称
                          impAttrs.XY_env_type = "icon";
                          impAttrs.XY_gd_source = "搜索平台";
                          impAttrs.XY_scene = this.getSearchContent() || ""; // 搜索内容
                          impAttrs.WT_si_n = itemTab.categoryName; // 物品对应的名称
                          impAttrs.WT_goods_id = ""; // 物品所对应的id信息
                          impAttrs.XY_visit_source =
                            sessionStorage.pageEntrance || ""; // 访问来源

                          itemTab.impAttrsTabs = impAttrs;
                          that.tabListCodeString += itemTab.categoryCode + ",";
                          tbSzItem.impAttrsList = impAttrs;
                        }
                      );
                    }
                  });
                  tbItem.subList = mergedProdArr;
                });
              } else {
                if (tbItem.categoryCode !== "CSRDC_ALL") {
                  let index = that.templateList
                    ? that.templateList.findIndex(
                      (e) => e.displayCategoryCode === tbItem.categoryCode
                    )
                    : [];
                  tbItem.wholeTemplateId =
                    index !== -1
                      ? that.templateList[index].wholeTemplateId
                      : "";
                }
                tbItem.dispOrd = szItem.dispOrd;
                tbItem.searchZoneData = szItem.searchZoneDataPre;
                if (tbItem.searchZoneData && tbItem.searchZoneData.length > 0) {
                  tbItem.subTitleFlag = tbItem.searchZoneData.every(
                    (item) => !item.subTitle
                  );
                  tbItem.eightFlag = tbItem.searchZoneData.some(
                    (item) => item.pCode == "P00000057388"
                  );
                }
                tbItem.searchZoneData.forEach((szDataItem, szDataIndex) => {
                  if (
                    szDataItem.pCode == "P00000057388" &&
                    szItem.searchZoneDataPre.length == 1
                  ) {
                    //只有一个小图的场景 位置4，pCode=P00000057388
                    //默认小图片判断 defaultUrl 待提供
                    szDataItem.defaultUrl = require("../../assets/images/img2.png");
                  } else {
                    //默认大图片判断 defaultUrl 待提供
                    szDataItem.defaultUrl = require("../../assets/images/img3.png");
                  }
                  if (
                    szDataItem.iconUrl &&
                    szDataItem.iconUrl.replace(" ", "").split(":")[1] &&
                    szDataItem.iconUrl
                      .replace(" ", "")
                      .split(":")[1]
                      .indexOf("10.4.160.6") != -1
                  ) {
                    szDataItem.iconUrl = szDataItem.defaultUrl;
                  }
                  if (
                    szDataItem.iconUrl &&
                    szDataItem.iconUrl.replace(" ", "").split(":")[1] &&
                    szDataItem.iconUrl
                      .replace(" ", "")
                      .split(":")[1]
                      .indexOf("172.22.225.71") != -1
                  ) {
                    szDataItem.iconUrl = szDataItem.defaultUrl;
                  }
                  // }
                  const impAttrs = {};
                  // impAttrs.position_id = 1;
                  impAttrs.XY_transaction_id = that.getSearchUUID();
                  // impAttrs.type = "once";
                  impAttrs.WT_et = "imp";
                  impAttrs.WT_event = szDataItem.pCode;
                  impAttrs.WT_envName = szDataItem.title;
                  impAttrs.XY_first_class =
                    sessionStorage.pageEntrance == "6"
                      ? "权益"
                      : sessionStorage.pageEntrance == "8"
                        ? "商城"
                        : szItem.categoryName;
                  // impAttrs.XY_point_position = 1;
                  impAttrs.WT_markId = szDataItem._id;
                  impAttrs.WT_next_url = szDataItem.linkAdress;
                  impAttrs.WT_plat = sessionStorage.pagePlat || "";
                  impAttrs.WT_es = sessionStorage.pageUrl || "";
                  impAttrs.WT_ti = "搜索结果页";
                  impAttrs.XY_pageEntry = sessionStorage.pageEntrance || ""; //新增页面入口
                  szDataItem.impAttrsList = impAttrs;
                });
              }
            }
          });
        });
        // 专区统一给tabs触点赋值+templateId赋值
        that.tabsList.forEach((itemTabsList, indexTabsList) => {
          if (
            itemTabsList.pCode == "" ||
            itemTabsList.pCode == undefined ||
            itemTabsList.pCode == null
          ) {
            itemTabsList.pCode = "P00000050500"; //插入pcode
            // itemP.parentCategoryName = item.categoryName;
            //组装触点曝光所需impAttrs参数
            const impAttrs = {};
            // impAttrs.position_id = indexTab+1;
            impAttrs.XY_transaction_id = that.getSearchUUID();
            // impAttrs.type = "once";
            impAttrs.WT_et = "imp";
            impAttrs.WT_event = itemTabsList.pCode;
            impAttrs.WT_envName = itemTabsList.categoryName;
            impAttrs.XY_point_position = indexTabsList + 1;
            impAttrs.WT_markId = itemTabsList.categoryCode;
            impAttrs.WT_plat = sessionStorage.pagePlat || "";
            impAttrs.WT_es = sessionStorage.pageUrl || "";
            impAttrs.WT_ti = "搜索结果页";
            impAttrs.XY_pageEntry = sessionStorage.pageEntrance || ""; //新增页面入口
            itemTabsList.impAttrsTabs = impAttrs;
            that.tabListCodeString += itemTabsList.categoryCode + ",";
          }
          that.templateList &&
            that.templateList.forEach((itemD, indexD) => {
              if (itemTabsList.categoryCode == itemD.displayCategoryCode) {
                //区分全部/垂直templateId
                itemTabsList.wholeTemplateId = itemD.wholeTemplateId;
                itemTabsList.verticalTemplateId = itemD.verticalTemplateId;
                itemTabsList.wholeDefaultPic = itemD.wholeDefaultPic;
                itemTabsList.verticalDefaultPic = itemD.verticalDefaultPic;
                itemTabsList.wholeTemplateFieldList =
                  itemD.wholeTemplateFieldList;
                itemTabsList.verticalTemplateFieldList =
                  itemD.verticalTemplateFieldList;
                if (itemTabsList.subList && itemTabsList.subList.length > 0) {
                  itemTabsList.subList.forEach((itemDe) => {
                    that.templateList &&
                      that.templateList.forEach((itemF, indexF) => {
                        if (itemDe.categoryCode == itemF.displayCategoryCode) {
                          itemDe.wholeTemplateId = itemF.wholeTemplateId;
                          itemDe.verticalTemplateId = itemF.verticalTemplateId;
                          itemDe.wholeDefaultPic = itemF.wholeDefaultPic;
                          itemDe.verticalDefaultPic = itemF.verticalDefaultPic;
                          itemDe.wholeTemplateFieldList =
                            itemF.wholeTemplateFieldList;
                          itemDe.verticalTemplateFieldList =
                            itemF.verticalTemplateFieldList;
                        }
                      });
                  });
                }
              }
            });
        });
        // that.tabsList = that.tabsList.sort((a, b) => a.dispOrd - b.dispOrd); //按搜索专区给的dispOrd 从-1到大排序
        that.tabsList.forEach((tab) => {
          if (tab.subList && tab.subList.length > 0) {
            // tab.subList.sort((a, b) => a.dispOrd - b.dispOrd);
          }
        });
      }
    }),

    // 此方法不能废弃
    // 将handleQueryResult的逻辑拆分
    // 获取数据getContentData
    // 格式化数据handleContenData  暴露给searchmain外部调用
    // 内部tab页切换至全部页  还需调用此方法
    handleQueryResult: Debounce(function (categoryCodeIn, type) {
      // 搜索请求来源
      let search_source_type = type === "1" ? type : "2";
      console.log("搜索请求来源===>", type, search_source_type);
      console.log("搜索categoryCodeIn===>", categoryCodeIn);
      this.loaded = true;
      const that = this;
      that.trafficPeakFallback = false;
      that.paramData = handleGetUrlParam();
      // 代码格式修改
      // (that.paramData.categoryCode =
      //   categoryCodeIn == "CSRDC_ALL" ? "" : categoryCodeIn),
      //   (that.paramData.params.keyWord = that.searchContent);
      that.paramData.categoryCode =
        categoryCodeIn == "CSRDC_ALL" ? "" : categoryCodeIn;
      that.paramData.params.keyWord = that.searchContent;
      // 代码编写
      that.paramData.sortField = "";
      that.paramData.searchSourceType = search_source_type;
      that.latitude = sessionStorage.latitude || "";
      that.longtitude = sessionStorage.longtitude || "";
      if (that.latitude && that.latitude == "0.000000") {
        that.latitude = "";
      }
      if (that.longtitude && that.longtitude == "0.000000") {
        that.longtitude = "";
      }
      console.log("that.longtitude===>", that.longtitude);
      console.log("that.latitude===>", that.latitude);
      that.paramData.location =
        that.latitude && that.longtitude
          ? `${that.latitude},${that.longtitude}`
          : "";
      let iopResultRes =
        checkoutKeywordsToSession(that.searchContent) != "999999"
          ? checkoutKeywordsToSession(that.searchContent)
          : null;
      that.paramData.iopResult = iopResultRes;
      const userInfo = localStorage.getItem("userInfo")
        ? JSON.parse(localStorage.getItem("userInfo"))
        : null;
      that.paramData.cityCode = userInfo?.city;
      const xList = [];
      const yList = [];
      // that.tabsList = [];
      that.configList = sessionStorage.configListSes
        ? JSON.parse(sessionStorage.configListSes)
        : {};
      that.paramData.tranId = that.getSearchUUID();
      that.paramData.wordType = that.getWordType();
      that.paramData.correctionFlag = that.getCorrectionFlag();
      that.paramData.userState = that.userLoginState();
      that.paramData.birthday = userInfo?.birthday || "";
      console.log("搜索结果传参===>");
      console.log(that.paramData);

      CommonApi.queryResult(that.paramData)
        .then(async (res) => {
          that.tabsList = [];
          that.noDataShow = false;
          that.resultSkeletonShow = false;
          that.hideLoading();
          if (isQueryIndexTrafficPeak(res)) {
            that.trafficPeakFallback = true;
            that.noDataShow_All = false;
            that.searchZoneResult_All = false;
            that.allBtShow = false;
            that.$nextTick(() => {
              setTimeout(() => {
                that.$refs.trafficPeakRef?.$refs.recommendRef?.handleQueryResult();
              }, 500);
            });
            return;
          }
          that.trafficPeakFallback = false;
          this.$isDistinct = !res.data?.distinct;
          if (res.code == "000000") {
            // 纠错词回显相关逻辑
            const correctionMap = res.data?.correctionMap;
            // 原型方法最好换个地方
            if (!String.prototype.replaceAll) {
              String.prototype.replaceAll = function (search, replacement) {
                var target = this;
                return target.replace(new RegExp(search, "g"), replacement);
              };
            }
            const correctionWord =
              correctionMap[that.searchContent.replaceAll(" ", "")];
            if (correctionWord) {
              const correction = new Correction(
                that.searchContent,
                correctionWord,
                that.handleResearch(that.searchContent)
              );
              correction.mount(that.$refs.resultRef);
            }

            that.noDataShow_All = false;
            that.searchZoneResult_All = false;
            if (res.data && res.data.result && res.data.result.length > 0) {
              that.searchTable = res.data.result;
            }
            that.searchZoneResultFlag =
              sessionStorage.searchZoneResultListSes &&
              JSON.parse(sessionStorage.searchZoneResultListSes).length;
            console.log(
              "searchZoneResultFlag===>几个tab页",
              that.searchZoneResultFlag
            );
            console.log("searchTable==返回的index数据", that.searchTable);

            if (
              (res.data && res.data.result && res.data.result.length > 0) ||
              that.searchZoneResultFlag
            ) {
              that.allBtShow = true;
              console.log("存储的templateListSes==>");
              console.log(that.templateList);

              that.searchTable.forEach((item, index) => {
                // 初步组装匹配数据
                that.templateList &&
                  that.templateList.forEach((itemD, indexD) => {
                    if (item.categoryCode == itemD.displayCategoryCode) {
                      // 区分全部/垂直templateId
                      item.wholeTemplateId = itemD.wholeTemplateId;
                      item.verticalTemplateId = itemD.verticalTemplateId;
                      item.wholeDefaultPic = itemD.wholeDefaultPic;
                      item.verticalDefaultPic = itemD.verticalDefaultPic;
                      item.wholeTemplateFieldList =
                        itemD.wholeTemplateFieldList;
                      item.verticalTemplateFieldList =
                        itemD.verticalTemplateFieldList;
                    }
                  });

                console.log("组装完成====>");
                console.log(item);

                if (
                  item.wholeTemplateId == that.CONSTANTS.TEMPLATEPAGE.SERV001
                ) {
                  // 分流-服务
                  console.log("开始处理全部页服务栏目下===曝光所需要配置信息");

                  item.data.forEach((itemP, indexP) => {
                    itemP.pCode = "P00000050508"; //插入pcode
                    // itemP.parentCategoryName = item.categoryName;
                    // 组装触点曝光所需impAttrs参数
                    const impAttrs = {};

                    // impAttrs.position_id = indexU+1;
                    // impAttrs.type = "once";
                    impAttrs.WT_et = "imp";
                    impAttrs.WT_event = itemP.pCode;
                    impAttrs.WT_envName = itemP.title;
                    // impAttrs.XY_point_position = indexTab+1;
                    impAttrs.WT_markId = itemP._id;
                    impAttrs.XY_first_class = "搜索结果页_全部";
                    impAttrs.XY_second_class = itemP.dispCategoryName;
                    impAttrs.WT_next_url = itemP.linkAdress;
                    impAttrs.WT_plat = sessionStorage.pagePlat || "";
                    impAttrs.WT_es = sessionStorage.pageUrl || "";
                    impAttrs.WT_ti = "搜索结果页";
                    impAttrs.XY_pageEntry = sessionStorage.pageEntrance || ""; //新增页面入口

                    // 插码方案修改2025-1-16
                    impAttrs.XY_second_class = itemP.dispCategoryName;
                    impAttrs.WT_area_type_1 = "楼层";
                    impAttrs.areaid = ""; // 父物品id信息（无父物品传空）
                    impAttrs.WT_area_type_2 = itemP.dispCategoryName;
                    impAttrs.WT_area_name = itemP.dispCategoryName; // 若没有二级分类，此名称则记录为一级分类名称
                    impAttrs.XY_env_type = "icon";
                    impAttrs.XY_gd_source = "搜索平台";
                    impAttrs.XY_scene = this.getSearchContent() || ""; // 搜索内容
                    impAttrs.WT_si_n = itemP.title; // 物品对应的名称
                    impAttrs.WT_goods_id = itemP.itemId; // 物品所对应的id信息
                    impAttrs.XY_visit_source =
                      sessionStorage.pageEntrance || ""; // 访问来源
                    // impAttrs.XY_transaction_id = that.getSearchUUID(); // 这里没有设置XY_transaction_id 是在上报传参时统一设置了

                    itemP.impAttrsList = impAttrs;

                    // 图片判断
                    if (
                      itemP.iconUrl &&
                      itemP.iconUrl
                        .replace(" ", "")
                        .split(":")[0]
                        .indexOf("https") == -1
                    ) {
                      // itemP.iconUrl = item.wholeDefaultPic;
                    }
                  });
                  xList.push(item);
                }
                console.log("服务数据是横向展示===>");
                console.log(xList);

                if (
                  item.subList &&
                  item.subList.length == 0 &&
                  item.wholeTemplateId !== that.CONSTANTS.TEMPLATEPAGE.SERV001
                ) {
                  // 不是服务也不含有二级分类
                  item.data &&
                    item.data.forEach((itemU, indexU) => {
                      itemU.pCode = "P00000050508"; //插入pcode
                      // itemU.parentCategoryName = item.categoryName;
                      //组装触点曝光所需impAttrs参数
                      const impAttrs = {};
                      // impAttrs.position_id = indexU+1;
                      // impAttrs.type = "once";
                      impAttrs.WT_et = "imp";
                      impAttrs.WT_event = itemU.pCode;
                      impAttrs.WT_envName = itemU.title;
                      // impAttrs.XY_point_position = indexTab+1;
                      impAttrs.WT_markId = itemU._id;
                      impAttrs.XY_first_class = "搜索结果页_全部";
                      impAttrs.XY_second_class = itemU.dispCategoryName;
                      impAttrs.WT_next_url = itemU.linkAdress;
                      impAttrs.WT_plat = sessionStorage.pagePlat || "";
                      impAttrs.WT_es = sessionStorage.pageUrl || "";
                      impAttrs.WT_ti = "搜索结果页";
                      impAttrs.XY_pageEntry = sessionStorage.pageEntrance || ""; //新增页面入口

                      // 插码方案修改2025-1-16
                      impAttrs.XY_second_class = itemU.dispCategoryName;
                      impAttrs.WT_area_type_1 = "楼层";
                      impAttrs.areaid = ""; // 父物品id信息（无父物品传空）
                      impAttrs.WT_area_type_2 = itemU.dispCategoryName;
                      impAttrs.WT_area_name = itemU.dispCategoryName; // 若没有二级分类，此名称则记录为一级分类名称
                      impAttrs.XY_env_type = "icon";
                      impAttrs.XY_gd_source = "搜索平台";
                      impAttrs.XY_scene = this.getSearchContent() || ""; // 搜索内容
                      impAttrs.WT_si_n = itemU.title; // 物品对应的名称
                      impAttrs.WT_goods_id = itemU.itemId; // 物品所对应的id信息
                      impAttrs.XY_visit_source =
                        sessionStorage.pageEntrance || ""; // 访问来源
                      // impAttrs.XY_transaction_id = that.getSearchUUID(); // 这里没有设置XY_transaction_id 是在上报传参时统一设置了

                      itemU.impAttrsList = impAttrs;

                      // that.configList.UNIFY_SEARCH_CORNERMARK_URL
                      // 会话存储configListSec中的tips小图片链接数组
                      // hot 限时优惠 秒杀
                      if (that.configList.UNIFY_SEARCH_CORNERMARK_URL) {
                        let cornerMarkUrlArr = [];
                        that.configList.UNIFY_SEARCH_CORNERMARK_URL.forEach(
                          (itemY, indexY) => {
                            let cornerMarkArr = [];
                            if (itemU.cornerMark) {
                              if (itemU.cornerMark instanceof Array) {
                                cornerMarkArr = itemU.cornerMark;
                              } else {
                                cornerMarkArr = itemU.cornerMark.split(",");
                              }
                            }
                            if (cornerMarkArr && cornerMarkArr.length > 0) {
                              cornerMarkArr.sort((a, b) => a - b);
                              cornerMarkArr.forEach((itemO) => {
                                if (itemO == itemY.code) {
                                  cornerMarkUrlArr.push(itemY.name);
                                  itemU.cornerMarkUrlArray = cornerMarkUrlArr;
                                }
                              });
                            }
                          }
                        );
                      }

                      if (
                        itemU.cornerMarkUrlArray &&
                        itemU.cornerMarkUrlArray.length > 0
                      ) {
                        itemU.cornerMarkUrl = itemU.cornerMarkUrlArray[0];
                      }

                      if (that.configList.UNIFY_SEARCH_BUY_WAY) {
                        that.configList.UNIFY_SEARCH_BUY_WAY.forEach(
                          (itemN, indexN) => {
                            if (itemU.buyType && itemU.buyType == itemN.code) {
                              itemU.buyTypeUrl = itemN.name;
                              itemU.buyTypeName = itemN.name;
                              itemU.tagWidth = getConWidth(itemU.buyTypeName);
                            }
                          }
                        );
                      }
                      //图片判断
                      // if( itemU.iconUrl && itemU.iconUrl.replace(' ','').split(":")[0].indexOf("https") == -1 ){
                      // if(itemU.iconUrl && itemU.iconUrl.replace(' ','').split(":")[1]
                      // && itemU.iconUrl.replace(' ','').split(":")[1].indexOf("activity.cmcc-cs.cn") != -1){
                      //   //
                      // }else{
                      //   itemU.iconUrl = item.wholeDefaultPic;
                      // }
                      // }else{
                      if (
                        itemU.iconUrl &&
                        itemU.iconUrl.replace(" ", "").split(":")[1] &&
                        itemU.iconUrl
                          .replace(" ", "")
                          .split(":")[1]
                          .indexOf("10.4.160.6") != -1
                      ) {
                        itemU.iconUrl = item.wholeDefaultPic;
                      }
                      // }
                    });
                  yList.push(item);
                }

                console.log("纵向数据填充===>有tips小图片");
                console.log(yList);

                if (item.subList && item.subList.length > 0) {
                  item.subList.forEach((itemD) => {
                    that.templateList &&
                      that.templateList.forEach((itemF, indexF) => {
                        if (itemD.categoryCode == itemF.displayCategoryCode) {
                          itemD.wholeTemplateId = itemF.wholeTemplateId;
                          itemD.verticalTemplateId = itemF.verticalTemplateId;
                          itemD.wholeDefaultPic = itemF.wholeDefaultPic;
                          itemD.verticalDefaultPic = itemF.verticalDefaultPic;
                          itemD.wholeTemplateFieldList =
                            itemF.wholeTemplateFieldList;
                          itemD.verticalTemplateFieldList =
                            itemF.verticalTemplateFieldList;
                          // 商城页没有全部页，为了不影响其他入口，商城页不做区分全部页
                          if (sessionStorage.pageEntrance == "8") {
                            itemD.wholeTemplateId = itemF.verticalTemplateId;
                            itemD.wholeDefaultPic = itemF.verticalDefaultPic;
                            itemD.wholeTemplateFieldList =
                              itemF.verticalTemplateFieldList;
                          }
                        }
                      });
                    itemD.data.forEach((itemU, indexU) => {
                      itemU.pCode = "P00000050508"; //插入二级tab-pcode
                      itemU.parentCategoryName = item.categoryName;
                      // 组装触点曝光所需impAttrs参数
                      const impAttrs = {};
                      // impAttrs.position_id = indexU+1;
                      // impAttrs.type = "once";
                      impAttrs.WT_et = "imp";
                      impAttrs.WT_event = itemU.pCode;
                      impAttrs.WT_envName = itemU.title;
                      // impAttrs.XY_point_position = indexTab+1;
                      impAttrs.WT_markId = itemU._id;
                      impAttrs.XY_first_class = "搜索结果页_全部";
                      impAttrs.XY_second_class = itemU.dispCategoryName;
                      impAttrs.WT_next_url = itemU.linkAdress;
                      impAttrs.WT_plat = sessionStorage.pagePlat || "";
                      impAttrs.WT_es = sessionStorage.pageUrl || "";
                      impAttrs.WT_ti = "搜索结果页";
                      impAttrs.XY_pageEntry = sessionStorage.pageEntrance || ""; //新增页面入口

                      // 插码方案修改2025-1-16
                      impAttrs.XY_second_class = itemU.dispCategoryName;
                      impAttrs.WT_area_type_1 = "楼层";
                      impAttrs.areaid = ""; // 父物品id信息（无父物品传空）
                      impAttrs.WT_area_type_2 = itemU.dispCategoryName;
                      impAttrs.WT_area_name = `${itemU.parentCategoryName}_${itemU.dispCategoryName}`; // 若没有二级分类，此名称则记录为一级分类名称
                      impAttrs.XY_env_type = "icon";
                      impAttrs.XY_gd_source = "搜索平台";
                      impAttrs.XY_scene = this.getSearchContent() || ""; // 搜索内容
                      impAttrs.WT_si_n = itemU.title; // 物品对应的名称
                      impAttrs.WT_goods_id = itemU.itemId; // 物品所对应的id信息
                      impAttrs.XY_visit_source =
                        sessionStorage.pageEntrance || ""; // 访问来源
                      // impAttrs.XY_transaction_id = that.getSearchUUID(); // 这里没有设置XY_transaction_id 是在上报传参时统一设置了

                      itemU.impAttrsList = impAttrs;
                      // that.configList.UNIFY_SEARCH_CORNERMARK_URL.forEach((itemY,indexY) => {
                      //   if(itemU.cornerMark && itemU.cornerMark == itemY.code){
                      //     itemU.cornerMarkUrl = itemY.name
                      //   }
                      // })

                      if (that.configList.UNIFY_SEARCH_CORNERMARK_URL) {
                        let cornerMarkUrlArr = [];
                        that.configList.UNIFY_SEARCH_CORNERMARK_URL.forEach(
                          (itemY, indexY) => {
                            let cornerMarkArr = [];
                            if (itemU.cornerMark) {
                              if (itemU.cornerMark instanceof Array) {
                                cornerMarkArr = itemU.cornerMark;
                              } else {
                                cornerMarkArr = itemU.cornerMark.split(",");
                              }
                            }
                            if (cornerMarkArr && cornerMarkArr.length > 0) {
                              cornerMarkArr.sort((a, b) => a - b);
                              cornerMarkArr.forEach((itemO) => {
                                if (itemO == itemY.code) {
                                  cornerMarkUrlArr.push(itemY.name);
                                  itemU.cornerMarkUrlArray = cornerMarkUrlArr;
                                }
                              });
                            }
                          }
                        );
                      }

                      if (
                        itemU.cornerMarkUrlArray &&
                        itemU.cornerMarkUrlArray.length > 0
                      ) {
                        itemU.cornerMarkUrl = itemU.cornerMarkUrlArray[0];
                      }

                      if (that.configList.UNIFY_SEARCH_BUY_WAY) {
                        that.configList.UNIFY_SEARCH_BUY_WAY.forEach(
                          (itemN, indexN) => {
                            if (itemU.buyType && itemU.buyType == itemN.code) {
                              itemU.buyTypeUrl = itemN.name;
                              itemU.buyTypeName = itemN.name;
                              itemU.tagWidth = getConWidth(itemU.buyTypeName);
                            }
                          }
                        );
                      }

                      // 图片判断
                      // if( itemU.iconUrl && itemU.iconUrl.replace(' ','').split(":")[0].indexOf("https") == -1 ){
                      // if(itemU.iconUrl && itemU.iconUrl.replace(' ','').split(":")[1]
                      // && itemU.iconUrl.replace(' ','').split(":")[1].indexOf("activity.cmcc-cs.cn") != -1){
                      //
                      // }else{
                      //   itemU.iconUrl = itemD.wholeDefaultPic;
                      // }
                      // }else{

                      if (
                        itemU.iconUrl &&
                        itemU.iconUrl.replace(" ", "").split(":")[1] &&
                        itemU.iconUrl
                          .replace(" ", "")
                          .split(":")[1]
                          .indexOf("10.4.160.6") != -1
                      ) {
                        itemU.iconUrl = itemD.wholeDefaultPic;
                      }
                      // }
                    });

                    if (
                      itemD.wholeTemplateId ==
                      that.CONSTANTS.TEMPLATEPAGE.SERV001
                    ) {
                      // 会有二级分类也是服务的场景
                      xList.push(itemD);
                    } else {
                      yList.push(itemD);
                    }
                  });
                }
              });

              if (categoryCodeIn == "CSRDC_ALL") {
                sessionStorage.setItem(
                  "allSearchResultSes",
                  JSON.stringify(that.searchTable)
                );
              }

              // if (that.initFlag) { // 初始化的时候才加载tab
              that.searchTable.forEach((item, index) => {
                const obj = {};
                let categoryNameFlg =
                  sessionStorage.pageEntrance == "6"
                    ? "权益"
                    : sessionStorage.pageEntrance == "8"
                    ? "商城"
                    : item.categoryName;

                obj.categoryCode = item.categoryCode || "";
                obj.categoryName = categoryNameFlg || "";
                obj.templateId = item.wholeTemplateId || "";
                obj.wholeTemplateId = item.wholeTemplateId || "";
                obj.verticalTemplateId = item.verticalTemplateId || "";
                obj.parentCode = item.parentCode || "";
                obj.data = item.data || [];
                obj.subList = item.subList || [];
                obj.pCode = "P00000050500";
                obj.showFlag = item.showFlag || "";
                
                // 过滤掉data和subList都为空的分类
                // 但保留CSRDC_ALL（全部）分类
                if (obj.categoryCode !== "CSRDC_ALL" && obj.data.length === 0 && obj.subList.length === 0) {
                  return;
                }
                
                that.tabsList.push(obj);
              });

              //垂直页的时候不需要展示全部--从config接口里拿到includePage用
              if (!sessionStorage.pageEntranceIncludedPage.includes("1")) {
                // that.tabsList.unshift({
                //   categoryCode: "CSRDC_ALL",
                //   categoryName: "全部",
                //   pCode: "P00000050500",
                //   templateId: that.CONSTANTS.TEMPLATEPAGE.CATEALL,
                //   showFlag: false,
                // });
              } else {
                that.tabsList.unshift({
                  categoryCode: "CSRDC_ALL",
                  categoryName: "全部",
                  pCode: "P00000050500",
                  wholeTemplateId: that.CONSTANTS.TEMPLATEPAGE.CATEALL,
                  showFlag: true,
                });
              }

              //组装触点曝光所需impAttrs参数
              that.tabsList.forEach((itemTab, indexTab) => {
                const impAttrs = {};
                // impAttrs.position_id = indexTab+1;
                impAttrs.XY_transaction_id = that.getSearchUUID();
                // impAttrs.type = "once";
                impAttrs.WT_et = "imp";
                impAttrs.WT_event = itemTab.pCode;
                impAttrs.WT_envName = itemTab.categoryName;
                impAttrs.XY_point_position = indexTab + 1;
                impAttrs.WT_markId = itemTab.categoryCode;
                impAttrs.WT_plat = sessionStorage.pagePlat || "";
                impAttrs.WT_es = sessionStorage.pageUrl || "";
                impAttrs.WT_ti = "搜索结果页";
                impAttrs.XY_pageEntry = sessionStorage.pageEntrance || ""; //新增页面入口

                // 插码方案修改2025-1-16
                impAttrs.WT_area_type_1 = "楼层";
                impAttrs.areaid = ""; // 父物品id信息（无父物品传空）
                impAttrs.WT_area_type_2 = itemTab.categoryName;
                impAttrs.WT_area_name = itemTab.categoryName; // 若没有二级分类，此名称则记录为一级分类名称
                impAttrs.XY_env_type = "icon";
                impAttrs.XY_gd_source = "搜索平台";
                impAttrs.XY_scene = this.getSearchContent() || ""; // 搜索内容
                impAttrs.WT_si_n = itemTab.categoryName; // 物品对应的名称
                impAttrs.WT_goods_id = ""; // 物品所对应的id信息
                impAttrs.XY_visit_source = sessionStorage.pageEntrance || ""; // 访问来源
                // impAttrs.XY_transaction_id = that.getSearchUUID(); // 这里没有设置XY_transaction_id 是在上报传参时统一设置了

                itemTab.impAttrsTabs = impAttrs;
                that.tabListCodeString += itemTab.categoryCode + ",";
              });
              // }
              if (that.searchZoneResultFlag) {
                that.searchZoneResultList = JSON.parse(
                  sessionStorage.searchZoneResultListSes
                );
                that.tabsList = that.tabsList
                  .concat(that.searchZoneResultList)
                  .reduce((acc, cur) => {
                    if (
                      !acc.find(
                        (item) => item.categoryCode === cur.categoryCode
                      )
                    ) {
                      // 过滤掉data和subList都为空的专区数据
                      // 但保留CSRDC_ALL（全部）分类
                      if (cur.categoryCode !== "CSRDC_ALL" && 
                          (!cur.data || cur.data.length === 0) && 
                          (!cur.subList || cur.subList.length === 0)) {
                        return acc;
                      }
                      acc.push(cur);
                    }
                    return acc;
                  }, []);

                // 这里处理专区数据的曝光
                that.searchZoneResultList.forEach((szItem, szIndex) => {
                  that.tabsList.forEach((tbItem, tbIndex) => {
                    // that.templateList && that.templateList.forEach((itemN, indexN) => {
                    //   if (tbItem.categoryCode == itemN.displayCategoryCode) {
                    //     tbItem.wholeTemplateId = itemN.wholeTemplateId;
                    //     tbItem.verticalTemplateId = itemN.verticalTemplateId;
                    //     tbItem.wholeDefaultPic = itemN.wholeDefaultPic;
                    //     tbItem.verticalDefaultPic = itemN.verticalDefaultPic;
                    //     tbItem.wholeTemplateFieldList = itemN.wholeTemplateFieldList;
                    //     tbItem.verticalTemplateFieldList = itemN.verticalTemplateFieldList;
                    //   }
                    // });
                    if (szItem.categoryCode == tbItem.categoryCode) {
                      tbItem.dispOrd = szItem.dispOrd;
                      if (tbItem.subList && tbItem.subList.length > 0) {
                        //有二级类目的比如商品，生活，数据在sublist里
                        var mergedProdArr = tbItem.subList
                          .concat(szItem.subList)
                          .reduce((acc, cur) => {
                            if (
                              !acc.find(
                                (item) => item.categoryCode === cur.categoryCode
                              )
                            ) {
                              // 专区子分类数据即使data为空也保留
                              acc.push(cur);
                            }
                            return acc;
                          }, []);
                        // mergedProdArr.forEach((tbsubItem,tbsubIndex) => {
                        //   that.templateList && that.templateList.forEach((itemF, indexF) => {
                        //     if (tbsubItem.categoryCode == itemF.categoryCode) {
                        //       tbsubItem.wholeTemplateId = itemF.wholeTemplateId;
                        //       tbsubItem.verticalTemplateId = itemF.verticalTemplateId;
                        //       tbsubItem.wholeDefaultPic = itemF.wholeDefaultPic;
                        //       tbsubItem.verticalDefaultPic = itemF.verticalDefaultPic;
                        //       tbsubItem.wholeTemplateFieldList = itemF.wholeTemplateFieldList;
                        //       tbsubItem.verticalTemplateFieldList = itemF.verticalTemplateFieldList;
                        //     }
                        //   });
                        // })
                        szItem.subList.forEach((szSubItem, szSubIndex) => {
                          mergedProdArr.forEach((tbSubItem, tbSubIndex) => {
                            if (
                              szSubItem.categoryCode == tbSubItem.categoryCode
                            ) {
                              tbSubItem.searchZoneData =
                                szSubItem.searchZoneDataPre;
                              if (
                                tbSubItem.searchZoneData &&
                                tbSubItem.searchZoneData.length > 0
                              ) {
                                tbSubItem.subTitleFlag =
                                  tbSubItem.searchZoneData.every(
                                    (item) => !item.subTitle
                                  );
                                tbSubItem.eightFlag =
                                  tbSubItem.searchZoneData.some(
                                    (item) => item.pCode == "P00000057388"
                                  );
                              }
                              tbSubItem.searchZoneData.forEach(
                                (tbSzItem, tbSzIndex) => {
                                  tbSzItem.categoryName = szItem.categoryName;
                                  if (
                                    tbSzItem.pCode == "P00000057388" &&
                                    szItem.subList.length == 1
                                  ) {
                                    //只有一个小图的场景 位置4，pCode=P00000057388
                                    //默认小图片判断 defaultUrl 待提供
                                    tbSzItem.defaultUrl = require("../../assets/images/img2.png");
                                  } else {
                                    //默认大图片判断 defaultUrl 待提供
                                    tbSzItem.defaultUrl = require("../../assets/images/img3.png");
                                  }
                                  //这里是判断图片路径是否正确，不正确的话就将错误iconUrl替换为defaultUrl展示
                                  // if( tbSzItem.iconUrl && tbSzItem.iconUrl.replace(' ','').split(":")[0].indexOf("https") == -1 ){
                                  // if(tbSzItem.iconUrl && tbSzItem.iconUrl.replace(' ','').split(":")[1]
                                  // && tbSzItem.iconUrl.replace(' ','').split(":")[1].indexOf("activity.cmcc-cs.cn") != -1){
                                  //   //
                                  // }else{
                                  //   tbSzItem.iconUrl = tbSzItem.defaultUrl;
                                  // }
                                  // }else{
                                  if (
                                    tbSzItem.iconUrl &&
                                    tbSzItem.iconUrl
                                      .replace(" ", "")
                                      .split(":")[1] &&
                                    tbSzItem.iconUrl
                                      .replace(" ", "")
                                      .split(":")[1]
                                      .indexOf("10.4.160.6") != -1
                                  ) {
                                    tbSzItem.iconUrl = tbSzItem.defaultUrl;
                                  }
                                  if (
                                    tbSzItem.iconUrl &&
                                    tbSzItem.iconUrl
                                      .replace(" ", "")
                                      .split(":")[1] &&
                                    tbSzItem.iconUrl
                                      .replace(" ", "")
                                      .split(":")[1]
                                      .indexOf("172.22.225.71") != -1
                                  ) {
                                    tbSzItem.iconUrl = tbSzItem.defaultUrl;
                                  }
                                  // }
                                  const impAttrs = {};
                                  // impAttrs.position_id = 1;
                                  // impAttrs.type = "once";
                                  impAttrs.WT_et = "imp";
                                  impAttrs.WT_event = tbSzItem.pCode;
                                  impAttrs.WT_envName = tbSzItem.title;
                                  impAttrs.XY_first_class =
                                    sessionStorage.pageEntrance == "6"
                                      ? "权益"
                                      : sessionStorage.pageEntrance == "8"
                                      ? "商城"
                                      : szItem.categoryName;
                                  // impAttrs.XY_point_position = 1;
                                  impAttrs.WT_markId = tbSzItem._id;
                                  impAttrs.WT_next_url = tbSzItem.linkAdress;
                                  impAttrs.WT_plat =
                                    sessionStorage.pagePlat || "";
                                  impAttrs.WT_es = sessionStorage.pageUrl || "";
                                  impAttrs.WT_ti = "搜索结果页";
                                  impAttrs.XY_pageEntry =
                                    sessionStorage.pageEntrance || ""; //新增页面入口

                                  // 插码方案修改2025-1-16
                                  impAttrs.XY_second_class =
                                    szSubItem.categoryName;
                                  impAttrs.WT_area_type_1 = "楼层";
                                  impAttrs.areaid = ""; // 父物品id信息（无父物品传空）
                                  impAttrs.WT_area_type_2 =
                                    szSubItem.categoryName;
                                  impAttrs.WT_area_name = `${tbSzItem.categoryName}_${szSubItem.categoryName}`; // 若没有二级分类，此名称则记录为一级分类名称
                                  impAttrs.XY_env_type = "icon";
                                  impAttrs.XY_gd_source = "搜索平台";
                                  impAttrs.XY_scene =
                                    this.getSearchContent() || ""; // 搜索内容
                                  impAttrs.WT_si_n = tbSzItem.title; // 物品对应的名称
                                  impAttrs.WT_goods_id = tbSzItem.itemId; // 物品所对应的id信息
                                  impAttrs.XY_visit_source =
                                    sessionStorage.pageEntrance || ""; // 访问来源
                                  // impAttrs.XY_transaction_id = that.getSearchUUID(); // 这里没有设置XY_transaction_id 是在上报传参时统一设置了
                                  impAttrs.XY_transaction_id =
                                    that.getSearchUUID(); //

                                  tbSzItem.impAttrsList = impAttrs;
                                }
                              );
                            }
                          });
                          tbItem.subList = mergedProdArr;
                        });
                      } else {
                        if (tbItem.categoryCode !== "CSRDC_ALL") {
                          let index = that.templateList
                            ? that.templateList.findIndex(
                                (e) =>
                                  e.displayCategoryCode === tbItem.categoryCode
                              )
                            : [];
                          tbItem.wholeTemplateId =
                            index !== -1
                              ? that.templateList[index].wholeTemplateId
                              : "";
                        }
                        tbItem.dispOrd = szItem.dispOrd;
                        tbItem.searchZoneData = szItem.searchZoneDataPre;
                        if (
                          tbItem.searchZoneData &&
                          tbItem.searchZoneData.length > 0
                        ) {
                          tbItem.subTitleFlag = tbItem.searchZoneData.every(
                            (item) => !item.subTitle
                          );
                          tbItem.eightFlag = tbItem.searchZoneData.some(
                            (item) => item.pCode == "P00000057388"
                          );
                        }
                        tbItem.searchZoneData.forEach(
                          (szDataItem, szDataIndex) => {
                            if (
                              szDataItem.pCode == "P00000057388" &&
                              szItem.searchZoneDataPre.length == 1
                            ) {
                              //只有一个小图的场景 位置4，pCode=P00000057388
                              //默认小图片判断 defaultUrl 待提供
                              szDataItem.defaultUrl = require("../../assets/images/img2.png");
                            } else {
                              //默认大图片判断 defaultUrl 待提供
                              szDataItem.defaultUrl = require("../../assets/images/img3.png");
                            }
                            //这里是判断图片路径是否正确，不正确的话就将错误iconUrl替换为defaultUrl展示
                            // if( szDataItem.iconUrl && szDataItem.iconUrl.replace(' ','').split(":")[0].indexOf("https") == -1 ){
                            // if(szDataItem.iconUrl && szDataItem.iconUrl.replace(' ','').split(":")[1]
                            // && szDataItem.iconUrl.replace(' ','').split(":")[1].indexOf("activity.cmcc-cs.cn") != -1){
                            //   //
                            // }else{
                            //   szDataItem.iconUrl = szDataItem.defaultUrl;
                            // }
                            // }else{
                            if (
                              szDataItem.iconUrl &&
                              szDataItem.iconUrl
                                .replace(" ", "")
                                .split(":")[1] &&
                              szDataItem.iconUrl
                                .replace(" ", "")
                                .split(":")[1]
                                .indexOf("10.4.160.6") != -1
                            ) {
                              szDataItem.iconUrl = szDataItem.defaultUrl;
                            }
                            if (
                              szDataItem.iconUrl &&
                              szDataItem.iconUrl
                                .replace(" ", "")
                                .split(":")[1] &&
                              szDataItem.iconUrl
                                .replace(" ", "")
                                .split(":")[1]
                                .indexOf("172.22.225.71") != -1
                            ) {
                              szDataItem.iconUrl = szDataItem.defaultUrl;
                            }
                            // }
                            const impAttrs = {};
                            // impAttrs.position_id = 1;
                            impAttrs.XY_transaction_id = that.getSearchUUID();
                            // impAttrs.type = "once";
                            impAttrs.WT_et = "imp";
                            impAttrs.WT_event = szDataItem.pCode;
                            impAttrs.WT_envName = szDataItem.title;
                            impAttrs.XY_first_class =
                              sessionStorage.pageEntrance == "6"
                                ? "权益"
                                : sessionStorage.pageEntrance == "8"
                                ? "商城"
                                : szItem.categoryName;
                            // impAttrs.XY_point_position = 1;
                            impAttrs.WT_markId = szDataItem._id;
                            impAttrs.WT_next_url = szDataItem.linkAdress;
                            impAttrs.WT_plat = sessionStorage.pagePlat || "";
                            impAttrs.WT_es = sessionStorage.pageUrl || "";
                            impAttrs.WT_ti = "搜索结果页";
                            impAttrs.XY_pageEntry =
                              sessionStorage.pageEntrance || ""; //新增页面入口

                            // 插码方案修改2025-1-16
                            impAttrs.XY_second_class = szItem.categoryName;
                            impAttrs.WT_area_type_1 = "楼层";
                            impAttrs.areaid = ""; // 父物品id信息（无父物品传空）
                            impAttrs.WT_area_type_2 = szItem.categoryName;
                            impAttrs.WT_area_name = szItem.categoryName; // 若没有二级分类，此名称则记录为一级分类名称
                            impAttrs.XY_env_type = "icon";
                            impAttrs.XY_gd_source = "搜索平台";
                            impAttrs.XY_scene = this.getSearchContent() || ""; // 搜索内容
                            impAttrs.WT_si_n = szDataItem.title; // 物品对应的名称
                            impAttrs.WT_goods_id = szDataItem.itemId; // 物品所对应的id信息
                            impAttrs.XY_visit_source =
                              sessionStorage.pageEntrance || ""; // 访问来源
                            // impAttrs.XY_transaction_id = that.getSearchUUID(); // 这里没有设置XY_transaction_id 是在上报传参时统一设置了

                            szDataItem.impAttrsList = impAttrs;
                          }
                        );
                      }
                    }
                  });
                });

                // that.tabsList= that.tabsList.concat(mergeArr);
                // 专区统一给tabs触点赋值+templateId赋值
                // 疑似兜底代码路基

                that.tabsList.forEach((itemTabsList, indexTabsList) => {
                  if (
                    itemTabsList.pCode == "" ||
                    itemTabsList.pCode == undefined ||
                    itemTabsList.pCode == null
                  ) {
                    itemTabsList.pCode = "P00000050500"; //插入pcode
                    // itemP.parentCategoryName = item.categoryName;
                    //组装触点曝光所需impAttrs参数
                    const impAttrs = {};
                    // impAttrs.position_id = indexTab+1;
                    impAttrs.XY_transaction_id = that.getSearchUUID();
                    // impAttrs.type = "once";
                    impAttrs.WT_et = "imp";
                    impAttrs.WT_event = itemTabsList.pCode;
                    impAttrs.WT_envName = itemTabsList.categoryName;
                    impAttrs.XY_point_position = indexTabsList + 1;
                    impAttrs.WT_markId = itemTabsList.categoryCode;
                    impAttrs.WT_plat = sessionStorage.pagePlat || "";
                    impAttrs.WT_es = sessionStorage.pageUrl || "";
                    impAttrs.WT_ti = "搜索结果页";
                    impAttrs.XY_pageEntry = sessionStorage.pageEntrance || ""; //新增页面入口

                    // 插码方案修改2025-1-16
                    impAttrs.XY_second_class = itemTabsList.categoryName;
                    impAttrs.WT_area_type_1 = "楼层";
                    impAttrs.areaid = ""; // 父物品id信息（无父物品传空）
                    impAttrs.WT_area_type_2 = itemTabsList.categoryName;
                    impAttrs.WT_area_name = itemTabsList.categoryName; // 若没有二级分类，此名称则记录为一级分类名称
                    impAttrs.XY_env_type = "icon";
                    impAttrs.XY_gd_source = "搜索平台";
                    impAttrs.XY_scene = this.getSearchContent() || ""; // 搜索内容
                    impAttrs.WT_si_n = itemTabsList.title; // 物品对应的名称
                    impAttrs.WT_goods_id = ""; // 物品所对应的id信息---tab标签没有id信息
                    impAttrs.XY_visit_source =
                      sessionStorage.pageEntrance || ""; // 访问来源
                    // impAttrs.XY_transaction_id = that.getSearchUUID(); // 这里没有设置XY_transaction_id 是在上报传参时统一设置了

                    itemTabsList.impAttrsTabs = impAttrs;
                    that.tabListCodeString += itemTabsList.categoryCode + ",";
                  }
                  that.templateList &&
                    that.templateList.forEach((itemD, indexD) => {
                      if (
                        itemTabsList.categoryCode == itemD.displayCategoryCode
                      ) {
                        //区分全部/垂直templateId
                        itemTabsList.wholeTemplateId = itemD.wholeTemplateId;
                        itemTabsList.verticalTemplateId =
                          itemD.verticalTemplateId;
                        itemTabsList.wholeDefaultPic = itemD.wholeDefaultPic;
                        itemTabsList.verticalDefaultPic =
                          itemD.verticalDefaultPic;
                        itemTabsList.wholeTemplateFieldList =
                          itemD.wholeTemplateFieldList;
                        itemTabsList.verticalTemplateFieldList =
                          itemD.verticalTemplateFieldList;
                        if (
                          itemTabsList.subList &&
                          itemTabsList.subList.length > 0
                        ) {
                          itemTabsList.subList.forEach((itemDe) => {
                            that.templateList &&
                              that.templateList.forEach((itemF, indexF) => {
                                if (
                                  itemDe.categoryCode ==
                                  itemF.displayCategoryCode
                                ) {
                                  itemDe.wholeTemplateId =
                                    itemF.wholeTemplateId;
                                  itemDe.verticalTemplateId =
                                    itemF.verticalTemplateId;
                                  itemDe.wholeDefaultPic =
                                    itemF.wholeDefaultPic;
                                  itemDe.verticalDefaultPic =
                                    itemF.verticalDefaultPic;
                                  itemDe.wholeTemplateFieldList =
                                    itemF.wholeTemplateFieldList;
                                  itemDe.verticalTemplateFieldList =
                                    itemF.verticalTemplateFieldList;
                                }
                              });
                          });
                        }
                      }
                    });
                });

                // 保持服务端返回的原始顺序，不按dispOrd排序
                // that.tabsList = that.tabsList.sort(
                //   (a, b) => a.dispOrd - b.dispOrd
                // );

                // that.tabsList.forEach((tab) => {
                //   if (tab.subList && tab.subList.length > 0) {
                //     tab.subList.sort((a, b) => a.dispOrd - b.dispOrd);
                //   }
                // });
              }

              // 定位判断
              // if (sessionStorage.initGetLocationFlag == '1') {
              let posList = [];
              let locationFlag = false;
              console.log(yList, "yList");

              yList.forEach((itemPos, indexPos) => {
                itemPos.data.map((itemPP) => {
                  if (
                    itemPP.location != null &&
                    itemPP.location != undefined &&
                    itemPP.location != ""
                  ) {
                    posList.push(itemPP.location);
                  }
                });
                if (
                  (itemPos.wholeTemplateId ==
                    that.CONSTANTS.TEMPLATEPAGE.PRODHW004 ||
                    itemPos.verticalTemplateId ==
                      that.CONSTANTS.TEMPLATEPAGE.PRODHW004 ||
                    itemPos.wholeTemplateId ==
                      that.CONSTANTS.TEMPLATEPAGE.PRODMB0053) &&
                  posList &&
                  posList.length > 0
                ) {
                  locationFlag = true;
                }
              });
              // 结果页拉起定位，存在安全问题，让其不生效
              // if (
              //   locationFlag &&
              //   (that.latitude == "" || that.longtitude == "")
              // ) {
              //   that.getRealLocation();
              // }

              // }
              //存储IOP缓存
              const keyword = `${that.paramData.phoneNum}_${that.searchContent}`; // 拼接搜索关键字
              const keywords = getKeywordsFromSession(); // 获取当前缓存的搜索关键字数组
              let obj = {};
              obj.value = res.info || null;
              obj.label = keyword;
              keywords.push(obj); // 将新的关键字推入数组
              if (keywords.length > 500) {
                keywords.splice(0, 100); // 删除前100个关键字
              }
              const uniqueA = Array.from(
                new Set(keywords.map((item) => JSON.stringify(item)))
              ).map((item) => JSON.parse(item));
              saveKeywordsToSession(uniqueA); // 缓存更新后保存到 Session Storage

              that.tabsList = Array.from(
                new Set(that.tabsList.map(JSON.stringify))
              ).map(JSON.parse);
              that.updateTabVisibility();

              sessionStorage.setItem(
                "tabsListSes",
                JSON.stringify(that.tabsList)
              );
              // } else {
              //   that.tabsList = JSON.parse(sessionStorage.getItem('tabsListSes'));
              // }
              // console.log(that.tabsList,'00000')
              // that.currentCompList = [{ path: 'EnterXList', refD: 'EnterXListRef' }, { path: 'EnterYList', refD: 'EnterYListRef' }], // 当前组件
              // that.$nextTick(() => {
              //   that.$refs.EnterXListRef[0].arrXList = xList;
              //   that.$refs.EnterYListRef[0].arrList = yList;
              // });
              // that.currentCompList = [{ path: 'EnterYList', refD: 'EnterYListRef' }], // 当前组件
              if (!sessionStorage.pageEntranceIncludedPage.includes("1")) {
                that.handleTab(0, that.tabsList[0].categoryName);
              } else {
                that.currentCom = "EnterYList";
                that.currentRef = "EnterYListRef";
              }
              // 保持服务端返回的原始顺序，不按maxScore排序
              // xList.sort((a, b) => b.maxScore - a.maxScore);
              // yList.sort((a, b) => b.maxScore - a.maxScore);
              that.$nextTick(() => {
                that.searchTable = that.tabsList;
                // if(!that.searchZoneResultFlag){
                if (sessionStorage.pageEntranceIncludedPage.includes("1")) {
                  // 保持服务端返回的原始顺序，不将xList放在最后
                  let arr = [];
                  // 遍历原始searchTable，保持原始顺序
                  that.searchTable.forEach(item => {
                    if (item.wholeTemplateId == that.CONSTANTS.TEMPLATEPAGE.SERV001) {
                      // 服务数据
                      arr.push(item);
                    } else if (item.subList && item.subList.length == 0) {
                      // 非服务且无二级分类
                      arr.push(item);
                    } else if (item.subList && item.subList.length > 0) {
                      // 有二级分类的数据
                      item.subList.forEach(subItem => {
                        arr.push(subItem);
                      });
                    }
                  });
                  // 保持服务端返回的原始顺序，不按maxScore排序
                  // arr.sort((a, b) => b.maxScore - a.maxScore);
                  
                  // 对搜索结果和专区数据进行合并去重（按链接+省份维度）
                  console.log('this.$isProvinceDistinct===>', this.$isProvinceDistinct);
                  const mergedItems = mergeSearchAndZoneData(arr, this.$isProvinceDistinct);
                  
                  // 对全部页合并后的最终数组按 linkAdress 去重后再赋值
                  // that.$refs.EnterYListRef[0].searchTableY = arr;
                  // that.$refs.EnterYListRef[0].arrXList = arr;
                  that.$refs.EnterYListRef[0].searchTableY = mergedItems;
                  that.$refs.EnterYListRef[0].arrXList = mergedItems;

                  console.log("全部标签页--页面渲染的最终数据X===>");
                  console.log(xList);
                  console.log("全部标签页--页面渲染的最终数据Y===>");
                  console.log(yList);
                  console.log("全部标签页--页面渲染的最终数据ALL===>");
                  console.log(arr);
                  console.log("全部标签页--搜索结果和专区合并去重后数据===>");
                  console.log(mergedItems);

                  // that.$refs.EnterYListRef[0].arrList = arr;
                  that.$refs.EnterYListRef[0].arrList = mergedItems;
                }
                // }
                //如果专区全部有数据，就加个标识，for全部里的无数据 这时候要展示全部-专区
                //搜索关键词只匹配到垂直页的搜索专区数据时，全部页应展示为无搜索结果样式，且无需展示为你推荐数据
                let index = that.tabsList.findIndex(
                  (e) => e.categoryCode === "CSRDC_ALL"
                );
                if (index > -1) {
                  if (res.data.result && res.data.result.length == 0) {
                    that.searchZoneResult_All = true;
                  }
                }
                if (
                  res.data.result &&
                  res.data.result.length == 0 &&
                  that.searchZoneResultFlag
                ) {
                  that.noDataShow_All = true;
                }
              });
            } else {
              that.noDataShow = true;
              that.$nextTick(() => {
                //为您推荐专区查询
                setTimeout(() => {
                  that.$refs.noDataRef?.$refs.recommendRef?.handleQueryResult();
                }, 500);
              });
              // that.currentCompList = [{ path: 'NoData', refD: 'NoDataRef' }];
            }
          } else {
            that.noDataShow = true;
            that.$nextTick(() => {
              //为您推荐专区查询
              setTimeout(() => {
                that.$refs.noDataRef?.$refs.recommendRef?.handleQueryResult();
              }, 500);
            });
          }
        })
        .catch((err) => {
          if (isQueryIndexTrafficPeakByError(err)) {
            that.hideLoading();
            that.trafficPeakFallback = true;
            that.noDataShow = false;
            that.resultSkeletonShow = false;
            that.$nextTick(() => {
              setTimeout(() => {
                that.$refs.trafficPeakRef?.$refs.recommendRef?.handleQueryResult();
              }, 500);
            });
            return;
          }
          that.hideLoading();
          that.trafficPeakFallback = false;
          that.noDataShow = true;
          that.resultSkeletonShow = false;
          that.$nextTick(() => {
            //为您推荐专区查询
            setTimeout(() => {
              that.$refs.noDataRef?.$refs.recommendRef?.handleQueryResult();
            }, 500);
          });
          sendSkyNet(`queryResult-error: ${JSON.stringify(err)}`)
          console.log("queryResult请求接口失败", err);
        });
    }, 300),

    // 将handleQueryResult的逻辑拆分
    // 获取数据getContentData
    // 格式化数据handleContenData

    // 搜索内容数据查询请求--并行调用
    getContentData(categoryCodeIn, type) {
      // 搜索请求来源
      let search_source_type = type === "1" ? type : "2";
      console.log("搜索请求来源===>", type, search_source_type);
      console.log("搜索categoryCodeIn===>", categoryCodeIn);
      this.loaded = true;
      const that = this;
      that.trafficPeakFallback = false;
      that.paramData = handleGetUrlParam();
      // 代码格式修改
      // (that.paramData.categoryCode =
      //   categoryCodeIn == "CSRDC_ALL" ? "" : categoryCodeIn),
      //   (that.paramData.params.keyWord = that.searchContent);
      that.paramData.categoryCode =
        categoryCodeIn == "CSRDC_ALL" ? "" : categoryCodeIn;
      that.paramData.params.keyWord = that.searchContent;
      // 代码编写
      that.paramData.sortField = "";
      that.paramData.searchSourceType = search_source_type;
      that.latitude = sessionStorage.latitude || "";
      that.longtitude = sessionStorage.longtitude || "";
      if (that.latitude && that.latitude == "0.000000") {
        that.latitude = "";
      }
      if (that.longtitude && that.longtitude == "0.000000") {
        that.longtitude = "";
      }
      console.log("that.longtitude===>", that.longtitude);
      console.log("that.latitude===>", that.latitude);
      that.paramData.location =
        that.latitude && that.longtitude
          ? `${that.latitude},${that.longtitude}`
          : "";
      let iopResultRes =
        checkoutKeywordsToSession(that.searchContent) != "999999"
          ? checkoutKeywordsToSession(that.searchContent)
          : null;
      that.paramData.iopResult = iopResultRes;
      const userInfo = localStorage.getItem("userInfo")
        ? JSON.parse(localStorage.getItem("userInfo"))
        : null;
      that.paramData.cityCode = userInfo?.city;
      // that.tabsList = [];
      that.configList = sessionStorage.configListSes
        ? JSON.parse(sessionStorage.configListSes)
        : {};
      that.paramData.tranId = that.getSearchUUID();
      that.paramData.wordType = that.getWordType();
      that.paramData.correctionFlag = that.getCorrectionFlag();
      that.paramData.userState = that.userLoginState();
      that.paramData.birthday = userInfo?.birthday || "";
      console.log("搜索结果传参===>");
      console.log(that.paramData);

      return new Promise((resolve, reject) => {
        CommonApi.queryResult(that.paramData)
          .then(async (res) => {
            that.tabsList = [];
            that.noDataShow = false;
            that.resultSkeletonShow = false;
            that.hideLoading();
            this.$isDistinct = !res.data?.distinct;
            resolve(res);
          })
          .catch((err) => {
            if (isQueryIndexTrafficPeakByError(err)) {
              that.hideLoading();
              that.trafficPeakFallback = true;
              that.noDataShow = false;
              that.resultSkeletonShow = false;
              that.$nextTick(() => {
                setTimeout(() => {
                  that.$refs.trafficPeakRef?.$refs.recommendRef?.handleQueryResult();
                }, 500);
              });
              reject(err);
              return;
            }
            that.hideLoading();
            that.trafficPeakFallback = false;
            that.noDataShow = true;
            that.resultSkeletonShow = false;
            that.$nextTick(() => {
              //为您推荐专区查询
              setTimeout(() => {
                that.$refs.noDataRef?.$refs.recommendRef?.handleQueryResult();
              }, 500);
            });
            console.log("queryResult请求接口失败", err);
            sendSkyNet(`queryResult-error: ${JSON.stringify(err)}`)
            reject(err);
          });
      });
    },

    // 处理搜索内容数据--并行调用
    handleContenData(res, categoryCodeIn) {
      const that = this;
      const xList = [];
      const yList = [];

      if (isQueryIndexTrafficPeak(res)) {
        that.trafficPeakFallback = true;
        that.noDataShow = false;
        that.noDataShow_All = false;
        that.searchZoneResult_All = false;
        that.allBtShow = false;
        that.tabsList = [];
        that.$nextTick(() => {
          setTimeout(() => {
            that.$refs.trafficPeakRef?.$refs.recommendRef?.handleQueryResult();
          }, 500);
        });
        return;
      }
      that.trafficPeakFallback = false;

      if (res.code == "000000") {
        console.time("indexSearch");

        // 纠错词回显相关逻辑
        const correctionMap = res.data?.correctionMap;
        // 原型方法最好换个地方
        if (!String.prototype.replaceAll) {
          String.prototype.replaceAll = function (search, replacement) {
            var target = this;
            return target.replace(new RegExp(search, "g"), replacement);
          };
        }
        const correctionWord =
          correctionMap[that.searchContent.replaceAll(" ", "")];
        if (correctionWord) {
          const correction = new Correction(
            that.searchContent,
            correctionWord,
            that.handleResearch(that.searchContent)
          );
          correction.mount(that.$refs.resultRef);
        }

        that.noDataShow_All = false;
        that.searchZoneResult_All = false;
        if (res.data && res.data.result && res.data.result.length > 0) {
          that.searchTable = res.data.result;
        }
        that.searchZoneResultFlag =
          sessionStorage.searchZoneResultListSes &&
          JSON.parse(sessionStorage.searchZoneResultListSes).length;
        console.log(
          "searchZoneResultFlag===>几个tab页",
          that.searchZoneResultFlag
        );
        console.log("searchTable==返回的index数据", that.searchTable);

        if (
          (res.data && res.data.result && res.data.result.length > 0) ||
          that.searchZoneResultFlag
        ) {
          that.allBtShow = true;
          console.log("存储的templateListSes==>");
          console.log(that.templateList);

          that.searchTable.forEach((item, index) => {
            // 初步组装匹配数据
            that.templateList &&
              that.templateList.forEach((itemD, indexD) => {
                if (item.categoryCode == itemD.displayCategoryCode) {
                  // 区分全部/垂直templateId
                  item.wholeTemplateId = itemD.wholeTemplateId;
                  item.verticalTemplateId = itemD.verticalTemplateId;
                  item.wholeDefaultPic = itemD.wholeDefaultPic;
                  item.verticalDefaultPic = itemD.verticalDefaultPic;
                  item.wholeTemplateFieldList = itemD.wholeTemplateFieldList;
                  item.verticalTemplateFieldList =
                    itemD.verticalTemplateFieldList;
                }
              });
            console.log("初步组装完成====>");
            console.log(item);

            if (item.wholeTemplateId == that.CONSTANTS.TEMPLATEPAGE.SERV001) {
              // 分流-服务
              console.log("开始处理全部页服务栏目下===曝光所需要配置信息");

              item.data.forEach((itemP, indexP) => {
                itemP.pCode = "P00000050508"; //插入pcode
                // itemP.parentCategoryName = item.categoryName;
                // 组装触点曝光所需impAttrs参数
                const impAttrs = {};

                // impAttrs.position_id = indexU+1;
                // impAttrs.type = "once";
                impAttrs.WT_et = "imp";
                impAttrs.WT_event = itemP.pCode;
                impAttrs.WT_envName = itemP.title;
                // impAttrs.XY_point_position = indexTab+1;
                impAttrs.WT_markId = itemP._id;
                impAttrs.XY_first_class = "搜索结果页_全部";
                impAttrs.XY_second_class = itemP.dispCategoryName;
                impAttrs.WT_next_url = itemP.linkAdress;
                impAttrs.WT_plat = sessionStorage.pagePlat || "";
                impAttrs.WT_es = sessionStorage.pageUrl || "";
                impAttrs.WT_ti = "搜索结果页";
                impAttrs.XY_pageEntry = sessionStorage.pageEntrance || ""; //新增页面入口

                // 插码方案修改2025-1-16
                impAttrs.XY_second_class = itemP.dispCategoryName;
                impAttrs.WT_area_type_1 = "楼层";
                impAttrs.areaid = ""; // 父物品id信息（无父物品传空）
                impAttrs.WT_area_type_2 = "全部";
                impAttrs.WT_area_name = itemP.dispCategoryName; // 若没有二级分类，此名称则记录为一级分类名称
                impAttrs.XY_env_type = "icon";
                impAttrs.XY_gd_source = "搜索平台";
                impAttrs.XY_scene = this.getSearchContent() || ""; // 搜索内容
                impAttrs.WT_si_n = itemP.title; // 物品对应的名称
                impAttrs.WT_goods_id = itemP.itemId; // 物品所对应的id信息
                impAttrs.XY_visit_source = sessionStorage.pageEntrance || ""; // 访问来源
                // impAttrs.XY_transaction_id = that.getSearchUUID(); // 这里没有设置XY_transaction_id 是在上报传参时统一设置了

                itemP.impAttrsList = impAttrs;
                // 图片判断
                if (
                  itemP.iconUrl &&
                  itemP.iconUrl
                    .replace(" ", "")
                    .split(":")[0]
                    .indexOf("https") == -1
                ) {
                  // itemP.iconUrl = item.wholeDefaultPic;
                }
              });
              xList.push(item);
            }
            console.log("服务数据是横向展示===>");
            console.log(xList);

            if (
              item.subList &&
              item.subList.length == 0 &&
              item.wholeTemplateId !== that.CONSTANTS.TEMPLATEPAGE.SERV001
            ) {
              // 不是服务也不含有二级分类
              item.data &&
                item.data.forEach((itemU, indexU) => {
                  itemU.pCode = "P00000050508"; //插入pcode
                  // itemU.parentCategoryName = item.categoryName;
                  //组装触点曝光所需impAttrs参数
                  const impAttrs = {};

                  // impAttrs.position_id = indexU+1;
                  // impAttrs.type = "once";
                  impAttrs.WT_et = "imp";
                  impAttrs.WT_event = itemU.pCode;
                  impAttrs.WT_envName = itemU.title;
                  // impAttrs.XY_point_position = indexTab+1;
                  impAttrs.WT_markId = itemU._id;
                  impAttrs.XY_first_class = "搜索结果页_全部";
                  impAttrs.XY_second_class = itemU.dispCategoryName;
                  impAttrs.WT_next_url = itemU.linkAdress;
                  impAttrs.WT_plat = sessionStorage.pagePlat || "";
                  impAttrs.WT_es = sessionStorage.pageUrl || "";
                  impAttrs.WT_ti = "搜索结果页";
                  impAttrs.XY_pageEntry = sessionStorage.pageEntrance || ""; //新增页面入口

                  // 插码方案修改2025-1-16
                  impAttrs.XY_second_class = itemU.dispCategoryName;
                  impAttrs.WT_area_type_1 = "楼层";
                  impAttrs.areaid = ""; // 父物品id信息（无父物品传空）
                  impAttrs.WT_area_type_2 = "全部";
                  impAttrs.WT_area_name = itemU.dispCategoryName; // 若没有二级分类，此名称则记录为一级分类名称
                  impAttrs.XY_env_type = "icon";
                  impAttrs.XY_gd_source = "搜索平台";
                  impAttrs.XY_scene = this.getSearchContent() || ""; // 搜索内容
                  impAttrs.WT_si_n = itemU.title; // 物品对应的名称
                  impAttrs.WT_goods_id = itemU.itemId; // 物品所对应的id信息
                  impAttrs.XY_visit_source = sessionStorage.pageEntrance || ""; // 访问来源
                  // impAttrs.XY_transaction_id = that.getSearchUUID(); // 这里没有设置XY_transaction_id 是在上报传参时统一设置了

                  itemU.impAttrsList = impAttrs;

                  // that.configList.UNIFY_SEARCH_CORNERMARK_URL
                  // 会话存储configListSec中的tips小图片链接数组
                  // hot 限时优惠 秒杀
                  console.log(that.configList.UNIFY_SEARCH_CORNERMARK_URL);

                  if (that.configList.UNIFY_SEARCH_CORNERMARK_URL) {
                    let cornerMarkUrlArr = [];
                    that.configList.UNIFY_SEARCH_CORNERMARK_URL.forEach(
                      (itemY, indexY) => {
                        let cornerMarkArr = [];
                        if (itemU.cornerMark) {
                          if (itemU.cornerMark instanceof Array) {
                            cornerMarkArr = itemU.cornerMark;
                          } else {
                            cornerMarkArr = itemU.cornerMark.split(",");
                          }
                        }
                        if (cornerMarkArr && cornerMarkArr.length > 0) {
                          cornerMarkArr.sort((a, b) => a - b);
                          cornerMarkArr.forEach((itemO) => {
                            if (itemO == itemY.code) {
                              cornerMarkUrlArr.push(itemY.name);
                              itemU.cornerMarkUrlArray = cornerMarkUrlArr;
                            }
                          });
                        }
                      }
                    );
                  }
                  if (
                    itemU.cornerMarkUrlArray &&
                    itemU.cornerMarkUrlArray.length > 0
                  ) {
                    itemU.cornerMarkUrl = itemU.cornerMarkUrlArray[0];
                  }
                  // 购买方式
                  // 裸机 信用购机 优惠购机 5G金币购机
                  if (that.configList.UNIFY_SEARCH_BUY_WAY) {
                    that.configList.UNIFY_SEARCH_BUY_WAY.forEach(
                      (itemN, indexN) => {
                        if (itemU.buyType && itemU.buyType == itemN.code) {
                          itemU.buyTypeUrl = itemN.name;
                          itemU.buyTypeName = itemN.name;
                          itemU.tagWidth = getConWidth(itemU.buyTypeName);
                        }
                      }
                    );
                  }
                  console.log("处理完图片cornerMarkUrl-购买方式字段===>");
                  console.log(itemU);
                  // 图片判断
                  // if (
                  //   itemU.iconUrl &&
                  //   itemU.iconUrl
                  //     .replace(" ", "")
                  //     .split(":")[0]
                  //     .indexOf("https") == -1
                  // ) {
                  //   if (
                  //     itemU.iconUrl &&
                  //     itemU.iconUrl.replace(" ", "").split(":")[1] &&
                  //     itemU.iconUrl
                  //       .replace(" ", "")
                  //       .split(":")[1]
                  //       .indexOf("activity.cmcc-cs.cn") != -1
                  //   ) {
                  //   } else {
                  //     itemU.iconUrl = item.wholeDefaultPic;
                  //   }
                  // } else {
                  //   if (
                  //     itemU.iconUrl &&
                  //     itemU.iconUrl.replace(" ", "").split(":")[1] &&
                  //     itemU.iconUrl
                  //       .replace(" ", "")
                  //       .split(":")[1]
                  //       .indexOf("10.4.160.6") != -1
                  //   ) {
                  //     itemU.iconUrl = item.wholeDefaultPic;
                  //   }
                  // }
                  if (
                    itemU.iconUrl &&
                    itemU.iconUrl.replace(" ", "").split(":")[1] &&
                    itemU.iconUrl
                      .replace(" ", "")
                      .split(":")[1]
                      .indexOf("10.4.160.6") != -1
                  ) {
                    itemU.iconUrl = item.wholeDefaultPic;
                  }
                });
              yList.push(item);
            }
            console.log("纵向数据填充===>tips小图片-购买方式");
            console.log(yList);

            if (item.subList && item.subList.length > 0) {
              item.subList.forEach((itemD) => {
                that.templateList &&
                  that.templateList.forEach((itemF, indexF) => {
                    if (itemD.categoryCode == itemF.displayCategoryCode) {
                      itemD.wholeTemplateId = itemF.wholeTemplateId;
                      itemD.verticalTemplateId = itemF.verticalTemplateId;
                      itemD.wholeDefaultPic = itemF.wholeDefaultPic;
                      itemD.verticalDefaultPic = itemF.verticalDefaultPic;
                      itemD.wholeTemplateFieldList =
                        itemF.wholeTemplateFieldList;
                      itemD.verticalTemplateFieldList =
                        itemF.verticalTemplateFieldList;
                      // 商城页没有全部页，为了不影响其他入口，商城页不做区分全部页
                      if (sessionStorage.pageEntrance == "8") {
                        itemD.wholeTemplateId = itemF.verticalTemplateId;
                        itemD.wholeDefaultPic = itemF.verticalDefaultPic;
                        itemD.wholeTemplateFieldList =
                          itemF.verticalTemplateFieldList;
                      }
                    }
                  });

                itemD.data.forEach((itemU, indexU) => {
                  itemU.pCode = "P00000050508"; //插入二级tab-pcode
                  itemU.parentCategoryName = item.categoryName;

                  //组装触点曝光所需impAttrs参数
                  const impAttrs = {};
                  // impAttrs.position_id = indexU+1;
                  // impAttrs.type = "once";
                  impAttrs.WT_et = "imp";
                  impAttrs.WT_event = itemU.pCode;
                  impAttrs.WT_envName = itemU.title;
                  // impAttrs.XY_point_position = indexTab+1;
                  impAttrs.WT_markId = itemU._id;
                  impAttrs.XY_first_class = "搜索结果页_全部";
                  impAttrs.XY_second_class = itemU.dispCategoryName;
                  impAttrs.WT_next_url = itemU.linkAdress;
                  impAttrs.WT_plat = sessionStorage.pagePlat || "";
                  impAttrs.WT_es = sessionStorage.pageUrl || "";
                  impAttrs.WT_ti = "搜索结果页";
                  impAttrs.XY_pageEntry = sessionStorage.pageEntrance || ""; //新增页面入口

                  // 插码方案修改2025-1-16
                  impAttrs.XY_second_class = itemU.dispCategoryName;
                  impAttrs.WT_area_type_1 = "楼层";
                  impAttrs.areaid = ""; // 父物品id信息（无父物品传空）
                  impAttrs.WT_area_type_2 = "全部";
                  impAttrs.WT_area_name = itemU.dispCategoryName; // 若没有二级分类，此名称则记录为一级分类名称
                  impAttrs.XY_env_type = "icon";
                  impAttrs.XY_gd_source = "搜索平台";
                  impAttrs.XY_scene = this.getSearchContent() || ""; // 搜索内容
                  impAttrs.WT_si_n = itemU.title; // 物品对应的名称
                  impAttrs.WT_goods_id = itemU.itemId; // 物品所对应的id信息
                  impAttrs.XY_visit_source = sessionStorage.pageEntrance || ""; // 访问来源
                  // impAttrs.XY_transaction_id = that.getSearchUUID(); // 这里没有设置XY_transaction_id 是在上报传参时统一设置了

                  itemU.impAttrsList = impAttrs;
                  // that.configList.UNIFY_SEARCH_CORNERMARK_URL.forEach((itemY,indexY) => {
                  //   if(itemU.cornerMark && itemU.cornerMark == itemY.code){
                  //     itemU.cornerMarkUrl = itemY.name
                  //   }
                  // })

                  if (that.configList.UNIFY_SEARCH_CORNERMARK_URL) {
                    let cornerMarkUrlArr = [];
                    that.configList.UNIFY_SEARCH_CORNERMARK_URL.forEach(
                      (itemY, indexY) => {
                        let cornerMarkArr = [];
                        if (itemU.cornerMark) {
                          if (itemU.cornerMark instanceof Array) {
                            cornerMarkArr = itemU.cornerMark;
                          } else {
                            cornerMarkArr = itemU.cornerMark.split(",");
                          }
                        }
                        if (cornerMarkArr && cornerMarkArr.length > 0) {
                          cornerMarkArr.sort((a, b) => a - b);
                          cornerMarkArr.forEach((itemO) => {
                            if (itemO == itemY.code) {
                              cornerMarkUrlArr.push(itemY.name);
                              itemU.cornerMarkUrlArray = cornerMarkUrlArr;
                            }
                          });
                        }
                      }
                    );
                  }
                  if (
                    itemU.cornerMarkUrlArray &&
                    itemU.cornerMarkUrlArray.length > 0
                  ) {
                    itemU.cornerMarkUrl = itemU.cornerMarkUrlArray[0];
                  }

                  if (that.configList.UNIFY_SEARCH_BUY_WAY) {
                    that.configList.UNIFY_SEARCH_BUY_WAY.forEach(
                      (itemN, indexN) => {
                        if (itemU.buyType && itemU.buyType == itemN.code) {
                          itemU.buyTypeUrl = itemN.name;
                          itemU.buyTypeName = itemN.name;
                          itemU.tagWidth = getConWidth(itemU.buyTypeName);
                        }
                      }
                    );
                  }

                  //图片判断
                  // if( itemU.iconUrl && itemU.iconUrl.replace(' ','').split(":")[0].indexOf("https") == -1 ){
                  // if(itemU.iconUrl && itemU.iconUrl.replace(' ','').split(":")[1]
                  // && itemU.iconUrl.replace(' ','').split(":")[1].indexOf("activity.cmcc-cs.cn") != -1){
                  //
                  // }else{
                  //   itemU.iconUrl = itemD.wholeDefaultPic;
                  // }
                  // }else{

                  // if (
                  //   itemU.iconUrl &&
                  //   itemU.iconUrl.replace(" ", "").split(":")[1] &&
                  //   itemU.iconUrl
                  //     .replace(" ", "")
                  //     .split(":")[1]
                  //     .indexOf("10.4.160.6") != -1
                  // ) {
                  //   itemU.iconUrl = itemD.wholeDefaultPic;
                  // }
                  // }

                  if (
                    itemU.iconUrl &&
                    itemU.iconUrl.replace(" ", "").split(":")[1] &&
                    itemU.iconUrl
                      .replace(" ", "")
                      .split(":")[1]
                      .indexOf("10.4.160.6") != -1
                  ) {
                    itemU.iconUrl = itemD.wholeDefaultPic;
                  }
                });

                if (
                  itemD.wholeTemplateId == that.CONSTANTS.TEMPLATEPAGE.SERV001
                ) {
                  // 会有二级分类也是服务的场景
                  xList.push(itemD);
                } else {
                  yList.push(itemD);
                }
              });
            }
          });

          if (categoryCodeIn == "CSRDC_ALL") {
            sessionStorage.setItem(
              "allSearchResultSes",
              JSON.stringify(that.searchTable)
            );
          }

          // if (that.initFlag) { // 初始化的时候才加载tab
          that.searchTable.forEach((item, index) => {
            const obj = {};
            let categoryNameFlg =
              sessionStorage.pageEntrance == "6"
                ? "权益"
                : sessionStorage.pageEntrance == "8"
                ? "商城"
                : item.categoryName;

            obj.categoryCode = item.categoryCode || "";
            obj.categoryName = categoryNameFlg || "";
            obj.templateId = item.wholeTemplateId || "";
            obj.wholeTemplateId = item.wholeTemplateId || "";
            obj.verticalTemplateId = item.verticalTemplateId || "";
            obj.parentCode = item.parentCode || "";
            obj.data = item.data || [];
            obj.subList = item.subList || [];
            obj.pCode = "P00000050500";
            obj.showFlag = item.showFlag || "";
            that.tabsList.push(obj);
          });

          console.log("格式化完成的搜索请求数据===>");
          console.log(that.searchTable);

          //垂直页的时候不需要展示全部--从config接口里拿到includePage用
          if (!sessionStorage.pageEntranceIncludedPage.includes("1")) {
            // that.tabsList.unshift({ categoryCode: 'CSRDC_ALL', categoryName: '全部', pCode:'P00000050500', templateId:that.CONSTANTS.TEMPLATEPAGE.CATEALL, showFlag:false });
          } else {
            that.tabsList.unshift({
              categoryCode: "CSRDC_ALL",
              categoryName: "全部",
              pCode: "P00000050500",
              wholeTemplateId: that.CONSTANTS.TEMPLATEPAGE.CATEALL,
              showFlag: true,
            });
          }

          // 组装全部页头部标签页 触点曝光所需impAttrs参数
          that.tabsList.forEach((itemTab, indexTab) => {
            const impAttrs = {};
            // impAttrs.position_id = indexTab+1;
            impAttrs.XY_transaction_id = that.getSearchUUID();
            // impAttrs.type = "once";
            impAttrs.WT_et = "imp";
            impAttrs.WT_event = itemTab.pCode;
            impAttrs.WT_envName = itemTab.categoryName;
            impAttrs.XY_point_position = indexTab + 1;
            impAttrs.WT_markId = itemTab.categoryCode;
            impAttrs.WT_plat = sessionStorage.pagePlat || "";
            impAttrs.WT_es = sessionStorage.pageUrl || "";
            impAttrs.WT_ti = "搜索结果页";
            impAttrs.XY_pageEntry = sessionStorage.pageEntrance || ""; //新增页面入口

            // 插码方案修改2025-1-16
            impAttrs.WT_area_type_1 = "楼层";
            impAttrs.areaid = ""; // 父物品id信息（无父物品传空）
            impAttrs.WT_area_type_2 = itemTab.categoryName;
            impAttrs.WT_area_name = itemTab.categoryName; // 若没有二级分类，此名称则记录为一级分类名称
            impAttrs.XY_env_type = "icon";
            impAttrs.XY_gd_source = "搜索平台";
            impAttrs.XY_scene = this.getSearchContent() || ""; // 搜索内容
            impAttrs.WT_si_n = itemTab.categoryName; // 物品对应的名称
            impAttrs.WT_goods_id = ""; // 物品所对应的id信息
            impAttrs.XY_visit_source = sessionStorage.pageEntrance || ""; // 访问来源
            // impAttrs.XY_transaction_id = that.getSearchUUID(); // 这里没有设置XY_transaction_id 是在上报传参时统一设置了

            itemTab.impAttrsTabs = impAttrs;
            that.tabListCodeString += itemTab.categoryCode + ",";
          });
          // }

          if (that.searchZoneResultFlag) {
            that.searchZoneResultList = JSON.parse(
              sessionStorage.searchZoneResultListSes
            );
            console.log("又开始循环了=====>");
            console.log(that.tabsList);
            console.log(that.searchZoneResultList);
            // 去重
            that.tabsList = that.tabsList
              .concat(that.searchZoneResultList)
              .reduce((acc, cur) => {
                if (
                  !acc.find((item) => item.categoryCode === cur.categoryCode)
                ) {
                  acc.push(cur);
                }
                return acc;
              }, []);

            // 这里处理专区数据的曝光
            that.searchZoneResultList.forEach((szItem, szIndex) => {
              that.tabsList.forEach((tbItem, tbIndex) => {
                // that.templateList && that.templateList.forEach((itemN, indexN) => {
                //   if (tbItem.categoryCode == itemN.displayCategoryCode) {
                //     tbItem.wholeTemplateId = itemN.wholeTemplateId;
                //     tbItem.verticalTemplateId = itemN.verticalTemplateId;
                //     tbItem.wholeDefaultPic = itemN.wholeDefaultPic;
                //     tbItem.verticalDefaultPic = itemN.verticalDefaultPic;
                //     tbItem.wholeTemplateFieldList = itemN.wholeTemplateFieldList;
                //     tbItem.verticalTemplateFieldList = itemN.verticalTemplateFieldList;
                //   }
                // });
                if (szItem.categoryCode == tbItem.categoryCode) {
                  tbItem.dispOrd = szItem.dispOrd;
                  if (tbItem.subList && tbItem.subList.length > 0) {
                    // 有二级类目的比如商品，生活，数据在sublist里
                    var mergedProdArr = tbItem.subList
                      .concat(szItem.subList)
                      .reduce((acc, cur) => {
                        if (
                          !acc.find(
                            (item) => item.categoryCode === cur.categoryCode
                          )
                        ) {
                          acc.push(cur);
                        }
                        return acc;
                      }, []);
                    // mergedProdArr.forEach((tbsubItem,tbsubIndex) => {
                    //   that.templateList && that.templateList.forEach((itemF, indexF) => {
                    //     if (tbsubItem.categoryCode == itemF.categoryCode) {
                    //       tbsubItem.wholeTemplateId = itemF.wholeTemplateId;
                    //       tbsubItem.verticalTemplateId = itemF.verticalTemplateId;
                    //       tbsubItem.wholeDefaultPic = itemF.wholeDefaultPic;
                    //       tbsubItem.verticalDefaultPic = itemF.verticalDefaultPic;
                    //       tbsubItem.wholeTemplateFieldList = itemF.wholeTemplateFieldList;
                    //       tbsubItem.verticalTemplateFieldList = itemF.verticalTemplateFieldList;
                    //     }
                    //   });
                    // })
                    szItem.subList.forEach((szSubItem, szSubIndex) => {
                      mergedProdArr.forEach((tbSubItem, tbSubIndex) => {
                        if (szSubItem.categoryCode == tbSubItem.categoryCode) {
                          tbSubItem.searchZoneData =
                            szSubItem.searchZoneDataPre;
                          if (
                            tbSubItem.searchZoneData &&
                            tbSubItem.searchZoneData.length > 0
                          ) {
                            tbSubItem.subTitleFlag =
                              tbSubItem.searchZoneData.every(
                                (item) => !item.subTitle
                              );
                            tbSubItem.eightFlag = tbSubItem.searchZoneData.some(
                              (item) => item.pCode == "P00000057388"
                            );
                          }

                          tbSubItem.searchZoneData.forEach(
                            (tbSzItem, tbSzIndex) => {
                              tbSzItem.categoryName = szItem.categoryName;

                              if (
                                tbSzItem.pCode == "P00000057388" &&
                                szItem.subList.length == 1
                              ) {
                                //只有一个小图的场景 位置4，pCode=P00000057388
                                //默认小图片判断 defaultUrl 待提供
                                tbSzItem.defaultUrl = require("../../assets/images/img2.png");
                              } else {
                                //默认大图片判断 defaultUrl 待提供
                                tbSzItem.defaultUrl = require("../../assets/images/img3.png");
                              }
                              //这里是判断图片路径是否正确，不正确的话就将错误iconUrl替换为defaultUrl展示
                              // if( tbSzItem.iconUrl && tbSzItem.iconUrl.replace(' ','').split(":")[0].indexOf("https") == -1 ){
                              // if(tbSzItem.iconUrl && tbSzItem.iconUrl.replace(' ','').split(":")[1]
                              // && tbSzItem.iconUrl.replace(' ','').split(":")[1].indexOf("activity.cmcc-cs.cn") != -1){
                              //   //
                              // }else{
                              //   tbSzItem.iconUrl = tbSzItem.defaultUrl;
                              // }
                              // }else{
                              if (
                                tbSzItem.iconUrl &&
                                tbSzItem.iconUrl
                                  .replace(" ", "")
                                  .split(":")[1] &&
                                tbSzItem.iconUrl
                                  .replace(" ", "")
                                  .split(":")[1]
                                  .indexOf("10.4.160.6") != -1
                              ) {
                                tbSzItem.iconUrl = tbSzItem.defaultUrl;
                              }
                              if (
                                tbSzItem.iconUrl &&
                                tbSzItem.iconUrl
                                  .replace(" ", "")
                                  .split(":")[1] &&
                                tbSzItem.iconUrl
                                  .replace(" ", "")
                                  .split(":")[1]
                                  .indexOf("172.22.225.71") != -1
                              ) {
                                tbSzItem.iconUrl = tbSzItem.defaultUrl;
                              }
                              // }

                              const impAttrs = {};
                              // impAttrs.position_id = 1;
                              // impAttrs.type = "once";
                              impAttrs.WT_et = "imp";
                              impAttrs.WT_event = tbSzItem.pCode;
                              impAttrs.WT_envName = tbSzItem.title;
                              impAttrs.XY_first_class =
                                sessionStorage.pageEntrance == "6"
                                  ? "权益"
                                  : sessionStorage.pageEntrance == "8"
                                  ? "商城"
                                  : szItem.categoryName;
                              // impAttrs.XY_point_position = 1;
                              impAttrs.WT_markId = tbSzItem._id;
                              impAttrs.WT_next_url = tbSzItem.linkAdress;
                              impAttrs.WT_plat = sessionStorage.pagePlat || "";
                              impAttrs.WT_es = sessionStorage.pageUrl || "";
                              impAttrs.WT_ti = "搜索结果页";
                              impAttrs.XY_pageEntry =
                                sessionStorage.pageEntrance || ""; //新增页面入口

                              // 插码方案修改2025-1-16
                              impAttrs.XY_second_class = szSubItem.categoryName;
                              impAttrs.WT_area_type_1 = "楼层";
                              impAttrs.areaid = ""; // 父物品id信息（无父物品传空）
                              impAttrs.WT_area_type_2 = szSubItem.categoryName;
                              impAttrs.WT_area_name = `${tbSzItem.categoryName}_${szSubItem.categoryName}`; // 若没有二级分类，此名称则记录为一级分类名称
                              impAttrs.XY_env_type = "icon";
                              impAttrs.XY_gd_source = "搜索平台";
                              impAttrs.XY_scene = this.getSearchContent() || ""; // 搜索内容
                              impAttrs.WT_si_n = tbSzItem.title; // 物品对应的名称
                              impAttrs.WT_goods_id = tbSzItem.itemId; // 物品所对应的id信息
                              impAttrs.XY_visit_source =
                                sessionStorage.pageEntrance || ""; // 访问来源
                              // impAttrs.XY_transaction_id = that.getSearchUUID(); // 这里没有设置XY_transaction_id 是在上报传参时统一设置了
                              impAttrs.XY_transaction_id = that.getSearchUUID(); //

                              tbSzItem.impAttrsList = impAttrs;
                            }
                          );
                        }
                      });
                      tbItem.subList = mergedProdArr;
                    });
                  } else {
                    if (tbItem.categoryCode !== "CSRDC_ALL") {
                      let index = that.templateList
                        ? that.templateList.findIndex(
                            (e) => e.displayCategoryCode === tbItem.categoryCode
                          )
                        : [];
                      tbItem.wholeTemplateId =
                        index !== -1
                          ? that.templateList[index].wholeTemplateId
                          : "";
                    }
                    tbItem.dispOrd = szItem.dispOrd;
                    tbItem.searchZoneData = szItem.searchZoneDataPre;
                    if (
                      tbItem.searchZoneData &&
                      tbItem.searchZoneData.length > 0
                    ) {
                      tbItem.subTitleFlag = tbItem.searchZoneData.every(
                        (item) => !item.subTitle
                      );
                      tbItem.eightFlag = tbItem.searchZoneData.some(
                        (item) => item.pCode == "P00000057388"
                      );
                    }
                    tbItem.searchZoneData.forEach((szDataItem, szDataIndex) => {
                      if (
                        szDataItem.pCode == "P00000057388" &&
                        szItem.searchZoneDataPre.length == 1
                      ) {
                        //只有一个小图的场景 位置4，pCode=P00000057388
                        //默认小图片判断 defaultUrl 待提供
                        szDataItem.defaultUrl = require("../../assets/images/img2.png");
                      } else {
                        //默认大图片判断 defaultUrl 待提供
                        szDataItem.defaultUrl = require("../../assets/images/img3.png");
                      }
                      //这里是判断图片路径是否正确，不正确的话就将错误iconUrl替换为defaultUrl展示
                      // if( szDataItem.iconUrl && szDataItem.iconUrl.replace(' ','').split(":")[0].indexOf("https") == -1 ){
                      // if(szDataItem.iconUrl && szDataItem.iconUrl.replace(' ','').split(":")[1]
                      // && szDataItem.iconUrl.replace(' ','').split(":")[1].indexOf("activity.cmcc-cs.cn") != -1){
                      //   //
                      // }else{
                      //   szDataItem.iconUrl = szDataItem.defaultUrl;
                      // }
                      // }else{
                      if (
                        szDataItem.iconUrl &&
                        szDataItem.iconUrl.replace(" ", "").split(":")[1] &&
                        szDataItem.iconUrl
                          .replace(" ", "")
                          .split(":")[1]
                          .indexOf("10.4.160.6") != -1
                      ) {
                        szDataItem.iconUrl = szDataItem.defaultUrl;
                      }
                      if (
                        szDataItem.iconUrl &&
                        szDataItem.iconUrl.replace(" ", "").split(":")[1] &&
                        szDataItem.iconUrl
                          .replace(" ", "")
                          .split(":")[1]
                          .indexOf("172.22.225.71") != -1
                      ) {
                        szDataItem.iconUrl = szDataItem.defaultUrl;
                      }
                      // }
                      const impAttrs = {};
                      // impAttrs.position_id = 1;
                      impAttrs.XY_transaction_id = that.getSearchUUID();
                      // impAttrs.type = "once";
                      impAttrs.WT_et = "imp";
                      impAttrs.WT_event = szDataItem.pCode;
                      impAttrs.WT_envName = szDataItem.title;
                      impAttrs.XY_first_class =
                        sessionStorage.pageEntrance == "6"
                          ? "权益"
                          : sessionStorage.pageEntrance == "8"
                          ? "商城"
                          : szItem.categoryName;
                      // impAttrs.XY_point_position = 1;
                      impAttrs.WT_markId = szDataItem._id;
                      impAttrs.WT_next_url = szDataItem.linkAdress;
                      impAttrs.WT_plat = sessionStorage.pagePlat || "";
                      impAttrs.WT_es = sessionStorage.pageUrl || "";
                      impAttrs.WT_ti = "搜索结果页";
                      impAttrs.XY_pageEntry = sessionStorage.pageEntrance || ""; //新增页面入口

                      // 插码方案修改2025-1-16
                      impAttrs.XY_second_class = szItem.categoryName;
                      impAttrs.WT_area_type_1 = "楼层";
                      impAttrs.areaid = ""; // 父物品id信息（无父物品传空）
                      impAttrs.WT_area_type_2 = szItem.categoryName;
                      impAttrs.WT_area_name = szItem.categoryName; // 若没有二级分类，此名称则记录为一级分类名称
                      impAttrs.XY_env_type = "icon";
                      impAttrs.XY_gd_source = "搜索平台";
                      impAttrs.XY_scene = this.getSearchContent() || ""; // 搜索内容
                      impAttrs.WT_si_n = szDataItem.title; // 物品对应的名称
                      impAttrs.WT_goods_id = szDataItem.itemId; // 物品所对应的id信息
                      impAttrs.XY_visit_source =
                        sessionStorage.pageEntrance || ""; // 访问来源
                      // impAttrs.XY_transaction_id = that.getSearchUUID(); // 这里没有设置XY_transaction_id 是在上报传参时统一设置了

                      szDataItem.impAttrsList = impAttrs;
                    });
                  }
                }
              });
            });

            // that.tabsList= that.tabsList.concat(mergeArr);
            // 专区统一给tabs触点赋值+templateId赋值
            // 疑似兜底代码路基
            that.tabsList.forEach((itemTabsList, indexTabsList) => {
              if (
                itemTabsList.pCode == "" ||
                itemTabsList.pCode == undefined ||
                itemTabsList.pCode == null
              ) {
                itemTabsList.pCode = "P00000050500"; // 插入pcode
                // itemP.parentCategoryName = item.categoryName;
                //组装触点曝光所需impAttrs参数
                const impAttrs = {};
                // impAttrs.position_id = indexTab+1;
                impAttrs.XY_transaction_id = that.getSearchUUID();
                // impAttrs.type = "once";
                impAttrs.WT_et = "imp";
                impAttrs.WT_event = itemTabsList.pCode;
                impAttrs.WT_envName = itemTabsList.categoryName;
                impAttrs.XY_point_position = indexTabsList + 1;
                impAttrs.WT_markId = itemTabsList.categoryCode;
                impAttrs.WT_plat = sessionStorage.pagePlat || "";
                impAttrs.WT_es = sessionStorage.pageUrl || "";
                impAttrs.WT_ti = "搜索结果页";
                impAttrs.XY_pageEntry = sessionStorage.pageEntrance || ""; //新增页面入口

                // 插码方案修改2025-1-16
                impAttrs.XY_second_class = itemTabsList.categoryName;
                impAttrs.WT_area_type_1 = "楼层";
                impAttrs.areaid = ""; // 父物品id信息（无父物品传空）
                impAttrs.WT_area_type_2 = itemTabsList.categoryName;
                impAttrs.WT_area_name = itemTabsList.categoryName; // 若没有二级分类，此名称则记录为一级分类名称
                impAttrs.XY_env_type = "icon";
                impAttrs.XY_gd_source = "搜索平台";
                impAttrs.XY_scene = this.getSearchContent() || ""; // 搜索内容
                impAttrs.WT_si_n = itemTabsList.title; // 物品对应的名称
                impAttrs.WT_goods_id = ""; // 物品所对应的id信息---tab标签没有id信息
                impAttrs.XY_visit_source = sessionStorage.pageEntrance || ""; // 访问来源
                // impAttrs.XY_transaction_id = that.getSearchUUID(); // 这里没有设置XY_transaction_id 是在上报传参时统一设置了

                itemTabsList.impAttrsTabs = impAttrs;

                that.tabListCodeString += itemTabsList.categoryCode + ",";
              }

              that.templateList &&
                that.templateList.forEach((itemD, indexD) => {
                  if (itemTabsList.categoryCode == itemD.displayCategoryCode) {
                    //区分全部/垂直templateId
                    itemTabsList.wholeTemplateId = itemD.wholeTemplateId;
                    itemTabsList.verticalTemplateId = itemD.verticalTemplateId;
                    itemTabsList.wholeDefaultPic = itemD.wholeDefaultPic;
                    itemTabsList.verticalDefaultPic = itemD.verticalDefaultPic;
                    itemTabsList.wholeTemplateFieldList =
                      itemD.wholeTemplateFieldList;
                    itemTabsList.verticalTemplateFieldList =
                      itemD.verticalTemplateFieldList;
                    if (
                      itemTabsList.subList &&
                      itemTabsList.subList.length > 0
                    ) {
                      itemTabsList.subList.forEach((itemDe) => {
                        that.templateList &&
                          that.templateList.forEach((itemF, indexF) => {
                            if (
                              itemDe.categoryCode == itemF.displayCategoryCode
                            ) {
                              itemDe.wholeTemplateId = itemF.wholeTemplateId;
                              itemDe.verticalTemplateId =
                                itemF.verticalTemplateId;
                              itemDe.wholeDefaultPic = itemF.wholeDefaultPic;
                              itemDe.verticalDefaultPic =
                                itemF.verticalDefaultPic;
                              itemDe.wholeTemplateFieldList =
                                itemF.wholeTemplateFieldList;
                              itemDe.verticalTemplateFieldList =
                                itemF.verticalTemplateFieldList;
                            }
                          });
                      });
                    }
                  }
                });
            });

            // 按搜索专区给的dispOrd 从-1到大排序
            // that.tabsList = that.tabsList.sort((a, b) => a.dispOrd - b.dispOrd);

            that.tabsList.forEach((tab) => {
              if (tab.subList && tab.subList.length > 0) {
                // tab.subList.sort((a, b) => a.dispOrd - b.dispOrd);
              }
            });
          }

          // 定位判断
          // if (sessionStorage.initGetLocationFlag == '1') {
          let posList = [];
          let locationFlag = false;
          console.log(yList, "yList");

          yList.forEach((itemPos, indexPos) => {
            itemPos.data.map((itemPP) => {
              if (
                itemPP.location != null &&
                itemPP.location != undefined &&
                itemPP.location != ""
              ) {
                posList.push(itemPP.location);
              }
            });
            if (
              (itemPos.wholeTemplateId ==
                that.CONSTANTS.TEMPLATEPAGE.PRODHW004 ||
                itemPos.verticalTemplateId ==
                  that.CONSTANTS.TEMPLATEPAGE.PRODHW004 ||
                itemPos.wholeTemplateId ==
                  that.CONSTANTS.TEMPLATEPAGE.PRODMB0053) &&
              posList &&
              posList.length > 0
            ) {
              locationFlag = true;
            }
          });
          // 结果页拉起定位，存在安全问题，让其不生效
          // if (locationFlag && (that.latitude == "" || that.longtitude == "")) {
          //   that.getRealLocation();
          // }

          // }
          //存储IOP缓存
          const keyword = `${that.paramData.phoneNum}_${that.searchContent}`; // 拼接搜索关键字
          const keywords = getKeywordsFromSession(); // 获取当前缓存的搜索关键字数组
          let obj = {};
          obj.value = res.info || null;
          obj.label = keyword;
          keywords.push(obj); // 将新的关键字推入数组
          if (keywords.length > 500) {
            keywords.splice(0, 100); // 删除前100个关键字
          }
          const uniqueA = Array.from(
            new Set(keywords.map((item) => JSON.stringify(item)))
          ).map((item) => JSON.parse(item));
          saveKeywordsToSession(uniqueA); // 缓存更新后保存到 Session Storage

          that.tabsList = Array.from(
            new Set(that.tabsList.map(JSON.stringify))
          ).map(JSON.parse);
          that.updateTabVisibility();

          sessionStorage.setItem("tabsListSes", JSON.stringify(that.tabsList));
          // } else {
          //   that.tabsList = JSON.parse(sessionStorage.getItem('tabsListSes'));
          // }
          // console.log(that.tabsList,'00000')
          // that.currentCompList = [{ path: 'EnterXList', refD: 'EnterXListRef' }, { path: 'EnterYList', refD: 'EnterYListRef' }], // 当前组件
          // that.$nextTick(() => {
          //   that.$refs.EnterXListRef[0].arrXList = xList;
          //   that.$refs.EnterYListRef[0].arrList = yList;
          // });
          // that.currentCompList = [{ path: 'EnterYList', refD: 'EnterYListRef' }], // 当前组件
          if (!sessionStorage.pageEntranceIncludedPage.includes("1")) {
            that.handleTab(0, that.tabsList[0].categoryName);
          } else {
            that.currentCom = "EnterYList";
            that.currentRef = "EnterYListRef";
          }
          // xList.sort((a, b) => b.maxScore - a.maxScore);
          // yList.sort((a, b) => b.maxScore - a.maxScore);
          that.$nextTick(() => {
            // 把ai的显隐滞后一点吧
            // console.log('查询到数据才回显ai')
            // this.showAiFlag = true

            that.searchTable = that.tabsList;
            // if(!that.searchZoneResultFlag){
            if (sessionStorage.pageEntranceIncludedPage.includes("1")) {
              // 保持服务端返回的原始顺序，不将xList放在最后
              let arr = [];
              // 遍历原始searchTable，保持原始顺序
              that.searchTable.forEach(item => {
                if (item.wholeTemplateId == that.CONSTANTS.TEMPLATEPAGE.SERV001) {
                  // 服务数据
                  arr.push(item);
                } else if (item.subList && item.subList.length == 0) {
                  // 非服务且无二级分类
                  arr.push(item);
                } else if (item.subList && item.subList.length > 0) {
                  // 有二级分类的数据
                  item.subList.forEach(subItem => {
                    arr.push(subItem);
                  });
                }
              });
              // 保持服务端返回的原始顺序，不按maxScore排序
              // arr.sort((a, b) => b.maxScore - a.maxScore);
              
              // 对搜索结果和专区数据进行合并去重（按链接+省份维度）
              console.log('this.$isProvinceDistinct是否开启', this.$isProvinceDistinct,);
              const mergedItems = mergeSearchAndZoneData(arr, this.$isProvinceDistinct);
              
              // that.$refs.EnterYListRef[0].searchTableY = arr;
              // that.$refs.EnterYListRef[0].arrXList = arr;
              that.$refs.EnterYListRef[0].searchTableY = mergedItems;
              that.$refs.EnterYListRef[0].arrXList = mergedItems;
              console.log("页面渲染的最终数据X===>");
              console.log(xList);
              console.log("页面渲染的最终数据Y===>");
              console.log(yList);
              console.log("页面渲染的最终数据ALL===>");
              console.log(arr);
              console.log("搜索结果和专区合并去重后数据===>");
              console.log(mergedItems);
              //that.$refs.EnterYListRef[0].arrList = arr;
              that.$refs.EnterYListRef[0].arrList = mergedItems;
            }
            // }
            //如果专区全部有数据，就加个标识，for全部里的无数据 这时候要展示全部-专区
            //搜索关键词只匹配到垂直页的搜索专区数据时，全部页应展示为无搜索结果样式，且无需展示为你推荐数据
            let index = that.tabsList.findIndex(
              (e) => e.categoryCode === "CSRDC_ALL"
            );
            if (index > -1) {
              if (res.data.result && res.data.result.length == 0) {
                that.searchZoneResult_All = true;
              }
            }
            if (
              res.data.result &&
              res.data.result.length == 0 &&
              that.searchZoneResultFlag
            ) {
              that.noDataShow_All = true;
            }
          });
        } else {
          that.noDataShow = true;
          that.$nextTick(() => {
            //为您推荐专区查询
            setTimeout(() => {
              that.$refs.noDataRef?.$refs.recommendRef?.handleQueryResult();
            }, 500);
          });
          // that.currentCompList = [{ path: 'NoData', refD: 'NoDataRef' }];
        }
        console.log("前端处理数据耗时==>");
        console.timeEnd("indexSearch");
      } else {
        that.noDataShow = true;
        that.$nextTick(() => {
          //为您推荐专区查询
          setTimeout(() => {
            that.$refs.noDataRef?.$refs.recommendRef?.handleQueryResult();
          }, 500);
        });
      }
    },

    getRealLocation() {
      isPermission()
        .then((res) => {
          // 已授权
          console.log("获取位置已授权");
          getLocation()?.then((position) => {
            if (position === 0) {
              console.log("获取定位失败");
              this.hasLocation = false;
              this.latitude = "";
              this.longtitude = "";
            } else {
              console.log(position, "-----position------");
              let latitude = position?.coords?.latitude || "";
              let longtitude = position?.coords?.longtitude || "";
              if (latitude && latitude == "0.000000") {
                latitude = "";
              }
              if (longtitude && longtitude == "0.000000") {
                longtitude = "";
              }
              updateSessionStorage("longtitude", String(longtitude));
              updateSessionStorage("latitude", String(latitude));
              this.latitude = latitude;
              this.longtitude = longtitude;
              this.locationInfo = { latitude, longtitude };
            }
          });
        })
        .catch((err) => {
          getRefuseTime().then((res) => {
            console.log(res, "获取拒绝时间差");
            if (res) {
              getLocation()?.then((position) => {
                if (position === 0) {
                  console.log("获取定位失败");
                  this.hasLocation = false;
                  this.latitude = "";
                  this.longtitude = "";
                } else {
                  console.log(position, "-----position------");
                  let latitude = position?.coords?.latitude || "";
                  let longtitude = position?.coords?.longtitude || "";
                  if (latitude && latitude == "0.000000") {
                    latitude = "";
                  }
                  if (longtitude && longtitude == "0.000000") {
                    longtitude = "";
                  }
                  updateSessionStorage("longtitude", String(longtitude));
                  updateSessionStorage("latitude", String(latitude));
                  this.latitude = latitude;
                  this.longtitude = longtitude;
                  this.locationInfo = { latitude, longtitude };
                }
              });
            }
          });
        });
    },

    // 三个入驻更新
    refreshTreeCard() {
      this.$nextTick(() => {
        console.log(this.$refs.threeCardRef);
        // 在tab标签页中 三个入驻的refs对象是个数组
        if (this.$refs.threeCardRef) {
          this.$refs.threeCardRef[0]?.updateManager();
        }
      });
    },
    //号码信息高亮处理
    highlightPhoneNumber(item) {
      const userInfo = localStorage.getItem("userInfo")
        ? JSON.parse(localStorage.getItem("userInfo"))
        : null;
      // 获取到对应的号码高亮信息
      const highlightInfo = checkHighlightNumber(item, userInfo)
      // 获取号码的高亮数组，用于进行样式高亮渲染
      const numberArr = item.number.split('').map((item, index) => {
        let highlight = false
        if (highlightInfo && index >= highlightInfo.startIndex && index <= highlightInfo.endIndex) {
          highlight = true
        }
        return {
          value: item,
          highlight
        }
      })
      // 进行空格分段处理
      const spaceItem = {
        value: " ",
        highlight: false
      }
      numberArr.splice(7, 0, spaceItem)
      numberArr.splice(3, 0, spaceItem)
      return numberArr
    },

    getHotMobileNum() {
      try {
        const pageEntrance = getQueryStringNew().pageEntrance;
        const userInfo = localStorage.getItem("userInfo")
          ? JSON.parse(localStorage.getItem("userInfo"))
          : null;
        const getUrlParam = handleGetUrlParam();
        const loginProvince = userInfo?.loginProvince || (userInfo?.province ? userInfo?.province : ""); // 省份参数兜底优化
        const searchContent = this.getSearchContent();
        const iopResultRes =
          checkoutKeywordsToSession(searchContent) != "999999"
            ? checkoutKeywordsToSession(searchContent)
            : null;
        this.paramsPlan.province = userInfo?.province || "";
        this.paramsPlan.version = userInfo?.version
          ? `10_10,${userInfo?.version}`
          : "10_10";
        this.paramsPlan.beans = getUrlParam.beans;
        this.paramsPlan.pageEntrance = pageEntrance || "";
        this.paramsPlan.loginProvince = loginProvince;
        this.paramsPlan.loginCity = userInfo?.loginCity || "";
        this.paramsPlan.phoneNumber = userInfo?.phoneNumber || "";
        this.paramsPlan.cid = userInfo?.cid || "";
        this.paramsPlan.xk = userInfo?.xk || "";
        this.paramsPlan.osType = userInfo?.osType || "";
        this.paramsPlan.iopResult = "";
        this.paramsPlan.correctionFlag = this.getCorrectionFlag();
        this.paramsPlan.city = userInfo?.city || "";
        const paramNum = {
          province: this.paramsPlan.province,
          phoneNumber: this.paramsPlan.phoneNumber,
          st: isHarmony() ? 10 : isIOS ? 2 : 1, // 客户端类型 1 安卓 2 ios  10 鸿蒙
          city: this.paramsPlan.city,
          version: this.paramsPlan.version,
          pageEntrance: this.paramsPlan.pageEntrance,
          loginProvince: this.paramsPlan.loginProvince, // 用户归属地-省份
          loginCity: this.paramsPlan.loginCity, // 用户归属地-地市
          touchCode: 'P00000132680',
          xk: this.paramsPlan.xk,
        }
        console.log('获取结果号卡---start', paramNum)
        CommonApi.queryResultHotMobileNum(paramNum).then(res => {
          if (res.code == "000000" && res.data) {
            console.log(res.data, '号卡数据获取')
            this.hotMobileNumData = res.data
          }
        })
      } catch (error) {
        console.log(error);
      }
    },

    getHotMobilePlan() {
      console.log('重新获取')
      try {
        const searchContent = this.getSearchContent();
        this.paramsPlan.params.keyWord = searchContent || ""
        console.log(this.paramsPlan, '获取套餐计划---')
        CommonApi.queryResultHotMobilePlan(this.paramsPlan).then(res => {
          console.log('请求套餐--', res.data)
          if (res.code == "000000" && res.data) {
            this.hideLoading()
            sessionStorage.setItem(
              "hotMobilePlanData",
              JSON.stringify(res.data)
            );
            if (isHarmony()) {
              this.showHotMobilePlan = false
            } else {
              this.showHotMobilePlan = true
            }
          }
        })
      } catch (error) {
        this.hideLoading()
        console.log(error)
      }
    },

    async getHotPlan() {
      await this.getHotMobileNum()
      this.getHotMobilePlan()
    },

    refreshHotMobileNum() {
      console.log('重新获取号卡数据-----')
      this.getHotMobileNum()
    },
  },
};
</script>

<style scoped lang='scss'>
.correction-container {
  font-size: 24px;
  color: #999;
}

.tab-wrap .tabs ul::-webkit-scrollbar {
  display: none;
}

.tab-wrap .tabs ul::-moz-scrollbar {
  display: none;
}

.tab-content::-webkit-scrollbar {
  display: none;
}

.tab-content::-moz-scrollbar {
  display: none;
}

.tab-wrap {
  height: 100%;

  .tabs ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    height: 100px;
    overflow-x: auto;
    overflow-y: hidden;
    scrollbar-width: none;
    white-space: nowrap;
  }

  .tabs li {
    font-size: 32px;
    color: #333333;
    line-height: 80px;
    height: 100%;
    position: relative;
    text-align: center;
    margin-right: 55px;
    // min-width: 70px;
  }

  .tabs li.active {
    color: #000000;
    font-weight: 500;
  }

  .tabs .active-line {
    position: absolute;
    bottom: 25px;
    left: 0;
    z-index: 1;
    height: 6px;
    width: 100%;
    background: linear-gradient(90deg, #0095ff 0%, #0080ff 100%);
    border-radius: 3px;
    // transform: translateX(10px) translateX(10%);
    // transition-duration: 1s;
  }

  .tab-content {
    //
    height: calc((100% - 106px));
    overflow-y: auto;
    scrollbar-width: none;
  }
}

.bottom-line {
  font-size: 24px;
  font-weight: 400;
  color: #cccccc;
  line-height: 33px;
  // margin:30px 0px 0px 0px;
  text-align: center;
  margin: 36px 0;
}

.h100 {
  height: 100%;
  border-radius: 18px;
}

::v-deep.swiper-container {
  overflow: auto;
  height: 100%;
  scrollbar-width: none;
}

::v-deep.swiper-container::-webkit-scrollbar {
  display: none;
}

::v-deep.swiper-container::-moz-scrollbar {
  display: none;
}

::v-deep .van-tab {
  align-items: flex-start;
  font-size: 32px;
  color: #333;
}

::v-deep .van-tabs__line {
  height: 6px;
  background: linear-gradient(90deg, #2892ff 0%, #007eff 100%);
  border-radius: 3px;
  width: 60px;
  // bottom: 38px;
}

::v-deep .van-tab__text--ellipsis {
  // white-space: nowrap;
  // overflow: inherit;
}

::v-deep .van-tabs {
  height: 100%;
}

::v-deep .van-tabs__nav {
  background: #f7f7f7;
}

::v-deep .van-tabs--line .van-tabs__wrap {
  margin-bottom: 27px;
  margin-left: -12px;
  margin-right: -12px;
  display: flex;
  justify-content: flex-start;
  height: 84px;
}

::v-deep .van-tab__pane {
  height: 100%;
  overflow-y: auto;
  scrollbar-width: none;
  border-radius: 18px;
  // padding-top:27px;
}

::v-deep .van-tab__pane::-webkit-scrollbar {
  display: none;
}

::v-deep .van-tab__pane::-webkit-scrollbar {
  display: none;
}

::v-deep .van-tabs__content {
  height: calc((100% - 106px));
  overflow-y: auto;
  scrollbar-width: none;
}

::v-deep .van-tabs__content::-webkit-scrollbar {
  display: none;
}

::v-deep .van-tabs__content::-webkit-scrollbar {
  display: none;
}

.vertical-content {
  margin-top: 52px;
  height: calc((100% - 52px));
  overflow-y: auto;
  scrollbar-width: none;
}

.vertical-content::-webkit-scrollbar {
  display: none;
}

.vertical-content::-webkit-scrollbar {
  display: none;
}

::v-deep .van-tabs__wrap--scrollable .van-tab .van-tab__text {
  // font-weight: 700;
  // font-family:PingFangSC-Medium, sans-serif;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  padding-top: 29px;
}

::v-deep .van-tabs__wrap--scrollable .van-tab--active .van-tab__text {
  font-weight: 700;
  font-family: PingFangSC-Medium, PingFang SC;
  // font-weight: 500;
}

// ::v-deep .van-tabs__wrap--scrollable .van-tab:first-child{
//   padding-left:0px;
// }

::v-deep .van-tabs__nav--line.van-tabs__nav--complete {
  padding-left: 0px;
  padding-right: 0px;
}

.cover {
  height: 80px;
  position: absolute;
  // top: 0;
  left: 0;
  right: 0;
  // z-index: 100;
}

.left-cover,
.right-cover {
  width: 140px;
  height: 80px;
  position: absolute;
  top: 0;
  z-index: 100;
  pointer-events: none;
}

.left-cover {
  left: 0px;
  background: linear-gradient(90deg, #f7f7f7 0%, rgba(255, 255, 255, 0.1) 100%);
}

.right-cover {
  right: 0px;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.1) 0%, #f7f7f7 100%);
}

.display-none {
  display: none;
}

.mt-30 {
  margin-top: 30px;
}
.mb18 {
  margin-bottom: 18px;
}
</style>
