<template>
  <div
    :class="
      moreArrDataList.length > 5
        ? 'recommend-wrap-height recommend-wrap'
        : 'recommend-wrap'
    "
  >
    <div class="title" v-if="moreArrDataList && moreArrDataList.length > 0">
      为您推荐
    </div>
    <div class="module-wrap wrap-fixed">
      <div class="module-wrap wrap-fixed">
        <div class="m-content">
          <van-list
            v-model="loading"
            :finished="finished"
            :finished-text="finishedText"
            @load="onLoad"
            :immediate-check="false"
            class=""
            :offset="20"
          >
            <div
              :class="
                moreArrDataList.length == index + 1
                  ? 'content-item content-item-radius'
                  : 'content-item'
              "
              v-for="(item, index) in moreArrDataList"
              :key="item._id"
              @click="handleClickTo(item, index)"
              :id="'imp-recommend-content_' + item.pCode"
              :imp-position-id="item + 1"
              imp-type="once"
              imp-track="imp"
              :imp-attrs="item.impAttrsList"
              :data-value="JSON.stringify(item.impAttrsList)"
            >
              <div
                :class="
                  item.templateId == CONSTANTS.TEMPLATEPAGE.BIZ003
                    ? 'c-i-left-width c-i-left'
                    : 'c-i-left'
                "
              >
                <!-- <img :src="itemD.iconUrl?itemD.iconUrl:item.defaultUrl" draggable="false" alt=""/> -->
                <van-image
                  :src="
                    item.iconUrl
                      ? item.iconUrl.replace(' ', '')
                      : item.defaultUrl
                  "
                  draggable="false"
                  :style="{
                    'max-width':
                      item.templateId == CONSTANTS.TEMPLATEPAGE.PRODHW004 ||
                      item.templateId == CONSTANTS.TEMPLATEPAGE.PRODMS012 ||
                      item.templateId == CONSTANTS.TEMPLATEPAGE.ACTI002 ||
                      item.templateId == CONSTANTS.TEMPLATEPAGE.LIFEVD010
                        ? (offsetWidth * 150) / 750 + 'px'
                        : item.templateId == CONSTANTS.TEMPLATEPAGE.BIZ003
                        ? (offsetWidth * 100) / 750 + 'px'
                        : (offsetWidth * 140) / 750 + 'px',
                  }"
                >
                  <template v-slot:loading>
                    <van-loading type="spinner" size="20" />
                    <!-- <img :src="item.defaultUrl" :style="{'max-width': item.templateId == CONSTANTS.TEMPLATEPAGE.PRODHW004 || item.templateId == CONSTANTS.TEMPLATEPAGE.ACTI002 || item.templateId == CONSTANTS.TEMPLATEPAGE.LIFEVD010 ? ((offsetWidth * 150) / 750) + 'px' : item.templateId == CONSTANTS.TEMPLATEPAGE.BIZ003 ? ((offsetWidth * 100) / 750) + 'px': ((offsetWidth * 140) / 750) + 'px', 'width': 'auto','height': 'auto'}" draggable="false" 
                      alt=""/> -->
                  </template>
                  <template v-slot:error>
                    <img
                      :src="item.defaultUrl"
                      :style="{
                        'max-width':
                          item.templateId == CONSTANTS.TEMPLATEPAGE.PRODHW004 ||
                          item.templateId == CONSTANTS.TEMPLATEPAGE.PRODMS012 ||
                          item.templateId == CONSTANTS.TEMPLATEPAGE.ACTI002 ||
                          item.templateId == CONSTANTS.TEMPLATEPAGE.LIFEVD010
                            ? (offsetWidth * 150) / 750 + 'px'
                            : item.templateId == CONSTANTS.TEMPLATEPAGE.BIZ003
                            ? (offsetWidth * 100) / 750 + 'px'
                            : (offsetWidth * 140) / 750 + 'px',
                        width: 'auto',
                        height: 'auto',
                      }"
                      draggable="false"
                      alt=""
                  /></template>
                </van-image>
                <img
                  class="l-tag"
                  :style="{
                    right:
                      item.templateId == CONSTANTS.TEMPLATEPAGE.BIZ003
                        ? (offsetWidth * 10) / 750 + 'px'
                        : '-' + (offsetWidth * 10) / 750 + 'px',
                  }"
                  v-if="item.cornerMarkUrl"
                  :src="item.cornerMarkUrl"
                  draggable="false"
                  alt=""
                />
              </div>
              <align-list
                :itemData="item"
                :itemParent="item"
                itemParentTemplateId="RECOMMEND"
              ></align-list>
            </div>
            <div
              v-if="moreArrDataList.length && moreArrDataList.length >= 8"
              class="bottom-line"
            >
              我是有底线的
            </div>
          </van-list>
        </div>
      </div>
    </div>
    <!-- 加载中 -->
    <Loadding ref="loading" />
  </div>
</template>

<script>
import CommonApi from "@/api/index";
import AlignList from "./AlignList.vue";
import Loadding from "../../Loadding.vue";
import {
  handleSaveClickInfo,
  handleGetUrlParam,
  goPageUrl,
  isApp,
  handleGdpImp,
  getQueryString,
  getQueryStringNew,
  isProtogenesisSkip,
  goProtogenesisPage,
} from "@/utils/tool";

export default {
  name: "no-data",
  components: {
    AlignList,
    Loadding,
  },
  computed: {
    vanListHeight() {
      return "class100";
    },
  },
  data() {
    return {
      borderHeight: "1px",
      loading: false,
      finishedText: " ",
      finished: false,
      moreArrList: [],
      moreArrDataList: [],
      offsetWidth: null,
      pagePage: 1,
      totalPage: null,
      paramData: {},
      pageEntrance: null,
    };
  },
  inject: ["getSearchUUID", "getSearchContent"],
  mounted() {
    // this.handleQueryResult();
    this.offsetWidth = document.body.offsetWidth;
  },
  methods: {
    onLoad() {
      if (this.totalPage) {
        if (parseInt(this.pagePage, 10) >= this.totalPage) {
          this.finished = true;
        } else {
          this.pagePage++;
          this.handleQueryResult(
            this.paramData.categoryCode,
            this.paramData.parentCode,
            this.paramData.templateId
          );
        }
      } else {
        this.loading = false;
      }
    },
    /**
     * 查询为您推荐
     * @param {*} categoryCodeIn
     * @param {*} parentCodeIn
     * @param {*} templateId
     * @param {*} type 1：从一级类目查询要清空筛选里的数据
     */
    handleQueryResult(categoryCodeIn, parentCodeIn, templateId, type) {
      const that = this;
      that.moreArrDataList = [];
      // that.loading = true;
      // that.$refs.loading.loadingShow();
      // 从会话中获取页面入口信息
      // this.pageEntrance = getQueryStringNew().pageEntrance;
      this.pageEntrance = sessionStorage.getItem("pageEntrance");

      const userInfo = localStorage.getItem("userInfo")
        ? JSON.parse(localStorage.getItem("userInfo"))
        : null;
      // console.log("that.totalPage"+that.totalPage);
      let getUrlParam;
      getUrlParam = handleGetUrlParam();
      that.paramData.page = that.pagePage;
      that.paramData.size = 100;
      that.paramData.provCode = getUrlParam.provCode;
      // that.paramData.clientVersion = getUrlParam.clientVersion;
      that.paramData.clientVersion = userInfo?.version
        ? `10_10,${userInfo?.version}`
        : "10_10";
      that.paramData.beans = getUrlParam.beans;
      (that.paramData.loginProvince = userInfo?.loginProvince || ""),
        (that.paramData.loginCity = getUrlParam.loginCity);
      that.paramData.entryPage = that.pageEntrance;
      that.paramData.cityCode = userInfo?.city || "";
      console.log(that.paramData, "为你推荐传参");
      // that.configList = sessionStorage.configListSes?JSON.parse(sessionStorage.configListSes):{};
      CommonApi.queryRecommend(that.paramData)
        .then((res) => {
          that.loading = false;
          that.$refs.loading.loadingHide();
          if (res.code == "000000") {
            if (res.data && res.data.result && res.data.result.length > 0) {
              // sessionStorage.setItem('transactionIdSes',res.data.transactionId);
              that.noDataShow = false;
              // res.data.result.forEach((item)=>{
              //   if(item.data){}
              // })
              // that.CONSTANTS.TEMPLATEPAGE.PRODLIST004.indexOf(templateId) != -1 ||  that.CONSTANTS.TEMPLATEPAGE.LIFELIST005.indexOf(templateId) != -1
              that.moreArrList = res.data.result;
              that.moreArrList.forEach((itemD, indexD) => {
                // itemD.pCode = 'P00000050506';
                itemD.parentCategoryName = itemD.categoryName;
                itemD.templateId = that.CONSTANTS.TEMPLATEPAGE.RECO001;
                // if(that.configList.UNIFY_SEARCH_CORNERMARK_URL){
                //   that.configList.UNIFY_SEARCH_CORNERMARK_URL.forEach((itemY,indexY) => {
                //     if(itemD.cornerMark && itemD.cornerMark == itemY.code){
                //       itemD.cornerMarkUrl = itemY.name
                //     }
                //   })
                // }

                //图片判断
                // if( itemD.iconUrl && itemD.iconUrl.replace(' ','').split(":")[0].indexOf("https") == -1 ){
                //   itemD.iconUrl = require('../../../assets/images/img4.png');
                // }else{
                if (
                  itemD.iconUrl &&
                  itemD.iconUrl.replace(" ", "").split(":")[1] &&
                  itemD.iconUrl
                    .replace(" ", "")
                    .split(":")[1]
                    .indexOf("10.4.160.6") != -1
                ) {
                  itemD.iconUrl = require("../../../assets/images/img4.png");
                }
                itemD.defaultUrl = require("../../../assets/images/img4.png");
                // }
                that.moreArrDataList.push(itemD);
                that.moreArrDataList.forEach((itemFi, indexFi) => {
                  //组装触点曝光所需impAttrs参数
                  const impAttrs = {};
                  // impAttrs.position_id = indexFi+1;
                  // impAttrs.type = "once";
                  impAttrs.WT_et = "imp";
                  impAttrs.WT_event = itemFi.pCode; //接口动态返P码
                  impAttrs.WT_envName = itemFi.title;
                  impAttrs.XY_point_position = indexFi + 1;
                  impAttrs.WT_markId = itemFi._id;
                  impAttrs.XY_first_class = "搜索结果页_无搜索结果_推荐区域";
                  impAttrs.WT_next_url = itemFi.linkAdress;
                  impAttrs.WT_plat = sessionStorage.pagePlat || "";
                  impAttrs.WT_es = sessionStorage.pageUrl || "";
                  impAttrs.WT_ti = "搜索结果页";
                  impAttrs.XY_pageEntry = sessionStorage.pageEntrance || ""; //新增页面入口
                  // 插码方案修改2025-1-16
                  impAttrs.WT_area_type_1 = "楼层";
                  impAttrs.areaid = ""; // 父物品id信息（无父物品传空）
                  impAttrs.WT_area_type_2 = "搜索无结果";
                  impAttrs.WT_area_name = "为您推荐"; // 若没有二级分类，此名称则记录为一级分类名称
                  impAttrs.XY_env_type = "icon";
                  impAttrs.XY_gd_source = "搜索平台";
                  impAttrs.XY_scene = this.getSearchContent() || ""; // 搜索内容
                  impAttrs.WT_si_n = itemFi.title; // 物品对应的名称
                  impAttrs.WT_goods_id = itemFi.itemId; // 物品所对应的id信息---tab标签没有id信息
                  impAttrs.XY_visit_source = sessionStorage.pageEntrance || ""; // 访问来源
                  // impAttrs.XY_transaction_id = that.getSearchUUID(); // 这里没有设置XY_transaction_id 是在上报传参时统一设置了
                  itemFi.impAttrsList = impAttrs;
                });
                // that.$set(that.moreArrDataList,indexD,itemD);
              });
              // that.moreArrDataList=JSON.parse(JSON.stringify(moreArrDataList));;
              // that.$forceUpdate();
              that.$emit("moreArrDataList", that.moreArrDataList);
              that.totalPage = res.data?.pageCount;
              //分页曝光-不重复曝光
              const arr = that.moreArrDataList;
              // 定义每页显示的数量
              let arrpageSize = 0;
              // if(templateId == that.CONSTANTS.TEMPLATEPAGE.PRODMB005){
              //   arrpageSize = 20;
              // }else{
              arrpageSize = 10;
              // }
              // 定义要显示的页数
              const pageNumber = that.pagePage;
              // 计算起始位置和结束位置
              const startIndex = (pageNumber - 1) * arrpageSize;
              const endIndex = pageNumber * arrpageSize;
              let impArrDataList = arr.slice(startIndex, endIndex);
              this.$nextTick(() => {
                /**
                 * 埋点-插码-上报
                 * 曝光事件采集
                 * 为您推荐_无搜索结果_推荐区域
                 */
                const elements = document.querySelectorAll(".content-item");
                // const impContent = document.querySelectorAll('#imp-more-content_'+parentCodeIn);
                elements.forEach((elementE, indexE) => {
                  const obj = JSON.parse(elementE.dataset.value);
                  impArrDataList.forEach((elementF, indexF) => {
                    // 判断当前元素是否是需要的元素
                    if (obj.WT_markId == elementF._id) {
                      // console.log(JSON.stringify(elementE.impAttrsList),'-------------moreY-商品-曝光事件传参----------------');
                      // if(isApp()){
                      elementF.impAttrsList.XY_transaction_id =
                        this.getSearchUUID();
                      handleGdpImp(
                        elementE,
                        elementF.impAttrsList,
                        "recommendList",
                        elementF.impAttrsList.WT_markId,
                        "为您推荐_无搜索结果_推荐区域"
                      );
                      // }
                    }
                  });
                });
              });
            } else {
              that.finishedText = " ";
              that.noDataShow = true;
              // that.currentCompList = [{ path: 'NoData', refD: 'NoDataRef' }];
            }
          }
        })
        .catch((err) => {
          that.finishedText = " ";
          that.noDataShow = true;
          that.loading = false;
          that.$refs.loading.loadingHide();
          console.log("请求接口失败", err);
        });
    },

    async handleClickTo(item, index) {
      this.$refs.loading.loadingShow();
      console.log(
        JSON.stringify(item.impAttrsList),
        "-------------为您推荐_无搜索结果_推荐区域-点击事件传参----------------"
      );
      console.log(
        "-----为您推荐_无搜索结果_推荐区域-商品position-----" + (index + 1)
      );
      /**
       * 埋点-插码-上报
       * 点击事件采集
       * 为您推荐_无搜索结果_推荐区域
       */
      const clickGdpObj = {
        XY_transaction_id: this.getSearchUUID(),
        WT_et: "clk",
        WT_envName: item.title,
        WT_event: item.pCode,
        WT_markId: item._id,
        XY_point_position: index + 1,
        XY_first_class: "搜索结果页_无搜索结果_推荐区域",
        WT_next_url: item.linkAdress,
        WT_plat: sessionStorage.pagePlat || "",
        WT_es: sessionStorage.pageUrl || "",
        WT_ti: "搜索结果页",
        XY_pageEntry: sessionStorage.pageEntrance || "",
        // 插码方案修改2025-1-16
        WT_area_type_1: "楼层",
        areaid: "", // 父物品id信息（无父物品传空）
        WT_area_type_2: "搜索无结果",
        WT_area_name: "为您推荐", // 若没有二级分类，此名称则记录为一级分类名称
        XY_env_type: "icon",
        WT_event: item.pCode, // 接口动态返P码
        XY_gd_source: "搜索平台",
        XY_scene: this.getSearchContent() || "", // 搜索内容
        WT_si_n: item.title, // 物品对应的名称
        WT_goods_id: item.itemId, // 物品所对应的id信息
        XY_visit_source: sessionStorage.pageEntrance || "", // 访问来源
      };
      console.log("点击无搜索结果_推荐区域数据上报===>");
      console.log(clickGdpObj);
      if (isApp()) {
        gdp("track", "clk", clickGdpObj);
      }
      await handleSaveClickInfo(item, this.searchContent).then((resolve) => {
        this.$refs.loading.loadingHide();
        if (resolve == "0") {
          // let jumpType = item.jumpType === '30' ? '5' : item.jumpType === '1' ? '4' : '1';
          // goPageUrl(item.jumpType, item.linkAdress);
          // window.location.href = item.linkAdress;
          if (isProtogenesisSkip(item)) {
            goProtogenesisPage(item.linkAdress1);
          } else {
            goPageUrl(item.jumpType, item.linkAdress);
          }
        }
      });
    },
  },
};
</script>
<style scoped lang='scss'>
.recommend-wrap::-webkit-scrollbar {
  display: none;
}
.recommend-wrap::-webkit-scrollbar {
  display: none;
}
.recommend-wrap-height {
  // height: 100%;
}
.recommend-wrap {
  width: 100%;
  padding-bottom: 30px;
  // height: 100%;
  // overflow-y: auto;
  // scrollbar-width: none;
  // padding:0px 29px;
  .title {
    text-align: left;
    font-size: 32px;
    font-family: PingFangSC;
    font-weight: 700;
    color: #000000;
    line-height: 34px;
    padding: 20px 29px;
    background: #fff;
  }
}
.m-content {
  .content-item-radius {
    border-bottom-left-radius: 18px !important;
    border-bottom-right-radius: 18px !important;
  }
  .content-item {
    display: flex;
    align-items: center;
    // border-bottom: 2px solid #f1f1f1;
    // padding: 30px 0px;
    position: relative;
    padding: 30px 24px 30px 29px;
    background: #fff;
    border-bottom-left-radius: 18px;
    border-bottom-right-radius: 18px;
    // margin:2px 0px;
    &:nth-child(1)::before {
      content: none;
    }
    &:not(:nth-last-child(1)) {
      border-bottom-left-radius: 0px;
      border-bottom-right-radius: 0px;
    }

    .c-i-left-width {
      width: 140px !important;
    }
    .c-i-left {
      margin-right: 20px;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 180px;
      .van-image {
        border-radius: 12px;
        overflow: hidden;
        img {
          width: 100%;
          border-radius: 12px;
        }
      }
      ::v-deep .van-image__img {
        min-width: 100px;
      }
      ::v-deep .van-image__error {
        position: relative;
        background-color: initial !important;
      }
      img {
        width: 150px;
        border-radius: 10px;
        // height: 150px;
      }
      .l-tag {
        width: auto;
        height: 24px;
        position: absolute;
        right: -10px;
        top: -10px;
        border-radius: 0px !important;
      }
    }
  }
  .content-item-three::before {
    content: none !important;
  }
  .content-item::before {
    content: " ";
    height: v-bind(borderHeight);
    width: calc(100% - 60px);
    position: absolute;
    top: 0;
    left: 30px;
    background-color: #e5e5e5;
  }

  @media (-webkit-min-device-pixel-ratio: 1.5) and (-webkit-max-device-pixel-ratio: 2.49) {
    .content-item::before {
      // height: 1.3px;
      -webkit-transform: scaleY(0.5);
      transform: scaleY(0.5);
    }
  }

  @media (-webkit-min-device-pixel-ratio: 2.5) {
    .content-item::before {
      // height: 1.3px;
      -webkit-transform: scaleY(0.33);
      transform: scaleY(0.33);
    }
  }
}
.module-wrap1 {
  // position: fixed;
  // width: 92%;
  // background: #fff;
  // z-index: 99;
  // top: 310px;
  box-shadow: none;
}
.wrap-fixed {
  height: 100%;
  // max-height: calc((100% - 116px));
  overflow-y: auto;
  scrollbar-width: none;
  // margin-bottom: 100px;
  // border-radius: 18px;
  .m-content {
    height: 100%;
  }
}
::v-deep.van-list {
  //
  // height: calc((100% - 58px));
  height: 100%;
  overflow-y: auto;
  scrollbar-width: none;
  // border-radius: 18px;
  // margin-top: 100px;
}

::v-deep.van-list__finished-text {
  font-size: 24px;
  font-weight: 400;
  color: #cccccc;
  line-height: 33px;
  text-align: center;
  margin: 36px 0px 94px 0px;
  width: 100%;
}
::v-deep.van-list::-webkit-scrollbar {
  display: none;
}
::v-deep.van-list::-moz-scrollbar {
  display: none;
}
.wrap-fixed::-webkit-scrollbar {
  display: none;
}
.wrap-fixed::-moz-scrollbar {
  display: none;
}
.mt-100 {
  margin-top: 100px;
}
.mt-0 {
  margin-top: 0px;
}
.pt-120 {
  padding-top: 120px;
}
.class230 {
  height: calc(100% - 180px);
  // padding-bottom: 100px;
}
.class110 {
  height: calc(100% - 60px);
}
.class120 {
  height: calc(100% - 70px);
}
.class100 {
  height: 103%;
}

.bottom-line {
  font-size: 24px;
  font-weight: 400;
  color: #cccccc;
  line-height: 33px;
  // margin:30px 0px 0px 0px;
  text-align: center;
  margin: 36px 0;
  width: 100%;
}
.display-none {
  display: none;
}
.no-data {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #ffffff;
  box-shadow: 0px 4px 20px 0px #f6f6f6;
  // border-top-left-radius: 18px;
  // border-top-right-radius: 18px;
  img {
    margin-top: 208px;
    width: 612px;
  }
  p {
    font-size: 28px;
    color: #666666;
    line-height: 26px;
    margin-top: 14px;
  }
  .btn {
    width: 306px;
    height: 72px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    border: 2px solid #2892ff;
    font-size: 28px;
    color: #2892ff;
    margin-top: 58px;
    margin-bottom: 98px;
  }
}
</style>