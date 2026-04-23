<template>
  <div class="hot-search">
    <InnerLoading ref="loading" />
    <div class="item-con">
      <div
        class="item"
        v-for="(item, index) in hotData"
        :key="index"
        @click="jumpPage(item, index)"
      >
        <div class="serial">
          <img
            :src="require('@/assets/images/number' + (index + 1) + '.png')"
            draggable="false"
            alt=""
          />
        </div>
        <div class="content">{{ item.title }}</div>
        <div class="index">
          <span class="left">{{ item.num ? "指数" : "" }}</span>
          <span class="right">{{ item.num }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CommonApi from "@/api/index";
import {
  isApp,
  updateHistoryData,
  goPage,
  goPageUrl,
  getDefaultPageLocalInfo,
} from "@/utils/tool";
import { rmssData } from "./HomeNewPhoneList"; // 新版首页热门搜索兜底数据
import InnerLoading from "./InnerLoading.vue";

export default {
  name: "HotSearchNew",
  components: {
    InnerLoading,
  },
  data() {
    return {
      mockRMSSData: null, // 热门搜索兜底数据
      pageEntrance: null,
      param: {
        provinceCode: "571", // 省编码
        cityCode: "0000", // 市编码
        cv: "7.9.0", // 客户端版本号
        st: "1", // 系统类型
        cellNum: "19805289925", // 登录手机号码
        pageEntrance: "1", // 页面入口枚举,1:普通版首页,2:PLUS 版首页,3:全球通首页,4:动感地带首页,5:分类页,6:权益页,7:探索页,8:商城页
        loginProvince: "", // 用户归属地-省份
        loginCity: "", // 用户归属地-地市
      },
      hotData: [],
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
    impAttrsHot: {
      type: Object,
      default: () => {},
    },
  },
  watch: {},
  mounted() {
    // 承接异常兜底数据
    this.mockRMSSData = JSON.parse(JSON.stringify(rmssData));

    const userInfo = localStorage.getItem("userInfo")
      ? JSON.parse(localStorage.getItem("userInfo"))
      : null;
    const pageEntrance = sessionStorage.getItem("pageEntrance");
    this.pageEntrance = pageEntrance;

    this.param = {
      provinceCode: userInfo?.province || "",
      cityCode: userInfo?.city || "",
      cv: userInfo?.version ? `10_10,${userInfo.version}` : "10_10",
      st: userInfo?.st || "",
      cellNum: userInfo?.phoneNumber || "",
      pageEntrance,
      loginProvince:
        userInfo?.loginProvince ||
        (userInfo?.province ? userInfo?.province : ""), // 省份参数兜底优化
      loginCity: userInfo?.loginCity || "",
    };

    // 获取缓存信息
    const localRmssData = getDefaultPageLocalInfo("local_default_rmss");
    const nowTime = Date.now();
    // 本地存储有效 使用本地存储信息渲染页面
    if (localRmssData && localRmssData.expiredTime > nowTime) {
      this.handleRMSSData(localRmssData, false);
      console.log("热门搜索--缓存有效期内使用缓存信息--不再请求接口");
    } else {
      // 获取热门搜索数据
      this.getHotSearchData();
    }
  },
  methods: {
    // 获取热门搜索数据
    getHotSearchData() {
      // 显示加载效果
      this.$refs.loading.loadingShow();
      try {
        CommonApi.hotSearch(this.param)
          .then((res) => {
            if (res.code === "000000") {
              if (res.data && res.data.length > 0) {
                // 分页面入口存储
                const setKey = `local_default_rmss_${this.param.loginProvince}_${this.param.pageEntrance}`;
                localStorage.setItem(
                  setKey,
                  JSON.stringify({
                    ...res,
                    expiredTime: Date.now() + 5 * 60 * 1000,
                  })
                );
                // 渲染页面
                this.handleRMSSData(res, true);
              }
            } else {
              console.log("热门搜索接口查询失败");
              this.dataErrorHandle();
            }
          })
          .catch((error) => {
            console.log("热门搜索接口失败");
            console.log(error);
            this.dataErrorHandle();
          });
      } catch (error) {
        console.log("热门搜索接口调用失败");
        console.log(error);
        this.dataErrorHandle();
      }
    },

    handleRMSSData(resObj, gdpFlag) {
      const resHotData = resObj.data;
      resHotData.forEach((ele, index) => {
        if (ele.num) {
          const temp = ele.num / 10000;
          const tempArr = temp.toString().split(".");
          resHotData[index].num =
            tempArr.length === 1
              ? `${tempArr[0]}W`
              : `${Math.ceil(temp * 10) / 10}W`;
        }
      });
      this.hotData = resHotData;

      // 处理曝光插码上报--tab切换一次发一次-会导致曝光数据过多
      // 修改为请求数据才上报--使用缓存（5分钟内）更新页面不上报
      if (gdpFlag) {
        this.handleGdpImp(resHotData);
      }

      this.$refs.loading.loadingHide();
    },

    // 曝光插码上报
    handleGdpImp(renderData) {
      for (let index = 0; index < renderData.length; index++) {
        const impGdpObj = {
          XY_transaction_id: this.getSearchUUID(),
          WT_et: "imp",
          WT_envName: renderData[index].title,
          WT_markId: "",
          XY_point_position: index + 1,
          XY_first_class: "搜索默认页",
          XY_second_class: "热门搜索",
          WT_next_url: renderData[index].addressUrl
            ? renderData[index].addressUrl
            : "",
          WT_plat: sessionStorage.pagePlat || "",
          WT_es: sessionStorage.pageUrl || "",
          WT_ti: "搜索默认页",
          XY_pageEntry: sessionStorage.pageEntrance || "",
          // 插码方案修改2025-1-16
          WT_area_type_1: "楼层",
          areaid: "", // [区域id_模板id]
          WT_area_type_2: "tab页",
          WT_area_name: "热门搜索",
          XY_env_type: "button",
          WT_event: renderData[index].addressUrl ? "" : "P00000049488", // 点击进入搜索结果页，则作为搜索词上报传P00000049488；若点击进入详情页，则传空
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

    // 数据接口请求异常执行方法
    dataErrorHandle() {
      const localRmssData = getDefaultPageLocalInfo("local_default_rmss");
      this.$refs.loading.loadingHide();
      if (localRmssData) {
        this.handleRMSSData(localRmssData, true);
      } else {
        console.error("数据接口请求异常执行--也没有缓存--使用兜底数据");
        this.handleRMSSData(this.mockRMSSData, true);
      }
    },

    jumpPage(item, index) {
      console.log("首页重构-热门搜索点击====>");
      console.log(item);
      const clickGdpObj = {
        XY_transaction_id: this.getSearchUUID(),
        WT_et: "clk",
        WT_envName: item.title,
        WT_markId: "",
        XY_point_position: index + 1,
        XY_first_class: "搜索默认页",
        XY_second_class: "热门搜索",
        WT_next_url: item.addressUrl ? item.addressUrl : "",
        WT_plat: sessionStorage.pagePlat || "",
        WT_es: sessionStorage.pageUrl || "",
        WT_ti: "搜索默认页",
        XY_pageEntry: sessionStorage.pageEntrance || "",
        // 插码方案修改2025-1-16
        WT_area_type_1: "楼层",
        areaid: "", // [区域id_模板id]
        WT_area_type_2: "tab页",
        WT_area_name: "热门搜索",
        XY_env_type: "button",
        WT_event: item.addressUrl ? "" : "P00000049488", // 点击进入搜索结果页，则作为搜索词上报传P00000049488；若点击进入详情页，则传空
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
      console.log("默认页-热门搜索tab-数据点击上报===>");
      console.log(clickGdpObj);
      if (isApp()) {
        gdp("track", "clk", clickGdpObj);
      }
      let hisData = {
        markName: item.title,
        actionUrl: item?.addressUrl || "",
        actionType: item?.actionType || "",
      };
      updateHistoryData(this.pageEntrance, hisData);

      if (item.addressUrl) {
        // 需要区分是两级来的数据 还是 补全的物品数据
        // 原全网热搜两级数据与旧版全网热搜数据同样跳转逻辑 使用goPage跳转
        // 补全物品数据与搜索结果页数据同样跳转逻辑 使用goPageUrl跳转
        this.handleBlur();
        if (item.originType === 1) {
          // 两级
          goPage(item.actionType, item.addressUrl);
        } else if (item.originType === 2) {
          // 补录
          goPageUrl("2", item.addressUrl);
        }
      } else {
        this.updateSearchContent(item.title);
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
  background: linear-gradient(180deg, #fff3f3 0%, #ffffff 120px);
  border-radius: 18px;
  border: 1px solid #ffe8e8;
  padding: 54px 38px 54px 28px;
  min-height: 400px;
  position: relative;

  .item-con {
    display: flex;
    flex-direction: column;
    font-size: 28px;
    font-weight: 400;
    color: #000000;
    z-index: 1;

    .item {
      display: flex;
      align-items: center;
      margin-bottom: 56px;

      .serial {
        height: 33px;
        display: flex;
        align-items: center;
        margin-right: 16px;

        img {
          height: 33px;
        }
      }

      .content {
        flex: 1;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      .index {
        font-size: 22px;
        font-weight: 400;
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
</style>
