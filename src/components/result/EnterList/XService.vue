<template>
  <div class="imp-content">
    <template v-for="(item, index) in arrXList">
      <div
        class="module-wrap"
        :key="index"
        v-if="parentCategoryCode == item.categoryCode"
      >
        <div class="m-title">
          <div class="m-t-left" :maxScore="item.maxScore">
            {{ item.categoryName }}
          </div>
          <div
            class="m-t-right"
            @click="handleMore(item)"
            v-if="item.count > 4"
          >
            <MoreText :count='item.count'></MoreText>
            <!-- <span>更多<i class="s-iconfont ic-youjiantou"></i></span> -->
          </div>
        </div>
        <div class="m-content">
          <div
            class="content-item"
            v-for="(itemD, indexD) in getMap(item.data, undefined, $isDistinct)"
            :key="indexD"
            @click="handleClickTo(itemD, indexD)"
            imp-type="once"
            imp-track="imp"
            :imp-attrs="itemD.impAttrsList"
            :data-value="JSON.stringify(itemD.impAttrsList)"
          >
            <div class="c-i-pic">
              <!-- <img :src="itemD.iconUrl?itemD.iconUrl:item.wholeDefaultPic" draggable="false" alt=""/> -->
              <van-image
                :src="itemD.iconUrl ? itemD.iconUrl : item.wholeDefaultPic"
                draggable="false"
                class="img-10"
              >
                <template v-slot:loading>
                  <van-loading type="spinner" size="20" />
                  <!-- <img :src="item.wholeDefaultPic" draggable="false" :style="{'max-width':((offsetWidth * 48) / 750) + 'px'}" alt=""/> -->
                </template>
                <template v-slot:error
                  ><img :src="item.wholeDefaultPic" draggable="false" alt=""
                /></template>
              </van-image>
            </div>
            <div
              class="c-i-title"
              :data-value="itemD._id"
              v-html="itemD.titleHL ? itemD.titleHL : itemD.title"
            ></div>
            <!-- <div class="c-i-title" :data-value="itemD._id" v-html="itemD.subTitleHL?itemD.subTitleHL:itemD.subTitle"></div> -->
          </div>
        </div>
      </div>
      <!-- <more-x-list v-if="moreXShow" ref="moreXListRef"></more-x-list> -->
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
// import MoreXList from "../MoreList/MoreXList.vue";
import Loadding from "../../Loadding.vue";
import MoreText from "./MoreText.vue"//更多文案的展示

export default {
  components: {
    // MoreXList,
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
  watch: {},
  data() {
    return {
      // moreShow: false,
      // enterXShow: true,
      // arrXList: [],
      offsetWidth: null,
      getMap: getMap,
    };
  },
  mounted() {
    this.offsetWidth = document.body.offsetWidth;
  },
  methods: {
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
        "-------------enterX-点击商品-点击事件传参----------------"
      );
      console.log("-----enterX-商品position-----" + posIndex);

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
        WT_area_name: "服务", // 若没有二级分类，此名称则记录为一级分类名称
        XY_env_type: "icon",
        WT_event: "P00000050508", // 全部页传P00000050508 垂直页传P00000050506
        XY_gd_source: "搜索平台",
        XY_scene: this.getSearchContent() || "", // 搜索内容
        WT_si_n: item.title, // 物品对应的名称
        WT_goods_id: item.itemId, // 物品所对应的id信息
        XY_visit_source: sessionStorage.pageEntrance || "", // 访问来源
      };
      console.log("点击Xservice全部页-服务-数据上报===>");
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
::v-deep .van-image__error {
  position: relative;
  background-color: initial !important;
}

.module-wrap {
  background: #ffffff;
  box-shadow: 0px 4px 20px 0px #f6f6f6;
  border-radius: 18px;
  padding: 32px 24px 0px 29px;
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
  .m-content {
    display: flex;
    flex-wrap: wrap;
    // justify-content: space-between;
    .content-item {
      width: 25%;
      display: flex;
      flex-direction: column;
      text-align: center;
      margin-bottom: 20px;
      .van-image {
        // border-radius: 12px;
        // overflow: hidden;
        img {
          // border-radius: 12px;
        }
      }
      ::v-deep .van-image__img {
        max-width: 48px;
      }
      .c-i-pic {
        width: 100%;
        min-height: 48px;
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        img {
          width: 48px;
          height: 48px;
        }
      }
      .c-i-title {
        width: 100%;
        font-size: 24px;
        height: 31px;
        line-height: 31px;
        color: #333333;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        font-weight: bold;
        ::v-deep span {
          color: #2892ff !important;
        }
      }
    }
  }
  .img-10 {
    ::v-deep .van-image__img {
      max-width: 48px;
      max-height: 48px;
    }
    ::v-deep .van-image__error {
      max-width: 48px;
      max-height: 48px;
    }
  }
}
</style>
  