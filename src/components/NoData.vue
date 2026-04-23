<template>
  <div class="h-overflow">
    <div class="cover">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 18 18"
        version="1.1"
      >
        <g id="" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
          <path
            d="M0,0 L18,0 L17.6693348,0.0029762956 C7.88078333,0.179318477 -1.20390968e-15,8.16933145 0,18 L0,18 L0,0 Z"
            fill="#F7F7F7"
          />
        </g>
      </svg>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 18 18"
        version="1.1"
      >
        <g id="" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
          <path
            d="M0,0 L18,0 L17.6693348,0.0029762956 C7.88078333,0.179318477 -1.20390968e-15,8.16933145 0,18 L0,18 L0,0 Z"
            fill="#F7F7F7"
            transform="translate(9.000000, 9.000000) scale(-1, 1) translate(-9.000000, -9.000000) "
          />
        </g>
      </svg>
    </div>
    <div
      :class="recommendList.length > 0 ? 'no-data' : 'no-data border-radius'"
    >
      <img :src="noDataUrl" draggable="false" alt="" />
      <p>很抱歉，没有找到相关信息哦～</p>
      <div class="btn" v-if="url" @click="consultOnline()">咨询在线客服</div>
    </div>
    <!-- 为您推荐 -->
    <recommend-wrap
      ref="recommendRef"
      @moreArrDataList="moreArrDataList"
    ></recommend-wrap>
    <!-- 为您推荐 -->
  </div>
</template>

<script>
import { isApp } from "@/utils/tool";
import CommonApi from "@/api/index";
import RecommendWrap from "../components/result/TemplatePage/RecommendList.vue";

export default {
  name: "no-data",
  components: {
    RecommendWrap,
  },
  data() {
    return {
      paramData: {
        provCode: "351",
        clientVersion: "10_10",
      },
      url: "",
      recommendListBol: false,
      recommendList: [],
      noDataUrl: "data:image/png;base64,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"
    };
  },
  inject: ["getSearchContent", "getSearchUUID"],
  mounted() {
    const userInfo = localStorage.getItem("userInfo")
      ? JSON.parse(localStorage.getItem("userInfo"))
      : null;
    this.paramData.provCode = userInfo?.province || "";
    this.paramData.loginProvince = userInfo?.loginProvince || "";
    this.paramData.clientVersion = userInfo?.version
      ? `10_10,${userInfo.version}`
      : "10_10";
    this.queryOnlineCustomerInfo();
  },
  methods: {
    /**
     * 回传为您推荐商品列表
     */
    moreArrDataList(val) {
      this.recommendList = val;
    },
    queryOnlineCustomerInfo() {
      CommonApi.queryOnlineCustomerInfo(this.paramData)
        .then((res) => {
          this.url = res.data;
        })
        .catch(() => {
          console.log("客服接口查询失败");
        });
    },

    /**
     * 埋点-插码-上报
     * 点击事件采集
     * 为您推荐_无搜索结果_推荐区域
     */
    consultOnline() {
      const clickGdpObj = {
        XY_transaction_id: this.getSearchUUID(),
        WT_et: "clk",
        WT_envName: "咨询在线客服",
        WT_event: "",
        WT_markId: "",
        XY_point_position: "",
        XY_first_class: "",
        WT_next_url: this.url,
        WT_plat: sessionStorage.pagePlat || "",
        WT_es: sessionStorage.pageUrl || "",
        WT_ti: "搜索结果页",
        XY_pageEntry: sessionStorage.pageEntrance || "",
        // 插码方案修改2025-1-16
        WT_area_type_1: "楼层",
        areaid: "", // 父物品id信息（无父物品传空）
        WT_area_type_2: "搜索无结果",
        WT_area_name: "在线客服", // 若没有二级分类，此名称则记录为一级分类名称
        XY_env_type: "button",
        XY_gd_source: "搜索平台",
        XY_scene: this.getSearchContent() || "", // 搜索内容
        WT_si_n: "", // 物品对应的名称
        WT_goods_id: "", // 物品所对应的id信息
        XY_visit_source: sessionStorage.pageEntrance || "", // 访问来源
      };
      console.log("点击无结果-在线客服-数据上报===>");
      console.log(clickGdpObj);
      if (isApp()) {
        gdp("track", "clk", clickGdpObj);
      }
      // 验证插码上报时禁用跳转可注释
      window.location.href = this.url;
    },
  },
};
</script>

<style scoped lang='scss'>
.border-radius {
  border-radius: 18px;
}
.h-overflow {
  height: 100%;
  overflow-y: auto;
  scrollbar-width: none;
  position: relative;
}
.h-overflow::-webkit-scrollbar {
  display: none;
}
.h-overflow::-webkit-scrollbar {
  display: none;
}
.no-data {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #ffffff;
  box-shadow: 0px 4px 20px 0px #f6f6f6;
  padding-bottom: 78px;
  // border-top-left-radius: 18px;
  // border-top-right-radius: 18px;
  img {
    margin-top: 208px;
    width: 612px;
  }
  p {
    font-size: 28px;
    color: #666666;
    line-height: 26px;
    margin-top: 14px;
  }
  .btn {
    width: 306px;
    height: 72px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    border: 2px solid #2892ff;
    font-size: 28px;
    color: #2892ff;
    margin-top: 58px;
    // margin-bottom:98px;
  }
}
.cover {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 5;
  width: 100%;
  height: 18px;
}
.cover > svg {
  width: 18px;
  height: 18px;
}
.cover > svg:first-child {
  float: left;
}
.cover > svg:last-child {
  float: right;
}
</style>
