<template>
  <div class="default-con">
    <!-- 骨架屏 -->
    <default-skeleton v-show="isShowSkeleton"></default-skeleton>

    <template v-if="!isShowNewPage">
      <!-- 搜索默认词 -->
      <keep-alive>
        <default-words
          v-show="!pageErrorFlag"
          :defaultWords="defaultWords"
          :impAttrsDefaultWords="impAttrsDefaultWords"
          @getTrack="getTrack"
        ></default-words>
      </keep-alive>
      <!-- 历史搜索 -->
      <keep-alive>
        <!-- 历史搜索不根据接口返回状态判断显隐 -->
        <HistorySearch @getTrack="getTrack"></HistorySearch>
      </keep-alive>
      <!-- 搜索发现 -->
      <keep-alive>
        <search-discovery
          v-show="!pageErrorFlag"
          :disCoveryData="disCoveryData"
          :impAttrsDisCovery="impAttrsDisCovery"
          @getTrack="getTrack"
        ></search-discovery>
      </keep-alive>
      <!-- 全网热搜 -->
      <keep-alive>
        <hot-search
          v-show="!pageErrorFlag"
          :hotData="hotData"
          :impAttrsHot="impAttrsHot"
          @getTrack="getTrack"
        ></hot-search>
      </keep-alive>
      <!-- 猜你喜欢 -->
      <keep-alive>
        <guess-like
          v-show="!pageErrorFlag"
          :likeData="likeData"
          :bannerData="bannerData"
          :impAttrsLike="impAttrsLike"
          :impAttrsBanner="impAttrsBanner"
          @getTrack="getTrack"
        ></guess-like>
      </keep-alive>
      <!-- <div v-if="pageErrorFlag" class="error-wrap">
        <img src="@/assets/images/error-page.png" draggable="false" alt="" />
        <p>{{ pageErrorInfo }}</p>
        <div v-if="pageErrorBtn" class="btn" @click="reloadPage">重试</div>
      </div> -->
      <!-- 异常默认兜底页面 -->
      <DefaultPage v-if="pageErrorFlag"></DefaultPage>
    </template>

    <!-- 首页重构 -->
    <template v-if="isShowNewPage">
      <!-- 历史搜索 -->
      <keep-alive>
        <!-- 历史搜索不根据接口返回状态判断显隐 -->
        <HistorySearch @getTrack="getTrack"></HistorySearch>
      </keep-alive>
      <!-- 搜索发现 -->
      <keep-alive>
        <search-discovery-new
          v-show="!pageErrorFlag"
          :disCoveryData="disCoveryNewData"
          @getTrack="getTrack"
        ></search-discovery-new>
      </keep-alive>
      <!-- 搜索推荐 -->
      <keep-alive>
        <search-recommend
          v-show="!pageErrorFlag"
          :hotData="hotData"
          :impAttrsHot="impAttrsHot"
          @getTrack="getTrack"
          @getTab="getTab"
          ref="recommendRef"
        ></search-recommend>
      </keep-alive>
      <!-- 猜你喜欢 -->
      <keep-alive>
        <guess-like
          v-show="!pageErrorFlag && isShowTab === 'rmss'"
          :likeData="likeNewData"
          :bannerData="bannerNewData"
          :impAttrsLike="impAttrsLike"
          :impAttrsBanner="impAttrsBanner"
          @getTrack="getTrack"
        ></guess-like>
      </keep-alive>
      <!-- 异常默认兜底页面 -->
      <DefaultPage v-if="pageErrorFlag"></DefaultPage>
    </template>
  </div>
</template>

<script>
import CommonApi from "@/api/index";
import {
  getQueryString,
  isApp,
  getQueryStringNew,
  getDefaultPageLocalInfo,
} from "@/utils/tool";
// 移动优选模拟数据
// import {
//   MockGuessLikeData,
//   GuessLike1NewData,
//   GuessLike2NewData,
// } from "./GuessLikeData";
import DefaultSkeleton from "./skeleton.vue"; // 骨架屏
import DefaultWords from "./DefaultWords.vue";
import HistorySearch from "./HistorySearch.vue";
import SearchDiscovery from "./SearchDiscovery.vue"; // 搜索发现
import HotSearch from "./HotSearch.vue"; // 全网热搜
import GuessLike from "./GuessLike.vue"; // 猜你喜欢--后改名移动优选
import DefaultPage from "./DefaultPage.vue"; // 异常兜底页面
// 首页重构改版
// import { HomeNewPhoneList } from "./HomeNewPhoneList"; // 新版首页白名单
import SearchDiscoveryNew from "./SearchDiscoveryNew.vue"; // 搜索发现新版
import SearchRecommend from "./SearchRecommend.vue"; // 搜索推荐

export default {
  name: "default-index",
  components: {
    DefaultSkeleton,
    DefaultWords,
    HistorySearch,
    SearchDiscovery,
    HotSearch,
    GuessLike,
    SearchDiscoveryNew,
    SearchRecommend,
    DefaultPage,
  },
  data() {
    return {
      isShowSkeleton: true, // 骨架屏
      isShowNewPage: false,
      param: {
        provinceCode: "571", // 省编码
        cityCode: "0000", // 市编码
        cv: "7.9.0", // 客户端版本号
        st: "1", // 系统类型
        cellNum: "19805289925", // 登录手机号码
        pageEntrance: "1", // 页面入口枚举,1:普通版首页,2:PLUS 版首页,3:全球通首页,4:动感地带首页,5:分类页,6:权益页,7:探索页,8:商城页
        loginProvince: "", // 用户归属地-省份
        loginCity: "", // 用户归属地-地市
      },
      defaultWords: [], // 搜索默认词
      disCoveryData: [], // 搜索发现
      hotData: [], // 全网热搜
      likeData: [], // 猜你喜欢
      bannerData: [], // 猜你喜欢-通栏
      pCodes: [
        "P00000025100",
        "P00000025101",
        "P00000025102",
        "P00000025103",
        "P00000025104",
        "P00000025105",
        "P00000025106",
        "P00000025107",
        "P00000025108",
        "P00000025109",
      ], // 曝光P码
      impAttrsDefaultWords: {},
      impAttrsDisCovery: {},
      impAttrsHot: {},
      impAttrsLike: {},
      impAttrsBanner: {},
      pageErrorFlag: false, // 接口异常背景图显示
      pageErrorInfo: "", // 接口异常提示语
      pageErrorBtn: false, // 接口异常重试按钮
      isShowTab: "rmss", // 当前搜索推荐展示的是热门搜索（显示猜你喜欢）
      disCoveryNewData: [], // 首页重构--搜索发现
      likeNewData: [], // 首页重构--猜你喜欢
      bannerNewData: [], // 首页重构--猜你喜欢-通栏
    };
  },
  inject: [
    "getPlaceholder",
    "updatePlaceholder",
    "getDefaultWord",
    "updateDefaultWord",
    "getSearchUUID",
  ],
  computed: {
    placeholder() {
      return this.getPlaceholder();
    },
    defaultWord() {
      return this.getDefaultWord();
    },
  },
  mounted() {
    console.log("打印--进入searchmain先加载default组件-vue父子组件加载顺序");
    const userInfo = localStorage.getItem("userInfo")
      ? JSON.parse(localStorage.getItem("userInfo"))
      : null;
    // 从会话中获取页面入口信息
    // const pageEntrance = getQueryStringNew().pageEntrance;
    const pageEntrance = sessionStorage.getItem("pageEntrance");

    this.param = {
      provinceCode: userInfo?.province || "",
      cityCode: userInfo?.city || "",
      cv: userInfo?.version ? `10_10,${userInfo.version}` : "10_10",
      st: userInfo?.st || "",
      cellNum: userInfo?.phoneNumber || "",
      pageEntrance,
      loginProvince:
        userInfo?.loginProvince ||
        (userInfo?.province ? userInfo?.province : ""), // 省份参数兜底优化
      loginCity: userInfo?.loginCity || "",
    };
    console.log("打印--默认页请求接口和处理数据===>");
    console.time("getDefaultData");

    // 首页重构白名单判断
    // if (
    //   userInfo?.phoneNumber &&
    //   HomeNewPhoneList.indexOf(userInfo?.phoneNumber) !== -1
    // ) {
    //   this.isShowNewPage = true;
    //   // 默认词匹配回显-移动优选数据
    //   this.getDefaultNewData();
    //   // 搜索发现
    //   this.getSearchNewData();
    // } else {
    //   this.isShowNewPage = false;
    //   this.getDefaultData();
    // }

    // 使用新版首页
    this.isShowNewPage = true;
    // 默认词匹配回显-移动优选数据
    this.getDefaultNewData();
    // 搜索发现
    this.getSearchNewData();
  },
  methods: {
    // 点击事件采集
    getTrack(res) {
      // console.log(JSON.stringify(res),'-------------点击事件采集----------------')

      // 插码方案修改2025-1-16
      const clickGdpObj = {
        WT_et: "clk",
        WT_area_type_1: "楼层",
        areaid: res.areaid, // 该区域对应的区域id_模板id_位置
        WT_area_type_2: res.WT_area_type_2,
        WT_area_name: res.WT_area_name,
        XY_env_type: res.XY_env_type,
        XY_point_position: res.XY_point_position,
        WT_event: res.WT_event,
        XY_gd_source: "搜索平台",
        WT_markId: res.WT_markId,
        WT_next_url: res.WT_next_url,
        WT_envName: res.WT_envName,
        XY_scene: res.WT_envName,
        WT_es: sessionStorage.pageUrl || "", // 页面路径
        WT_ti: "搜索默认页", // 页面名称
        XY_visit_source: sessionStorage.pageEntrance || "", // 访问来源
        WT_plat: sessionStorage.pagePlat || "", // 渠道
        XY_transaction_id: this.getSearchUUID(),
      };
      console.log("点击默认页-子组件传递给-父级default-的数据上报===>");
      console.log(clickGdpObj);

      if (isApp()) {
        // gdp("track", "clk", {
        //   XY_transaction_id: this.getSearchUUID(),
        //   WT_et: "clk",
        //   WT_event: res.WT_event,
        //   WT_envName: res.WT_envName,
        //   WT_markId: res.WT_markId,
        //   WT_next_url: res.WT_next_url,
        //   WT_plat: sessionStorage.pagePlat || "",
        //   WT_es: sessionStorage.pageUrl || "",
        //   WT_ti: "搜索默认页",
        //   XY_pageEntry: sessionStorage.pageEntrance || "",
        // });
        gdp("track", "clk", clickGdpObj);
      }
    },

    getDefaultData() {
      // this.isShowSkeleton = true;
      // 此处逻辑与app.vue内getConfig接口类似
      // 获取缓存信息
      const localDefaultData = getDefaultPageLocalInfo("local_default");
      const nowTime = Date.now();
      // 本地存储有效 渲染页面(后续组件调用) 接口请求不再渲染页面 只更新本地存储
      // 本次存储无效 接口请求 渲染页面 更新本地存储
      // let updateFlag = true; // 定义一个是否渲染页面的标记
      let diffTime = 0; // 定义过期时间与当前时间差值
      if (localDefaultData && localDefaultData.expiredTime > nowTime) {
        this.handleDefaultData(localDefaultData);
        diffTime = localDefaultData.expiredTime - nowTime;
        console.log("默认词缓存优化--11本地存储");
      }

      // 不管有没有缓存数据 都请求接口获取最新的后端数据
      // 修改为过期时间小于两分钟和没有缓存数据 请求接口
      // 暂定全部请求后端
      try {
        // if (!localDefaultData || diffTime < 2 * 60 * 1000) {
        CommonApi.appSearch(this.param)
          .then((res) => {
            if (res.code === "000000") {
              if (res.data.areaList && res.data.areaList.length > 0) {
                // 分页面入口存储
                const setKey = `local_default_${this.param.loginProvince}_${this.param.pageEntrance}`;
                localStorage.setItem(
                  setKey,
                  JSON.stringify({
                    ...res,
                    expiredTime: Date.now() + 5 * 60 * 1000,
                  })
                );
                // 处理数据
                console.log("默认词缓存优化--接口返回");
                this.handleDefaultData(res);
              } else {
                this.dataErrorHandle();
              }
            } else {
              console.log("请求默认词接口查询失败");
              this.dataErrorHandle();
            }
          })
          .catch(() => {
            console.log("请求默认词接口失败");
            this.dataErrorHandle();
          });
        // }
      } catch (err) {
        console.error(
          "default组件调用appSearch失败==>直接使用缓存数据-不管时间是否过期"
        );
        this.dataErrorHandle();
      }
    },

    // 数据接口请求异常执行方法
    dataErrorHandle() {
      const localDefaultData = getDefaultPageLocalInfo("local_default");
      this.isShowSkeleton = false;
      if (localDefaultData) {
        this.handleDefaultData(localDefaultData);
      } else {
        this.pageErrorFlag = true;
        console.error("数据接口请求异常执行--也没有缓存");
      }
    },

    handleDefaultData(res) {
      console.log("打印--默认页请求数据完成==开始处理");
      this.isShowSkeleton = false;
      let floorData = [];

      // 猜你喜欢(现名为移动优选)-猜你喜欢通栏模拟数据
      // console.log(MockGuessLikeData);
      // res.data.areaList.push(MockGuessLikeData);

      const moduleList = res.data.areaList;

      if (moduleList && moduleList.length) {
        moduleList.forEach((e) => {
          // 整理插码需要的区域id值
          if (e.moduleList && e.moduleList.length > 0) {
            e.moduleList.map((item) => {
              item.areaId = e.areaId;
            });
          }
          floorData = floorData.concat(e.moduleList);
        });
      }

      console.log("插码需要的区域id===>");
      console.log(floorData);

      console.time("morenci");
      // 默认词
      let tempDefaultWords = floorData?.find((e) => e.moduleId === "A0021-10");
      this.defaultWords = tempDefaultWords?.adverList;
      console.log("接口返回后取的defaultWords===>");
      console.log(this.defaultWords);

      // 从searchmain页面迁移过来的逻辑
      const urlInfoObj = sessionStorage.getItem("newUrlParams")
        ? JSON.parse(sessionStorage.getItem("newUrlParams"))
        : null;

      // 此处逻辑迁移至default组件
      console.log("获取会话中存储的url携带参数信息===>");
      console.log(urlInfoObj);
      console.log("url里用来匹配的defaultWordId====>", urlInfoObj.markId);

      const defaultWordObj = {
        markId: urlInfoObj.markId,
        markName: urlInfoObj.markName,
      };
      const placeholderObj = defaultWordObj
        ? defaultWordObj
        : {
            markName: "",
          };

      if (defaultWordObj && defaultWordObj.markId) {
        let pos =
          this.defaultWords &&
          this.defaultWords.findIndex(
            (e) => e.markId === defaultWordObj.markId
          );
        console.log("获取到的默认词匹配下标==>");
        console.log(pos);
        if (pos > -1) {
          let defaultWord = this.defaultWords[pos];
          this.defaultWords.splice(pos, 1);
          this.updateDefaultWord(defaultWord);
          this.updatePlaceholder(defaultWord);
        } else {
          console.log("没有匹配到默认词");
          let defaultWord = {};
          this.updateDefaultWord(defaultWord);
          this.updatePlaceholder(placeholderObj);
        }
      } else if (defaultWordObj && defaultWordObj.markName) {
        console.log("分类页跳转url内无markid的参数==>使用markName判断");
        let pos =
          this.defaultWords &&
          this.defaultWords.findIndex(
            (e) => e.markName === defaultWordObj.markName
          );
        if (pos > -1) {
          let defaultWord = this.defaultWords[pos];
          this.defaultWords.splice(pos, 1);
          this.updateDefaultWord(defaultWord);
          this.updatePlaceholder(defaultWord);
        } else {
          console.log("没有匹配到默认词");
          let defaultWord = {};
          this.updateDefaultWord(defaultWord);
          this.updatePlaceholder(placeholderObj);
        }
      } else {
        // 把searchMain主页最初的逻辑执行一遍
        this.updateDefaultWord(defaultWordObj);
        this.updatePlaceholder(placeholderObj);
      }

      // 如果url中没有传递markname使用接口返回的默认词
      if (!placeholderObj.markName && this.defaultWords) {
        console.log("placeHolder", this.defaultWords?.[0]);
        this.updatePlaceholder(this.defaultWords?.[0]);
      }

      // 回显规则调整原因
      // 异常场景--接口无默认词list数据返回  且  无markname传参
      // 上几行代码未处理this.defaultWords数组为空场景 数组首项为空  导致页面input输入框placeholder取值异常 页面吸顶不可搜索

      // 默认词回显新规则
      // const urlInfoObj = sessionStorage.getItem("newUrlParams")
      //   ? JSON.parse(sessionStorage.getItem("newUrlParams"))
      //   : null;
      // const defaultUrlObj = {
      //   markId: urlInfoObj?.markId || "",
      //   markName: urlInfoObj?.markName || "",
      // };
      // this.updateDefaultWord(defaultUrlObj);
      // this.updatePlaceholder(defaultUrlObj);

      // 插码参数处理
      if (tempDefaultWords) {
        this.impAttrsDefaultWords = {
          area_id: `${tempDefaultWords?.floorId || ""}_${
            tempDefaultWords?.moduleId || ""
          }`,
          areaid: `${tempDefaultWords?.areaId || ""}_${
            tempDefaultWords?.moduleId || ""
          }`,
          type: "once",
          WT_plat: sessionStorage.pagePlat || "",
          WT_es: sessionStorage.pageUrl || "",
          WT_ti: "搜索默认页",
          XY_pageEntry: sessionStorage.pageEntrance || "",
        };
      }
      console.timeEnd("morenci");

      console.time("sousuofaxian");
      // 搜索发现
      let tempDisCoveryData = floorData?.find((e) => e.moduleId === "A0022-10");
      let disCoveryData = tempDisCoveryData?.adverList || [];
      disCoveryData.forEach((e, index) => {
        disCoveryData[index].pCode = this.pCodes[index] || "";
      });
      this.disCoveryData = disCoveryData;
      // 插码参数处理
      if (tempDisCoveryData) {
        this.impAttrsDisCovery = {
          area_id: `${tempDisCoveryData?.floorId || ""}_${
            tempDisCoveryData?.moduleId || ""
          }`,
          areaid: `${tempDisCoveryData?.areaId || ""}_${
            tempDisCoveryData?.moduleId || ""
          }`,
          type: "once",
          WT_plat: sessionStorage.pagePlat || "",
          WT_es: sessionStorage.pageUrl || "",
          WT_ti: "搜索默认页",
          XY_pageEntry: sessionStorage.pageEntrance || "",
        };
        this.disCoveryData.forEach((ele, index) => {
          // 给页面回显的数据添加areaid信息
          ele.diyAreaInfo = `${tempDisCoveryData?.areaId || ""}_${
            tempDisCoveryData?.moduleId || ""
          }_${index + 1}`;
          const impAttrsImpObj = {
            WT_et: "imp",
            WT_event: ele?.pCode || "",
            WT_envName: ele?.markName || "",
            WT_markId: `${ele?.advBusiType || ""}_${ele?.markId || ""}`,
            WT_next_url: ele?.actionUrl || "",
            // WT_es: sessionStorage.pageUrl || '',
            // WT_ti: '搜索默认页',
            XY_pageEntry: sessionStorage.pageEntrance || "",
            // 插码方案修改2025-1-16
            WT_area_type_1: "楼层",
            areaid: `${tempDisCoveryData?.areaId || ""}_${
              tempDisCoveryData?.moduleId || ""
            }_${index + 1}`, // 该区域对应的区域id_模板id_位置
            WT_area_type_2: "搜索发现",
            WT_area_name: "搜索发现",
            XY_env_type: "",
            XY_point_position: index + 1,
            // WT_event: item?.pCode || "",
            WT_event: `P0000002510${index}`,
            XY_gd_source: "搜索平台",
            XY_scene: ele?.markName || "",
            WT_es: sessionStorage.pageUrl || "", // 页面路径
            WT_ti: "搜索默认页", // 页面名称
            XY_visit_source: sessionStorage.pageEntrance || "", // 访问来源
            WT_plat: sessionStorage.pagePlat || "", // 渠道
            XY_transaction_id: this.getSearchUUID(),
          };
          this.impAttrsDisCovery[ele.pCode || ""] = impAttrsImpObj;
          // 单一上报
          console.log("单一上报搜索发现===>");
          console.log(impAttrsImpObj);
          if (isApp()) {
            gdp("track", "imp", impAttrsImpObj);
          }
        });
      }
      console.timeEnd("sousuofaxian");

      console.time("quanwangresou");
      // 全网热搜
      const tempHotData = floorData?.find((e) => e.moduleId === "A0023-8");
      const hotData = tempHotData?.adverList || [];
      hotData.forEach((ele, index) => {
        if (ele.moods) {
          const temp = ele.moods / 10000;
          const tempArr = temp.toString().split(".");
          hotData[index].moods =
            tempArr.length === 1
              ? `${tempArr[0]}W`
              : `${Math.ceil(temp * 10) / 10}W`;
        }
      });
      this.hotData = hotData;
      // 插码参数处理
      if (tempHotData) {
        this.impAttrsHot = {
          area_id: `${tempHotData?.floorId || ""}_${
            tempHotData?.moduleId || ""
          }`,
          areaid: `${tempHotData?.areaId || ""}_${tempHotData?.moduleId || ""}`,
          type: "once",
          WT_plat: sessionStorage.pagePlat || "",
          WT_es: sessionStorage.pageUrl || "",
          WT_ti: "搜索默认页",
          XY_pageEntry: sessionStorage.pageEntrance || "",
        };
        this.hotData.forEach((ele, index) => {
          // 给页面回显的数据添加areaid信息
          ele.diyAreaInfo = `${tempHotData?.areaId || ""}_${
            tempHotData?.moduleId || ""
          }_${index + 1}`;
          const impAttrsImpObj = {
            WT_et: "imp",
            WT_event: ele?.pCode || "",
            WT_envName: ele?.markName || "",
            WT_markId: `${ele?.advBusiType || ""}_${ele?.markId || ""}`,
            WT_next_url: ele?.actionUrl || "",
            // WT_es: sessionStorage.pageUrl || '',
            // WT_ti: '搜索默认页',
            XY_pageEntry: sessionStorage.pageEntrance || "",
            // 插码方案修改2025-1-16
            WT_area_type_1: "楼层",
            areaid: `${tempHotData?.areaId || ""}_${
              tempHotData?.moduleId || ""
            }_${index + 1}`, // 该区域对应的区域id_模板id_位置
            WT_area_type_2: "全网热搜",
            WT_area_name: "全网热搜",
            XY_env_type: "",
            XY_point_position: index + 1,
            XY_gd_source: "搜索平台",
            XY_scene: ele?.markName || "",
            WT_es: sessionStorage.pageUrl || "", // 页面路径
            WT_ti: "搜索默认页", // 页面名称
            XY_visit_source: sessionStorage.pageEntrance || "", // 访问来源
            WT_plat: sessionStorage.pagePlat || "", // 渠道
            XY_transaction_id: this.getSearchUUID(),
          };
          this.impAttrsHot[ele.pCode || ""] = impAttrsImpObj;
          // 单一上报
          console.log("单一上报全网热搜===>");
          console.log(impAttrsImpObj);
          if (isApp()) {
            gdp("track", "imp", impAttrsImpObj);
          }
        });
      }
      console.timeEnd("quanwnagresou");

      // 猜你喜欢
      console.time("cainixihuan");
      let tempLikeData = floorData?.find((e) => e.moduleId === "M0001-3");
      let likeData = tempLikeData?.adverList;
      this.likeData =
        likeData && likeData.length
          ? likeData.filter((e) => e.imageUrl).slice(0, 4)
          : [];
      // 插码参数处理
      if (tempLikeData) {
        this.impAttrsLike = {
          area_id: `${tempLikeData?.floorId || ""}_${
            tempLikeData?.moduleId || ""
          }`,
          areaid: `${tempLikeData?.areaId || ""}_${
            tempLikeData?.moduleId || ""
          }`,
          type: "once",
          WT_plat: sessionStorage.pagePlat || "",
          WT_es: sessionStorage.pageUrl || "",
          WT_ti: "搜索默认页",
          XY_pageEntry: sessionStorage.pageEntrance || "",
        };
        this.likeData.forEach((ele, index) => {
          // 给页面回显的数据添加areaid信息
          ele.diyAreaInfo = `${tempLikeData?.areaId || ""}_${
            tempLikeData?.moduleId || ""
          }_${index + 1}`;
          const impAttrsImpObj = {
            WT_et: "imp",
            WT_event: ele?.pCode || "",
            WT_envName: ele?.markName || "",
            WT_markId: `${ele?.advBusiType || ""}_${ele?.markId || ""}`,
            WT_next_url: ele?.actionUrl || "",
            // WT_es: sessionStorage.pageUrl || "",
            // WT_ti: "搜索默认页",
            XY_pageEntry: sessionStorage.pageEntrance || "",
            // 插码方案修改2025-1-16
            WT_area_type_1: "楼层",
            areaid: `${tempLikeData?.areaId || ""}_${
              tempLikeData?.moduleId || ""
            }_${index + 1}`, // 该区域对应的区域id_模板id_位置
            WT_area_type_2: "猜你喜欢",
            WT_area_name: "猜你喜欢",
            XY_env_type: "icon",
            XY_point_position: index + 1,
            XY_gd_source: "搜索平台",
            XY_scene: ele?.markName || "",
            WT_es: sessionStorage.pageUrl || "", // 页面路径
            WT_ti: "搜索默认页", // 页面名称
            XY_visit_source: sessionStorage.pageEntrance || "", // 访问来源
            WT_plat: sessionStorage.pagePlat || "", // 渠道
            XY_transaction_id: this.getSearchUUID(),
          };
          this.impAttrsLike[ele.pCode || ""] = impAttrsImpObj;
          // 单一上报
          console.log("单一上报猜你喜欢===>");
          console.log(impAttrsImpObj);
          if (isApp()) {
            gdp("track", "imp", impAttrsImpObj);
          }
        });
      }
      console.timeEnd("cainixihuan");

      console.time("tonglan");
      // 猜你喜欢-通栏
      let tempBannerData = floorData?.find((e) => e.moduleId === "M0001-1");
      this.bannerData = tempBannerData?.adverList;
      // 插码参数处理
      if (tempBannerData) {
        this.impAttrsBanner = {
          area_id: `${tempBannerData?.floorId || ""}_${
            tempBannerData?.moduleId || ""
          }`,
          areaid: `${tempBannerData?.areaId || ""}_${
            tempBannerData?.moduleId || ""
          }`,
          type: "once",
          WT_plat: sessionStorage.pagePlat || "",
          WT_es: sessionStorage.pageUrl || "",
          WT_ti: "搜索默认页",
          XY_pageEntry: sessionStorage.pageEntrance || "",
        };
        this.bannerData.forEach((ele, index) => {
          // 给页面回显的数据添加areaid信息
          ele.diyAreaInfo = `${tempBannerData?.areaId || ""}_${
            tempBannerData?.moduleId || ""
          }_${index + 1}`;
          const impAttrsImpObj = {
            WT_et: "imp",
            WT_event: ele?.pCode || "",
            WT_envName: ele?.markName || "",
            WT_markId: `${ele?.advBusiType || ""}_${ele?.markId || ""}`,
            WT_next_url: ele?.actionUrl || "",
            // WT_es: sessionStorage.pageUrl || '',
            // WT_ti: '搜索默认页',
            XY_pageEntry: sessionStorage.pageEntrance || "",
            // 插码方案修改2025-1-16
            WT_area_type_1: "楼层",
            areaid: `${tempBannerData?.areaId || ""}_${
              tempBannerData?.moduleId || ""
            }_${index + 1}`, // 该区域对应的区域id_模板id_位置
            WT_area_type_2: "广告栏",
            WT_area_name: "广告栏",
            XY_env_type: "banner",
            XY_point_position: index + 1,
            XY_gd_source: "搜索平台",
            XY_scene: ele?.markName || "",
            WT_es: sessionStorage.pageUrl || "", // 页面路径
            WT_ti: "搜索默认页", // 页面名称
            XY_visit_source: sessionStorage.pageEntrance || "", // 访问来源
            WT_plat: sessionStorage.pagePlat || "", // 渠道
            XY_transaction_id: this.getSearchUUID(),
          };
          this.impAttrsBanner[ele.pCode] = impAttrsImpObj;
          // 单一上报
          console.log("单一上报猜你喜欢广告栏===>");
          console.log(impAttrsImpObj);
          if (isApp()) {
            gdp("track", "imp", impAttrsImpObj);
          }
        });
      }
      console.timeEnd("tonglan");
      console.log("打印--默认页总耗时===>");
      console.timeEnd("getDefaultData");
    },

    // 首页重构-搜索发现
    getSearchNewData() {
      // 获取缓存信息
      const localSearchData = getDefaultPageLocalInfo("local_search_new");
      const nowTime = Date.now();
      // 本地存储有效 渲染页面(后续组件调用) 接口请求不再渲染页面 只更新本地存储
      // 本次存储无效 接口请求 渲染页面 更新本地存储
      if (localSearchData && localSearchData.expiredTime > nowTime) {
        this.handleSearchNewData(localSearchData);
        console.log("首页重构-搜索发现-使用本地存储缓存信息");
      }

      // 获取本地存储的历史搜索词
      const xkTag =
        localStorage.getItem("userInfo") &&
        JSON.parse(localStorage.getItem("userInfo")).xk
          ? JSON.parse(localStorage.getItem("userInfo")).xk
          : "";
      let configList = sessionStorage.configListSes
        ? JSON.parse(sessionStorage.configListSes)
        : {};
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
        });
      }
      let pageColumnTag = pageColumnReadTag[0];
      let pageEntranceFlag = "";
      pageEntranceFlag =
        "_pageColumn_" + "_" + pageColumnTag + "_" + xkTag + "";
      let historyData = localStorage.getItem(pageEntranceFlag);
      // 历史搜索词
      this.historyData = historyData ? JSON.parse(historyData).reverse() : [];
      const historyWords = this.historyData.map((item) => {
        return item.markName;
      });
      console.log("获取历史搜索词---->");
      console.log(historyWords);

      try {
        CommonApi.searchIndex({
          ...this.param,
          historySearchWordList: historyWords.slice(0, 5), // 控制参数长度
        })
          .then((res) => {
            console.log("首页重构-搜索发现接口返回数据====>");
            console.log(res);
            if (res.code === "000000" && res.data) {
              // 分页面入口存储
              const setKey = `local_search_new_${this.param.loginProvince}_${this.param.pageEntrance}`;
              localStorage.setItem(
                setKey,
                JSON.stringify({
                  ...res,
                  expiredTime: Date.now() + 5 * 60 * 1000,
                })
              );
              this.handleSearchNewData(res);
            } else {
              console.log("首页重构-搜索发现查询失败");
              this.searchErrorHandle();
            }
          })
          .catch((error) => {
            console.log("首页重构-搜索发现查询接口失败");
            console.log(error);
            this.searchErrorHandle();
          });
      } catch (err) {
        console.error(
          "首页重构-搜索发现查询调用失败==>直接使用缓存数据-不管时间是否过期"
        );
        this.searchErrorHandle();
      }
    },

    // 数据接口请求异常执行方法
    searchErrorHandle() {
      const localSearchData = getDefaultPageLocalInfo("local_search_new");
      this.isShowSkeleton = false;
      if (localSearchData) {
        this.handleSearchNewData(localSearchData);
      } else {
        this.pageErrorFlag = true;
        console.error("首页重构-搜索发现接口异常--也没有缓存");
      }
    },

    handleSearchNewData(resObj) {
      const resData = resObj.data;
      this.isShowSkeleton = false; // 骨架屏消失

      const flagArr = [];
      const noFlagArr = [];
      // 处理搜索发现的推荐-火标识
      // 数据展示顺序 火-推荐-推荐-无标识
      resData.searchDiscoveryData.map((item) => {
        if (item.flag === "2") {
          item.imgUrl = "icon-hot";
          flagArr.unshift(item);
        } else if (item.flag === "1") {
          item.imgUrl = "icon-tuijian";
          flagArr.push(item);
        } else {
          item.imgUrl = "";
          noFlagArr.push(item);
        }
      });
      this.disCoveryNewData = flagArr.concat(noFlagArr);

      // 首页重构新版搜索发现插码曝光上报 相比较以前搜索发现 后端返回数据源增加
      // 两级数据+历史搜索词es数据沉淀（无区域id和模块id的概念）
      // 处理曝光插码上报
      this.disCoveryNewData.forEach((ele, index) => {
        // 给页面回显的数据添加areaid信息
        ele.diyAreaInfo = "";
        const impAttrsImpObj = {
          WT_et: "imp",
          WT_event: ele?.pCode || "",
          WT_envName: ele?.markName || "",
          WT_markId: `${ele?.advBusiType || ""}_${ele?.markId || ""}`,
          WT_next_url: ele?.actionUrl || "",
          // WT_es: sessionStorage.pageUrl || '',
          // WT_ti: '搜索默认页',
          XY_pageEntry: sessionStorage.getItem("pageEntrance") || "",
          // 插码方案修改2025-1-16
          WT_area_type_1: "楼层",
          areaid: "", // 该区域对应的区域id_模板id_位置---新版搜索发现无此类标识返回
          // WT_area_type_2: "搜索发现",
          WT_area_name: "搜索发现",
          XY_env_type: "button",
          XY_point_position: index + 1,
          // WT_event: item?.pCode || "",
          WT_event: `P0000002510${index}`, // 最多只返回8个
          XY_gd_source: "",
          XY_scene: ele?.markName || "",
          WT_es: sessionStorage.getItem("pageUrl") || "", // 页面路径
          WT_ti: "搜索默认页", // 页面名称
          XY_visit_source: sessionStorage.getItem("pageEntrance") || "", // 访问来源
          WT_plat: sessionStorage.getItem("pagePlat") || "", // 渠道
          XY_transaction_id: this.getSearchUUID(),
        };
        // 单一上报
        console.log("首页重构---新版搜索发现曝光上报===>");
        console.log(impAttrsImpObj);
        if (isApp()) {
          gdp("track", "imp", impAttrsImpObj);
        }
      });
    },

    // 首页重构-默认词-移动优选
    getDefaultNewData() {
      // 获取缓存信息
      const localDefaultData = getDefaultPageLocalInfo("local_default_new");
      const nowTime = Date.now();
      // 本地存储有效 渲染页面(后续组件调用) 接口请求不再渲染页面 只更新本地存储
      // 本次存储无效 接口请求 渲染页面 更新本地存储
      if (localDefaultData && localDefaultData.expiredTime > nowTime) {
        this.handleDefaultNewData(localDefaultData);
        console.log("首页重构-默认词-移动优选-使用本地存储缓存信息");
      }

      try {
        CommonApi.moveSelect({
          ...this.param,
        })
          .then((res) => {
            console.log("首页重构-默认词-移动优选-查询接口返回数据====>");
            console.log(res);
            if (res.code === "000000" && res.data) {
              // 分页面入口存储
              const setKey = `local_default_new_${this.param.loginProvince}_${this.param.pageEntrance}`;
              localStorage.setItem(
                setKey,
                JSON.stringify({
                  ...res,
                  expiredTime: Date.now() + 5 * 60 * 1000,
                })
              );
              this.handleDefaultNewData(res);
            } else {
              console.log("首页重构-默认词-移动优选-查询失败");
              this.defaultErrorHandle();
            }
          })
          .catch((error) => {
            console.log("首页重构-默认词-移动优选-查询接口失败");
            console.log(error);
            this.defaultErrorHandle();
          });
      } catch (err) {
        console.error(
          "首页重构-默认词-移动优选-查询调用失败==>直接使用缓存数据-不管时间是否过期"
        );
        this.defaultErrorHandle();
      }
    },

    // 数据接口请求异常执行方法
    defaultErrorHandle() {
      const localDefaultData = getDefaultPageLocalInfo("local_default_new");
      this.isShowSkeleton = false;
      if (localDefaultData) {
        this.handleDefaultNewData(localDefaultData);
      } else {
        // 页面异常(进入异常兜底页面) 以搜索发现接口状态为准 不以默认词-移动优选接口状态为准
        // this.pageErrorFlag = true;
        console.error("首页重构-默认词-移动优选接口异常--也没有缓存");
      }
    },

    handleDefaultNewData(resObj) {
      const resData = resObj.data;
      this.isShowSkeleton = false; // 骨架屏消失

      // 处理搜索框默认词 匹配显示逻辑
      // this.defaultWords = resData.searchBoxData;
      // console.log("首页重构--接口返回后取的defaultWords===>");
      // console.log(this.defaultWords);

      // // 从searchmain页面迁移过来的逻辑
      // const urlInfoObj = sessionStorage.getItem("newUrlParams")
      //   ? JSON.parse(sessionStorage.getItem("newUrlParams"))
      //   : null;

      // // 此处逻辑迁移至default组件
      // console.log("获取会话中存储的url携带参数信息===>");
      // console.log(urlInfoObj);
      // console.log("url里用来匹配的defaultWordId====>", urlInfoObj.markId);

      // const defaultWordObj = {
      //   markId: urlInfoObj.markId,
      //   markName: urlInfoObj.markName,
      // };
      // const placeholderObj = defaultWordObj
      //   ? defaultWordObj
      //   : {
      //       markName: "",
      //     };

      // if (defaultWordObj && defaultWordObj.markId) {
      //   let pos =
      //     this.defaultWords &&
      //     this.defaultWords.findIndex(
      //       (e) => e.markId === defaultWordObj.markId
      //     );
      //   console.log("获取到的默认词匹配下标==>");
      //   console.log(pos);
      //   if (pos > -1) {
      //     let defaultWord = this.defaultWords[pos];
      //     this.defaultWords.splice(pos, 1);
      //     this.updateDefaultWord(defaultWord);
      //     this.updatePlaceholder(defaultWord);
      //   } else {
      //     console.log("没有匹配到默认词");
      //     let defaultWord = {};
      //     this.updateDefaultWord(defaultWord);
      //     this.updatePlaceholder(placeholderObj);
      //   }
      // } else if (defaultWordObj && defaultWordObj.markName) {
      //   console.log("分类页跳转url内无markid的参数==>使用markName判断");
      //   let pos =
      //     this.defaultWords &&
      //     this.defaultWords.findIndex(
      //       (e) => e.markName === defaultWordObj.markName
      //     );
      //   if (pos > -1) {
      //     let defaultWord = this.defaultWords[pos];
      //     this.defaultWords.splice(pos, 1);
      //     this.updateDefaultWord(defaultWord);
      //     this.updatePlaceholder(defaultWord);
      //   } else {
      //     console.log("没有匹配到默认词");
      //     let defaultWord = {};
      //     this.updateDefaultWord(defaultWord);
      //     this.updatePlaceholder(placeholderObj);
      //   }
      // } else {
      //   // 把searchMain主页最初的逻辑执行一遍
      //   this.updateDefaultWord(defaultWordObj);
      //   this.updatePlaceholder(placeholderObj);
      // }

      // // 如果url中没有传递markname使用接口返回的默认词
      // if (!placeholderObj.markName && this.defaultWords) {
      //   console.log("placeHolder", this.defaultWords?.[0]);
      //   this.updatePlaceholder(this.defaultWords?.[0]);
      // }

      // 回显规则调整原因
      // 异常场景--接口无默认词list数据返回  且  无markname传参
      // 上几行代码未处理this.defaultWords数组为空场景 数组首项为空  导致页面input输入框placeholder取值异常 页面吸顶不可搜索

      // 默认词回显新规则
      const urlInfoObj = sessionStorage.getItem("newUrlParams")
        ? JSON.parse(sessionStorage.getItem("newUrlParams"))
        : null;
      const defaultUrlObj = {
        markId: urlInfoObj?.markId || "",
        markName: urlInfoObj?.markName || "",
      };
      this.updateDefaultWord(defaultUrlObj);
      this.updatePlaceholder(defaultUrlObj);

      // 移动优选
      this.likeNewData = resData.guessLike1Data;
      this.bannerNewData = resData.guessLike2Data;
      // this.likeNewData = GuessLike1NewData;
      // this.bannerNewData = GuessLike2NewData;
    },

    // 页面异常重载
    reloadPage() {
      location.reload();
    },

    // 首页重构tab切换--非热门搜索不显示移动优选
    getTab(tabFlag) {
      this.isShowTab = tabFlag;
    },

    // 首页重构周周边生活
    refreshNearbyLife() {
      this.$nextTick(() => {
        console.log(this.isShowTab);
        console.log(this.$refs.recommendRef);
        if (this.isShowTab === "zbsh") {
          if (this.$refs.recommendRef) {
            this.$refs.recommendRef?.updateNearbyLife();
          }
        }
      });
    },
  },
};
</script>

<style scoped lang='scss'>
.default-con {
  display: flex;
  flex-direction: column;
}

.error-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #ffffff;
  // box-shadow: 0px 4px 20px 0px #f6f6f6;
  padding-bottom: 78px;
  // border-top-left-radius: 18px;
  // border-top-right-radius: 18px;

  img {
    margin-top: 100px;
    width: 612px;
  }

  p {
    font-size: 28px;
    color: #666666;
    line-height: 26px;
    margin-top: 14px;
  }

  .btn {
    width: 180px;
    height: 72px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    border: 2px solid #2892ff;
    font-size: 28px;
    color: #2892ff;
    margin-top: 58px;
    // margin-bottom:98px;
  }
}
</style>
