<template>
  <div
    :class="
      radiusDataList && radiusDataList.length > 0
        ? 'r-t-wrap'
        : 'r-t-wrap-no r-t-wrap'
    "
    v-show="radiusTabShow"
    @touchmove.stop
  >
    <div
      class="r-t-item imp-attrs-radius-tabs"
      ref="tabsRef"
      v-for="(item, index) in radiusDataList"
      :key="index"
      :class="{ active: activeTabRadius === index }"
      @click="handleTab(item, index)"
      :imp-position-id="index + 1"
      imp-type="once"
      imp-track="imp"
      :imp-attrs="item.impAttrsRadiusTab"
      :data-value="JSON.stringify(item.impAttrsRadiusTab)"
    >
      {{ item.categoryName }}
    </div>
    <van-popup
      v-model="popShow"
      closeable
      close-icon="close"
      @close="onClose"
      safe-area-inset-bottom
      lock-scroll
      round
      position="bottom"
      :style="{ height: '80%', overflow: 'hidden' }"
    >
      <div class="pop-wrap">
        <div class="p-w-title">筛选</div>
        <div class="p-w-content">
          <div class="c-radius-btn">
            <div class="title">价格区间</div>
            <div class="btn-list">
              <div
                :class="['b-l-item', { 'item-active': chooseIndex === 1 }]"
                @click="handleChoose(1)"
              >
                {{ price1 }}
              </div>
              <div
                :class="['b-l-item', { 'item-active': chooseIndex === 2 }]"
                @click="handleChoose(2)"
              >
                {{ price2 }}
              </div>
              <div
                :class="['b-l-item', { 'item-active': chooseIndex === 3 }]"
                @click="handleChoose(3)"
              >
                {{ price3 }}
              </div>
              <div
                :class="['b-l-item', { 'item-active': chooseIndex === 4 }]"
                @click="handleChoose(4)"
              >
                {{ price4 }}
              </div>
              <div
                :class="['b-l-item', { 'item-active': chooseIndex === 5 }]"
                @click="handleChoose(5)"
              >
                <van-field
                  v-model="price5"
                  type="digit"
                  placeholder="最低价"
                  maxlength="8"
                  @blur="handleMin"
                />
                <!-- <input v-model="price5" placeholder="最低价" type="number" oninput="if(value.length>8)value=value.slice(0,8)" pattern="[0-9]*" maxlength="8" /> -->
              </div>
              <span class="line">-</span>
              <div
                :class="['b-l-item', { 'item-active': chooseIndex === 6 }]"
                @click="handleChoose(6)"
              >
                <van-field
                  v-model="price6"
                  type="digit"
                  placeholder="最高价"
                  maxlength="8"
                  @blur="handleMax"
                />
                <!-- <input v-model="price6" placeholder="最高价" type="number" oninput="if(value.length>8)value=value.slice(0,8)" pattern="[0-9]*" maxlength="8" /> -->
              </div>
            </div>
          </div>
          <div class="c-radius-btn">
            <div class="title">网络制式</div>
            <div class="btn-list btn-half">
              <div
                v-for="(item, index) in networkList"
                :key="item.code + Math.random()"
                :class="[
                  'b-l-item',
                  { 'item-active': chooseNetIndex === index },
                ]"
                @click="handleNetChoose(item, index)"
              >
                {{ item.name }}
              </div>
            </div>
          </div>
          <div class="c-radius-btn">
            <div class="title">购机方式</div>
            <div class="btn-list btn-half">
              <div
                v-for="(item, index) in buyWayList"
                :key="item.code + Math.random()"
                :class="[
                  'b-l-item',
                  { 'item-active': chooseBuyIndex === index },
                ]"
                @click="handleBuyWayChoose(item, index)"
              >
                {{ item.name }}
              </div>
            </div>
          </div>
          <div class="c-radius-btn" v-if="provinceCodeLocal == '200'">
            <div class="title">发货地市</div>
            <div class="btn-list">
              <div
                v-for="(item, index) in provinceList"
                :key="item.code + Math.random()"
                :class="[
                  'b-l-item',
                  { 'item-active': chooseProIndex === index },
                ]"
                @click="handleProChoose(item, index)"
              >
                {{ item.name }}
              </div>
            </div>
          </div>
          <div class="c-bottom">
            <div @click="handleReset()">重置</div>
            <div @click="handleConfirm()">确定</div>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import CommonApi from "@/api/index";
import {
  Debounce,
  handleGetUrlParam,
  isApp,
  handleGdpImp,
  handleQueryGetConfig,
  handleScreenData,
} from "@/utils/tool";

export default {
  inject: ["updateSearchZoneHasData", "getSearchUUID", "getSearchContent"],
  data() {
    return {
      borderHeight: "1px",
      radiusTabShow: false,
      popShow: false,
      activeTabRadius: 0,
      chooseNetIndex: -1,
      chooseBuyIndex: -1,
      chooseProIndex: 0,
      radiusDataList: [],
      chooseIndex: 0,
      minPrice: null,
      maxPrice: null,
      price1: "0-499",
      price2: "499-1499",
      price3: "1499-2499",
      price4: "2499以上",
      price5: null,
      price6: null,
      formItem: {
        maxPrice: null,
        minPrice: null,
      },
      buyWayList: [],
      networkList: [],
      networkStd: "", // 网络制式
      buyWay: "", // 购机方式
      confirmFlag: false, //确认标识
      provinceList: [],
      provinceCodeLocal: "", //省份
      pageEntrance: "", //页面入口
      cityCode: "", //广东地市筛选增加参数-接口用到的省份
      configParams: {
        paramTypes: [
          "UNIFY_SEARCH_NETWORK_STD",
          "UNIFY_SEARCH_BUY_WAY",
          "UNIFY_SEARCH_BUYWAY_URL",
          "UNIFY_SEARCH_CORNERMARK_URL",
          "UNIFY_SHIP_CITY_CODE",
          // "UNIFY_GUANGDONG_CITY_CODE",//广东省地市查询
          "UNIFY_ENTRY_PAGE_LIST", //页面入口
          "UNIFY_ENTRY_PAGE_COLUMN",
        ],
        provCode: "",
        loginProvince: "",
      },
    };
  },
  watch: {
    provinceList: {
      // 固定发货地只有一个发货地的情况下，默认选中（当前数据中只有广州），有2个及以上发货地则不选中（多个发货地的情况下），由用户手动选择过滤
      handler(newVal, oldVal) {
        if (newVal && newVal.length >= 2) {
          this.chooseProIndex = -1;
        } else if (newVal && newVal.length == 1) {
          this.chooseProIndex = 0;
        }
      },
      immediate: true,
    },

    // 点击有二级的tab的时候自动触发第一个radiustab点击事件一次--不需要
    radiusDataList: {
      handler(newVal, oldVal) {
        if (newVal && newVal.length && oldVal.length == 0) {
          this.$nextTick(() => {
            const elements = document.querySelectorAll(
              ".imp-attrs-radius-tabs"
            );
            // 遍历所有元素
            elements.forEach((elementE, indexE) => {
              // 判断当前元素是否是需要的元素
              const obj = JSON.parse(elementE.dataset.value);
              // const attr = elementE.getAttribute("imp-attrs");
              // console.log(obj,'-------------搜索结果页_二级分类tab名称-曝光事件传参----------------');
              // if(isApp()){
              // handleGdpImp(obj);
              obj.XY_transaction_id = this.getSearchUUID();
              handleGdpImp(
                elementE,
                obj,
                "radiusTab",
                obj.WT_envName + obj.XY_point_position,
                "搜索结果页_二级分类tab名称"
              );
              // }
            });
            /**
             * 埋点-插码-上报
             * 点击事件采集
             * 搜索结果页_二级分类tab名称
             */
            // console.log(JSON.stringify(newVal[0].impAttrsRadiusTab),'-------------搜索结果二级分类tab-默认第一个tab-点击事件传参----------------');
            // console.log("-----radius-tabposition-----"+1);
            // if(isApp()){
            //   gdp('track',"clk", {
            //     "WT_et":"clk",
            //     "WT_envName": newVal[0].categoryName,
            //     "WT_event": newVal[0].pCode,
            //     "WT_markId": newVal[0].categoryCode,
            //     "XY_first_class": newVal[0].parentCategoryName,
            //     "XY_point_position":1
            //   });
            // }
          });
        }
      },
    },
  },
  mounted() {},
  methods: {
    /**
     * 二级分类锚点跟踪
     */
    scrollToActiveTab() {
      // 获取 Tabs 组件的 DOM 元素
      this.$nextTick(() => {
        const tabsElement = this.$refs.tabsRef;
        // 获取活动页签的 DOM 元素
        tabsElement.forEach((elementE, indexE) => {
          if (elementE.className == "r-t-item imp-attrs-radius-tabs active") {
            // 判断活动页签是否在当前页面
            if (elementE && !this.isInViewport(elementE)) {
              // 使用 scrollIntoView() 方法滚动到活动页签
              setTimeout(() => {
                elementE.scrollIntoView({ behavior: "smooth", block: "end" });
              }, 200);
            }
          }
        });
      });
    },
    isInViewport(element) {
      const rect = element.getBoundingClientRect();
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <=
          (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <=
          (window.innerWidth || document.documentElement.clientWidth)
      );
    },
    handleMin(event) {
      var valueMin = event.target.value;
      if (this.price6) {
        if (Number(this.price6) < Number(valueMin)) {
          this.price5 = this.price6;
          this.price6 = valueMin;
        }
      }
    },
    handleMax(event) {
      var valueMax = event.target.value;
      if (this.price5) {
        if (Number(this.price5) > Number(valueMax)) {
          event.target.value = this.price5;
          this.price6 = this.price5;
          this.price5 = valueMax;
        }
      }
    },
    handleTab: Debounce(function (tab, index) {
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
      if (this.activeTabRadius === index) {
        //当前tab不刷新
        return;
      } else {
        this.activeTabRadius = index;
      }
      this.updateSearchZoneHasData(false);
      // that.radiusDataList = [];
      // this.activeTabRadius = index;
      this.$parent.moreArrList = [];
      this.$parent.moreArrDataList = [];
      this.$parent.finishedText = " ";
      this.$parent.sortField = "";
      this.$parent.pagePage = 1;
      this.formItem.maxPrice = null;
      this.formItem.minPrice = null;
      this.networkStd = "";
      this.buyWay = "";
      this.cityCode = "";
      this.$parent.totalPage = null;
      this.handleReset();
      if (
        tab.templateId == this.CONSTANTS.TEMPLATEPAGE.PRODHW004 ||
        tab.templateId == this.CONSTANTS.TEMPLATEPAGE.PRODMS012
      ) {
        //切换tab的时候如果有筛选，就自动默认到综合
        this.$parent.activeTab = 0;
      }
      //判断当前二级只有搜索专区有数据的场景
      // debugger
      // if(sessionStorage.tabsListSesString && sessionStorage.searchZoneResultListSesString){
      //   var string1 = sessionStorage.tabsListSesString.substring(0, sessionStorage.tabsListSesString.length - 1);
      //   var string2 = sessionStorage.searchZoneResultListSesString.substring(0, sessionStorage.searchZoneResultListSesString.length - 1);
      //   if(tab.categoryCode.indexOf(string1) == -1){
      //     this.$parent.handleQueryResult(tab.categoryCode, tab.parentCode, tab.templateId);
      //   }else{
      //     this.$parent.handleQueryResult(tab.categoryCode, tab.parentCode, tab.templateId, '5');
      //   }
      // }
      // 分页初始化
      this.$parent.loading = false;
      this.$parent.finished = false;
      // this.$parent.onLoad();
      this.$parent.handleQueryResult(
        tab.categoryCode,
        tab.parentCode,
        tab.verticalTemplateId
      );
      // this.popShow = true;
      let tabIndex = index + 1;
      console.log(
        JSON.stringify(tab.impAttrsRadiusTab),
        "-------------搜索结果二级分类tab-点击事件传参----------------"
      );
      console.log("-----radius-tabposition-----" + tabIndex);

      handleScreenData(tab.parentCode, tab.categoryCode);

      /**
       * 埋点-插码-上报
       * 点击事件采集
       * 搜索结果页_二级分类tab名称
       */
      const clickGdpObj = {
        XY_transaction_id: this.getSearchUUID(),
        WT_et: "clk",
        WT_envName: tab.categoryName,
        WT_event: tab.pCode,
        WT_markId: tab.categoryCode,
        XY_first_class:
          sessionStorage.pageEntrance == "6"
            ? "权益"
            : sessionStorage.pageEntrance == "8"
            ? "商城"
            : tab.parentCategoryName,
        XY_point_position: tabIndex,
        WT_plat: sessionStorage.pagePlat || "",
        WT_es: sessionStorage.pageUrl || "",
        WT_ti: "搜索结果页",
        XY_pageEntry: sessionStorage.pageEntrance || "",
        // 插码方案修改2025-1-16
        WT_area_type_1: "楼层",
        areaid: "", // 父物品id信息（无父物品传空）
        WT_area_type_2: tab.categoryName,
        WT_area_name:
          sessionStorage.pageEntrance == "6"
            ? "权益"
            : sessionStorage.pageEntrance == "8"
            ? "商城"
            : tab.parentCategoryName, // 若没有二级分类，此名称则记录为一级分类名称
        XY_env_type: "icon",
        WT_event: "P00000050507", // 一级tab传P00000050500  二级tab传P00000050507
        XY_gd_source: "搜索平台",
        XY_scene: this.getSearchContent() || "", // 搜索内容
        WT_si_n: "", // 物品对应的名称
        WT_goods_id: "", // 物品所对应的id信息
        XY_visit_source: sessionStorage.pageEntrance || "", // 访问来源
      };
      console.log("点击二级分类tab上报===>");
      console.log(clickGdpObj);

      if (isApp()) {
        gdp("track", "clk", clickGdpObj);
      }
    }, 100),

    handleChoose(index) {
      if (this.chooseIndex === index) {
        this.chooseIndex = null;
        this.formItem.maxPrice = null;
        this.formItem.minPrice = null;
      } else {
        this.chooseIndex = index;
      }
      if (index != 5 && index != 6) {
        this.price5 = null;
        this.price6 = null;
        this.formItem.maxPrice = null;
        this.formItem.minPrice = null;
      }
      // this.chooseIndex = index;
    },

    handleNetChoose(item, index) {
      if (this.chooseNetIndex === index) {
        this.chooseNetIndex = null;
        this.networkStd = "";
      } else {
        this.chooseNetIndex = index;
        this.networkStd = item.code;
      }
    },
    handleBuyWayChoose(item, index) {
      if (this.chooseBuyIndex === index) {
        this.chooseBuyIndex = null;
        this.buyWay = "";
      } else {
        this.chooseBuyIndex = index;
        this.buyWay = item.code;
      }
    },
    handleProChoose(item, index) {
      if (this.chooseProIndex === index) {
        this.chooseProIndex = null;
        this.cityCode = "";
      } else {
        this.chooseProIndex = index;
        this.cityCode = item.code;
      }
    },
    /**
     *过滤浮框初始化
     */
    onClose() {
      // let obj = this.$parent.filterList[0];
      // this.$parent.handleFilter(obj,0);
      if (this.confirmFlag) {
        this.$parent.activeTab = 3; //筛选确认的时候要定位到筛选
        this.confirmFlag = false;
      } else {
        if (this.$parent.originActiveTab == 3) {
          this.$parent.activeTab = 0;
        } else {
          this.$parent.activeTab = this.$parent.originActiveTab;
        }
      }
    },
    handleConfirm: Debounce(function () {
      const that = this;
      const coco = `price${that.chooseIndex}`;
      that.confirmFlag = true;
      switch (that.chooseIndex) {
        case 1:
        case 2:
        case 3:
          that.formItem.minPrice = that[coco].split("-")[0];
          that.formItem.maxPrice = that[coco].split("-")[1];
          break;
        case 4:
          that.formItem.minPrice = "2499";
          that.formItem.maxPrice = null;
          break;
        case 5:
          that.formItem.minPrice = that[coco];
          that.formItem.maxPrice = that.price6;
          if (
            Number(that.formItem.maxPrice) &&
            Number(that.formItem.minPrice)
          ) {
            if (
              Number(that.formItem.maxPrice) < Number(that.formItem.minPrice)
            ) {
              that.formItem.minPrice = that.price6;
              that.formItem.maxPrice = that[coco];
            }
          }
          break;
        case 6:
          that.formItem.minPrice = that.price5;
          that.formItem.maxPrice = that[coco];
          if (
            Number(that.formItem.maxPrice) &&
            Number(that.formItem.minPrice)
          ) {
            if (
              Number(that.formItem.maxPrice) < Number(that.formItem.minPrice)
            ) {
              that.formItem.minPrice = that[coco];
              that.formItem.maxPrice = that.price5;
            }
          }
          break;
        default:
          console.log("radius-default");
      }
      that.popShow = false;
      that.$emit("getFormItem");
    }, 100),
    handleReset() {
      const that = this;
      that.chooseIndex = 0;
      that.chooseNetIndex = -1;
      that.chooseBuyIndex = -1;
      that.price5 = null;
      that.price6 = null;
      that.formItem.minPrice = null;
      that.formItem.maxPrice = null;
      that.buyWay = "";
      that.networkStd = "";
      that.cityCode = "";
      //分页初始化
      that.$parent.pagePage = 1;
      that.$parent.loading = false;
      that.$parent.finished = false;
      if (that.provinceList.length >= 2) {
        that.chooseProIndex = -1;
      } else if (that.provinceList.length == 1) {
        that.chooseProIndex = 0;
      }
    },
    handleResetNoPrice() {
      // const that = this;
      // that.chooseIndex = 0;
      // that.price5 = null;
      // that.price6 = null;
      // that.formItem.minPrice = null;
      // that.formItem.maxPrice = null;
    },
    handleQueryGetConfigInit() {
      // 改为从静态资源取
      const that = this;
      that.provinceCodeLocal =
        JSON.parse(localStorage.getItem("userInfo")).province || "";
      that.configParams.entryPage = sessionStorage.pageEntrance || "";
      let configList = sessionStorage.configListSes
        ? JSON.parse(sessionStorage.configListSes)
        : {};
      that.configParams.loginProvince =
        JSON.parse(localStorage.getItem("userInfo")).loginProvince || "";
      that.configParams.provCode =
        JSON.parse(localStorage.getItem("userInfo")).province || "";
      that.buyWayList = configList.UNIFY_SEARCH_BUY_WAY;
      that.networkList = configList.UNIFY_SEARCH_NETWORK_STD;
      handleQueryGetConfig(this.configParams).then((configRes) => {
        if (configRes) {
          that.provinceList = configRes.data.UNIFY_SHIP_CITY_CODE;
        }
      });

      // const parmas = {
      //   paramTypes: [
      //     'UNIFY_SEARCH_NETWORK_STD',
      //     'UNIFY_SEARCH_BUY_WAY',
      //   ],
      // };
      // CommonApi.queryGetConfig(parmas).then((res) => {
      //   if (res.code == '000000') {
      //     that.buyWayList = res.data.UNIFY_SEARCH_BUY_WAY;
      //     // that.buyWay = res.data.UNIFY_SEARCH_BUY_WAY[0].code
      //     that.networkList = res.data.UNIFY_SEARCH_NETWORK_STD;
      //     // that.networkStd = res.data.UNIFY_SEARCH_NETWORK_STD[0].code;
      //   }
      // }).catch(() => {
      //   console.log('GetConfig接口调用失败');
      // });
    },
  },
};
</script>

<style scoped lang="scss">
$theme-color: #2892ff;

.pop-wrap {
  padding: 0px 43px 0px 41px;
  // height:1150px;
  // overflow-y: auto;
  // position: relative;
  .p-w-title {
    height: 110px;
    text-align: center;
    font-size: 36px;
    font-weight: 500;
    color: #333333;
    vertical-align: middle;
    line-height: 110px;
    border-bottom: 1px solid #e5e5e5;
  }
  .p-w-content {
    padding-bottom: calc(50%);
    max-height: 1150px;
    overflow-y: auto;
    .c-radius-btn {
      .title {
        font-size: 24px;
        font-weight: 500;
        color: #333333;
        line-height: 33px;
        margin: 36px 0px 18px 0px;
        font-weight: 700;
        font-family: PingFangSC-Medium;
      }
      .btn-list {
        display: flex;
        flex-wrap: wrap;
        .line {
          color: #e9e9e9;
          font-size: 28px;
          line-height: 70px;
          padding-right: 10px;
        }
        .item-active {
          input {
            color: #2892ff !important;
            font-weight: 700;
            font-family: PingFangSC-Medium;
            background: #f5faff !important;
            font-size: 28px;
          }
          input:disabled {
            opacity: 1;
            -webkit-text-fill-color: #2892ff;
          }
          color: #2892ff !important;
          border-color: #2892ff !important;
          font-weight: 500;
          font-family: PingFangSC-Medium;
          background: #f5faff !important;
          font-size: 28px;
          .van-cell {
            background: #f5faff !important;
          }
        }

        .b-l-item {
          background: #f6f6f6;
          border: 2px solid #f6f6f6;
          border-radius: 36px;
          font-size: 28px;
          color: #999999;
          line-height: 70px;
          padding: 0px 10px;
          text-align: center;
          height: 70px;
          margin-right: 10px;
          margin-bottom: 30px;
          min-width: 200px;
          justify-content: space-between;
          input {
            width: 148px;
            height: 48px;
            line-height: 48px;
            border: none;
            background: #f6f6f6;
            text-align: center;
            font-size: 28px;
            // color: #2892FF;
          }
          input {
            opacity: 1;
            -webkit-text-fill-color: #999999;
            font-size: 28px;
          }
          .van-cell {
            width: 150px;
            height: 50px;
            line-height: 50px;
            border: none;
            background: #f6f6f6;
            text-align: center;
            margin: 8px 0px 0px 10px;
            padding: 0px 0px;
            // color: #2892FF;
            ::v-deep input {
              color: #2892ff;
              text-align: center;
            }
          }

          &:nth-child(3n) {
            margin-right: 0px;
          }
        }
      }
      .btn-half {
        .b-l-item {
          width: 48%;
          &:nth-child(3n) {
            margin-right: 20px;
          }
          &:nth-child(even) {
            margin-right: 0px;
          }
          // &:nth-child(odd){
          //   margin-right: 20px;
          // }
        }
      }
    }
    .c-bottom {
      background: #fff;
      height: 140px;
      position: fixed;
      bottom: 10px;
      display: flex;
      justify-content: space-around;
      div {
        margin-top: 20px;
        height: 90px;
        background: #f6f6f6;
        border-radius: 45px;
        font-size: 32px;
        font-weight: 500;
        color: #666666;
        line-height: 90px;
        text-align: center;
        width: 321px;
        margin-right: 24px;
        &:nth-child(even) {
          margin-right: 0px;
          color: #fff;
          background: linear-gradient(90deg, #0095ff 0%, #0080ff 100%);
        }
      }
    }
  }
}
.r-t-wrap::before {
  content: " ";
  height: v-bind(borderHeight);
  width: 100%;
  position: absolute;
  top: -20px;
  left: 0;
  background-color: #e5e5e5;
}
@media (-webkit-min-device-pixel-ratio: 1.5) and (-webkit-max-device-pixel-ratio: 2.49) {
  .r-t-wrap::before {
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }
}
@media (-webkit-min-device-pixel-ratio: 2.5) {
  .r-t-wrap::before {
    -webkit-transform: scaleY(0.33);
    transform: scaleY(0.33);
  }
}
.r-t-wrap-no {
  padding-top: 0px !important;
  margin-bottom: 0px !important;
}
.r-t-wrap {
  display: flex;
  flex-direction: row;
  overflow-x: auto;
  overflow-y: hidden;
  margin-bottom: 30px;
  // border-top: 1px solid #EBEBEB;
  padding-top: 10px;
  // padding-bottom:15px;
  // position: fixed;
  // top:200px;
  // background: #f7f7f7;
  // z-index: 99;
  width: 100%;
  scrollbar-width: none;
  position: relative;
  .r-t-item {
    height: 58px;
    background: #ffffff;
    border-radius: 30px;
    font-size: 28px;
    color: rgba(0, 0, 0, 0.8);
    line-height: 58px;
    text-align: center;
    padding: 0px 20px;
    margin-right: 16px;
    min-width: 157px;
    border: 2px solid #ffffff;
    flex-shrink: 0;
    margin-bottom: 2px;
    // display: table;
  }

  .active {
    border: 2px solid $theme-color;
    color: $theme-color;
    background: #f5faff !important;
  }
}
.r-t-wrap::-webkit-scrollbar {
  display: none;
}
.r-t-wrap::-moz-scrollbar {
  display: none;
}
</style>
