<template>
  <div class="imp-content">
    <div
      v-for="(item, indexM) in searchTableY"
      :key="indexM"
      ref="mContentRef"
      :class="'imp-content_' + item.categoryCode"
    >
      <!-- {{ item.wholeTemplateId }}{{ item.categoryCode }} -->
      <!-- 全部标签页-横向-服务 -->
      <XServiceList
        v-if="
          arrXList &&
          arrXList.length > 0 &&
          item.wholeTemplateId == CONSTANTS.TEMPLATEPAGE.SERV001
        "
        ref="EnterXListRef"
        :arrXList="arrXList"
        @handleXMore="handleXMore"
        :parentCategoryCode="item.categoryCode"
      ></XServiceList>
      <!-- 全部标签页-横向-惠民 -->
      <XRightsList
        v-else-if="
          arrXList &&
          arrXList.length > 0 &&
          item.wholeTemplateId == CONSTANTS.TEMPLATEPAGE.PRODMB0060
        "
        ref="XRightsRef"
        :arrXList="arrXList"
        @handleXMore="handleXMore"
        :parentCategoryCode="item.categoryCode"
      ></XRightsList>
      <!-- 全部标签页-子物品-活动 -->
      <XSubItem
        v-else-if="
          arrXList &&
          arrXList.length > 0 &&
          (item.wholeTemplateId == CONSTANTS.TEMPLATEPAGE.ACTI002 || item.wholeTemplateId == CONSTANTS.TEMPLATEPAGE.BIZ003)
        "
        ref="XSubItemRef"
        :arrXList="arrXList"
        @handleXMore="handleXMore"
        :parentCategoryCode="item.categoryCode"
        :wholeTemplateId="item.wholeTemplateId"
      ></XSubItem>
      <!-- 全部标签页-纵向 -->
      <div v-else>
        <div class="module-wrap">
          <!-- 标题 -->
          <div class="m-title">
            <div class="m-t-left" :maxScore="item.maxScore">
              {{ item.categoryName }}
            </div>
            <!-- <div
              class="m-t-right"
              @click="handleMore(item, indexM)"
              v-if="
                item.count > 4 &&
                (item.wholeTemplateId == CONSTANTS.TEMPLATEPAGE.ACTI002 ||
                  CONSTANTS.TEMPLATEPAGE.BIZ003 ||
                  CONSTANTS.TEMPLATEPAGE.PRODMB005)
              "
            >
              <span>更多<i class="s-iconfont ic-youjiantou"></i></span>
            </div> -->
            <div
              class="m-t-right"
              @click="handleMore(item, indexM)"
              v-if="item.count > 3"
            >
              <MoreText :count='item.count'></MoreText>
              <!-- <span>更多<i class="s-iconfont ic-youjiantou"></i></span> -->
            </div>
          </div>
          <!-- 内容区域 会员权益 -->
          <div
            v-if="
              item.data &&
              item.data.length > 0 &&
              item.wholeTemplateId == CONSTANTS.TEMPLATEPAGE.PRODMB005
            "
            class="m-content-three"
          >
            <div
              class="content-item-three content-item"
              v-for="(itemD, indexD) in getMap(
                item.data,
                item.wholeTemplateFieldList,
                $isDistinct
              )"
              :key="indexD"
              @click="handleClickTo(itemD, indexD)"
            >
              <div class="c-i-pic">
                <!-- <img v-bind:src="item.iconUrl" alt=""/> -->
                <van-image
                  :src="
                    itemD.iconUrl
                      ? itemD.iconUrl.replace(' ', '')
                      : itemD.wholeDefaultPic
                  "
                  draggable="false"
                  fit="contain"
                  :style="{ 'max-width': (offsetWidth * 100) / 750 + 'px' }"
                >
                  <template v-slot:loading>
                    <van-loading type="spinner" size="20" />
                    <!-- <img
                      :src="itemParent.defaultUrl"
                      draggable="false"
                      :style="{ 'max-width': (offsetWidth * 100) / 750 + 'px' }"
                      alt=""
                    /> -->
                  </template>
                  <template v-slot:error>
                    <img
                      :src="itemParent.defaultUrl"
                      draggable="false"
                      :style="{ 'max-width': (offsetWidth * 100) / 750 + 'px' }"
                      alt=""
                    />
                  </template>
                </van-image>
              </div>
              <div
                class="c-i-title"
                :data-value="itemD._id"
                v-html="itemD.titleHL ? itemD.titleHL : itemD.title"
              ></div>
              <div
                class="c-i-price"
                v-if="
                  itemD.currentPrice &&
                  Number(itemD.currentPrice || 0)
                    .toFixed(2)
                    .split('.')[0]
                    .toString().length <= 6
                "
              >
                {{
                  itemD.currentPricePrefix
                    ? itemD.currentPricePrefix || ""
                    : itemD.currentPriceUnit && itemD.currentPriceUnit == "元"
                    ? "¥"
                    : "¥"
                }}{{ Number(itemD.currentPrice || 0).toFixed(2) }}
                {{
                  itemD.currentPriceUnit !== "元" && itemD.currentPriceUnit
                    ? itemD.currentPriceUnit
                    : itemD.currentPricePrefix && itemD.currentPriceUnit == "元"
                    ? "元"
                    : ""
                }}
              </div>
            </div>
          </div>
          <!-- 普通内容区域 -->
          <div class="m-content" v-else>
            <ul>
              <li
                class="content-item"
                v-for="(itemD, indexD) in getMap(
                  item.data,
                  item.wholeTemplateFieldList,
                  $isDistinct
                )"
                :key="indexD"
                @click="handleClickTo(itemD, indexD)"
                imp-type="once"
                imp-track="imp"
                :imp-attrs="itemD.impAttrsList"
                :data-value="JSON.stringify(itemD.impAttrsList)"
              >
                <!-- 政企产品、解决方案无左侧图片 -->
                <template
                  v-if="
                    item.wholeTemplateId == CONSTANTS.TEMPLATEPAGE.SLSRC306 ||
                    item.wholeTemplateId == CONSTANTS.TEMPLATEPAGE.SLSRC307
                  "
                >
                  <!-- 占位dom 保证点击时获取dataset.value -->
                  <div></div>
                  <div
                    class="zq-wrap"
                    :data-value="itemD._id"
                    :data-code="item.wholeTemplateId"
                  >
                    <div
                      class="zq-title"
                      v-html="itemD.titleHL ? itemD.titleHL : itemD.title"
                    ></div>
                    <div
                      v-if="
                        isFieldToShow(
                          'subTitle',
                          item.wholeTemplateFieldList
                        ) &&
                        (itemD.subTitleHL || itemD.subTitle)
                      "
                      class="zq-subtitle"
                      v-html="
                        itemD.subTitleHL ? itemD.subTitleHL : itemD.subTitle
                      "
                    ></div>
                  </div>
                </template>
                <!-- 普通左图右文区域 -->
                <template v-else>
                  <!-- 左图区域 -->
                  <div class="c-i-left">
                    <van-image
                      :src="
                        itemD.iconUrl ? itemD.iconUrl : item.wholeDefaultPic
                      "
                      draggable="false"
                      lazy-load
                      :loading-icon="item.wholeDefaultPic"
                      class="van-img"
                      :class="generateTempIconClass(item.wholeTemplateId)?.img"
                    >
                      <template v-slot:loading>
                        <van-loading type="spinner" size="20" />
                        <!-- <img
                        :src="item.wholeDefaultPic"
                        :style="{
                          'max-width':
                            item.wholeTemplateId ==
                              CONSTANTS.TEMPLATEPAGE.PRODHW004 ||
                            item.wholeTemplateId ==
                              CONSTANTS.TEMPLATEPAGE.ACTI002 ||
                            item.wholeTemplateId ==
                              CONSTANTS.TEMPLATEPAGE.LIFEVD010
                              ? (offsetWidth * 150) / 750 + 'px'
                              : item.wholeTemplateId ==
                                CONSTANTS.TEMPLATEPAGE.BIZ003
                              ? (offsetWidth * 100) / 750 + 'px'
                              : (offsetWidth * 140) / 750 + 'px',
                          width: 'auto',
                          height: 'auto',
                        }"
                        draggable="false"
                        alt=""
                      /> -->
                      </template>
                      <!-- 修改左图右文左侧图片大小使用iphoneSe 设计稿尺寸/37.5px / 2 -->
                      <!-- src="../../../../public/images/2d8f810c7efa95tu.png" -->
                      <!-- :src="item.wholeDefaultPic" -->
                      <template v-slot:error>
                        <img
                          :src="item.wholeDefaultPic"
                          draggable="false"
                          class="default-img"
                          :class="
                            generateTempIconClass(item.wholeTemplateId)?.def
                          "
                          alt=""
                        />
                      </template>
                    </van-image>
                    <!-- <img :src="itemD.iconUrl?itemD.iconUrl:item.wholeDefaultPic" draggable="false" alt=""/> -->
                    <!-- {{ itemD.cornerMarkUrlArray }} -->
                    <img
                      class="l-tag"
                      :style="{
                        right:
                          item.wholeTemplateId == CONSTANTS.TEMPLATEPAGE.BIZ003
                            ? (offsetWidth * 10) / 750 + 'px'
                            : '-' + (offsetWidth * 10) / 750 + 'px',
                      }"
                      v-if="
                        isFieldToShow(
                          'cornerMark',
                          item.wholeTemplateFieldList
                        ) && itemD.cornerMarkUrl
                      "
                      :src="itemD.cornerMarkUrl"
                      draggable="false"
                      alt=""
                    />
                    <!-- 政企视频的左图上要加一个播放标识 -->
                    <!-- 此处的判断不严谨 应该是政企视频且左图正常展示需要播放标识 vantimage的error事件未获知 -->
                    <template
                      v-if="
                        item.wholeTemplateId ==
                          CONSTANTS.TEMPLATEPAGE.SLSRC310 && itemD.iconUrl
                      "
                    >
                      <img
                        src="@/assets/images/video-flag.png"
                        draggable="false"
                        class="zq-video"
                        alt=""
                      />
                    </template>
                    <!-- <img
                    class="l-tag"
                    v-for="(itemA, indexA) in itemD.cornerMarkUrlArray"
                    v-if="itemD.cornerMarkUrlArray"
                    :key="indexA + Math.random()"
                    :src="itemA"
                    draggable="false"
                    alt=""
                  />
                  <img
                    class="l-tag"
                    v-if="itemD.cornerMarkUrl"
                    :src="itemD.cornerMarkUrl"
                    draggable="false"
                    alt=""
                  /> -->
                  </div>
                  <!-- 右侧文区域 -->
                  <align-list
                    :itemData="itemD"
                    :itemParent="item"
                    :itemParentTemplateId="item.wholeTemplateId"
                    :itemParentTemplateFieldList="item.wholeTemplateFieldList"
                  ></align-list>
                </template>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <!-- 大家都在搜 -->
    <!-- <EverySearch v-if="matchActivePhone()" /> -->
    <EverySearch />
    <!-- <more-y-list v-show="moreShow" ref="moreYListRef"></more-y-list> -->
    <!-- 加载中 -->
    <Loadding ref="loading" />
    <!-- 视频播放 -->
    <VideoPlayer
      v-if="showVideo"
      ref="xVideoRef"
      :videoSrc="videoUrl"
      @closePlayer="hideVideo"
    />
  </div>
</template>

<script>
import {
  handleSaveClickInfo,
  goPageUrl,
  isApp,
  handleGdpImp,
  getMap,
  generateTempIconClass,
  isProtogenesisSkip,
  goProtogenesisPage,
} from "@/utils/tool";
import AlignList from "../TemplatePage/AlignList.vue";
import MoreYList from "../MoreList/MoreYList.vue";
import CONSTANTS from "@/utils/constants";
import Loadding from "../../Loadding.vue";
// import EnterXList from "../EnterList/EnterX.vue";
import XServiceList from "../EnterList/XService.vue"; // 全部页横向服务展示--从enterXlist复制
import XRightsList from "../EnterList/XRights.vue"; // 全部页横向惠民展示
import VideoPlayer from "../../VideoPlay.vue"; // 全部页横向惠民展示
import XSubItem from "../EnterList/XSubItem.vue"; //全部页-横向-子物品-活动展示
import EverySearch from "./EverySearch.vue"; // 全部页-大家都在搜
import MoreText from "./MoreText.vue"//更多文案的展示
// import { ActivePhoneList } from "../../default/HomeNewPhoneList.js"; // 全部页活动分类改版白名单

export default {
  components: {
    AlignList, // 内容模板组件
    MoreYList,
    Loadding,
    // EnterXList,
    XServiceList,
    XRightsList,
    VideoPlayer,
    XSubItem,
    EverySearch,
    MoreText
  },
  inject: [
    "getSearchContent",
    "getSearchTable",
    "updateActiveTab",
    "updateCategoryCodeMore",
    "updateCategoryCodeParentMore",
    "updateTemplateIdMore",
    "getSearchUUID",
  ],
  computed: {
    searchContent() {
      return this.getSearchContent();
    },
    searchTableparent() {
      return this.getSearchTable();
    },
  },
  watch: {
    /**
     * 埋点-插码-上报
     * 曝光事件采集
     * 搜索结果页_全部
     */
    searchTableY: {
      handler(newVal) {
        if (newVal && newVal.length) {
          this.$nextTick(() => {
            const elements = document.querySelectorAll(".content-item");
            // const impContent = document.querySelectorAll('.imp-content');
            // 遍历所有元素
            // this.$refs.mContentRef.forEach((refItem,refIndex)=>{debugger
            // const elements = refItem.children[0].children[0].children[1].children[0].childNodes;
            elements.forEach((elementE, indexE) => {
              elementE.setAttribute("imp-position-id", indexE + 1);
              // 判断当前元素是否是需要的元素
              const obj = elementE.dataset.value;
              const posId = elementE.getAttribute("imp-position-id");
              let objList = JSON.parse(obj);
              // objList.position_id = posId;
              objList.XY_point_position = posId;
              // const attr = elementE.getAttribute("imp-attrs");
              // if(sessionStorage.initGetLocationFlag && sessionStorage.initGetLocationFlag !== '1'){
              // if(!isApp()){
              //   console.log(JSON.stringify(objList),'-------------搜索结果页_全部-entery-曝光事件传参----------------');
              // }
              objList.XY_transaction_id = this.getSearchUUID();
              handleGdpImp(
                elementE,
                objList,
                "enterY",
                objList.WT_markId,
                "搜索结果页_全部"
              );
              // }
              // if(isApp()){
              //   handleGdpImp(objList);
              // }
            });
            // })
          });
        }
      },
      deep: true,
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
      loadedTemplates: {}, // 用于跟踪已加载的条件
      showVideo: false, // 视频播放组件
      videoUrl: "", // 视频地址
      getMap: getMap,
      generateTempIconClass: generateTempIconClass,
    };
  },
  props: {
    // searchTable:{
    //   type:Array,
    //   default: () => {
    //     return []
    //   }
    // }
  },
  methods: {
    // 活动分类改版-白名单匹配
    // matchActivePhone() {
    //   const userInfo = localStorage.getItem("userInfo")
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
    /**
     * wholeTemplateFieldList/verticalTemplateFieldList --字段是否展示
     * @param {*} field
     */
    isFieldToShow(field, itemParentTemplateFieldList) {
      if (itemParentTemplateFieldList) {
        return itemParentTemplateFieldList.includes(field);
      }
    },
    // 服务的更多
    handleXMore(item) {
      this.searchTableparent.forEach((ddd, index) => {
        if (item.parentCode) {
          if (ddd.categoryCode == item.parentCode) {
            this.updateActiveTab(index);
          }
          this.updateCategoryCodeParentMore(item.parentCode);
        } else if (ddd.categoryCode == item.categoryCode) {
          this.updateActiveTab(index);
        }
      });
      this.updateCategoryCodeMore(item.categoryCode);
      this.updateTemplateIdMore(item.verticalTemplateId);
    },

    // 惠民的更多
    // handleRightsMore(){

    // }

    // 普通展示的更多
    handleMore(item, posIndex) {
      this.heightFlag = true;
      this.searchTableparent.forEach((ddd, index) => {
        if (item.parentCode) {
          if (ddd.categoryCode == item.parentCode) {
            this.updateActiveTab(index);
          }
        } else if (ddd.categoryCode == item.categoryCode) {
          this.updateActiveTab(index);
        }
      });
      this.updateCategoryCodeMore(item.categoryCode);
      this.updateCategoryCodeParentMore(item.parentCode);
      this.updateTemplateIdMore(item.verticalTemplateId);

      // 更多点击插码上报
      console.log("全部页--更多插码上报===>");
      const clickGdpObj = {
        XY_transaction_id: this.getSearchUUID(),
        WT_et: "clk",
        WT_envName: "更多",
        WT_event: item.pCode,
        WT_markId: item._id,
        XY_point_position: posIndex,
        XY_first_class: "搜索结果页_全部",
        XY_second_class: item.dispCategoryName,
        WT_next_url: item.linkAdress,
        WT_plat: sessionStorage.pagePlat || "",
        WT_es: sessionStorage.pageUrl || "",
        WT_ti: "搜索结果页",
        XY_pageEntry: sessionStorage.pageEntrance || "",
        // 插码方案修改2025-1-16
        WT_area_type_1: "楼层",
        areaid: "", // 父物品id信息（无父物品传空）
        WT_area_type_2: "全部",
        WT_area_name: item.dispCategoryName, // 若没有二级分类，此名称则记录为一级分类名称
        XY_env_type: "icon",
        WT_event: "P00000050508", // 全部页传P00000050508
        XY_gd_source: "搜索平台",
        XY_scene: this.getSearchContent() || "", // 搜索内容
        WT_si_n: "更多", // 物品对应的名称
        WT_goods_id: item.itemId, // 物品所对应的id信息
        XY_visit_source: sessionStorage.pageEntrance || "", // 访问来源
      };
      console.log("点击enterY全部页-更多-上报===>");
      console.log(clickGdpObj);

      if (isApp()) {
        gdp("track", "clk", clickGdpObj);
      }
    },

    hideVideo() {
      this.videoUrl = "";
      this.showVideo = false;
    },

    async handleClickTo(item, index) {
      this.$refs.loading.loadingShow();
      /**
       * 埋点-插码-上报
       * 点击事件采集
       * 搜索结果页_全部
       */
      let posIndex = 0;
      const elements = document.querySelectorAll(".content-item");
      // 遍历所有元素
      elements.forEach((elementE, indexE) => {
        // 判断当前元素是否是需要的元素
        const value = elementE.children[1].dataset.value;
        if (value == item._id) {
          console.log(`第${indexE + 1}个元素`);
          posIndex = indexE + 1;
        }
      });
      console.log(
        JSON.stringify(item),
        "-------------enterY-点击商品-点击事件传参----------------"
      );
      console.log("-----enterY-商品position-----" + posIndex);

      const clickGdpObj = {
        XY_transaction_id: this.getSearchUUID(),
        WT_et: "clk",
        WT_envName: item.title,
        WT_event: item.pCode,
        WT_markId: item._id,
        XY_point_position: posIndex,
        XY_first_class: "搜索结果页_全部",
        XY_second_class: item.dispCategoryName,
        WT_next_url: item.linkAdress,
        WT_plat: sessionStorage.pagePlat || "",
        WT_es: sessionStorage.pageUrl || "",
        WT_ti: "搜索结果页",
        XY_pageEntry: sessionStorage.pageEntrance || "",
        // 插码方案修改2025-1-16
        WT_area_type_1: "楼层",
        areaid: "", // 父物品id信息（无父物品传空）
        WT_area_type_2: "全部",
        WT_area_name: item.dispCategoryName, // 若没有二级分类，此名称则记录为一级分类名称
        XY_env_type: "icon",
        WT_event: "P00000050508", // 全部页传P00000050508
        XY_gd_source: "搜索平台",
        XY_scene: this.getSearchContent() || "", // 搜索内容
        WT_si_n: item.title, // 物品对应的名称
        WT_goods_id: item.itemId, // 物品所对应的id信息
        XY_visit_source: sessionStorage.pageEntrance || "", // 访问来源
      };
      console.log("点击enterY全部页-数据上报===>");
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

          // console.log(item);
          // 政企视频当前页打开播放弹窗 originalJumpType  jumpType
          if (item.jumpType === "40") {
            this.videoUrl = item.linkAdress;
            this.showVideo = true;
          } else {
            if (isProtogenesisSkip(item)) {
              goProtogenesisPage(item.linkAdress1);
            } else {
              goPageUrl(item.jumpType, item.linkAdress);
            }
          }
        }
      });
    },
  },
  mounted() {
    this.offsetWidth = document.body.offsetWidth;
  },
};
</script>

<style scoped lang='scss'>
@import "../index.scss";

.van-img {
  text-align: center;
  ::v-deep .van-image__img {
    width: auto;
    height: auto;
    vertical-align: middle;
  }
  ::v-deep .van-image__error {
    background-color: initial !important;
  }
}

.img-1 {
  ::v-deep .van-image__img {
    max-width: 2rem;
    max-height: 2rem;
  }
}
.img-2 {
  ::v-deep .van-image__img {
    max-width: 1.333rem;
    max-height: 1.333rem;
  }
}
.img-3 {
  ::v-deep .van-image__img {
    max-width: 1.8666rem;
    max-height: 1.8666rem;
  }
}
.img-4 {
  ::v-deep .van-image__img {
    max-width: 2rem;
    max-height: 1.333rem;
  }
}
.img-5 {
  ::v-deep .van-image__img {
    max-width: 1.8666rem;
    max-height: 2.7143rem;
  }
}
.img-6 {
  ::v-deep .van-image__img {
    max-width: 2rem;
    max-height: 1.12rem;
  }
  ::v-deep .van-image__error {
    max-width: 2rem;
    max-height: 1.12rem;
  }
}
.img-7 {
  ::v-deep .van-image__img {
    max-width: 8.4rem;
    max-height: 4.72rem;
  }
  ::v-deep .van-image__error {
    max-width: 8.4rem;
    max-height: 4.72rem;
  }
}
::v-deep .van-image__error {
  position: relative;
  background-color: initial !important;
}
$theme-color: #2892ff;
.module-wrap {
  background: #ffffff;
  box-shadow: 0px 4px 20px 0px #f6f6f6;
  border-radius: 18px;
  padding: 32px 24px 12px 29px;
  margin-bottom: 18px;

  .m-title {
    display: flex;
    justify-content: space-between;
    font-size: 24px;
    color: #999;
    margin-bottom: 24px;
    i {
      padding-left: 6px;
      font-size: 24px;
    }
    .m-t-left {
      font-size: 32px;
      color: #000000;
      font-weight: 700;
      font-family: PingFangSC-Medium, sans-serif;
    }
  }
  .m-content-three {
    display: flex;
    flex-wrap: wrap;
    // justify-content: space-between;
    padding: 50px 0px 0px 0px;
    // background:#fff;
    border-radius: 18px;
    background: #fff;
    .content-item-three {
      width: 33%;
      display: flex;
      flex-direction: column;
      text-align: center;
      margin-bottom: 50px;
      background: #fff;
      .van-image {
        // border-radius: 12px;
        // overflow: hidden;
      }
      .c-i-pic {
        width: 100%;
        margin-bottom: 33px;
        height: 110px;
        display: flex;
        justify-content: center;
        align-items: center;
        img {
          max-width: 100px;
          height: 100px;
          border-radius: 10px;
        }
      }
      .c-i-title {
        width: 100%;
        font-size: 28px;
        color: #333333;
        margin-bottom: 10px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .c-i-price {
        font-size: 24px;
        color: #f3513b;
      }
    }
  }
  .content-item-three::before {
    content: none !important;
  }
  .m-content {
    .content-item {
      display: flex;
      align-items: center;
      // border-bottom: 2px solid #f1f1f1;
      padding: 30px 0px;
      position: relative;
      margin: 2px 0px;

      &:first-child {
        margin-top: 0px;
        margin-bottom: 0px;
      }

      &:last-child::after {
        content: none;
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
        .vedio-img {
          ::v-deep .van-image__img {
            max-width: 2rem;
            max-height: 2rem;
          }
        }

        // ::v-deep .van-image__img{
        //   min-width:100px;
        // }
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

    .content-item::after {
      content: " ";
      height: v-bind(borderHeight);
      width: 100%;
      position: absolute;
      bottom: 0;
      left: 0;
      background-color: #e5e5e5;
    }

    @media (-webkit-min-device-pixel-ratio: 1.5) and (-webkit-max-device-pixel-ratio: 2.49) {
      .content-item::after {
        // height: 1.3px;
        -webkit-transform: scaleY(0.5);
        transform: scaleY(0.5);
      }
    }

    @media (-webkit-min-device-pixel-ratio: 2.5) {
      .content-item::after {
        // height: 1.3px;
        -webkit-transform: scaleY(0.33);
        transform: scaleY(0.33);
      }
    }
  }
}
.enter-cnt {
  // display: grid;
  height: 100%;
}

// 政企
.zq-wrap {
  .zq-title {
    font-size: 28px;
    color: #333333;
    margin-bottom: 12px;
    font-weight: 700;
    font-family: PingFangSC-Medium, sans-serif;

    ::v-deep span {
      color: #2892ff !important;
    }
  }
  .zq-subtitle {
    font-size: 24px;
    color: #999999;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    text-overflow: ellipsis;

    ::v-deep span {
      color: #2892ff !important;
    }
  }
}
</style>
