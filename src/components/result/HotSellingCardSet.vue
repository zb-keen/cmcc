<template>
  <div class="hotCard-wrap">
    <div class="hotCard-tab" v-if="tabList.length > 0">
      <template v-if="tabList.length > 1">
        <div class="tab-header two-left" :class="{'two-right': headerActive === 1}">
          <template v-for="(tabItem, tabindex) in tabList">
            <div
              :key="tabindex"if
              class="header-item"
              :class="{
                'header-active': tabActive === tabItem.activeTab
              }"
              :style="{
                width: `${100 / tabList.length}%`,
              }"
              @click="handleChange(tabindex, tabItem.activeTab)"
            >
              <div v-if="tabActive === 'hotPackage'" :class="tabActive === tabItem.activeTab ? 'left-package' : 'left-number-normal'"></div>
              <div v-if="tabActive === 'hotCard'" :class="tabActive === tabItem.activeTab ? 'left-number' : 'left-package-normal'"></div>
              <div class="refresh" v-if=" tabActive === tabItem.activeTab && refreshShow" @click.stop="refresh(tabItem.activeTab)">
                <img :class="['refresh-icon', {'stop-refresh': refreshing}]" :src="require('@/assets/images/rxtk-refresh.png')" alt="">
                <div class="text">换一批</div>
              </div>
            </div>
          </template>
        </div>
      </template>
      <template v-else>
        <div class="noTab-header">
          <span class="left">{{ tabList[0] && tabList[0].tabName }}</span>
          <div class="right" v-if="refreshShow" @click.stop="refresh(tabList[0].activeTab)">
            <img :class="['refresh-icon', {'stop-refresh': refreshing}]" :src="require('@/assets/images/rxtk-refresh.png')" alt="">
            <div class="text">换一批</div>
          </div>
        </div>
      </template>
      <div class="tab-content">
        <HotPackage ref="hotPackageRef" :dataInfo="hotMobilePlanData" v-if="tabActive === 'hotPackage' && showhotPackage"></HotPackage>
        <HotCard ref="hotCardRef" :dataInfo="hotMobileNumList" v-if="tabActive === 'hotCard' && showHotCard"></HotCard>
      </div>
    </div>
  </div>
</template>

<script>
import { isIOS, isHarmony, isApp } from "@/utils/tool";
import { checkHighlightNumber } from "@/utils/phoneNumberHighlight";
import { getQueryStringNew, handleGetUrlParam, checkoutKeywordsToSession, isProtogenesisSkip, goProtogenesisPage, goPageUrl, Debounce } from "@/utils/tool";
import CommonApi from "@/api/index";

import HotCard from "./TemplatePage/HotCard.vue"; // 热销号卡
import HotPackage from "./TemplatePage/HotPackage.vue"; // 热销套餐

export default {
  name: "HotSellingCardSet",
  components: {
    HotCard,
    HotPackage
  },
  props: {
    nowCategoryCode: {
      type: String,
    },
    hotMobileNumData: {
      type: Object,
      default: () => []
    }
  },
  data() {
    return {
      paramData: {
        params: {
          keyWord: ""
        },
        province: "571",
        version: "10_10",
        beans: [],
        pageEntrance: "1",
        loginProvince: "", // 用户归属地-省份
        loginCity: "", // 用户归属地-地市
        phoneNumber: "",
        cid: "",
        xk: "",
        osType: "",
        iopResult: "",
        correctionFlag: true,
        city: "0000",
      },
      tabHeaderList: [],
      headerActive: "",
      tabList: [],
      tabActive: "hotPackage",
      conShowTitle: true, // 标签页内是否显示自己的标题-默认显示-单卡片显示-多个卡片不显示
      hotMobileTabData: {}, // 热销号卡tab数据信息
      hotMobilePlanData: [], // 套餐数据
      hotMobilePlanDataList: [], // 套餐总列表数据
      hotMobilePlanShowList: [], // 套餐展示列表数据
      hotMobilePlanDefData: {}, // 套餐兜底数据
      hotMobileNumList: [], // 靓号列表数据
      hotMobilePlanTabInfo: {},
      hotMobileNumTabInfo: {},
      refreshing: false, // 刷新动画
    };
  },
  inject: [
    "getSearchContent",
    "getCorrectionFlag",
    "getSearchUUID",
    "hideLoading"
  ],
  computed: {
    showhotPackage() {
      return this.hotMobilePlanTabInfo && this.hotMobilePlanTabInfo?.dataList && this.hotMobilePlanTabInfo?.dataList[0]?.tabState == '1' && this.hotMobilePlanShowList?.length >= 3
    },
    showHotCard(){
      return this.hotMobileNumTabInfo && this.hotMobileNumTabInfo?.dataList && this.hotMobileNumTabInfo?.dataList[0]?.tabState == '1' && this.hotMobileNumList?.length >= 4
    },
    refreshShow(){
      let result = false
      if (this.tabActive === 'hotPackage') {
        result = this.showhotPackage && this.hotMobilePlanDataList.some(item => item.length > 1) && this.hotMobilePlanTabInfo?.dataList[0]?.refreshBtnState == '1' 
      }else if(this.tabActive === 'hotCard') {
        result = this.showHotCard
      }
      return result
    },
    // 套餐刷新是否展示
    hotPackageRefreshShow() {
      // 套餐正确展示且，总数据中有点位有两条数据以上
      return this.showhotPackage && this.hotMobilePlanDataList.some(item => item.length > 1) && this.tabActive === 'hotPackage'
    },
    hotCardRefreshShow() {
      return this.showHotCard && this.tabActive === 'hotCard'
    }
  },
  watch: {
    nowCategoryCode: {
      handler(newVal) {
        if (newVal == null) return
        this.init()
      },
    },
    hotMobileNumData: {
      handler(val) {
        console.log(val, '监听到号码数据变化')
        if (val == null) return
        this.init()
      },
      immediate: true,
      deep: true
    }
  },
  created() {
    //this.init()
    console.log('init', this.nowCategoryCode, this.hotMobileNumData)
  },
  mounted() {
  },
  methods: {
    init() {
      console.log('init--->hotSellingCardSet', this.hotMobileNumData, this.nowCategoryCode)
      const searchContent = this.getSearchContent();
      const hotMobilePlanDataSession = JSON.parse(sessionStorage.getItem('hotMobilePlanData'))
      console.log('hotMobilePlanDataSession--->', hotMobilePlanDataSession)
      if (this.hotMobileNumData && this.hotMobileNumData.hotMobileNumVOList?.length > 0 ) {
        sessionStorage.setItem('hotNumData', JSON.stringify(this.hotMobileNumData))
        this.hotMobileNumList = this.hotMobileNumData.hotMobileNumVOList?.map(item => {
          // 对号码信息进行高亮处理
          const splitPhoneNumberArr = this.highlightPhoneNumber(item)
          console.log('splitPhoneNumberArr--->', splitPhoneNumberArr)
          return {
            splitPhoneNumberArr,
            ...item
          }
        })
        this.hotMobileNumList.forEach((i, ids) => {
          const clickGdpObj = {
            XY_transaction_id: this.getSearchUUID(),
            WT_et: "clk",
            type: "",
            WT_envName: i.title,
            WT_markId: "",
            XY_first_class: "搜索结果页",
            XY_second_class: "",
            WT_next_url: i.linkAdress || '',
            WT_plat: sessionStorage.pagePlat || "",
            WT_es: sessionStorage.pageUrl || "",
            WT_ti: "搜索结果页",
            XY_pageEntry: sessionStorage.pageEntrance || "",
            // 插码方案修改2025-1-16
            WT_area_type_1: "楼层",
            areaid: "", // [区域id_模板id]
            WT_area_type_2: "全部",
            WT_area_name: "号卡卡片_选靓号",
            XY_env_type: "button",
            WT_event: 'P00000132680' || "",
            XY_gd_source: "搜索平台", // [如果source=qqd，传qqd；如果source=app，传app]
            XY_scene: searchContent, // 搜索内容
            WT_si_n: "", // 物品对应的名称
            WT_goods_id: "", // 物品所对应的id信息
            XY_visit_source: sessionStorage.pageEntrance || "", // 访问来源
            WT_charge_phone: "",
            WT_errCode: "",
            WT_errMsg: "",
            XY_env_extend_attribute: "",
            XY_gd_position: ids + 1
          };
          console.log("靓号曝光", clickGdpObj);
          if (isApp()) {
            gdp("track", "clk", clickGdpObj);
          }
        })
      } else {
        this.hotMobileNumList = []
      }
      if (hotMobilePlanDataSession) {
        console.log('从session中获取数据', hotMobilePlanDataSession)
        const planData = hotMobilePlanDataSession.find(item => item.categoryCode === this.nowCategoryCode)
        console.log(planData, 'session获取套餐数据')
        this.hotMobilePlanData = planData?.data && planData?.data?.length > 0 ? planData.data : []
        console.log('hotMobilePlanData--->', this.hotMobilePlanData)
        // 截取第一个和第八个点位数据，为套餐和号卡楼层数据，用来判断整体tab和刷新功能是否展示
        this.hotMobilePlanTabInfo = this.hotMobilePlanData.find(item => item.position === "1")
        this.hotMobileNumTabInfo = this.hotMobilePlanData.find(item => item.position === "8")
        console.log('hotMobileNumTabInfo--->', this.hotMobileNumTabInfo)
        console.log('hotMobilePlanTabInfo--->', this.hotMobilePlanTabInfo)
        // 截取第一个到第七个点位的数据，第八个点位为兜底数据
        this.hotMobilePlanDataList = this.hotMobilePlanData
          .slice(1, 7)
          .filter(item => item.dataList && item.dataList.length > 0)
          .map(item => item.dataList)

        this.hotMobilePlanShowList = this.hotMobilePlanDataList.map(item => {
          return item[0]
        })
        const result = []
        console.log('hotMobileNumList', this.hotMobileNumList)
        console.log('hotMobilePlanShowList--->', this.hotMobilePlanShowList)
        if (
          this.hotMobilePlanTabInfo?.dataList[0]?.tabState == '1' &&
          this.hotMobilePlanShowList?.length >= 3
        ) {
          result.push({ activeTab: "hotPackage", tabName: '选套餐' })
        }
        if (
          this.hotMobileNumTabInfo?.dataList[0]?.tabState == '1' &&
          this.hotMobileNumList?.length >= 4
        ) {
          console.log('进来了')
          result.push({ activeTab: "hotCard", tabName: '选靓号' })
        }
        this.tabList = result
        this.tabActive = result.length === 1 ? this.tabList[0]?.activeTab : this.tabActive;
        this.headerActive = this.tabList.findIndex(i => i.activeTab === this.tabActive)
        console.log('tabList--->end-store', this.tabList, 'tabActive', this.tabActive, this.headerActive)
        this.hideLoading()
        console.log('隐藏loading')
        this.tabList.forEach(item => {
          const clickGdpObj = {
            XY_transaction_id: this.getSearchUUID(),
            WT_et: "imp",
            type: "",
            WT_envName: item.activeTab === 'hotPackage' ? '选套餐' : '选靓号',
            WT_markId: "",
            XY_first_class: "搜索结果页",
            XY_second_class: "",
            WT_next_url: '',
            WT_plat: sessionStorage.pagePlat || "",
            WT_es: sessionStorage.pageUrl || "",
            WT_ti: "搜索结果页",
            XY_pageEntry: sessionStorage.pageEntrance || "",
            // 插码方案修改2025-1-16
            WT_area_type_1: "楼层",
            areaid: "", // [区域id_模板id]
            WT_area_type_2: "全部",
            WT_area_name: "号卡卡片_tab切换",
            XY_env_type: "tab",
            WT_event: 'P00000132680' || "",
            XY_gd_source: "搜索平台", // [如果source=qqd，传qqd；如果source=app，传app]
            XY_scene: searchContent, // 搜索内容
            WT_si_n: "", // 物品对应的名称
            WT_goods_id: "", // 物品所对应的id信息
            XY_visit_source: sessionStorage.pageEntrance || "", // 访问来源
            WT_charge_phone: "",
            WT_errCode: "",
            WT_errMsg: "",
            XY_env_extend_attribute: "",
          };
          console.log("tab埋点--->", clickGdpObj);
          if (isApp()) {
            gdp("track", "clk", clickGdpObj);
          }
        })
      }
    },
    getParamData(){
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
      this.paramData.params.keyWord = searchContent || ""
      this.paramData.province = userInfo?.province || "";
      this.paramData.version = userInfo?.version ? `10_10,${userInfo?.version}` : '10_10';
      this.paramData.beans = getUrlParam.beans;
      this.paramData.pageEntrance = pageEntrance || "";
      this.paramData.loginProvince = loginProvince;
      this.paramData.loginCity = userInfo?.loginCity || "";
      this.paramData.phoneNumber = userInfo?.phoneNumber || "";
      this.paramData.cid = userInfo?.cid || "";
      this.paramData.xk = userInfo?.xk || "";
      this.paramData.osType = userInfo?.osType || "";
      this.paramData.iopResult = "";
      this.paramData.correctionFlag = this.getCorrectionFlag();
      this.paramData.city = userInfo?.city || "";
    },
    getHotMobileNum() {
      try {
        console.log('refresh----')
        const paramNum = {
          province: this.paramData.province,
          phoneNumber: this.paramData.phoneNumber,
          st: isHarmony() ? 10 : isIOS ? 2 : 1, // 客户端类型 1 安卓 2 ios  10 鸿蒙
          city: this.paramData.city,
          version: this.paramData.version,
          pageEntrance: this.paramData.pageEntrance,
          loginProvince: this.paramData.loginProvince, // 用户归属地-省份
          loginCity: this.paramData.loginCity, // 用户归属地-地市
          touchCode: 'P00000132680',
          xk: this.paramData.xk,
        }
        CommonApi.queryResultHotMobileNum(paramNum).then(res => {
          if (res.code == "000000" && res.data ) {
            console.log(res.data, '结果页号码')
            setTimeout(() => {
              this.refreshing = false
            }, 1000);
            if (res.data.hotMobileNumVOList.length > 0) {
              this.hotMobileNumList = res.data?.hotMobileNumVOList?.map(item => {
              // 对号码信息进行高亮处理
              const splitPhoneNumberArr = this.highlightPhoneNumber(item)
              console.log('splitPhoneNumberArr--->', splitPhoneNumberArr)
              return {
                splitPhoneNumberArr,
                ...item
              }
            })
              console.log('getHotMobileNum---end', this.hotMobileNumList)
            } else {
              const _tablist = this.tabList.filter(i => i.activeTab !== 'hotCard')
              this.tabList = _tablist
              console.log(this.tabList, '如果换一批没有靓号了，就把tab去掉')
            }
          }
        }) 
      } catch (error) {
        console.log(error);
      }
    },
    // 号码信息高亮处理
    highlightPhoneNumber(item) {
      const userInfo = localStorage.getItem("userInfo")
        ? JSON.parse(localStorage.getItem("userInfo"))
        : null;
      // 获取到对应的号码高亮信息
      const highlightInfo = checkHighlightNumber(item, userInfo)
      // 获取号码的高亮数组，用于进行样式高亮渲染
      const numberArr = item.number.split('').map((item,index) => {
        let highlight = false
        if (highlightInfo && index >= highlightInfo.startIndex && index <= highlightInfo.endIndex ) {
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
    handleChange(indexFlag, tabFlag) {
      // 修改tab头部样式
      this.headerActive = indexFlag;
      // 修改激活tab的样式
      // 修改内容区域展示
      this.tabActive = tabFlag;
      const searchContent = this.getSearchContent();
      const clickGdpObj = {
        XY_transaction_id: this.getSearchUUID(),
        WT_et: "clk",
        type: "",
        WT_envName: this.tabActive === 'hotPackage' ? '选套餐' : '选靓号',
        WT_markId: "",
        XY_first_class: "搜索结果页",
        XY_second_class: "",
        WT_next_url: '',
        WT_plat: sessionStorage.pagePlat || "",
        WT_es: sessionStorage.pageUrl || "",
        WT_ti: "搜索结果页",
        XY_pageEntry: sessionStorage.pageEntrance || "",
        // 插码方案修改2025-1-16
        WT_area_type_1: "楼层",
        areaid: "", // [区域id_模板id]
        WT_area_type_2: "全部",
        WT_area_name: "号卡卡片_tab切换",
        XY_env_type: "tab",
        WT_event: 'P00000132680' || "",
        XY_gd_source: "搜索平台", // [如果source=qqd，传qqd；如果source=app，传app]
        XY_scene: searchContent, // 搜索内容
        WT_si_n: "", // 物品对应的名称
        WT_goods_id: "", // 物品所对应的id信息
        XY_visit_source: sessionStorage.pageEntrance || "", // 访问来源
        WT_charge_phone: "",
        WT_errCode: "",
        WT_errMsg: "",
        XY_env_extend_attribute: "",
      };
      console.log("tab点击曝光", clickGdpObj);
      if (isApp()) {
        gdp("track", "clk", clickGdpObj);
      }
    },
    refresh(activeTab) {
      this.refreshing = true
      console.log('点击了换一批', activeTab)
      if (activeTab === 'hotPackage') {
        this.$refs.hotPackageRef?.planRefresh()
        setTimeout(() => {
          this.refreshing = false
        }, 1000);
      }else if (activeTab === 'hotCard') {
        setTimeout(() => {
          this.refreshing = false
        }, 1000);
        this.$emit('refreshHotMobileNumRequest')
      }
      const searchContent = this.getSearchContent();
      const clickGdpObj = {
        XY_transaction_id: this.getSearchUUID(),
        WT_et: "clk",
        type: "",
        WT_envName: '换一批',
        WT_markId: "",
        XY_first_class: "搜索结果页",
        XY_second_class: "",
        WT_next_url: '',
        WT_plat: sessionStorage.pagePlat || "",
        WT_es: sessionStorage.pageUrl || "",
        WT_ti: "搜索结果页",
        XY_pageEntry: sessionStorage.pageEntrance || "",
        // 插码方案修改2025-1-16
        WT_area_type_1: "楼层",
        areaid: "", // [区域id_模板id]
        WT_area_type_2: "全部",
        WT_area_name: activeTab === 'hotPackage' ? "号卡卡片_选套餐" : "号卡卡片_选靓号",
        XY_env_type: "button",
        WT_event: 'P00000132680' || "",
        XY_gd_source: "搜索平台", // [如果source=qqd，传qqd；如果source=app，传app]
        XY_scene: searchContent, // 搜索内容
        WT_si_n: "", // 物品对应的名称
        WT_goods_id: "", // 物品所对应的id信息
        XY_visit_source: sessionStorage.pageEntrance || "", // 访问来源
        WT_charge_phone: "",
        WT_errCode: "",
        WT_errMsg: "",
        XY_env_extend_attribute: "",
      };
      console.log("换一换点击上报", clickGdpObj);
      if (isApp()) {
        gdp("track", "clk", clickGdpObj);
      }
    }
  },
};
</script>

<style scoped lang='scss'>
@keyframes planRefresh {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(180deg);
  }
}
.hotCard-wrap {
  margin: 0;
  padding: 0;
  box-sizing: border-box;

  .hotCard-tab {
    background: #ffffff;
    box-shadow: 0px 4px 20px 0px #f6f6f6;
    border-radius: 18px;
    padding: 0px 0px 0px 0px;
    margin-bottom: 18px;

    .noTab-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 32px 24px 14px 29px;
      .left{
        font-size: 32px;
        color: #000000;
        font-weight: 700;
        font-family: PingFangSC-Medium, sans-serif;
        line-height: 34px;
      }
      .left-package {
        height: 34px;
        width: 96px;
        background-image: url("../../assets/images/package-select.png");
        background-position: center top;
        background-size: 100% 100%;
      }
      .left-number {
        height: 34px;
        width: 96px;
        background-image: url("../../assets/images/number-select.png");
        background-position: center top;
        background-size: 100% 100%;
      }
      .right{
        display: flex;
        align-items: center;
        .refresh-icon{
          width: 32px;
          height: 32px;
          margin-right: 6px;
        }
        .text{
          font-family: PingFangSC, PingFang SC;
          font-size: 24px;
          color: #666666;
          line-height: 36px;
        }
      }
    }
    .tab-header {
      width: 100%;
      height: 91px;
      display: flex;
      justify-content: space-between;
      background-color: #fbfbfb;
      border-radius: 18px 18px 0 0;
      .left-package {
        height: 30px;
        width: 90px;
        background-image: url("../../assets/images/package-select.png");
        background-position: center top;
        background-size: 100% 100%;
      }
      .left-number {
        height: 30px;
        width: 90px;
        background-image: url("../../assets/images/number-select.png");
        background-position: center top;
        background-size: 100% 100%;
      }
      .left-package-normal {
        height: 30px;
        width: 90px;
        background-image: url("../../assets/images/package.png");
        background-position: center top;
        background-size: 100% 100%;
      }
      .left-number-normal {
        height: 30px;
        width: 90px;
        background-image: url("../../assets/images/number.png");
        background-position: center top;
        background-size: 100% 100%;
      }
    }
    .stop-refresh{
      animation: planRefresh 0.6s linear 0s infinite both;
    }

    .two-left {
      background-image: url("../../assets/images/two-left.png");
      background-position: center top;
      background-size: 100% 100%;
    }

    .two-right {
      background-image: url("../../assets/images/two-right.png");
      background-position: center top;
      background-size: 100% 100%;
    }

    .header-item {
      height: 92px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding-bottom: 16px;
      font-family: AlimamaFangYuanTiVF-Medium, AlimamaFangYuanTiVF-Medium;
      font-weight: normal;
      font-size: 28px;
      color: #666666;
      line-height: 34px;

      .refresh{
        display: flex;
        align-items: center;
        .refresh-icon{
          width: 32px;
          height: 32px;
          margin-right: 8px;
          margin-left: 12px;
        }
        .text{
          font-family: PingFangSC, PingFang SC;
          font-size: 24px;
          color: #666666;
          line-height: 36px;
        }
      }
    }

    .header-active {
      color: #000000;
    }

    .tab-content{
      display: flex;
      justify-content: center;
    }
  }
}
</style>