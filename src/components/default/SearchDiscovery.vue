<template>
  <div
    class="dicovery-search"
    :style="{
      'margin-bottom': isHidden
        ? (offsetWidth * 30) / 750 + 'px'
        : (offsetWidth * 12) / 750 + 'px',
    }"
    v-if="disCoveryData.length"
    ref="SearchDiscovery"
    imp-position-id="search-discovery"
    imp-type="once"
    imp-track="imp"
    :imp-attrs="impAttrsDisCovery"
  >
    <div class="head-con">
      <div class="left-con">搜索发现</div>
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
    <div
      class="main-con"
      :class="isHidden ? 'height-0' : isExpand ? 'height-auto' : ''"
      :style="{ 'margin-top': !isHidden ? '0.32rem' : '' }"
    >
      <div
        class="item"
        v-for="(item, index) in currentData"
        :key="item.markId"
        @click="jumpPage(item, index)"
      >
        {{ item.markName | filterChar }}
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
</template>

<script>
import {
  updateHistoryData,
  updateShowStatus,
  handleChar,
  goPage,
  getConWidth,
  isApp,
  intersectionObserver,
  getQueryString,
  getQueryStringNew,
} from "@/utils/tool";

export default {
  name: "search-discovery",
  data() {
    return {
      hasDom: false,
      dom: null,
      offsetWidth: null,
      isExpand: false,
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
    disCoveryData: {
      type: Array,
      default: () => [],
    },
    impAttrsDisCovery: {
      type: Object,
      default: () => {},
    },
  },
  watch: {
    dom(newVal) {
      if (newVal && !this.hasDom) {
        this.hasDom = true;
        let temp = this.impAttrsDisCovery
          ? JSON.parse(JSON.stringify(this.impAttrsDisCovery))
          : null;
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
          area_id: this.impAttrsDisCovery?.area_id,
          type: this.impAttrsDisCovery?.type,
          WT_plat: sessionStorage.pagePlat || "",
          WT_es: sessionStorage.pageUrl || "",
          WT_ti: "搜索默认页",
          XY_pageEntry: sessionStorage.pageEntrance || "",
          ...temp,
        };
        // 区域曝光的参数格式有问题--暂时摒弃区域曝光的方式
        // intersectionObserver(newVal, obj, "SearchDiscovery");
      }
    },
    currentData: {
      handler(newVal) {
        if (newVal && newVal.length) {
          this.$nextTick(() => {
            this.dom = this.$refs.SearchDiscovery;
          });
        }
      },
      deep: true,
    },
  },
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
      const currentData = this.disCoveryData.slice(0, lastIndex + 1);
      return currentData;
    },
  },
  filters: {
    filterChar(val) {
      return handleChar(val);
    },
  },
  mounted() {
    // 从会话中获取页面入口信息
    // this.pageEntrance = getQueryStringNew().pageEntrance;
    this.pageEntrance = sessionStorage.getItem("pageEntrance");
    this.offsetWidth = document.body.offsetWidth;
    let statusTemp = localStorage.getItem("status");
    let status = statusTemp ? JSON.parse(statusTemp) : {};
    this.isHidden = status?.discoveryShowStatus || false;
  },
  methods: {
    async changeShowStatus() {
      this.isHidden = !this.isHidden;
      await updateShowStatus("discoveryShowStatus", this.isHidden);
    },
    // 获取下标
    getIndex(startIndex, isEnd = false) {
      const { offsetWidth } = document.body;
      const containerWith = offsetWidth - (offsetWidth * 60) / 750;
      let eleWidth = 0;
      for (let i = startIndex + 1; i < this.disCoveryData.length; i++) {
        let width =
          getConWidth(this.disCoveryData[i].markName) +
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
    jumpPage(item, index) {
      console.log("搜索发现====>");
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
          WT_area_type_2: "搜索发现",
          WT_area_name: "搜索发现",
          XY_env_type: "",
          XY_point_position: index + 1,
          // WT_event: item?.pCode || "",
          WT_event: `P0000002510${index}`,
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
        console.log("点击搜索发现新上报===>");
        console.log(obj1);
        this.$emit("getTrack", obj1);
      }
      let hisData = {
        markName: item.markName,
        actionUrl: item?.actionUrl || "",
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
    },
  },
};
</script>
<style scoped lang="scss">
.height-0 {
  height: 0 !important;
}
.height-auto {
  max-height: 234px !important;
}
.dicovery-search {
  display: flex;
  flex-direction: column;
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
  .main-con {
    max-height: 156px;
    overflow: hidden;
    .item {
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
        font-weight: 400;
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
