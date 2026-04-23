<template>
  <div>
    <!-- <div class="m-title">
      <div class="m-t-left">服务</div>
      <div class="m-t-right">
        <span>更多<i class="s-iconfont ic-youjiantou"></i></span>
      </div>
    </div> -->
    <div class="m-content">
      <div
        class="content-item"
        v-for="(item, index) in moreArrDataList"
        :key="index"
        @click="handleClickTo(item, index)"
      >
        <div class="c-i-pic">
          <!-- <img v-bind:src="item.iconUrl" alt=""/> -->
          <van-image
            :src="
              item.iconUrl
                ? item.iconUrl.replace(' ', '')
                : itemParent.defaultUrl
            "
            draggable="false"
            :style="{ 'max-width': (offsetWidth * 100) / 750 + 'px' }"
          >
            <template v-slot:loading>
              <van-loading type="spinner" size="20" />
              <!-- <img :src="itemParent.defaultUrl" draggable="false" :style="{'max-width':((offsetWidth * 100) / 750) + 'px'}" alt=""/> -->
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
          :data-value="item._id"
          v-html="item.titleHL ? item.titleHL : item.title"
        ></div>
        <div class="c-i-price" v-if="item.currentPrice">
          {{
            item.currentPricePrefix
              ? item.currentPricePrefix || ""
              : item.currentPriceUnit && item.currentPriceUnit == "元"
              ? "¥"
              : "¥"
          }}{{ Number(item.currentPrice || 0).toFixed(2)
          }}{{
            item.currentPriceUnit !== "元" && item.currentPriceUnit
              ? item.currentPriceUnit
              : item.currentPricePrefix && item.currentPriceUnit == "元"
              ? "元"
              : ""
          }}
        </div>
      </div>
    </div>
    <!-- 加载中 -->
    <Loadding ref="loading" />
  </div>
</template>

<script>
import {
  handleSaveClickInfo,
  goPageUrl,
  isApp,
  isProtogenesisSkip,
  goProtogenesisPage,
} from "@/utils/tool";
import Loadding from "../../Loadding.vue";

export default {
  components: {
    Loadding,
  },
  props: {
    moreArrDataList: {
      type: Array,
    },
    itemParent: {
      type: Array,
    },
  },
  inject: ["getSearchContent", "getSearchUUID"],
  computed: {
    searchContent() {
      return this.getSearchContent();
    },
  },
  mounted() {
    this.offsetWidth = document.body.offsetWidth;
  },
  data() {
    return {
      offsetWidth: null,
    };
  },
  methods: {
    async handleClickTo(item, index) {
      this.$refs.loading.loadingShow();
      console.log(
        JSON.stringify(item),
        "-------------iconthree-点击商品-点击事件传参----------------"
      );
      console.log("-----iconthree-商品position-----" + (index + 1));
      /**
       * 埋点-插码-上报
       * 点击事件采集
       * 搜索结果页_tab标签下物品名称
       */
      const clickGdpObj = {
        XY_transaction_id: this.getSearchUUID(),
        WT_et: "clk",
        WT_envName: item.title,
        WT_event: item.pCode,
        WT_markId: item._id,
        XY_point_position: index + 1,
        XY_first_class:
          sessionStorage.pageEntrance == "6"
            ? "权益"
            : sessionStorage.pageEntrance == "8"
            ? "商城"
            : item.parentCategoryName,
        // XY_second_class:
        //   item.parentCategoryName == item.disCategoryName
        //     ? " "
        //     : item.disCategoryName,
        WT_next_url: item.linkAdress,
        WT_plat: sessionStorage.pagePlat || "",
        WT_es: sessionStorage.pageUrl || "",
        WT_ti: "搜索结果页",
        XY_pageEntry: sessionStorage.pageEntrance || "",
        // 插码方案修改2025-1-16
        XY_second_class:
          item.parentCategoryName == item.disCategoryName
            ? " "
            : item.disCategoryName,
        WT_area_type_1: "楼层",
        areaid: "", // 父物品id信息（无父物品传空）
        WT_area_type_2: item.dispCategoryName,
        WT_area_name: item.dispCategoryName, // 若没有二级分类，此名称则记录为一级分类名称
        XY_env_type: "icon",
        WT_event: "P00000050506", // 全部页传P00000050508 垂直页传P00000050506
        XY_gd_source: "搜索平台",
        XY_scene: this.getSearchContent() || "", // 搜索内容
        WT_si_n: item.title, // 物品对应的名称
        WT_goods_id: item.itemId, // 物品所对应的id信息
        XY_visit_source: sessionStorage.pageEntrance || "", // 访问来源
      };
      console.log("点击iconthree数据上报===>");
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
.module-wrap {
  background: #ffffff;
  box-shadow: 0px 4px 20px 0px #f6f6f6;
  border-radius: 18px;
  padding: 75px 24px 0px 29px;
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
    }
  }
  .m-content {
    display: flex;
    flex-wrap: wrap;
    // justify-content: space-between;
    padding: 50px 0px 0px 0px;
    background: #fff;
    border-radius: 18px;
    .content-item {
      width: 33%;
      display: flex;
      flex-direction: column;
      text-align: center;
      margin-bottom: 50px;
      .van-image {
        // border-radius: 12px;
        // overflow: hidden;
      }
      ::v-deep .van-image__img {
        max-width: 100px;
      }
      ::v-deep __error {
        position: relative;
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
        ::v-deep span {
          color: #2892ff !important;
        }
      }
      .c-i-price {
        font-size: 24px;
        color: #f3513b;
      }
    }
  }
}
</style>
