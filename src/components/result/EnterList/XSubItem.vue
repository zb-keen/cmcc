<template>
  <div>
    <template v-for="(item, index) in arrXList">
      <div
        :key="index"
        class="module-wrap"
        v-if="parentCategoryCode == item.categoryCode"
      >
        <div class="m-title">
          <div class="m-t-left" :maxScore="item.maxScore">
            {{ item.categoryName }}
          </div>
          <div
            class="m-t-right"
            @click="handleMore(item)"
            v-if="item.count > 3"
          >
            <MoreText :count='item.count'></MoreText>
            <!-- <span>更多<i class="s-iconfont ic-youjiantou"></i></span> -->
          </div>
        </div>
        <div class="m-content" @touchmove.stop>
          <ul class="m-content-ul">
            <li
              class="content-item"
              v-for="(itemD, indexD) in getMap(
                item.data,
                undefined,
                $isDistinct
              )"
              :key="indexD"
              @click="handleClickTo(itemD, indexD)"
              imp-type="once"
              imp-track="imp"
              :imp-attrs="itemD.impAttrsList"
              :data-value="JSON.stringify(itemD.impAttrsList)"
            >
              <div class="content-top">
                <div class="content-top-left">
                  <div class="c-i-pic">
                    <van-image
                      :src="
                        itemD.iconUrl ? itemD.iconUrl : item.wholeDefaultPic
                      "
                      draggable="false"
                      fit="contain"
                    >
                      <template v-slot:loading>
                        <van-loading type="spinner" size="20" />
                      </template>
                      <template v-slot:error>
                        <img
                          :src="item.wholeDefaultPic"
                          draggable="false"
                          alt=""
                        />
                      </template>
                    </van-image>
                  </div>
                </div>

                <div
                  class="content-top-right"
                  :class="{
                    noSubTitle: !(
                      isFieldToShow('subTitle', item.wholeTemplateFieldList) &&
                      (itemD.subTitleHL || itemD.subTitle)
                    ),
                    subTitle:
                      isFieldToShow('subTitle', item.wholeTemplateFieldList) &&
                      (itemD.subTitleHL || itemD.subTitle),
                  }"
                >
                  <!-- 标题 -->
                  <div class="content-title">
                    <div
                      class="title-left"
                      v-html="itemD.titleHL ? itemD.titleHL : itemD.title"
                    ></div>
                    <!-- 这里不需要右侧箭头图标吧 -->
                    <div
                      class="title-right"
                      v-if="itemD.sub_products && itemD.sub_products.length > 2"
                    >
                      <span><i class="s-iconfont ic-youjiantou"></i></span>
                    </div>
                  </div>
                  <!-- 子标题 -->
                  <div
                    v-if="
                      isFieldToShow('subTitle', item.wholeTemplateFieldList) &&
                      (itemD.subTitleHL || itemD.subTitle)
                    "
                    class="content-introduce"
                    v-html="
                      itemD.subTitleHL ? itemD.subTitleHL : itemD.subTitle
                    "
                  ></div>
                </div>
              </div>
              <div
                class="content-bottom"
                :data-value="itemD._id"
                v-if="itemD.sub_products && itemD.sub_products.length > 2"
              >
                <template v-for="(rightItem, rightIndex) in itemD.sub_products">
                  <div
                    :key="rightIndex"
                    class="rights-item"
                    @click="directGoPage(rightItem, rightIndex, itemD)"
                    @click.stop
                  >
                    <div class="c-i-pic">
                      <van-image
                        :src="
                          rightItem.iconUrl
                            ? getPreviewUrl(rightItem.iconUrl)
                            : item.wholeDefaultPic
                        "
                        draggable="false"
                      >
                        <template v-slot:loading>
                          <van-loading type="spinner" size="20" />
                        </template>
                        <template v-slot:error>
                          <img
                            :src="item.wholeDefaultPic"
                            draggable="false"
                            alt=""
                          />
                        </template>
                      </van-image>
                    </div>
                    <div class="rights-title" :data-value="rightItem._id">
                      <div
                        v-html="
                          rightItem.titleHL
                            ? rightItem.titleHL
                            : rightItem.title
                        "
                      ></div>
                    </div>
                    <!-- 现价 -->
                    <div
                      class="rights-price"
                      :data-value="rightItem._id"
                      v-if="isCurrentPriceShow(rightItem)"
                    >
                      <span class="price-unit">¥</span>
                      <span>{{ Number(rightItem.currentPrice || 0) === 0 ? 0 : Number(rightItem.currentPrice || 0).toFixed(1) }}</span>
                    </div>
                    <!-- 原价 -->
                    <div
                      class="rights-price rights-original-price"
                      :data-value="rightItem._id"
                      v-if="isoriginalPriceShow(rightItem)"
                    >
                      <span class="price-unit">¥</span>
                      <span>{{ Number(rightItem.originalPrice || 0) === 0 ? 0 : Number(rightItem.originalPrice || 0).toFixed(1) }}</span>
                    </div>
                    <!-- 积分 -->
                    <div
                      class="rights-price"
                      :data-value="rightItem._id"
                      v-if="rightItem.priceType === '2'"
                    >
                      <span>{{ rightItem.pointsNumber }}</span
                      ><span class="point-suffix">积分</span>
                    </div>
                    <!-- 自定义文字 -->
                    <div
                      class="rights-price"
                      :data-value="rightItem._id"
                      v-if="rightItem.priceType === '5'"
                    >
                      <span>{{ rightItem.customContent }}</span>
                    </div>
                  </div>
                </template>
              </div>
              <div v-else :data-value="itemD._id"></div>
            </li>
          </ul>
        </div>
        <!-- 活动推荐 添加属性传值全部页展示数据 与活动推荐获取的垂直页数据去重使用 -->
        <ActivityRecommend
          v-if="wholeTemplateId == CONSTANTS.TEMPLATEPAGE.ACTI002"
          :enterData="getMap(item.data, undefined, $isDistinct)"
        />
      </div>
    </template>
    <!-- 加载中 -->
    <Loadding ref="loading" />
  </div>
</template>

<script>
import { getGateWayToken } from "@/server/gateway";
import {
  handleSaveClickInfo,
  goPageUrl,
  isApp,
  getMap,
  isProtogenesisSkip,
  goProtogenesisPage,
} from "@/utils/tool";
import Loadding from "../../Loadding.vue";
import ActivityRecommend from "./ActivityRecommend.vue";
import MoreText from "./MoreText.vue"//更多文案的展示

export default {
  components: {
    Loadding,
    ActivityRecommend,
    MoreText
  },
  props: {
    arrXList: {
      type: Array,
    },
    parentCategoryCode: {
      type: String,
    },
    wholeTemplateId: {
      type: String,
    },
  },
  inject: ["getSearchContent", "getSearchUUID"],
  computed: {
    searchContent() {
      return this.getSearchContent();
    },
  },
  watch: {
    /**
     * 埋点-插码-上报
     * 曝光事件采集
     * 搜索结果页_全部
     */
    arrXList: {
      handler(newVal) {
        if (this.parentCategoryCode && newVal && newVal.length) {
          // 匹配处理子物品数据的曝光上报
          let categoryNameStr = "";
          let channelArr = null;
          let serverArr = null;
          newVal.map((item) => {
            if (item.categoryCode === this.parentCategoryCode) {
              categoryNameStr = item.categoryName;
              channelArr = item.data;
            }
          });
          channelArr.map((channelItem) => {
            serverArr = channelItem.sub_products;
            if (serverArr && serverArr.length) {
              serverArr.map((serverItem, serverIndex) => {
                // 此处上报牵涉到一个 一个子物品可以挂在多个主物品下场景  子物品为库里真实存在物料数据
                // 重复物料应上报一次
                // 添加上报记录标识--参照江苏权益处理逻辑（JiangSuRights.vue） 使用物料itemId做会话标识 上报一次存值1
                // 一次搜索操作下 上报一次即可     下一次搜索时清除会话itemId标识

                // 活动子物品 来源是两个  一个是我们自己定义的   一个是es里真实物料数据
                // 自定义的子物品  无itemId标识  不遵循上面逻辑
                if (serverItem.itemId) {
                  // es库中真实物料数据
                  const sessionkey = serverItem.itemId;
                  // 业务新增子物品，缓存key值区分
                  let type = this.wholeTemplateId == this.CONSTANTS.TEMPLATEPAGE.ACTI002 ? "hdzwp" : "ywzwp";
                  let temp = sessionStorage.getItem("observertimes" + type);
                  let observertimes = temp ? JSON.parse(temp) : {};
                  let times = observertimes[sessionkey];

                  if (times !== "1") {
                    // 元素进入可视区域
                    observertimes[sessionkey] = "1";
                    sessionStorage.setItem(
                      "observertimes" + type,
                      JSON.stringify(observertimes)
                    );

                    const impGdpObj = {
                      XY_transaction_id: this.getSearchUUID(),
                      WT_et: "imp",
                      WT_envName: serverItem.title,
                      WT_markId: "",
                      XY_point_position: serverIndex + 1,
                      XY_first_class: "搜索结果页_全部",
                      XY_second_class: channelItem.title,
                      WT_next_url: serverItem.linkAdress,
                      WT_plat: sessionStorage.pagePlat || "",
                      WT_es: sessionStorage.pageUrl || "",
                      WT_ti: "搜索结果页",
                      XY_pageEntry: sessionStorage.pageEntrance || "",
                      // 插码方案修改2025-1-16
                      WT_area_type_1: "楼层",
                      areaid: channelItem.itemId, // 父物品id信息（无父物品传空）
                      WT_area_type_2: "全部",
                      WT_area_name: `${categoryNameStr}_${channelItem.title}`, // 若没有二级分类，此名称则记录为一级分类名称
                      XY_env_type: "button",
                      WT_event: "P00000050508", // 全部页传P00000050508 垂直页传P00000050506
                      XY_gd_source: "搜索平台",
                      XY_scene: this.getSearchContent() || "", // 搜索内容
                      WT_si_n: serverItem.title, // 物品对应的名称
                      WT_goods_id: serverItem.itemId, // 物品所对应的id信息
                      XY_visit_source: sessionStorage.pageEntrance || "", // 访问来源
                      WT_charge_phone: "",
                      WT_errCode: "",
                      WT_errMsg: "",
                      XY_env_extend_attribute: "",
                    };
                    console.log(
                      "XSubItem全部页-活动-es真实物料子物品数据曝光上报===>"
                    );
                    console.log(impGdpObj);
                    if (isApp()) {
                      gdp("track", "imp", impGdpObj);
                    }
                  }
                } else {
                  // 自定义子物品信息
                  const impGdpObj = {
                    XY_transaction_id: this.getSearchUUID(),
                    WT_et: "imp",
                    WT_envName: serverItem.title,
                    WT_markId: "",
                    XY_point_position: serverIndex + 1,
                    XY_first_class: "搜索结果页_全部",
                    XY_second_class: channelItem.title,
                    WT_next_url: serverItem.linkAdress,
                    WT_plat: sessionStorage.pagePlat || "",
                    WT_es: sessionStorage.pageUrl || "",
                    WT_ti: "搜索结果页",
                    XY_pageEntry: sessionStorage.pageEntrance || "",
                    // 插码方案修改2025-1-16
                    WT_area_type_1: "楼层",
                    areaid: channelItem.itemId, // 父物品id信息（无父物品传空）
                    WT_area_type_2: "全部",
                    WT_area_name: `${categoryNameStr}_${channelItem.title}`, // 若没有二级分类，此名称则记录为一级分类名称
                    XY_env_type: "button",
                    WT_event: "P00000050508", // 全部页传P00000050508 垂直页传P00000050506
                    XY_gd_source: "搜索平台",
                    XY_scene: this.getSearchContent() || "", // 搜索内容
                    WT_si_n: serverItem.title, // 物品对应的名称
                    WT_goods_id: serverItem.itemId, // 物品所对应的id信息
                    XY_visit_source: sessionStorage.pageEntrance || "", // 访问来源
                    WT_charge_phone: "",
                    WT_errCode: "",
                    WT_errMsg: "",
                    XY_env_extend_attribute: "",
                  };
                  console.log(
                    "XSubItem全部页-活动-自定义子物品数据曝光上报===>"
                  );
                  console.log(impGdpObj);
                  if (isApp()) {
                    gdp("track", "imp", impGdpObj);
                  }
                }
              });
            }
          });
        }
      },
      immediate: true,
    },
  },
  data() {
    return {
      borderHeight: "1px",
      offsetWidth: null,
      getMap: getMap,
    };
  },
  mounted() {
    this.offsetWidth = document.body.offsetWidth;
  },
  methods: {
    /**
     * wholeTemplateFieldList/verticalTemplateFieldList --字段是否展示
     * @param {*} field
     */
    isFieldToShow(field, itemParentTemplateFieldList) {
      if (itemParentTemplateFieldList) {
        return itemParentTemplateFieldList.includes(field);
      }
    },
    getPreviewUrl(iconUrl) {
      if (iconUrl.startsWith("path=")) {
        let token = "";
        // const reg = new RegExp("(^|)" + "ordertoken" + "=([^;]*)(;|$)");
        // const arr = document.cookie.match(reg);
        // token = unescape(arr[2]).split("&")[0];

        // return `${process.env.VUE_APP_API_URL}/psiesearchsdkserver/api/oss/downloadfile?${iconUrl}&token=${token}`;
        return `${process.env.VUE_APP_API_URL}/psiesearchsdkserver/api/oss/downloadfile?${iconUrl}`;
      } else {
        return iconUrl;
      }
    },
    handleMore(item) {
      this.$emit("handleXMore", item);
    },
    isCurrentPriceShow(item) {
      if (item.priceType !== "1") {
        return false;
      }

      // 无原价 现价为0展示
      if (item.currentPrice == "0" && item.isOriginalPrice) {
        return true;
      }

      if (
        item.currentPrice == "0" &&
        item.originalPrice != "0" &&
        item.currentPrice < item.originalPrice
      ) {
        return true;
      }

      if (!item.currentPrice) {
        return false;
      }

      if (
        item.currentPrice &&
        item.originalPrice &&
        item.currentPrice === item.originalPrice
      ) {
        return false;
      }

      if (
        item.currentPrice &&
        item.originalPrice &&
        !item.isOriginalPrice &&
        item.currentPrice > item.originalPrice
      ) {
        return false;
      }

      return true;
    },
    isoriginalPriceShow(item) {
      if (item.priceType !== "1") {
        return false;
      }

      if (item.isOriginalPrice) {
        return false;
      }

      if (
        item.originalPrice == "0" &&
        item.currentPrice != "0" &&
        item.currentPrice < item.originalPrice
      ) {
        return true;
      }

      if (!item.originalPrice) {
        return false;
      }

      if (
        item.currentPrice &&
        item.originalPrice &&
        item.currentPrice === item.originalPrice
      ) {
        return false;
      }

      if (
        item.currentPrice &&
        item.originalPrice &&
        !item.isOriginalPrice &&
        item.currentPrice > item.originalPrice
      ) {
        return false;
      }

      return true;
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
        "-------------全部页XSubItem-点击二级商品-点击事件传参----------------"
      );
      console.log("-----全部页XSubItem-二级商品position-----" + posIndex);
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
        WT_event: "P00000050508", // 全部页传P00000050508 垂直页传P00000050506
        XY_gd_source: "搜索平台",
        XY_scene: this.getSearchContent() || "", // 搜索内容
        WT_si_n: item.title, // 物品对应的名称
        WT_goods_id: item.itemId, // 物品所对应的id信息
        XY_visit_source: sessionStorage.pageEntrance || "", // 访问来源
      };
      console.log("点击XSubItem全部页-活动-父物品-数据上报===>");
      console.log(clickGdpObj);
      if (isApp()) {
        gdp("track", "clk", clickGdpObj);
      }

      await handleSaveClickInfo(item, this.searchContent).then((resolve) => {
        this.$refs.loading.loadingHide();
        if (resolve == "0") {
          if (isProtogenesisSkip(item)) {
            goProtogenesisPage(item.linkAdress1);
          } else {
            goPageUrl(item.jumpType, item.linkAdress);
          }
        }
      });
    },

    // 插码最新方案已更新(2025/1/16 插码新方案需求即由此需求衍生出)-直接跳转
    async directGoPage(item, index, itemParentObj) {
      this.$refs.loading.loadingShow();
      console.log(
        JSON.stringify(item),
        "-------------XSubItem-点击三级子物品-点击事件传参----------------"
      );
      console.log("-----XSubItem-三级子物品position-----" + index);
      const clickGdpObj = {
        XY_transaction_id: this.getSearchUUID(),
        WT_et: "clk",
        WT_envName: item.title,
        WT_markId: "",
        XY_point_position: index + 1,
        XY_first_class: "搜索结果页_全部",
        XY_second_class: "活动",
        WT_next_url: item.linkAdress,
        WT_plat: sessionStorage.pagePlat || "",
        WT_es: sessionStorage.pageUrl || "",
        WT_ti: "搜索结果页",
        XY_pageEntry: sessionStorage.pageEntrance || "",
        // 插码方案修改2025-1-16
        WT_area_type_1: "楼层",
        areaid: itemParentObj.itemId, // 父物品id信息（无父物品传空）
        WT_area_type_2: "全部",
        WT_area_name: `${itemParentObj.dispCategoryName}_${itemParentObj.title}`, // 若没有二级分类，此名称则记录为一级分类名称
        XY_env_type: "button",
        WT_event: "P00000050508", // 全部页传P00000050508 垂直页传P00000050506
        XY_gd_source: "搜索平台",
        XY_scene: this.getSearchContent() || "", // 搜索内容
        WT_si_n: item.title, // 物品对应的名称
        WT_goods_id: item.itemId, // 物品所对应的id信息
        XY_visit_source: sessionStorage.pageEntrance || "", // 访问来源
        WT_charge_phone: "",
        WT_errCode: "",
        WT_errMsg: "",
        XY_env_extend_attribute: "",
      };
      console.log("点击XSubItem全部页-活动-子物品-数据上报===>");
      console.log(clickGdpObj);
      if (isApp()) {
        gdp("track", "clk", clickGdpObj);
      }

      await handleSaveClickInfo(item, this.searchContent).then((resolve) => {
        this.$refs.loading.loadingHide();
        if (resolve == "0") {
          console.log(item);
          if (isProtogenesisSkip(item)) {
            goProtogenesisPage(item.linkAdress1);
          } else {
            goPageUrl("2", item.linkAdress);
          }
        }
      });
    },
  },
};
</script>

<style scoped lang="scss">
::v-deep .van-image__error {
  position: relative;
  background-color: initial !important;
}

.module-wrap {
  background: #ffffff;
  box-shadow: 0px 4px 20px 0px #f6f6f6;
  border-radius: 18px;
  // padding: 32px 24px 0px 29px;
  padding: 32px 0px 0px 0px;
  margin-bottom: 18px;

  // 标题惠民
  .m-title {
    display: flex;
    justify-content: space-between;
    font-size: 24px;
    padding: 0px 24px 0px 29px;
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

  .m-content {
    .m-content-ul {
      padding-bottom: 6px;
    }

    .content-item {
      position: relative;
      display: flex;
      flex-direction: column;
      padding: 30px 24px 30px 29px;
      margin: 2px 0px;

      &:first-child {
        margin-top: 0px;
        margin-bottom: 0px;
      }

      &:last-child::after {
        content: none;
      }

      .content-top {
        display: flex;

        .content-top-left {
          width: 180px;
          height: 100px;
          margin-right: 20px;

          .c-i-pic {
            width: 180px;
            min-height: 100px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 12px;
            overflow: hidden;

            ::v-deep .van-image {
              border-radius: 12px;
              overflow: hidden;

              img {
                max-width: 2rem;
                max-height: 1.333rem;
              }
            }
          }
        }

        .content-top-right {
          .content-title {
            display: flex;
            justify-content: space-between;
            justify-items: center;
            font-size: 24px;
            color: #999;
            // padding: 0px 24px 0px 29px;
            // margin-bottom: 12px;

            i {
              padding-left: 6px;
              font-size: 24px;
            }

            .title-left {
              font-size: 28px;
              color: #333333;
              font-weight: 700;
              font-family: PingFangSC-Medium, sans-serif;
              line-height: 38px;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 1;
              overflow: hidden;
              text-overflow: ellipsis;

              ::v-deep span {
                color: #2892ff !important;
              }
            }
            .title-right{
              line-height: 38px;
            }
          }

          .content-introduce {
            font-size: 24px;
            color: #999999;
            line-height: 32px;
            padding: 0px 24px 0px 0px;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            overflow: hidden;
            text-overflow: ellipsis;

            ::v-deep span {
              color: #2892ff !important;
            }
          }
        }

        .noSubTitle {
          flex: 1;
          margin: auto;
        }

        .subTitle {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
      }

      .content-bottom {
        margin-top: 24px;
        margin-left: 200px;
        display: -webkit-box;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;

        // 图片要展示圆角
        // 源图设置圆角50% 不用管
        // 源图无圆角 此处代码有效果
        .van-image {
          border-radius: 12px;
          width: 90px;
          max-height: 90px;

          img {
            border-radius: 12px;
          }
        }

        ::v-deep .van-image__img {
          max-width: 90px;
        }

        .rights-item {
          // width: 100px;
          margin-right: 23px;

          .c-i-pic {
            width: 100px;
            min-height: 90px;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 12px;
            overflow: hidden;

            .van-image {
              width: 90px;
              max-height: 90px;
            }
            img {
              width: 90px;
              max-height: 90px;
            }
          }

          .rights-title {
            width: 108px;
            font-size: 24px;
            font-weight: 400;
            color: #333333;
            line-height: 32px;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
            text-overflow: ellipsis;
            word-break: break-all;
            word-wrap: break-word;

            ::v-deep span {
              color: #2892ff !important;
            }
          }

          .rights-price {
            width: 108px;
            margin-top: 6px;
            font-weight: 400;
            font-size: 22px;
            color: #f3513b;
            line-height: 32px;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            font-weight: 600;
            word-break: break-word;
          }

          .rights-original-price {
            width: 108px;
            margin-top: 0px;
            color: #999999;
            text-decoration-line: line-through;
            font-weight: normal;

            .price-unit {
              font-weight: normal;
              font-size: 18px;
            }
          }

          .price-unit {
            font-weight: 600;
            font-size: 18px;
          }

          .point-suffix {
            font-weight: 400;
          }

          .one-line {
            text-align: center;
          }
        }
      }

      .content-bottom::-webkit-scrollbar {
        display: none;
      }
    }

    .content-item::after {
      content: " ";
      height: v-bind(borderHeight);
      position: absolute;
      bottom: 0;
      left: 29px;
      right: 24px;
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
</style>
