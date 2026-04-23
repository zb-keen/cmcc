<template>
  <div class="search-zone-wrap">
    <template v-for="item in searchZoneList">
      <div
        :data-value="nowCategoryCode"
        :data-code="nowTemplateId"
        :key="item.categoryCode"
        v-if="
          searchZoneList &&
          item.searchZoneData &&
          item.searchZoneData.length > 0 &&
          nowCategoryCode == item.categoryCode
        "
      >
        <div
          :class="
            item.searchZoneData.length == 1 &&
            item.searchZoneData[0].pCode == 'P00000057388' &&
            nowTemplateId !== CONSTANTS.TEMPLATEPAGE.BIZ003
              ? 'module-wrap'
              : item.searchZoneData.length == 1 &&
                item.searchZoneData[0].pCode == 'P00000057388' &&
                nowTemplateId == CONSTANTS.TEMPLATEPAGE.BIZ003
              ? 'module-wrap-biz module-wrap'
              : 'module-wrap module-wrap-padding'
          "
        >
          <!-- 一个专区数据 -->
          <div
            class="m-content"
            v-if="
              item.searchZoneData.length == 1 &&
              item.searchZoneData[0].pCode == 'P00000057388'
            "
          >
            <ul>
              <li
                class="content-item-zone"
                @click="handleClickTo(item.categoryName, itemD, indexD)"
                v-for="(itemD, indexD) in item.searchZoneData"
                :key="itemD._id"
                :imp-position-id="indexD + 1"
                imp-type="once"
                imp-track="imp"
                :imp-attrs="itemD.impAttrsList"
                :data-value="JSON.stringify(itemD.impAttrsList)"
              >
                <div
                  :class="
                    nowTemplateId == CONSTANTS.TEMPLATEPAGE.BIZ003
                      ? 'c-i-left-w180 c-i-left'
                      : 'c-i-left-w180 c-i-left'
                  "
                >
                  <van-image
                    :src="itemD.iconUrl ? itemD.iconUrl : itemD.defaultUrl"
                    draggable="false"
                    :style="{
                      'max-width':
                        nowTemplateId == CONSTANTS.TEMPLATEPAGE.BIZ003
                          ? (offsetWidth * 140) / 750 + 'px'
                          : (offsetWidth * 140) / 750 + 'px',
                    }"
                  >
                    <template v-slot:loading>
                      <van-loading type="spinner" size="20" />
                      <!-- <img :src="itemD.defaultUrl" :style="{'max-width': ((offsetWidth * 140) / 750) + 'px'}" alt=""/> -->
                    </template>
                    <template v-slot:error>
                      <img
                        :src="itemD.defaultUrl"
                        :style="{
                          'max-width':
                            nowTemplateId == CONSTANTS.TEMPLATEPAGE.BIZ003
                              ? (offsetWidth * 140) / 750 + 'px'
                              : (offsetWidth * 140) / 750 + 'px',
                        }"
                        alt=""
                    /></template>
                  </van-image>
                </div>
                <div class="c-i-right">
                  <div class="r-title">
                    <div
                      v-html="itemD.titleHL ? itemD.titleHL : itemD.title"
                    ></div>
                  </div>
                  <div
                    class="r-intro"
                    v-html="
                      itemD.subTitleHL ? itemD.subTitleHL : itemD.subTitle
                    "
                  ></div>
                </div>
              </li>
            </ul>
          </div>
          <!-- 多个专区轮播 -->
          <div class="m-content" v-else>
            <div
              class="m-c-top"
              v-html="
                item.searchZoneData[currentIndex].titleHL
                  ? item.searchZoneData[currentIndex].titleHL
                  : item.searchZoneData[currentIndex].title
              "
            ></div>
            <van-swipe
              :autoplay="3000"
              :class="
                item.subTitleFlag
                  ? 'height208'
                  : !item.subTitleFlag &&
                    item.searchZoneData &&
                    item.searchZoneData.length == 1
                  ? 'height225'
                  : item.eightFlag &&
                    item.searchZoneData &&
                    item.searchZoneData.length - 1 == 1
                  ? 'height225'
                  : 'height245'
              "
              :active.sync="currentIndex"
              @change="handleSwiperChange"
            >
              <template v-for="(itemD, indexD) in item.searchZoneData">
                <van-swipe-item
                  :key="itemD._id"
                  :class="
                    item.subTitleFlag
                      ? 'height208'
                      : !item.subTitleFlag &&
                        item.searchZoneData &&
                        item.searchZoneData.length == 1
                      ? 'height225'
                      : item.eightFlag &&
                        item.searchZoneData &&
                        item.searchZoneData.length - 1 == 1
                      ? 'height225'
                      : 'height245'
                  "
                  class="m-swiper-zone"
                  @click="handleClickTo(item.categoryName, itemD, indexD)"
                  :imp-position-id="indexD + 1"
                  imp-type="once"
                  imp-track="imp"
                  :imp-attrs="itemD.impAttrsList"
                  :data-value="JSON.stringify(itemD.impAttrsList)"
                  v-if="itemD.pCode != 'P00000057388'"
                >
                  <!-- <div class="m-c-top">{{ itemD.title }}</div> -->
                  <van-image
                    :src="itemD.iconUrl ? itemD.iconUrl : itemD.defaultUrl"
                    draggable="false"
                  >
                    <template v-slot:loading>
                      <van-loading type="spinner" size="20" />
                      <!-- <img :src="itemD.defaultUrl" alt=""/> -->
                    </template>
                    <template v-slot:error>
                      <img :src="itemD.defaultUrl" alt="" />
                    </template>
                  </van-image>
                  <div
                    class="m-c-bottom"
                    v-html="
                      itemD.subTitleHL ? itemD.subTitleHL : itemD.subTitle
                    "
                  ></div>
                </van-swipe-item>
              </template>
            </van-swipe>
          </div>
        </div>
      </div>
    </template>
    <!-- 加载中 -->
    <Loadding ref="loading" />
  </div>
</template>

<script>
import CommonApi from "@/api/index";
import {
  handleSaveClickInfo,
  handleGetUrlParam,
  goPageUrl,
  isApp,
  handleGdpImp,
  getRecordingOrScreenshotStatus,
  isProtogenesisSkip,
  goProtogenesisPage,
} from "@/utils/tool";
import Loadding from "../../Loadding.vue";

export default {
  components: {
    Loadding,
  },
  props: {
    activeTab: {
      type: Number,
    },
    nowCategoryCode: {
      type: String,
    },
    nowTemplateId: {
      type: String,
    },
  },
  data() {
    return {
      borderHeight: "1px",
      loading: false,
      finished: false,
      arrList: [],
      arrXList: [],
      searchTableY: [],
      currentCode: "",
      offsetWidth: null,
      current: 0,
      currentIndex: 0,
      currentCategoryCode: "",
    };
  },
  inject: [
    "getSearchTabsList",
    "getActiveTab",
    "updateSearchZoneHasData",
    "getSearchUUID",
    "getSearchContent",
  ],
  computed: {
    searchZoneList() {
      this.getSearchTabsList().forEach((item, index) => {
        if (item.subList && item.subList.length > 0) {
          item.subList &&
            item.subList.forEach((itemData, indexData) => {
              item.searchZoneData = itemData.searchZoneData;
            });
        }
      });
      console.log(this.getSearchTabsList(), "专区数据轮播数据-----");
      // console.log(this.getSearchTabsList(),'专区数据-----')
      return this.getSearchTabsList();
    },
    nowActiveTab() {
      return this.getActiveTab();
    },
  },
  watch: {
    nowCategoryCode: {
      handler(newVal, oldVal) {
        this.currentCategoryCode = newVal;
        this.$nextTick(() => {
          /**
           * 埋点-插码-上报
           * 曝光事件采集
           * 搜索结果页_搜索专区
           */
          let elements = [];
          if (document.querySelectorAll(".content-item-zone").length > 0) {
            elements = document.querySelectorAll(".content-item-zone");
          } else {
            elements = document.querySelectorAll(".m-swiper-zone");
          }
          if (elements && elements.length > 0) {
            this.updateSearchZoneHasData(true);
          }
          // const impContent = document.querySelectorAll('#imp-more-content_'+parentCodeIn);
          elements.forEach((elementE, indexE) => {
            const obj = JSON.parse(elementE.dataset.value);
            this.searchZoneList.forEach((elementF, indexF) => {
              elementF.searchZoneData &&
                elementF.searchZoneData.forEach((elementData, elementindex) => {
                  // 判断当前元素是否是需要的元素
                  if (obj.WT_markId == elementData._id) {
                    // console.log(JSON.stringify(elementE.impAttrsList),'-------------moreY-商品-曝光事件传参----------------');
                    // if(isApp()){
                    elementData.impAttrsList.XY_transaction_id =
                      this.getSearchUUID();
                    // console.log("当前tab内容====>");
                    // console.log(this.nowActiveTab);
                    // console.log(obj);
                    // 插码方案修改2025-1-16
                    // 补充专区数据缺少曝光数据信息
                    // elementData.impAttrsList.WT_area_type_1 = "楼层";
                    // elementData.impAttrsList.areaid = "";
                    // elementData.impAttrsList.WT_area_type_2 = obj.categoryName;
                    // elementData.impAttrsList.WT_area_name = obj.categoryName;
                    // elementData.impAttrsList.XY_env_type = "icon";
                    // elementData.impAttrsList.XY_gd_source = "搜索平台";
                    // elementData.impAttrsList.XY_scene =
                    //   this.getSearchContent() || ""; // 搜索内容
                    // elementData.impAttrsList.WT_area_type_1 = "楼层";
                    // elementData.impAttrsList.WT_si_n = obj.title; // 物品对应的名称
                    // elementData.impAttrsList.WT_goods_id = obj.itemId; // 物品所对应的id信息
                    // elementData.impAttrsList.XY_visit_source =
                    //   sessionStorage.pageEntrance || ""; // 访问来源
                    // console.log("补充后的专区曝光上报====>");
                    // console.log(elementData.impAttrsList);
                    handleGdpImp(
                      elementE,
                      elementData.impAttrsList,
                      "searchZone",
                      elementData.impAttrsList.WT_markId,
                      "搜索结果页_搜索专区"
                    );
                    // }
                  }
                });
            });
          });
        });
      },
      immediate: true,
    },
  },
  mounted() {
    this.offsetWidth = document.body.offsetWidth;
  },
  methods: {
    handleSwiperChange(index) {
      this.currentIndex = index;
    },
    handleScreen(val) {
      const zoneData = this.searchZoneList.find(
        (ite) => this.nowCategoryCode === ite.categoryCode
      );
      if (zoneData && zoneData.searchZoneData) {
        getRecordingOrScreenshotStatus(zoneData.searchZoneData);
      }
    },
    async handleClickTo(categoryName, item, index) {
      this.$refs.loading.loadingShow();
      console.log(
        JSON.stringify(item.impAttrsList),
        "-------------searchZone-点击商品-点击事件传参----------------"
      );
      console.log("-----searchZone-商品position-----" + (index + 1));

      /**
       * 埋点-插码-上报
       * 点击事件采集
       * 搜索结果页_搜索专区
       */

      const clickGdpObj = {
        XY_transaction_id: this.getSearchUUID(),
        WT_et: "clk",
        WT_envName: item.title,
        WT_event: item.pCode,
        WT_markId: item._id,
        // "XY_point_position":index+1,
        XY_first_class:
          sessionStorage.pageEntrance == "6"
            ? "权益"
            : sessionStorage.pageEntrance == "8"
            ? "商城"
            : categoryName,
        // "XY_second_class":item.parentCategoryName == item.disCategoryName?" ":item.disCategoryName,
        WT_next_url: item.linkAdress,
        WT_plat: sessionStorage.pagePlat || "",
        WT_es: sessionStorage.pageUrl || "",
        WT_ti: "搜索结果页",
        XY_pageEntry: sessionStorage.pageEntrance || "",
        // 插码方案修改2025-1-16
        WT_area_type_1: "楼层",
        areaid: "", // 父物品id信息（无父物品传空）
        WT_area_type_2: categoryName,
        WT_area_name: categoryName, // 若没有二级分类，此名称则记录为一级分类名称
        XY_env_type: "icon",
        XY_gd_source: "搜索平台",
        XY_scene: this.getSearchContent() || "", // 搜索内容
        WT_si_n: item.title, // 物品对应的名称
        WT_goods_id: item.itemId, // 物品所对应的id信息
        XY_visit_source: sessionStorage.pageEntrance || "", // 访问来源
      };
      console.log("点击全部页的专区数据上报===>");
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
::v-deep .van-image {
  width: 99%;
  border-radius: 18px;
}
::v-deep .van-image__error {
  position: relative;
  background-color: initial !important;
}
$theme-color: #2892ff;
::v-deep .van-swipe__indicator {
  width: 28px;
  height: 6px;
  background: #e5eefe;
  border-radius: 4px;
}
::v-deep .van-swipe__indicator:not(:last-child) {
  margin-right: 0px !important;
}
::v-deep .van-swipe__indicator--active {
  width: 14px;
  background: $theme-color;
}
::v-deep .van-swipe__indicators {
  bottom: 0px;
}
::v-deep .van-swipe {
  // padding:30px 0px 21px 0px;
  // height: 470px;
}
::v-deep .van-swipe-item {
  // height: 470px;
  // background: #F8F8F8;
  border-radius: 18px;
  img {
    height: 320px;
    display: block;
    box-sizing: border-box;
    // width: 100%;
    border-radius: 18px;
    margin: auto;
    width: auto;
  }
}

::v-deep .van-image__error {
  position: relative;
  background-color: initial !important;
}
.module-wrap-padding {
  padding: 32px 30px 29px 30px !important;
}
.module-wrap-biz {
  padding: 31px 24px 29px 29px;
}
.module-wrap {
  background: #ffffff;
  box-shadow: 0px 4px 20px 0px #f6f6f6;
  border-radius: 18px;
  // padding:31px 37px 29px 52px;
  padding: 31px 24px 29px 29px;
  margin-bottom: 18px;
  .m-content {
    .content-item-zone {
      display: flex;
      align-items: center;
      // border-bottom: 2px solid #f1f1f1;
      padding: 0px 0px;
      position: relative;
      &:last-child::after {
        content: none;
      }
      .c-i-left-w180 {
        width: 180px;
      }
      .c-i-left-w140 {
        width: 140px;
      }
      .c-i-left {
        margin-right: 20px;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;

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
          // height:140px;
        }
        img {
          width: 140px;
          // height:140px;
          border-radius: 10px;
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

    .content-item-zone::after {
      content: " ";
      height: v-bind(borderHeight);
      width: 100%;
      position: absolute;
      bottom: 0;
      left: 0;
      background-color: #e5e5e5;
    }

    @media (-webkit-min-device-pixel-ratio: 1.5) and (-webkit-max-device-pixel-ratio: 2.49) {
      .content-item-zone::after {
        -webkit-transform: scaleY(0.5);
        transform: scaleY(0.5);
      }
    }

    @media (-webkit-min-device-pixel-ratio: 2.5) {
      .content-item-zone::after {
        -webkit-transform: scaleY(0.33);
        transform: scaleY(0.33);
      }
    }
    .c-i-right {
      flex: 1;
      overflow: hidden;
      // div{
      //   margin-bottom: 12px;
      // }
      .r-title {
        font-size: 28px;
        max-height: 76px;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-bottom: 12px;
        // display: flex;
        // align-items: flex-start;
        position: relative;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 700;
        color: #333333;
        line-height: 38px;
        .title-front-tag {
          position: absolute;
          left: 0px;
          width: 94px;
          // height:28px;
          top: 4px;
        }
        .title-front-tag-text {
          transform: scale(1);
          // position: absolute;
          // left:0px;
          // width: 110px;
          // height:32px;
          // top: 4px;
          font-size: 16px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #ffffff !important;
          line-height: 28px;
          border-radius: 6px;
          height: 30px;
          text-align: center;
          padding: 0px 10px;
          margin-right: 8px;
          position: relative;
          top: -6px;
          display: inline-block;
          // display: flex;
          // justify-content: center;
          // align-items: center;
        }
        .text-indent-100 {
          text-indent: 120px;
        }
        .text-indent-160 {
          text-indent: 160px;
        }
        img {
          width: 94px;
          vertical-align: text-bottom;
        }
        ::v-deep span {
          color: #2892ff !important;
        }
      }
      .r-intro {
        font-size: 24px;
        color: #999;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        line-height: 32px;
        ::v-deep span {
          color: #2892ff !important;
        }
      }
    }
    .m-c-top {
      font-size: 32px;
      font-family: PingFangSC;
      font-weight: 700;
      color: #000000;
      line-height: 34px;
      margin-bottom: 30px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      ::v-deep span {
        color: #2892ff !important;
      }
    }
    .m-c-bottom {
      font-size: 24px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #999999;
      // line-height: 600px;
      overflow: hidden;
      text-overflow: ellipsis;
      position: relative;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      margin-top: 18px;
      margin-bottom: 21px;
      ::v-deep span {
        color: #2892ff !important;
      }
    }
  }
}
.height208 {
  height: 354px;
}
.height225 {
  height: 388px;
}
.height245 {
  height: 428px;
}
</style>