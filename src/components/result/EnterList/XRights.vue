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
              <!-- 商超购物 -->
              <div class="content-title">
                <div
                  class="title-left"
                  v-html="itemD.titleHL ? itemD.titleHL : itemD.title"
                ></div>
                <!-- 这里不需要右侧箭头图标吧 -->
                <div class="title-right">
                  <span><i class="s-iconfont ic-youjiantou"></i></span>
                </div>
              </div>
              <!-- 商超会员线下买单每单打折，30+商超品牌，最低折扣低至8.9折，线上商品优惠购物快递到家 -->
              <div
                v-if="
                  isFieldToShow('subTitle', item.wholeTemplateFieldList) &&
                  (itemD.subTitleHL || itemD.subTitle)
                "
                class="content-introduce"
                v-html="itemD.subTitleHL ? itemD.subTitleHL : itemD.subTitle"
              ></div>
              <!-- 底部可左右滑动逛超市 -->
              <div
                v-if="itemD.fwList && itemD.fwList.length > 0"
                class="content-rights"
              >
                <!-- <template v-for="(rightItem, rightIndex) in itemD.fwList"></template> -->
                <!-- <template v-for="(rightItem, rightIndex) in mockRightsList"></template> -->
                <template v-for="(rightItem, rightIndex) in itemD.fwList">
                  <div
                    :key="rightIndex"
                    class="rights-item"
                    @click="directGoPage(rightItem, rightIndex, itemD)"
                    @click.stop
                  >
                    <div class="c-i-pic">
                      <!-- <img
                      :src="
                        itemD.iconUrl ? itemD.iconUrl : item.wholeDefaultPic
                      "
                      draggable="false"
                      alt=""
                    /> -->
                      <van-image
                        :src="
                          rightItem.iconUrl
                            ? rightItem.iconUrl
                            : item.wholeDefaultPic
                        "
                        draggable="false"
                      >
                        <template v-slot:loading>
                          <van-loading type="spinner" size="20" />
                          <!-- <img
                          :src="item.wholeDefaultPic"
                          draggable="false"
                          :style="{
                            'max-width': (offsetWidth * 48) / 750 + 'px',
                          }"
                          alt=""
                        /> -->
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
                    <div
                      class="rights-title"
                      :data-value="rightItem._id"
                      v-html="
                        rightItem.titleHL ? rightItem.titleHL : rightItem.title
                      "
                    ></div>
                    <!-- <div
                    class="c-i-title"
                    :data-value="itemD._id"
                    v-html="
                      itemD.subTitleHL ? itemD.subTitleHL : itemD.subTitle
                    "
                  ></div> -->
                  </div>
                </template>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </template>
    <!-- 加载中 -->
    <Loadding ref="loading" />
  </div>
</template>

<script>
import {
  handleSaveClickInfo,
  goPageUrl,
  isApp,
  getMap,
  isProtogenesisSkip,
  goProtogenesisPage,
} from "@/utils/tool";
import Loadding from "../../Loadding.vue";
import MoreText from "./MoreText.vue"//更多文案的展示

export default {
  components: {
    Loadding,
    MoreText
  },
  props: {
    arrXList: {
      type: Array,
    },
    parentCategoryCode: {
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
          // 匹配处理服务类数据的曝光上报
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
            serverArr = channelItem.fwList;
            if (serverArr && serverArr.length) {
              serverArr.map((serverItem, serverIndex) => {
                const impGdpObj = {
                  XY_transaction_id: this.getSearchUUID(),
                  WT_et: "imp",
                  WT_envName: serverItem.title,
                  WT_event: serverItem.pCode,
                  WT_markId: serverItem._id,
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
                  areaid: "", // 父物品id信息（无父物品传空）
                  WT_area_type_2: "全部",
                  WT_area_name: `${categoryNameStr}_${channelItem.title}`, // 若没有二级分类，此名称则记录为一级分类名称
                  XY_env_type: "icon",
                  WT_event: "P00000050508", // 全部页传P00000050508 垂直页传P00000050506
                  XY_gd_source: "搜索平台",
                  XY_scene: this.getSearchContent() || "", // 搜索内容
                  WT_si_n: serverItem.title, // 物品对应的名称
                  WT_goods_id: serverItem.itemId, // 物品所对应的id信息
                  XY_visit_source: sessionStorage.pageEntrance || "", // 访问来源
                };
                console.log("XRight全部页-权益超市-服务类数据曝光上报===>");
                console.log(impGdpObj);
                if (isApp()) {
                  gdp("track", "imp", impGdpObj);
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

    handleMore(item) {
      this.$emit("handleXMore", item);
      // this.$parent.searchTable.forEach((ddd, index) => {
      //   if (item.parentCode) {
      //     if (ddd.categoryCode == item.parentCode) {
      //       this.$parent.activeTab = index + 1;
      //     }
      //   } else if (ddd.categoryCode == item.categoryCode) {
      //     this.$parent.activeTab = index + 1;
      //   }
      // });
      // this.moreShow = true;
      // this.$parent.$refs.EnterYListRef[0].enterYShow = false;
      // this.$parent.allBtShow = false;
      // this.$refs.moreXListRef.moreArrDataList = [];
      // this.$refs.moreXListRef.handleQueryResult(item.categoryCode,item.templateId);
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
        "-------------全部页XRights-点击二级商品-点击事件传参----------------"
      );
      console.log("-----全部页XRights-二级商品position-----" + posIndex);
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
      console.log("点击XRight全部页-权益超市-频道-数据上报===>");
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

    // 插码最新方案已更新(2025/1/16 插码新方案需求即由此需求衍生出)-直接跳转
    async directGoPage(item, index, itemParentObj) {
      this.$refs.loading.loadingShow();
      console.log(
        JSON.stringify(item),
        "-------------XRights-点击三级服务商品-点击事件传参----------------"
      );
      console.log("-----XRights-三级服务商品position-----" + index);
      const clickGdpObj = {
        XY_transaction_id: this.getSearchUUID(),
        WT_et: "clk",
        WT_envName: item.title,
        WT_event: item.pCode,
        WT_markId: item._id,
        XY_point_position: index + 1,
        XY_first_class: "搜索结果页_全部",
        XY_second_class: "惠民",
        WT_next_url: item.linkAdress,
        WT_plat: sessionStorage.pagePlat || "",
        WT_es: sessionStorage.pageUrl || "",
        WT_ti: "搜索结果页",
        XY_pageEntry: sessionStorage.pageEntrance || "",
        // 插码方案修改2025-1-16
        WT_area_type_1: "楼层",
        areaid: "", // 父物品id信息（无父物品传空）
        WT_area_type_2: "全部",
        WT_area_name: `${itemParentObj.dispCategoryName}_${itemParentObj.title}`, // 若没有二级分类，此名称则记录为一级分类名称
        XY_env_type: "icon",
        WT_event: "P00000050508", // 全部页传P00000050508 垂直页传P00000050506
        XY_gd_source: "搜索平台",
        XY_scene: this.getSearchContent() || "", // 搜索内容
        WT_si_n: item.title, // 物品对应的名称
        WT_goods_id: item.itemId, // 物品所对应的id信息
        XY_visit_source: sessionStorage.pageEntrance || "", // 访问来源
      };
      console.log("点击XRight全部页-权益超市-服务-数据上报===>");
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

<style scoped lang='scss'>
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

      .content-title {
        display: flex;
        justify-content: space-between;
        font-size: 24px;
        color: #999;
        padding: 0px 24px 0px 29px;
        margin-bottom: 12px;

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

          ::v-deep span {
            color: #2892ff !important;
          }
        }
      }

      .content-introduce {
        font-size: 24px;
        color: #999999;
        line-height: 32px;
        padding: 0px 24px 0px 29px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        text-overflow: ellipsis;

        ::v-deep span {
          color: #2892ff !important;
        }
      }

      .content-rights {
        margin-top: 24px;
        display: -webkit-box;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;

        // 图片要展示圆角
        // 源图设置圆角50% 不用管
        // 源图无圆角 此处代码有效果
        .van-image {
          border-radius: 12px;
          overflow: hidden;
          img {
            border-radius: 12px;
          }
        }

        ::v-deep .van-image__img {
          max-width: 60px;
        }
        .rights-item {
          width: 22.3%;
          .c-i-pic {
            width: 100%;
            min-height: 60px;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            justify-content: center;

            img {
              width: 60px;
              height: 60px;
            }
          }
          .rights-title {
            width: 100%;
            font-size: 24px;
            font-weight: 400;
            padding: 0px 24px 0px 29px;
            color: #333333;
            line-height: 32px;
            text-align: center;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;

            ::v-deep span {
              color: #2892ff !important;
            }
          }
        }
      }
      .content-rights::-webkit-scrollbar {
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
  