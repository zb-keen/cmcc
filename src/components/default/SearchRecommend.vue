<template>
  <div class="search-recommend">
    <div class="recommend-warp" v-show="!isHidden">
      <div class="recommend-header">
        <template v-for="(tabItem, tabIndex) in tabList">
          <div
            :key="tabItem.key"
            :class="computedStyle(tabItem.key)"
            @click="handleTab(tabItem, tabIndex)"
          >
            {{ tabActive === tabItem.key ? "" : tabItem.name }}
          </div>
        </template>
      </div>
      <div class="recommend-con">
        <HotSearchNew v-if="tabActive === 'rmss'"></HotSearchNew>
        <SelectRecommend v-show="tabActive === 'jxtj'" :isShow="tabActive === 'jxtj'"></SelectRecommend>
        <HotSaleCard v-show="tabActive === 'rxtk'" :isShow="tabActive === 'rxtk'"></HotSaleCard>
        <WonderfulContent v-if="tabActive === 'jcnr'"></WonderfulContent>
        <NearbyLife v-if="tabActive === 'zbsh'" ref="zbshRef"></NearbyLife>
      </div>
    </div>
    <div
      class="hidde-con"
      @click="changeShowStatus()"
      :style="{
        'margin-top': isHidden ? (offsetWidth * 18) / 750 + 'px' : '24px',
      }"
    >
      <span
        class="icon s-iconfont"
        :class="isHidden ? 'ic-icon-hidden' : 'ic-icon-show'"
      ></span>
      <span>{{ isHidden ? "显示" : "隐藏" }}排行榜</span>
    </div>
  </div>
</template>

<script>
import { updateShowStatus, isApp, isHarmony } from "@/utils/tool";
import HotSearchNew from "./HotSearchNew.vue"; // 热门搜索
import SelectRecommend from "./SelectRecommend.vue"; // 精选推荐
import HotSaleCard from "./HotSaleCard.vue"; // 热门搜索
import WonderfulContent from "./WonderfulContent.vue"; // 精彩内容
import NearbyLife from "./NearbyLife.vue"; // 周边生活

export default {
  name: "SearchRecommend",
  data() {
    return {
      dom: null,
      isHidden: true,
      currentData: [],
      offsetWidth: null,
      pageEntrance: null,
      hasDom: false,
      tabList: [],
      tabActive: "rmss",
    };
  },

  computed: {
    computedStyle() {
      return (key) => {
        if (key === this.tabActive) {
          if (isHarmony()) {
            return `header-item1 ${key}-header`;
          }
          return `header-item ${key}-header`;
        } else {
          if (isHarmony()) {
            return "header-item1";
          }
          return "header-item";
        }
      }
    },
  },
  components: {
    HotSearchNew,
    SelectRecommend,
    WonderfulContent,
    NearbyLife,
    HotSaleCard
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
  },
  watch: {},
  mounted() {
    // 从会话中获取页面入口信息
    // this.pageEntrance = getQueryStringNew().pageEntrance;
    this.pageEntrance = sessionStorage.getItem("pageEntrance");
    this.offsetWidth = document.body.offsetWidth;
    let statusTemp = localStorage.getItem("status");
    let status = statusTemp ? JSON.parse(statusTemp) : {};
    this.isHidden = status?.hotShowStatus || false;

    this.tabList = [
      {
        key: "rmss",
        name: "热门搜索",
      },
      {
        key: "jxtj",
        name: "精选推荐",
      },
      {
        key: "rxtk",
        name: "热销套卡",
      },
      {
        key: "jcnr",
        name: "精彩内容",
      },
      {
        key: "zbsh",
        name: "周边生活",
      },
    ];

    if (isHarmony()) {
      this.tabList = this.tabList.filter(item => item.key !== 'rxtk')
    }
    // 处理曝光插码上报
    // 与插码侧确认： 这几个tab是写死的，没有运营性质
    // this.handleGdpImp(resHotData);
  },
  methods: {
    async changeShowStatus() {
      this.isHidden = !this.isHidden;
      const clickGdpObj = {
        XY_transaction_id: this.getSearchUUID(),
        WT_et: "clk",
        type: "",
        WT_envName: this.isHidden ? "隐藏排行榜" : "显示排行榜", // [显示排行榜/隐藏排行榜]
        WT_markId: "",
        XY_point_position: "",
        XY_first_class: "搜索默认页",
        XY_second_class: "",
        WT_next_url: "",
        WT_plat: sessionStorage.pagePlat || "",
        WT_es: sessionStorage.pageUrl || "",
        WT_ti: "搜索默认页",
        XY_pageEntry: sessionStorage.pageEntrance || "",
        // 插码方案修改2025-1-16
        WT_area_type_1: "楼层",
        areaid: "", // [区域id_模板id]
        WT_area_type_2: "",
        WT_area_name: "排行榜显示开关",
        XY_env_type: "button",
        WT_event: "",
        XY_gd_source: "搜索平台", // [如果source=qqd，传qqd；如果source=app，传app]
        XY_scene: "", // 搜索内容
        WT_si_n: "", // 物品对应的名称
        WT_goods_id: "", // 物品所对应的id信息
        XY_visit_source: sessionStorage.pageEntrance || "", // 访问来源
        WT_charge_phone: "",
        WT_errCode: "",
        WT_errMsg: "",
        XY_env_extend_attribute: "",
      };
      console.log("默认页-搜索推荐-显示/隐藏排行榜===>");
      console.log(clickGdpObj);
      if (isApp()) {
        gdp("track", "clk", clickGdpObj);
      }
      await updateShowStatus("hotShowStatus", this.isHidden);
    },

    handleGdpImp(renderTabs) {
      for (let index = 0; index < renderTabs.length; index++) {
        const impGdpObj = {
          XY_transaction_id: this.getSearchUUID(),
          WT_et: "imp",
          type: "",
          WT_envName: renderTabs[index].name,
          WT_markId: "",
          XY_point_position: "",
          XY_first_class: "搜索默认页",
          XY_second_class: "",
          WT_next_url: "",
          WT_plat: sessionStorage.pagePlat || "",
          WT_es: sessionStorage.pageUrl || "",
          WT_ti: "搜索默认页",
          XY_pageEntry: sessionStorage.pageEntrance || "",
          // 插码方案修改2025-1-16
          WT_area_type_1: "tab页",
          areaid: "", // [区域id_模板id]
          WT_area_type_2: "",
          WT_area_name: renderTabs[index].name,
          XY_env_type: "tab",
          WT_event: "",
          XY_gd_source: "搜索平台", // [如果source=qqd，传qqd；如果source=app，传app]
          XY_scene: "", // 搜索内容
          WT_si_n: "", // 物品对应的名称
          WT_goods_id: "", // 物品所对应的id信息
          XY_visit_source: sessionStorage.pageEntrance || "", // 访问来源
          WT_charge_phone: "",
          WT_errCode: "",
          WT_errMsg: "",
          XY_env_extend_attribute: "",
        };
        console.log("默认页-热门搜索tab-数据曝光上报===>");
        console.log(impGdpObj);
        if (isApp()) {
          gdp("track", "imp", impGdpObj);
        }
      }
    },

    handleTab(activeItem, activeIndex) {
      const clickGdpObj = {
        XY_transaction_id: this.getSearchUUID(),
        WT_et: "clk",
        type: "",
        WT_envName: activeItem.name,
        WT_markId: "",
        XY_point_position: activeIndex + 1,
        XY_first_class: "搜索默认页",
        XY_second_class: "",
        WT_next_url: "",
        WT_plat: sessionStorage.pagePlat || "",
        WT_es: sessionStorage.pageUrl || "",
        WT_ti: "搜索默认页",
        XY_pageEntry: sessionStorage.pageEntrance || "",
        // 插码方案修改2025-1-16
        WT_area_type_1: "tab",
        areaid: "", // [区域id_模板id]
        WT_area_type_2: "",
        WT_area_name: "tab切换",
        XY_env_type: "tab",
        WT_event: "",
        XY_gd_source: "搜索平台", // [如果source=qqd，传qqd；如果source=app，传app]
        XY_scene: "", // 搜索内容
        WT_si_n: "", // 物品对应的名称
        WT_goods_id: "", // 物品所对应的id信息
        XY_visit_source: sessionStorage.pageEntrance || "", // 访问来源
        WT_charge_phone: "",
        WT_errCode: "",
        WT_errMsg: "",
        XY_env_extend_attribute: "",
      };
      console.log("默认页-搜索推荐-tab点击上报===>");
      console.log(clickGdpObj);
      if (isApp()) {
        gdp("track", "clk", clickGdpObj);
      }
      // 切换tab
      this.tabActive = activeItem.key;
      this.$emit("getTab", activeItem.key);
    },

    // 重新请求周边生活数据
    updateNearbyLife() {
      console.log("搜索推荐组件===>");
      console.log(this.$refs.zbshRef);
      this.$nextTick(() => {
        console.log(this.$refs.zbshRef);
        if (this.$refs.zbshRef) {
          this.$refs.zbshRef?.returnPageGetData();
        }
      });
    },
  },
};
</script>

<style scoped lang='scss'>
.search-recommend {
  display: flex;
  flex-direction: column;
  margin-top: 8px;
  margin-bottom: 47px;

  .recommend-warp {
    .recommend-header {
      display: flex;
      align-items: center;
      .header-item {
        width: 112px;
        height: 40px;
        font-family: PingFangSC, PingFang SC;
        font-weight: 500;
        font-size: 28px;
        color: #333;
        line-height: 40px;
        text-align: center;
        font-style: normal;
        margin-right: 18px;
        padding-top: 3px;
        &:last-child {
          margin-right: 0;
        }
      }
      .header-item1 {
        width: 144px;
        height: 40px;
        font-family: PingFangSC, PingFang SC;
        font-weight: 500;
        font-size: 28px;
        color: #333;
        line-height: 40px;
        text-align: center;
        font-style: normal;
        margin-right: 18px;
        padding-top: 3px;

        &:last-child {
          margin-right: 0;
        }
      }

      .rmss-header {
        width: 144px;
        height: 50px;
        background-image: url("../../assets/images/rmss.png");
        background-position: center top;
        background-size: 100% 100%;
      }

      .jxtj-header {
        width: 144px;
        height: 50px;
        background-image: url("../../assets/images/jxtj.png");
        background-position: center top;
        background-size: 100% 100%;
      }

      .rxtk-header {
        width: 144px;
        height: 50px;
        background-image: url("../../assets/images/rxtk.png");
        background-position: center top;
        background-size: 100% 100%;
      }

      .jcnr-header {
        width: 144px;
        height: 50px;
        background-image: url("../../assets/images/jcnr.png");
        background-position: center top;
        background-size: 100% 100%;
      }

      .zbsh-header {
        width: 144px;
        height: 50px;
        background-image: url("../../assets/images/zbsh.png");
        background-position: center top;
        background-size: 100% 100%;
      }
    }

    .recommend-con {
      margin-top: 24px;
    }
  }

  .hidde-con {
    width: 204px;
    height: 44px;
    display: flex;
    // justify-content: center;
    align-items: center;
    background: #ffffff;
    border-radius: 30px;
    border: 1px solid #d5d5d5;
    font-size: 24px;
    font-weight: 400;
    color: #666666;
    padding: 5px 22px 5px 20px;

    .icon {
      font-size: 28px;
      margin-right: 6px;
      color: #999;
    }
  }
}
</style>