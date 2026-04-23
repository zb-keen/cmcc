<template>
  <div class="operation-carousel">
    <!-- 骨架屏加载效果 -->
    <van-skeleton :row="3" :loading="loading" class="operation-skeleton">
      <div v-if="groups && groups.length">
        <van-swipe
          :autoplay="3000"
          :show-indicators="false"
          class="operation-swipe"
          @change="onSwipeChange"
        >
          <van-swipe-item v-for="(group, idx) in groups" :key="idx">
            <div
              class="operation-group"
              :style="{ backgroundImage: `url(${group.bg})` }"
            >
              <div
                class="jump-points"
                :class="
                  group.points.length == 3 ? 'three-points' : 'two-points'
                "
              >
                <a
                  v-for="(point, pIdx) in group.points"
                  :key="pIdx"
                  @click="handleJump(point, pIdx, idx)"
                  class="jump-point image-only"
                >
                  <div class="jump-point-content">
                    <img :src="point.img" alt="" />
                    <!-- <span v-if="point.type === 'image-text'" class="jump-point-title">{{ point.title }}</span> -->
                  </div>
                </a>
              </div>
            </div>
          </van-swipe-item>
        </van-swipe>
        <!-- 自定义指示器 -->
        <div class="custom-indicator">
          <div
            v-for="(_, index) in groups"
            :key="index"
            :class="{ active: currentIndex === index }"
            class="indicator-dot"
          ></div>
        </div>
      </div>
    </van-skeleton>
  </div>
</template>

<script>
import {
  isApp,
  handleGetUrlParam,
  getQueryStringNew,
  // handleZoneData,
  handleSlotZone,
  goPageUrl,
  isProtogenesisSkip,
  goProtogenesisPage,
  checkoutKeywordsToSession,
} from "@/utils/tool";
import CommonApi from "@/api/index";

export default {
  name: "OperatingPosition",
  inject: ["getSearchUUID", "getSearchContent", "getCorrectionFlag", "userLoginState"],
  data() {
    return {
      currentIndex: 0,
      groups: [],
      loading: true, // 添加加载状态控制
    };
  },
  created() {
    this.getOperatingPositions();
  },
  methods: {
    onSwipeChange(index) {
      this.currentIndex = index;
    },

    handleJump(item, index, categoryIndex) {
      // 处理运营位点击插码上报
      const yywClkGdpObj = {
        XY_transaction_id: this.getSearchUUID(),
        WT_et: "clk",
        WT_envName: "",
        WT_markId: "",
        XY_point_position: categoryIndex * 3 + index + 1,
        XY_first_class: "搜索结果页",
        XY_second_class: "",
        WT_next_url: item.linkAdress,
        WT_plat: sessionStorage.pagePlat || "",
        WT_es: sessionStorage.pageUrl || "",
        WT_ti: "搜索结果页",
        XY_pageEntry: sessionStorage.pageEntrance || "",
        // 插码方案修改2025-1-16
        WT_area_type_1: "楼层",
        areaid: "", // [区域id_模板id]
        WT_area_type_2: "全部",
        WT_area_name: "运营位",
        XY_env_type: "button",
        WT_event: "",
        XY_gd_source: "", // [如果source=qqd，传qqd；如果source=app，传app]
        XY_scene: this.getSearchContent(), // 搜索内容
        WT_si_n: "", // 物品对应的名称
        WT_goods_id: "", // 物品所对应的id信息
        XY_visit_source: sessionStorage.pageEntrance || "", // 访问来源
        WT_charge_phone: "",
        WT_errCode: "",
        WT_errMsg: "",
        XY_env_extend_attribute: "",
      };
      console.log("结果页-运营位优化--点击上报===>");
      console.log(yywClkGdpObj);
      if (isApp()) {
        gdp("track", "clk", yywClkGdpObj);
      }

      if (isProtogenesisSkip(item)) {
        goProtogenesisPage(item.linkAdress1);
      } else {
        goPageUrl(item.jumpType, item.linkAdress);
      }
    },

    // 将数据处理逻辑抽象为单独的函数
    processOperatingPositionsData(result) {
      console.log("Processing data:", result);
      if (!result || !result.length) {
        console.log("Result is empty or not an array");
        return [];
      }

      // 找到categoryCode为CSRDC_ALL的对象
      const allCategory = result.find(
        (item) => item.categoryCode === "CSRDC_ALL"
      );
      console.log("CSRDC_ALL category:", allCategory);

      if (!allCategory || !allCategory.data || !allCategory.data.length) {
        console.log("No data found in CSRDC_ALL category");
        return [];
      }

      // 处理数据转换为组件需要的格式
      const processedData = allCategory.data.map((item, categoryIndex) => {
        console.log("Processing item:", item);
        const images = item.iconUrl ? item.iconUrl.split(",") : []; //分隔数据
        const bg = images.length > 0 ? images[0] : ""; // 使用第一个图片作为背景图
        const imagesUrl =
          images.length > 0 ? images.filter((item, index) => index > 0) : []; // 过滤掉第一个图片
        const linkAdress1 = item.linkAdress1 ? item.linkAdress1.split(",") : []; // 处理linkAdress1数据
        const jumpType = item.jumpType ? item.jumpType.split(",") : []; // 处理jumpType数据
        const jumpType1 = item.jumpType1 ? item.jumpType1.split(",") : []; // 处理jumpType1数据
        const iosVersion1 = item.iosVersion1 ? item.iosVersion1.split(",") : []; // 处理iosVersion1数据
        const androidVersion1 = item.androidVersion1
          ? item.androidVersion1.split(",")
          : []; // 处理androidVersion1数据
        const itemId = item.itemId || ""; // 处理itemId数据
        const linkAdress = item.linkAdress ? item.linkAdress.split(",") : []; // 处理linkAdress数据
        const _that = this;

        const points =
          imagesUrl.length > 0
            ? imagesUrl.map((img, index) => {
                // 滑动运营位数据最多展示3个
                if (categoryIndex < 3) {
                  // 处理运营位曝光插码上报
                  const yywImpGdpObj = {
                    XY_transaction_id: _that.getSearchUUID(),
                    WT_et: "imp",
                    WT_envName: "",
                    WT_markId: "",
                    XY_point_position: categoryIndex * 3 + index + 1,
                    XY_first_class: "搜索结果页",
                    XY_second_class: "",
                    WT_next_url: linkAdress[index],
                    WT_plat: sessionStorage.pagePlat || "",
                    WT_es: sessionStorage.pageUrl || "",
                    WT_ti: "搜索结果页",
                    XY_pageEntry: sessionStorage.pageEntrance || "",
                    // 插码方案修改2025-1-16
                    WT_area_type_1: "楼层",
                    areaid: "", // [区域id_模板id]
                    WT_area_type_2: "全部",
                    WT_area_name: "运营位",
                    XY_env_type: "button",
                    WT_event: "",
                    XY_gd_source: "", // [如果source=qqd，传qqd；如果source=app，传app]
                    XY_scene: _that.getSearchContent(), // 搜索内容
                    WT_si_n: "", // 物品对应的名称
                    WT_goods_id: "", // 物品所对应的id信息
                    XY_visit_source: sessionStorage.pageEntrance || "", // 访问来源
                    WT_charge_phone: "",
                    WT_errCode: "",
                    WT_errMsg: "",
                    XY_env_extend_attribute: "",
                  };
                  console.log("结果页-运营位优化--曝光上报===>");
                  console.log(yywImpGdpObj);
                  if (isApp()) {
                    gdp("track", "imp", yywImpGdpObj);
                  }
                }

                return {
                  img,
                  itemId: itemId,
                  linkAdress: linkAdress[index] || "",
                  linkAdress1: linkAdress1[index] || "",
                  jumpType: jumpType[index] || "",
                  jumpType1: jumpType1[index] || "",
                  iosVersion1: iosVersion1[index] || "",
                  androidVersion1: androidVersion1[index] || "",
                };
              })
            : [];

        return {
          itemId: itemId,
          bg,
          points,
        };
      });

      console.log("Processed data:", processedData);
      // 限制最多返回3个groups
      return processedData.slice(0, 3);
    },
    async getOperatingPositions() {
      this.loading = true; // 开始加载时设置为true
      const correctionFlag = this.getCorrectionFlag();
      const searchContent = this.getSearchContent();
      try {
        let getUrlParam = handleGetUrlParam();
        let pageEntrance = getQueryStringNew().pageEntrance;
        let paramData = {
          params: {
            keyWord: "",
          },
        };
        const userInfo = localStorage.getItem("userInfo")
          ? JSON.parse(localStorage.getItem("userInfo"))
          : null;
        paramData.page = 1;
        paramData.size = 50; // 多请求一些
        paramData.provCode = getUrlParam.provCode;
        // paramData.clientVersion = getUrlParam.clientVersion;
        paramData.clientVersion = userInfo?.version
          ? `10_10,${userInfo?.version}`
          : "10_10";
        paramData.beans = getUrlParam.beans;
        paramData.entryPage = pageEntrance;
        paramData.loginProvince = getUrlParam.loginProvince;
        paramData.loginCity = getUrlParam.loginCity;
        paramData.params.keyWord = searchContent;
        paramData.phoneNum = userInfo?.phoneNumber || "";
        paramData.cid = userInfo?.cid || "";
        paramData.xk = userInfo?.xk || "";
        paramData.osType = userInfo?.osType || ""; // android和ios
        let iopResultRes =
          checkoutKeywordsToSession(searchContent, 2) != "999999"
            ? checkoutKeywordsToSession(searchContent, 2)
            : null;
        paramData.iopResult = iopResultRes;
        paramData.correctionFlag = correctionFlag;
        paramData.cityCode = userInfo?.city || "";
        paramData.queryType = "9";
        paramData.userState = this.userLoginState();
        console.log("运营位zone传参===>", paramData);

        return new Promise((resolve, reject) => {
          // 先清除之前的缓存
          CommonApi.queryZone(paramData)
            .then((res) => {
              console.log("运营位专区接口数据===>", res);

              if (res.code == "000000") {
                let searchZoneResult = [];
                if (
                  res.data &&
                  res.data.isCardSlot &&
                  res.data.isCardSlot === "1"
                ) {
                  // 卡槽精准工单为1
                  // let isCardPermission = '0'
                  // 调取获取卡槽信息
                  handleSlotZone(true)
                    .then((status) => {
                      console.log(status, "获取卡槽授权状态");
                      const cardParams = JSON.parse(JSON.stringify(paramData));
                      cardParams["isCardPermission"] = status;
                      const voData = JSON.parse(JSON.stringify(res.data));
                      delete voData.isCardSlot;
                      cardParams["appCardslotVO"] = voData;
                      console.log("获取卡槽工单传参===>", cardParams);
                      // 获取带有卡运营位专区列表
                      CommonApi.queryCardslotZone(cardParams).then(
                        (cardRes) => {
                          console.log("获取运营位卡槽工单结果====>", cardRes);
                          if (cardRes.code == "000000") {
                            searchZoneResult = cardRes.data.result;
                            this.groups =
                              this.processOperatingPositionsData(
                                searchZoneResult
                              );
                            // handleZoneData(
                            //   searchZoneResult,
                            //   cardRes,
                            //   paramData,
                            //   searchContent
                            // );
                            resolve(cardRes);
                            // 防截屏/录屏
                            // getRecordingOrScreenshotStatus(searchZoneResult)
                          } else {
                            resolve(cardRes);
                          }
                        }
                      );
                    })
                    .catch((err) => {
                      console.log(err, "运营位卡槽授权失败");
                    });
                } else {
                  if (res.data && res.data.result) {
                    searchZoneResult = res.data.result;
                    this.groups =
                      this.processOperatingPositionsData(searchZoneResult);
                  }
                  // handleZoneData(
                  //   searchZoneResult,
                  //   res,
                  //   paramData,
                  //   searchContent
                  // );
                  resolve(res);
                }
              } else {
                resolve(res);
              }
            })
            .catch((err) => {
              resolve();
              console.log("handleQuerySearchZone接口调用失败", err);
            });
        });
      } catch (error) {
        console.error("获取运营位数据失败:", error);
        this.groups = [];
      } finally {
        this.loading = false; // 无论成功或失败，加载完成后设置为false
      }
    },
  },
};
</script>

<style scoped lang="scss">
.operation-carousel {
  width: 100%;
  margin: 0 auto;
  position: relative;
}

.operation-swipe {
  width: 100%;
  height: 160px;
}

.operation-group {
  width: 100%;
  height: 160px;
  background-size: cover;
  background-position: center;
  position: relative;
  display: flex;
  align-items: center;
  border-radius: 18px;
}

.jump-points {
  display: flex;
  gap: 6px;
  position: absolute;
  right: 38px;
  top: 10px;
  height: 140px;
  align-items: center;
  &.three-points {
    gap: 6px;
    right: 24px;
  }
  &.two-points {
    gap: 60px;
    right: 60px;
  }
}

.jump-point {
  width: 120px;
  height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
}

.jump-point-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.jump-point.image-only img {
  width: 120px;
  height: 140px;
  border-radius: 8px;
  object-fit: cover;
}

.jump-point-title {
  font-size: 22px;
  color: #333;
  text-align: center;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 自定义指示器样式 */
.custom-indicator {
  position: absolute;
  bottom: 18px;
  left: 41px;
  display: flex;
  align-items: center;
}

.indicator-dot {
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: #d3e9ff;
  margin-right: 6px;
  transition: all 0.3s;
}

.indicator-dot.active {
  width: 18px;
  height: 9px;
  border-radius: 5px;
  background: linear-gradient(270deg, #007eff 0%, #2892ff 100%);
}

/* 骨架屏样式 */
.operation-skeleton {
  width: 100%;
  height: 160px;
  border-radius: 18px;
  overflow: hidden;

  .van-skeleton__row,
  .van-skeleton__title {
    background-color: #fff;
  }
}
</style>
