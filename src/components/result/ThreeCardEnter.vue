<template>
  <div class="three-wrap">
    <div class="three-tab">
      <template v-if="tabList.length > 1">
        <div class="tab-header" :class="tabHeaderList[headerActive]">
          <template v-for="(tabItem, tabindex) in tabList">
            <div
              :key="tabindex"
              :class="
                tabActive === tabItem.activeTab
                  ? 'header-item header-active'
                  : 'header-item'
              "
              :style="{
                width: `${100 / tabList.length}%`,
              }"
              @click="handleChange(tabindex, tabItem.activeTab)"
            >
              <div
                :class="
                  tabActive === tabItem.activeTab
                    ? `${tabItem.icon} ${tabItem.activeClass}`
                    : `${tabItem.icon} ${tabItem.normalClass}`
                "
              ></div>
            </div>
          </template>
        </div>
      </template>
      <div class="tab-content">
        <AccountManager
          v-if="tabActive === 'kehu' && managerData"
          :dataInfo="managerData"
          :showTitle="conShowTitle"
          ref="managerRef"
        >
        </AccountManager>
        <ZhiJiaEngineer
          v-if="tabActive === 'zhijia' && engineerData"
          :dataInfo="engineerData"
          :showTitle="conShowTitle"
        >
        </ZhiJiaEngineer>
        <NearbyHall v-if="tabActive === 'fujin'" :showTitle="conShowTitle">
        </NearbyHall>
      </div>
    </div>
  </div>
</template>

<script>
import { isIOS, isHarmony, isApp } from "@/utils/tool";
import CommonApi from "@/api/index";
import AccountManager from "./TemplatePage/AccountManager.vue"; // 客户经理
import ZhiJiaEngineer from "./TemplatePage/ZhiJiaEngineer.vue"; // 爱家工程师
import NearbyHall from "./TemplatePage/NearbyHall.vue"; // 附近营业厅

export default {
  name: "ThreeCardEnter",
  components: {
    AccountManager,
    ZhiJiaEngineer,
    NearbyHall,
  },
  props: {},
  data() {
    return {
      twoDomShow: false, // 客户经理-爱家工程师双标签
      tabHeaderList: [],
      headerActive: "",
      tabList: [],
      tabActive: "",
      conShowTitle: true, // 标签页内是否显示自己的标题-默认显示-单卡片显示-多个卡片不显示
      managerData: null, // 客户经理信息
      engineerData: null, // 工程师信息
    };
  },
  inject: ["getSearchContent", "getSearchUUID"],
  computed: {},
  watch: {},
  created() {},
  mounted() {
    // 获取搜索关键字与三个入驻tab页的匹配
    const userInfo = localStorage.getItem("userInfo")
        ? JSON.parse(localStorage.getItem("userInfo"))
        : null;
    const version = userInfo?.version ? userInfo?.version.split("_")[1] : "";
    CommonApi.queryThreeWords({
      searchWords: this.getSearchContent(),
      cellNum: userInfo ? userInfo.phoneNumber : "",
      province: userInfo ? userInfo.loginProvince : "",
      cv: version, // 客户端版本号
      st: isHarmony() ? 10 : isIOS ? 2 : 1, // 客户端类型 1 安卓 2 ios  10 鸿蒙
      gsmState: userInfo ? userInfo.gsmState : "", // 全球通用户等级 1、全球通银卡  2、全球通金卡  3、全球通白金卡  4、全球通钻石卡（非终身）  5、全球通终身钻石卡 6、全球通客户（体验）7、其他非全球通用户
      broadbandNum: userInfo ? userInfo.phoneNumber : "",
      sceneEntry: "354",
      appId: "SEARCH_EMBED",
      telephone: userInfo ? userInfo.phoneNumber : "",
    })
      .then((enterRes) => {
        if (enterRes.code === "000000" && enterRes.data) {
          // 客户经理、爱家工程师只在已登录场景下调用和展示
          // 客户经理和爱家工程师命中且登录状态下-调用接口查询相关信息
          let isHasFlag = false;
          if (enterRes.data.accountManager || enterRes.data.engineer) {
            isHasFlag = true;
          }
          const userInfo = localStorage.getItem("userInfo")
            ? JSON.parse(localStorage.getItem("userInfo"))
            : null;
          // 全球通用户再去请求客户经理信息--但因为客户经理和爱家工程师机接口杂糅--依然要去调用后端接口--添加全球通标识字段
          // 附近营业厅未登录和已登录场景下均调用和展示，接口返回异常时不展示
          if (isHasFlag && userInfo?.phoneNumber) {
            // 获取合大三个入驻信息的查询结果
            this.gethreeEntries(enterRes.data.nearbyBusinessHall);
          } else if (enterRes.data.nearbyBusinessHall) {
            this.onlyInitHall();
          }
        } else {
          console.log("三查询内容与三个入驻的匹配查询失败==>");
        }
      })
      .catch((error) => {
        console.log("查询内容与三个入驻的匹配调用失败==>");
        console.log(error);
      });
  },
  methods: {
    handleChange(indexFlag, tabFlag) {
      // 修改tab头部样式
      this.headerActive = indexFlag;
      // 修改激活tab的样式
      // 修改内容区域展示
      this.tabActive = tabFlag;

      // 切换时插码上报
      const areaNameObj = {
        kehu: "客户经理",
        zhijia: "爱家工程师",
        fujin: "附近营业厅",
      };
      const clickGdpObj = {
        XY_transaction_id: this.getSearchUUID(),
        WT_et: "clk",

        WT_envName: areaNameObj[tabFlag],
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
        WT_area_name: `AI智答_${areaNameObj[tabFlag]}`, // AI智答_[三个入驻分类tab名称]
        XY_env_type: "tab",
        WT_event: "",
        XY_gd_source: "",
        XY_scene: this.getSearchContent() || "", // 搜索内容
        WT_si_n: "", // 物品对应的名称
        WT_goods_id: "", // 物品所对应的id信息
        XY_visit_source: sessionStorage.pageEntrance || "", // 访问来源
        WT_charge_phone: "",
        WT_errCode: "",
        WT_errMsg: "",
        XY_env_extend_attribute: "",
      };
      console.log("结果页-三个入驻-tab点击上报===>");
      console.log(clickGdpObj);
      if (isApp()) {
        gdp("track", "clk", clickGdpObj);
      }
    },

    // 合大客户经理+爱家工程师入驻信息
    gethreeEntries(hallFlag) {
      const userInfo = localStorage.getItem("userInfo")
        ? JSON.parse(localStorage.getItem("userInfo"))
        : null;
      const version = userInfo?.version ? userInfo?.version.split("_")[1] : "";
      console.log("版本信息===>", version);

      CommonApi.queryThreeEntries({
        searchWords: this.getSearchContent(),
        cellNum: userInfo ? userInfo.phoneNumber : "",
        province: userInfo ? userInfo.loginProvince : "",
        cv: version, // 客户端版本号
        st: isHarmony() ? 10 : isIOS ? 2 : 1, // 客户端类型 1 安卓 2 ios  10 鸿蒙
        gsmState: userInfo ? userInfo.gsmState : "", // 全球通用户等级 1、全球通银卡  2、全球通金卡  3、全球通白金卡  4、全球通钻石卡（非终身）  5、全球通终身钻石卡 6、全球通客户（体验）7、其他非全球通用户
        broadbandNum: userInfo ? userInfo.phoneNumber : "",
        sceneEntry: "354",
        appId: "SEARCH_EMBED",
        telephone: userInfo ? userInfo.phoneNumber : "",
      })
        .then((enterRes) => {
          if (enterRes.code === "000000" && enterRes.data) {
            // 客户经理
            if (enterRes.data.accountManager) {
              this.managerData = enterRes.data.accountManager;
              this.tabList.push({
                activeTab: "kehu",
                icon: "kehu-icon",
                activeClass: "kehu-active",
                normalClass: "kehu-normal",
              });
            }
            // 爱家工程师
            if (enterRes.data.engineer) {
              this.engineerData = enterRes.data.engineer;
              this.tabList.push({
                activeTab: "zhijia",
                icon: "zhijia-icon",
                activeClass: "zhijia-active",
                normalClass: "zhijia-normal",
              });
            }
            // 附近营业厅
            if (hallFlag) {
              this.tabList.push({
                activeTab: "fujin",
                icon: "fujin-icon",
                activeClass: "fujin-active",
                normalClass: "fujin-normal",
              });
            }
            this.tabActive = this.tabList[0].activeTab;
            this.headerActive = 0;
            if (this.tabList.length > 1) {
              this.conShowTitle = false;
            } else {
              this.conShowTitle = true;
            }
            if (this.tabList.length === 2) {
              this.tabHeaderList = ["two-left", "two-right"];
            }
            if (this.tabList.length === 3) {
              this.tabHeaderList = [
                "three-left",
                "three-center",
                "three-right",
              ];
            }
          } else {
            console.log("入驻信息查询失败==>");
            // 附近营业厅
            if (hallFlag) {
              this.onlyInitHall();
            }
          }
        })
        .catch((error) => {
          console.log("入驻信息调用失败==>");
          console.log(error);
          // 附近营业厅
          if (hallFlag) {
            this.onlyInitHall();
          }
        });
    },

    // 只匹配到了附近营业厅
    onlyInitHall() {
      this.conShowTitle = true;
      this.tabActive = "fujin";
    },

    // 更新客户经理的预约状态
    updateManager() {
      this.$nextTick(() => {
        console.log(this.$refs.managerRef);
        if (this.$refs.managerRef) {
          this.$refs.managerRef?.updateAppointment();
        }
      });
    },
  },
};
</script>

<style scoped lang='scss'>
.three-wrap {
  margin: 0;
  padding: 0;
  box-sizing: border-box;

  .three-tab {
    background: #ffffff;
    box-shadow: 0px 4px 20px 0px #f6f6f6;
    border-radius: 18px;
    padding: 0px 0px 0px 0px;
    margin-bottom: 18px;

    .tab-header {
      width: 100%;
      height: 91px;
      display: flex;
      justify-content: space-between;
      background-color: #fbfbfb;
      border-radius: 18px 18px 0 0;
    }

    .two-left {
      background-image: url("../../assets/images/two-left.png");
      background-position: center top;
      background-size: 100% 100%;
    }

    .two-right {
      background-image: url("../../assets/images/two-right.png");
      background-position: center top;
      background-size: 100% 100%;
    }

    .three-left {
      background-image: url("../../assets/images/three-left.png");
      background-position: center top;
      background-size: 100% 100%;
    }

    .three-center {
      background-image: url("../../assets/images/three-center.png");
      background-position: center top;
      background-size: 100% 100%;
    }

    .three-right {
      background-image: url("../../assets/images/three-right.png");
      background-position: center top;
      background-size: 100% 100%;
    }

    .header-item {
      height: 92px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding-bottom: 16px;
    }

    .header-active {
      padding-bottom: 12px;
    }

    .kehu-icon {
      width: 130px;
      height: 40px;
    }

    .zhijia-icon {
      width: 160px;
      height: 40px;
    }

    .fujin-icon {
      width: 160px;
      height: 40px;
    }

    .kehu-active {
      background-image: url("../../assets/images/kehu-active.png");
      background-position: center top;
      background-size: 100% 100%;
    }

    .kehu-normal {
      background-image: url("../../assets/images/kehu-normal.png");
      background-position: center top;
      background-size: 100% 100%;
    }

    .zhijia-active {
      background-image: url("../../assets/images/zhijia-active.png");
      background-position: center top;
      background-size: 100% 100%;
    }

    .zhijia-normal {
      background-image: url("../../assets/images/zhijia-normal.png");
      background-position: center top;
      background-size: 100% 100%;
    }

    .fujin-active {
      background-image: url("../../assets/images/yyt-active.png");
      background-position: center top;
      background-size: 100% 100%;
    }

    .fujin-normal {
      background-image: url("../../assets/images/yyt-normal.png");
      background-position: center top;
      background-size: 100% 100%;
    }
  }
}
</style>
