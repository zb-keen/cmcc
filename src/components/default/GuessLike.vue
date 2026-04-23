<template>
  <div class="guess-like" v-if="likeData.length || bannerData.length">
    <div class="head-con">
      <div class="left-con">移动优选</div>
      <div class="right-con" @click="changeShowStatus()">
        <template v-if="!isHidden">
          <span class="icon s-iconfont ic-icon-show"></span>
        </template>
        <template v-else>
          <p>已隐藏</p>
          <span class="icon s-iconfont ic-icon-hidden"></span>
        </template>
      </div>
    </div>
    <div class="main-con" :class="isHidden ? 'height-0' : ''">
      <div
        class="clounm"
        v-if="likeData.length"
        ref="GuessLike"
        imp-position-id="guess-like"
        imp-type="once"
        imp-track="imp"
        :imp-attrs="impAttrsLike"
      >
        <div
          class="item"
          v-for="(likeItem, likeIndex) in likeData"
          :key="likeItem.markId"
          @click="jumpPage(likeItem, false, likeIndex)"
        >
          <img :src="likeItem.imageUrl" draggable="false" alt="" />
          <p>{{ likeItem.markName }}</p>
        </div>
      </div>
      <!-- 猜你喜欢通栏 -->
      <div
        class="ad-space0"
        v-if="bannerData.length"
        ref="GuessLikeBanner"
        imp-position-id="guess-like-banner"
        imp-type="once"
        imp-track="imp"
        :imp-attrs="impAttrsBanner"
      >
        <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
          <van-swipe-item
            v-for="(bannerItem, bannerIndex) in bannerData"
            :key="bannerItem.markId"
            @click="jumpPage(bannerItem, true, bannerIndex)"
          >
            <img
              lazy-load
              :src="bannerItem.imageUrl"
              draggable="false"
              alt=""
            />
            <!-- <img lazy-load src="@/assets/images/noinfo.png" alt="" /> -->
          </van-swipe-item>
        </van-swipe>
      </div>
    </div>
  </div>
</template>

<script>
import {
  updateHistoryData,
  updateShowStatus,
  goPage,
  isApp,
  intersectionObserver,
  getQueryString,
  getQueryStringNew,
} from "@/utils/tool";

export default {
  name: "guess-like",
  components: {},
  data() {
    return {
      hasDomBanner: false,
      hasDom: false,
      dom: null,
      domBanner: null,
      isHidden: false,
      pageEntrance: null,
    };
  },
  inject: [
    "updateSearchContent",
    "updateCurrentCom",
    "getResult",
    "handleBlur",
    "getSearchUUID",
    "updateSearchUUID",
    "updateWordType",
  ],

  props: {
    likeData: {
      type: Array,
      default: () => [],
    },
    bannerData: {
      type: Array,
      default: () => [],
    },
    impAttrsLike: {
      type: Object,
      default: () => {},
    },
    impAttrsBanner: {
      type: Object,
      default: () => {},
    },
  },
  watch: {
    domBanner(newVal) {
      if (newVal && !this.hasDomBanner) {
        this.hasDomBanner = true;
        let temp = this.impAttrsBanner
          ? JSON.parse(JSON.stringify(this.impAttrsBanner))
          : null;
        delete temp.area_id;
        delete temp.type;
        delete temp?.WT_plat;
        delete temp?.WT_es;
        delete temp?.WT_ti;
        for (const key in temp) {
          temp[key] = JSON.stringify(temp[key]);
        }
        let obj = {
          XY_transaction_id: this.getSearchUUID(),
          area_id: this.impAttrsBanner.area_id,
          type: this.impAttrsBanner.type,
          WT_plat: sessionStorage.pagePlat || "",
          WT_es: sessionStorage.pageUrl || "",
          WT_ti: "搜索默认页",
          XY_pageEntry: sessionStorage.pageEntrance || "",
          ...temp,
        };
        // 区域曝光的参数格式有问题--暂时摒弃区域曝光的方式
        // intersectionObserver(newVal, obj, "GuessLikeBanner");
      }
    },
    dom(newVal) {
      if (newVal && !this.hasDom) {
        this.hasDom = true;
        let temp = JSON.parse(JSON.stringify(this.impAttrsLike));
        delete temp?.area_id;
        delete temp?.type;
        delete temp?.WT_plat;
        delete temp?.WT_es;
        delete temp?.WT_ti;
        for (const key in temp) {
          temp[key] = JSON.stringify(temp[key]);
        }
        let obj = {
          XY_transaction_id: this.getSearchUUID(),
          area_id: this.impAttrsLike?.area_id,
          type: this.impAttrsLike?.type,
          WT_plat: sessionStorage.pagePlat || "",
          WT_es: sessionStorage.pageUrl || "",
          WT_ti: "搜索默认页",
          XY_pageEntry: sessionStorage.pageEntrance || "",
          ...temp,
        };
        // 区域曝光的参数格式有问题--暂时摒弃区域曝光的方式
        // intersectionObserver(newVal, obj, "GuessLike");
      }
    },
    likeData: {
      handler(newVal) {
        if (newVal && newVal.length) {
          this.$nextTick(() => {
            this.dom = this.$refs.GuessLike;
          });
        }
      },
      deep: true,
    },
    bannerData: {
      handler(newVal) {
        if (newVal && newVal.length) {
          this.$nextTick(() => {
            this.domBanner = this.$refs.GuessLikeBanner;
          });
        }
      },
      deep: true,
    },
  },
  mounted() {
    // 从会话中获取页面入口信息
    // this.pageEntrance = getQueryStringNew().pageEntrance;
    this.pageEntrance = sessionStorage.getItem("pageEntrance");
    let statusTemp = localStorage.getItem("status");
    let status = statusTemp ? JSON.parse(statusTemp) : {};
    this.isHidden = status?.guessShowStatus || false;
  },
  methods: {
    changeShowStatus() {
      this.isHidden = !this.isHidden;
      updateShowStatus("guessShowStatus", this.isHidden);
    },

    jumpPage(item, flag, index) {
      console.log("猜你喜欢+猜你喜欢通栏====>");
      console.log(item);
      if (isApp()) {
        // let obj = {
        //   WT_event: item?.pCode || "",
        //   WT_envName: item?.markName || "",
        //   WT_markId: `${item?.advBusiType || ""}_${item?.markId || ""}`,
        //   WT_next_url: item.actionType == "4" ? item.iconCode : item.actionUrl,
        //   // WT_es: sessionStorage.pageUrl || '',
        //   // WT_ti: '搜索默认页',
        //   XY_pageEntry: sessionStorage.pageEntrance || "",
        // };
        // 插码方案修改2025-1-16
        let obj1 = {
          WT_et: "clk",
          WT_area_type_1: "楼层",
          areaid: `${item.diyAreaInfo}`, // 该区域对应的区域id_模板id_位置
          WT_area_type_2: flag ? "广告栏" : "猜你喜欢",
          WT_area_name: flag ? "广告栏" : "猜你喜欢",
          XY_env_type: flag ? "banner" : "icon",
          XY_point_position: index + 1,
          WT_event: item?.pCode || "",
          XY_gd_source: "搜索平台",
          WT_markId: "",
          WT_next_url: item.actionType == "4" ? item.iconCode : item.actionUrl,
          WT_envName: item?.markName || "",
          XY_scene: item?.markName || "",
          WT_es: sessionStorage.pageUrl || "", // 页面路径
          WT_ti: "搜索默认页", // 页面名称
          XY_visit_source: sessionStorage.pageEntrance || "", // 访问来源
          WT_plat: sessionStorage.pagePlat || "", // 渠道
          XY_transaction_id: this.getSearchUUID(),
        };
        console.log("点击猜你喜欢-广告栏新上报===>");
        console.log(obj1);
        this.$emit("getTrack", obj1);
      }
      if (flag) {
        if (item.actionUrl) {
          this.handleBlur();
          goPage(item.actionType, item.actionUrl);
        }
      } else {
        let hisData = {
          markName: item.markName,
          actionUrl: item?.actionUrl || "",
          // actionUrl: '',
          actionType: item?.actionType || "",
        };
        updateHistoryData(this.pageEntrance, hisData);
        if (item.actionUrl) {
          this.handleBlur();
          goPage(item.actionType, item.actionUrl);
        } else {
          this.updateSearchContent(item.markName);
          this.$nextTick(() => {
            this.updateCurrentCom("result");
            this.updateSearchUUID();
            // 更新搜索类型
            this.updateWordType(4);
            this.getResult();
          });
        }
      }
    },
  },
};
</script>
<style scoped lang="scss">
.height-0 {
  height: 0 !important;
  overflow: hidden;
}

.guess-like {
  display: flex;
  flex-direction: column;

  .head-con {
    display: flex;
    justify-content: space-between;
    margin-bottom: 30px;

    .left-con {
      font-size: 32px;
      font-weight: 700;
      color: #000000;
      // font-family: PingFangSC-Medium, sans-serif;
      font-family: PingFangSC, sans-serif;
    }

    .right-con {
      font-size: 36px;
      font-weight: 400;
      color: #999999;
      display: flex;
      align-items: center;
      p {
        font-size: 24px;
        margin-right: 19px;
      }
    }
  }
  .main-con {
    display: flex;
    flex-direction: column;
    margin-bottom: 48px;
    .clounm {
      display: flex;
      margin-bottom: 48px;
      .item {
        width: 25%;
        font-size: 24px;
        font-weight: 400;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        img {
          width: 46px;
          margin-bottom: 21px;
        }
      }
    }
    .ad-space0 {
      margin-bottom: 60px;
      img {
        width: 100%;
        border-radius: 18px;
      }
    }
  }
}
</style>
