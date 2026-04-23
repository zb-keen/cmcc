<template>
  <div class="hall-wrap">
    <div v-if="showTitle" class="hall-header">
      <div class="hall-title"></div>
    </div>
    <div id="businessHallNode"></div>
  </div>
</template>

<script>
import { isApp } from "@/utils/tool";
import CommonApi from "@/api/index";

export default {
  name: "BusinessHall",
  components: {},
  props: {
    dataInfo: {
      type: Object,
    },
    showTitle: {
      type: Boolean,
    },
  },
  data() {
    return {};
  },
  inject: ["showLoading", "hideLoading", "getSearchContent", "getSearchUUID"],
  computed: {},
  watch: {},
  created() {},
  mounted() {
    // 调用后端接口对手机号加密
    const userInfo = localStorage.getItem("userInfo")
      ? JSON.parse(localStorage.getItem("userInfo"))
      : null;
    CommonApi.threePhoneEncrypt({
      cellNum: userInfo ? userInfo.phoneNumber : "",
      escapeStatus: false,
    })
      .then((res) => {
        if (res.code === "000000") {
          console.log("附近营业厅初始化手机号参数加密成功==>");
          this.initHallPage(res.data);
        } else {
          console.log("附近营业厅初始化手机号参数加密失败==>");
        }
      })
      .catch((error) => {
        console.log("附近营业厅初始化手机号参数加密调用失败==>");
        console.log(error);
      });
  },
  methods: {
    initHallPage(escapePhone) {
      let script = document.createElement("script");
      script.type = "text/javascript";
      script.onload = () => {
        // 需要调用时
        if (window.hall_store) {
          const userInfo = localStorage.getItem("userInfo")
            ? JSON.parse(localStorage.getItem("userInfo"))
            : null;
          hall_store.init("#businessHallNode", {
            mobile: escapePhone, // 用户手机号码（后端加密）
            provinceCode: userInfo?.province || "", // 手机号码归属省份
            cityCode: userInfo?.city || "", // 手机号码归属地市
            appId: "NEAR_NETSTORE_APP", // 区分调用方，依据调用方分配不同的 appId
            pageId: "",
            onError: (error) => {
              console.log("查询附近厅卡片信息失败了", error);
              // 此处可处理附近厅卡片信息获取失败后的逻辑，比如删除插件容器或去掉容器的外间距及其他逻辑
            },
          });
        }
      };
      let joinUrl = "";
      if (process.env.NODE_ENV === "development") {
        joinUrl = "./hall_store.js";
      } else if (process.env.NODE_ENV === "gray" || process.env.NODE_ENV === "pre") {
        joinUrl = `https://wx.10086.cn/website/businessPlatform/js/sdk/hall_store.js`;
      } else if (process.env.NODE_ENV === "production") {
        joinUrl = `https://wx.10086.cn/website/businessPlatform/js/sdk/hall_store.js`;
      }
      script.src = joinUrl;
      document.getElementsByTagName("head")[0].appendChild(script);

      // 处理插码上报
      this.handleGdpImp();
    },

    // 曝光上报插码
    handleGdpImp() {
      // 附近营业厅调用sdk初始化渲染--端内只负责tba卡片曝光上报
      const tabImpGdpObj = {
        XY_transaction_id: this.getSearchUUID(),
        WT_et: "imp",
        WT_envName: "附近营业厅",
        WT_markId: "",
        XY_point_position: "",
        XY_first_class: "搜索结果页",
        XY_second_class: "",
        WT_next_url: "",
        WT_plat: sessionStorage.pagePlat || "",
        WT_es: sessionStorage.pageUrl || "",
        WT_ti: "搜索结果页",
        XY_pageEntry: sessionStorage.pageEntrance || "",
        // 插码方案修改2025-1-16
        WT_area_type_1: "楼层",
        areaid: "", // [区域id_模板id]
        WT_area_type_2: "全部",
        WT_area_name: "AI智答_附近营业厅", // AI智答_[三个入驻分类tab名称]
        XY_env_type: "tab",
        WT_event: "",
        XY_gd_source: "",
        XY_scene: this.getSearchContent(), // 搜索内容
        WT_si_n: "", // 物品对应的名称
        WT_goods_id: "", // 物品所对应的id信息
        XY_visit_source: sessionStorage.pageEntrance || "", // 访问来源
        WT_charge_phone: "",
        WT_errCode: "",
        WT_errMsg: "",
        XY_env_extend_attribute: "",
      };
      console.log("结果页-三个入驻-附近营业厅tab卡片-曝光上报===>");
      console.log(tabImpGdpObj);
      if (isApp()) {
        gdp("track", "imp", tabImpGdpObj);
      }
    },
  },
};
</script>

<style scoped lang='scss'>
.hall-wrap {
  .hall-header {
    padding: 20px 30px;

    .hall-title {
      // font-weight: 700;
      // font-size: 32px;
      // color: #000000;
      // margin-bottom: 35px;
      // font-family: PingFangSC, sans-serif;
      width: 160px;
      height: 40px;
      background-image: url("../../../assets/images/yyt-active.png");
      background-position: center top;
      background-size: 100% 100%;
    }
  }

  // 实例化的附近营业厅展示区域上下内边距待优化15px-->10px
  #businessHallNode {
    .plugin-wrap {
      padding-top: 10px !important;
      padding-bottom: 10px !important;
    }
  }
}
</style>
