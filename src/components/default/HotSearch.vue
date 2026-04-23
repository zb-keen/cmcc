<template>
  <div
    class="hot-search"
    v-if="hotData.length"
    ref="HotSearch"
    imp-position-id="hot-search"
    imp-type="once"
    imp-track="imp"
    :imp-attrs="impAttrsHot"
  >
    <div class="main-con" v-show="!isHidden">
      <img
        class="bg"
        src="@/assets/images/hot-search-bg.png"
        draggable="false"
        alt=""
      />
      <div class="title-con">
        <img
          src="@/assets/images/hot-search-icon.png"
          draggable="false"
          alt=""
        />
      </div>
      <div class="item-con">
        <div
          class="item"
          v-for="(item, index) in hotData"
          :key="index"
          @click="jumpPage(item, index)"
        >
          <div class="serial">
            <img
              :src="require('@/assets/images/' + (index + 1) + '.png')"
              draggable="false"
              alt=""
            />
          </div>
          <div class="content">{{ item.markName }}</div>
          <div class="index">
            <span class="left">{{ item.moods ? "热搜指数" : "" }}</span
            ><span class="right">{{ item.moods }}</span>
          </div>
        </div>
      </div>
    </div>
    <div
      class="hidde-con"
      @click="changeShowStatus()"
      :style="{
        'margin-top': isHidden
          ? (offsetWidth * 18) / 750 + 'px'
          : (offsetWidth * 12) / 750 + 'px',
      }"
    >
      <span
        class="icon s-iconfont"
        :class="isHidden ? 'ic-icon-hidden' : 'ic-icon-show'"
      ></span>
      <span>{{ isHidden ? "开启" : "隐藏" }}全网热搜</span>
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
  name: "hot-search",
  data() {
    return {
      dom: null,
      isHidden: true,
      currentData: [],
      offsetWidth: null,
      pageEntrance: null,
      hasDom: false,
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
    hotData: {
      type: Array,
      default: () => [],
    },
    impAttrsHot: {
      type: Object,
      default: () => {},
    },
  },
  watch: {
    dom(newVal) {
      if (newVal && !this.hasDom) {
        this.hasDom = true;
        let temp = this.impAttrsHot
          ? JSON.parse(JSON.stringify(this.impAttrsHot))
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
          area_id: this.impAttrsHot?.area_id,
          type: this.impAttrsHot?.type,
          WT_plat: sessionStorage.pagePlat || "",
          WT_es: sessionStorage.pageUrl || "",
          WT_ti: "搜索默认页",
          XY_pageEntry: sessionStorage.pageEntrance || "",
          ...temp,
        };
        // 区域曝光的参数格式有问题--暂时摒弃区域曝光的方式
        // intersectionObserver(newVal, obj, "HotSearch");
      }
    },
    hotData: {
      handler(newVal) {
        if (newVal && newVal.length) {
          this.$nextTick(() => {
            this.dom = this.$refs.HotSearch;
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
    this.offsetWidth = document.body.offsetWidth;
    let statusTemp = localStorage.getItem("status");
    let status = statusTemp ? JSON.parse(statusTemp) : {};
    this.isHidden = status?.hotShowStatus || false;
  },
  methods: {
    async changeShowStatus() {
      this.isHidden = !this.isHidden;
      await updateShowStatus("hotShowStatus", this.isHidden);
    },
    jumpPage(item, index) {
      console.log("全网热搜====>");
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
          WT_area_type_2: "全网热搜",
          WT_area_name: "全网热搜",
          XY_env_type: "",
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
        console.log("点击全网热搜新上报===>");
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
<style scoped lang='scss'>
.hot-search {
  display: flex;
  flex-direction: column;
  margin-bottom: 47px;
  .main-con {
    border: 2px solid #c4e2ff;
    border-radius: 18px;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
    .bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 0;
    }
    .title-con {
      margin-bottom: 20px;
      padding: 24px 40px 0px 40px;
      z-index: 1;
      font-size: 0;
      img {
        width: 144px;
      }
    }
    .item-con {
      padding: 0 48px 36px 48px;
      display: flex;
      flex-direction: column;
      font-size: 28px;
      font-weight: 500;
      color: #000000;
      z-index: 1;
      .item {
        display: flex;
        align-items: center;
        margin-bottom: 24px;
        height: 50px;
        .serial {
          height: 50px;
          display: flex;
          align-items: center;
          margin-right: 28px;
          img {
            height: 50px;
          }
        }
        .content {
          flex: 1;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .index {
          font-size: 20px;
          font-weight: 500;
          color: #999999;
          span {
            text-align: left;
          }
          span.right {
            margin-left: 8px;
          }
        }
      }
      .item:last-child {
        margin-bottom: 0;
      }
    }
  }
  .hidde-con {
    width: 227px;
    height: 42px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #ffffff;
    border: 2px solid #e5e5e5;
    border-radius: 21px;
    font-size: 24px;
    font-weight: 500;
    color: #666666;
    .icon {
      margin-right: 11px;
      color: #999;
    }
  }
}
</style>
