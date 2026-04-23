<template>
  <div class="default-wrap">
    <!-- 搜索发现 -->
    <div class="dicovery-search">
      <div class="head-con">
        <div class="left-con">搜索发现</div>
        <div class="right-con" @click="changeShowStatus('dicovery')">
          <template v-if="!isDisHidden">
            <span class="icon s-iconfont ic-icon-show"></span>
          </template>
          <template v-else>
            <p>已隐藏</p>
            <span class="icon s-iconfont ic-icon-hidden"></span>
          </template>
        </div>
      </div>
      <div
        class="dicovery-con"
        :class="isDisHidden ? 'height-0' : isExpand ? 'height-auto' : ''"
        :style="{ 'margin-top': !isDisHidden ? '0.32rem' : '' }"
      >
        <div
          class="dicovery-item"
          v-for="(item, index) in currentData"
          :key="index"
          @click="jumpPage('dicovery', item, index)"
        >
          <div v-if="item.imgUrl" class="serial">
            <img
              :src="require('@/assets/images/' + item.imgUrl + '.png')"
              draggable="false"
              alt=""
            />
          </div>
          <div class="content">
            <span>{{ item.markName | filterChar }}</span>
          </div>
        </div>
        <div
          class="btn-con"
          v-if="
            (!isExpand && currentData.length < disCoveryData.length) ||
            (isExpand && currentData.length <= disCoveryData.length)
          "
          @click="changeExpandStatus()"
        >
          <span class="icon s-iconfont ic-xiajiantou" v-if="!isExpand"></span>
          <span class="icon s-iconfont ic-shangjiantou" v-else></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  updateHistoryData,
  goPage,
  getConWidth,
  handleChar,
  isApp,
  isProtogenesisSkip,
  goProtogenesisPage,
  goPageUrl,
} from "@/utils/tool";

export default {
  name: "SearchDiscoveryNew",
  data() {
    return {
      offsetWidth: null,
      isExpand: false,
      isDisHidden: false, // 搜索发现隐藏
      pageEntrance: null,
      initData: [
        {
          markName: "充话费",
          imgUrl: "icon-hot",
          actionUrl: "",
          actionType: "",
        },
        {
          markName: "流量超市",
          imgUrl: "icon-tuijian",
          actionUrl: "",
          actionType: "",
        },
        {
          markName: "套餐办理",
          actionUrl: "",
          actionType: "",
        },
        {
          markName: "宽带福利",
          imgUrl: "",
          actionUrl: "",
          actionType: "",
        },
        {
          markName: "权益领取",
          imgUrl: "icon-tuijian",
          actionUrl: "",
          actionType: "",
        },
        {
          markName: "会员7折",
          imgUrl: "",
          actionUrl: "",
          actionType: "",
        },
        {
          markName: "签到领奖",
          imgUrl: "",
          actionUrl: "",
          actionType: "",
        },
        {
          markName: "积分兑换",
          imgUrl: "",
          actionUrl: "",
          actionType: "",
        },
      ],
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
    disCoveryData: {
      type: Array,
      default: () => [],
    },
    // impAttrsDisCovery: {
    //   type: Object,
    //   default: () => {},
    // },
  },
  watch: {},
  computed: {
    currentData() {
      let firstNum = 0;
      let secondNum = 0;
      let lastIndex = 0;
      firstNum = this.getIndex(-1);
      if (firstNum > 0) {
        if (!this.isExpand) {
          lastIndex = this.getIndex(firstNum, true);
        } else {
          secondNum = this.getIndex(firstNum);
          lastIndex = this.getIndex(secondNum, true);
        }
      }
      // 处理一下无数据的默认展示
      let currentData = null;
      if (this.disCoveryData.length === 0) {
        currentData = this.initData.slice(0, lastIndex + 1);
      } else {
        currentData = this.disCoveryData.slice(0, lastIndex + 1);
      }
      return currentData;
    },
  },
  filters: {
    filterChar(val) {
      return handleChar(val);
    },
  },
  mounted() {
    this.pageEntrance = sessionStorage.getItem("pageEntrance");
    this.offsetWidth = document.body.offsetWidth;
    this.isDisHidden = false;
  },
  methods: {
    changeShowStatus(mouduleFlag) {
      if (mouduleFlag === "dicovery") {
        this.isDisHidden = !this.isDisHidden;
      }
    },

    // 获取下标
    getIndex(startIndex, isEnd = false) {
      const { offsetWidth } = document.body;
      const containerWith = offsetWidth - (offsetWidth * 60) / 750;
      let eleWidth = 0;
      for (let i = startIndex + 1; i < this.disCoveryData.length; i++) {
        let iconWidth = this.disCoveryData[i].imgUrl ? 32 : 0; // 图标宽度
        let width =
          getConWidth(this.disCoveryData[i].markName) +
          iconWidth +
          (offsetWidth * 18) / 750;
        if (width >= (offsetWidth * 255) / 750) {
          width = (offsetWidth * 127.5) / 375 + (offsetWidth * 18) / 750;
        }
        eleWidth += width;
        if (i === this.disCoveryData.length - 1) {
          if (eleWidth <= containerWith) {
            return i;
          }
        }
        if (eleWidth + (isEnd ? (offsetWidth * 60) / 750 : 0) > containerWith) {
          eleWidth = 0;
          return i - 1;
        }
      }
      return this.disCoveryData.length - 1;
    },

    // 展开折叠状态
    changeExpandStatus() {
      this.isExpand = !this.isExpand;
    },

    jumpPage(mouduleFlag, item, index) {
      console.log("首页重构--搜索发现点击事件====>");
      console.log(mouduleFlag);
      console.log(item);

      const clickGdpObj = {
        WT_et: "clk",
        WT_area_type_1: "楼层",
        areaid: "", // 该区域对应的区域id_模板id_位置
        // WT_area_type_2: "搜索发现",
        WT_area_name: "搜索发现",
        XY_env_type: "button",
        XY_point_position: index + 1,
        // WT_event: item?.pCode || "",
        WT_event: `P0000002510${index}`,
        XY_gd_source: "搜索平台",
        WT_markId: "",
        WT_next_url: item.actionUrl || "",
        WT_envName: item?.markName || "",
        XY_scene: item?.markName || "",
        WT_es: sessionStorage.getItem("pageUrl") || "", // 页面路径
        WT_ti: "搜索默认页", // 页面名称
        XY_visit_source: sessionStorage.getItem("pageEntrance") || "", // 访问来源
        WT_plat: sessionStorage.getItem("pagePlat") || "", // 渠道
        XY_transaction_id: this.getSearchUUID(),
      };
      console.log("首页重构---新版搜索发现点击上报===>");
      console.log(clickGdpObj);
      if (isApp()) {
        gdp("track", "clk", clickGdpObj);
      }

      let hisData = {
        markName: item.markName,
        actionUrl: item?.actionUrl || "",
        actionType: item?.actionType || "",
      };
      updateHistoryData(this.pageEntrance, hisData);
      if (item.actionUrl) {
        this.handleBlur();
        // goPage(item.actionType, item.actionUrl);
        console.log("首页重构---搜索发现点击事件跳转===>", item.actionUrl);
        if (isProtogenesisSkip(item)) {
          goProtogenesisPage(item?.linkAdress1);
        } else {
          goPageUrl(item.actionType, item.actionUrl);
        }

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
    },
  },
};
</script>

<style scoped lang="scss">
.default-wrap {
  .height-0 {
    height: 0 !important;
  }

  .height-auto {
    max-height: 234px !important;
  }

  .service-choose,
  .dicovery-search {
    display: flex;
    flex-direction: column;
    margin-bottom: 30px;

    .head-con {
      display: flex;
      justify-content: space-between;

      .left-con {
        font-size: 32px;
        font-weight: 700;
        color: #000000;
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
  }

  .dicovery-con {
    max-height: 156px;
    overflow: hidden;

    .dicovery-item {
      float: left;
      font-size: 24px;
      font-weight: 400;
      padding: 0 24px;
      height: 60px;
      line-height: 60px;
      background: #f8f8f8;
      border-radius: 30px;
      margin-right: 18px;
      margin-bottom: 18px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      display: flex;
      align-items: center;

      .serial {
        height: 32px;
        display: flex;
        align-items: center;

        img {
          height: 32px;
          position: relative;
          top: -1px;
        }
      }

      .content {
        flex: 1;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      .icon {
        font-size: 20px;
        margin-left: 5px;
      }
    }

    .btn-con {
      width: 60px;
      float: left;

      span {
        width: 60px;
        height: 60px;
        font-size: 24px;
        font-weight: 500;
        background: #f8f8f8;
        border-radius: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
}
</style>
