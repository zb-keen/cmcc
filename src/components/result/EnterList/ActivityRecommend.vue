<template>
  <div v-show="recommendList.length > 0" class="recommend-wrap">
    <div class="recommend-title">
      <div class="recommend-t-left">活动推荐</div>
    </div>
    <div class="recommend-content">
      <template v-for="(recommendItem, recommendIndex) in recommendList">
        <div
          :key="recommendIndex"
          class="recommend-item"
          @click="jumpPage(recommendItem, recommendIndex)"
        >
          <div class="content-img">
            <img :src="recommendItem.iconUrl" alt="" />
          </div>
          <div
            class="content-title"
            v-html="
              recommendItem.titleHL
                ? recommendItem.titleHL
                : recommendItem.title
            "
          ></div>
        </div>
      </template>
    </div>
    <!-- 加载中 -->
    <Loadding ref="loading" />
  </div>
</template>

<script>
import CommonApi from "@/api/index";
import {
  handleGetUrlParam,
  checkoutKeywordsToSession,
  handleSaveClickInfo,
  goPageUrl,
  isApp,
  getMap,
  mergeSearchAndZoneData,
  isProtogenesisSkip,
  goProtogenesisPage,
} from "@/utils/tool";
import Loadding from "../../Loadding.vue";

export default {
  name: "ActivityRecommend",
  components: {
    Loadding,
  },
  data() {
    return {
      borderHeight: "1px",
      tabsList: [], // tab标签数组
      enterYItemIds: [],
      recommendList: [],
    };
  },
  inject: [
    "updateSearchContent",
    "updateCurrentCom",
    "getResult",
    "handleBlur",
    "getWordType",
    "getSearchUUID",
    "updateSearchUUID",
    "updateWordType",
    "getSearchContent",
    "getSearchTabsList",
    "userLoginState",
  ],
  computed: {
    searchContent() {
      return this.getSearchContent();
    },
  },
  props: {
    enterData: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  watch: {},
  mounted() {
    console.log("活动推荐--tab标签数据===>");
    console.log(this.getSearchTabsList());
    console.log("全部页展示数据===>");
    console.log(this.enterData);
    this.enterData.map((item) => {
      this.enterYItemIds.push(item.itemId);
    });
    console.log("全部页展示数据ids===>");
    console.log(this.enterYItemIds);

    this.tabsList = this.getSearchTabsList();
    let tab = {};
    this.tabsList.forEach((item, index) => {
      if (item.wholeTemplateId == this.CONSTANTS.TEMPLATEPAGE.ACTI002) {
        tab = item;
      }
    });
    // 如果有下级分类的话==首位参数传下级subList首位分类
    if (tab.subList && tab.subList.length > 0) {
      this.handleQueryResult(
        tab.subList[0].categoryCode,
        tab.categoryCode,
        tab.subList[0].verticalTemplateId,
        "1"
      );
    } else {
      this.handleQueryResult(
        tab.categoryCode,
        tab.categoryCode,
        tab.verticalTemplateId,
        "1"
      );
    }
  },
  methods: {
    /**
     * 查询搜索结果
     * @param {*} categoryCodeIn
     * @param {*} parentCodeIn
     * @param {*} templateId
     * @param {*} type 1：从一级类目查询要清空筛选里的数据 5:只有专区有数据 6:筛选里的确认
     */
    handleQueryResult(categoryCodeIn, parentCodeIn, templateId, type) {
      let search_source_type = "2";
      console.log("全部标签页下活动推荐", search_source_type);
      const that = this;
      that.loading = true;
      // that.resultSkeletonShow = true;
      // console.log("that.totalPage"+that.totalPage);
      that.finished = false;

      that.paramData = handleGetUrlParam();
      that.paramData.sortField = that.sortField;
      that.paramData.page = 1;
      that.paramData.size = 50;
      that.latitude = sessionStorage.latitude || "";
      that.longtitude = sessionStorage.longtitude || "";
      that.paramData.location =
        that.latitude && that.longtitude
          ? `${that.latitude},${that.longtitude}`
          : "";

      that.paramData.minPrice = "";
      that.paramData.maxPrice = "";
      that.paramData.networkStd = "";
      that.paramData.buyWay = "";
      this.paramData.shopCityCode = "";

      that.paramData.categoryCode =
        categoryCodeIn == "CSRDC_ALL" ? "" : categoryCodeIn;
      that.paramData.parentCode = parentCodeIn;
      that.paramData.verticalTemplateId = templateId;
      that.paramData.params.keyWord = that.searchContent;
      let iopResultRes =
        checkoutKeywordsToSession(that.searchContent) != "999999"
          ? checkoutKeywordsToSession(that.searchContent)
          : null;
      that.paramData.iopResult = iopResultRes;
      that.configList = sessionStorage.configListSes
        ? JSON.parse(sessionStorage.configListSes)
        : {};
      const userInfo = localStorage.getItem("userInfo")
        ? JSON.parse(localStorage.getItem("userInfo"))
        : null;
      that.paramData.cityCode = userInfo?.city;

      // 去重暂行方案-start-查2倍页数
      let paramData = JSON.parse(JSON.stringify(that.paramData));
      paramData.size = Math.ceil(paramData.size * 2);
      // 去重暂行方案-end

      paramData.tranId = that.getSearchUUID();
      paramData.wordType = that.getWordType();
      paramData.searchSourceType = search_source_type;
      paramData.userState = that.userLoginState();
      paramData.birthday = userInfo?.birthday || "";

      console.log("全部标签页下活动推荐-查询传参", paramData);

      CommonApi.queryActivity(paramData)
        .then((res) => {
          this.$isDistinct = !res.data?.distinct; // 去重方法传参
          // that.loading = false;
          // that.$refs.loading.loadingHide();
          // that.resultSkeletonShow = false;

          if (res.code == "000000") {
            if (res.data.result && res.data.result.length > 0) {
              this.handleHDTJData(res);
            } else {
              // 不显示
              console.log("活动推荐查询无数据--不显示");
              this.recommendList = [];
            }
          } else {
            // 不显示
            console.log("活动推荐查询失败--不显示");
            this.recommendList = [];
          }
        })
        .catch((error) => {
          // 不显示
          console.log("活动推荐查询调用失败--不显示");
          console.log(error);
          this.recommendList = [];
        });
    },

    handleHDTJData(resObj) {
      const resHDTJData = resObj.data.result;
      console.log("活动推荐垂直页查询返回数据===>");
      console.log(resHDTJData);

      if (!resHDTJData[0].data) {
        return;
      }
      // 开始做去重处理
      // 第一步返回数据自身去重
      const firstNewData = getMap(
        resHDTJData[0].data,
        undefined,
        this.$isDistinct
      );
      console.log("第一步去重===>");
      console.log(firstNewData);
      // 第二步与全部标签页-也就是活动推荐上方活动数据比对去重 比对itemId即可
      const secondNewData = [];
      firstNewData.map((item) => {
        if (this.enterYItemIds.indexOf(item.itemId) === -1) {
          secondNewData.push(item);
        }
      });
      // 模拟第二次去重后数据
      // const secondNewData = [];
      // for (let index = 0; index < 21; index++) {
      //   secondNewData.push({
      //     iconUrl:
      //       "https://res.coc.10086.cn/res/cdn/coc1/2024/06/24/1805082750383063040/baiguoyuan.jpg",
      //     titleHL: `${index}礼<span>签到</span>赢礼礼礼礼好`,
      //   });
      // }
      console.log("第二步去重===>");
      console.log(secondNewData);

      // 第三步：链接维度去重（活动推荐自身 + 全部页已展示活动 + 专区数据）
      // 说明：mergeSearchAndZoneData 会按“先出现先保留”处理，
      // 所以把全部页已展示活动数据放在前面，活动推荐新数据放在后面，
      // 可避免活动推荐与全部页、专区出现同链接重复展示。
      const mergedActivityList = mergeSearchAndZoneData(
        [
          {
            categoryName: "ALL_PAGE_ACTIVITY",
            data: Array.isArray(this.enterData) ? this.enterData : [],
            subList: [],
          },
          {
            categoryName: "ACTIVITY_RECOMMEND",
            data: secondNewData,
            subList: [],
          },
        ],
        this.$isProvinceDistinct
      );

      const thirdNewData =
        mergedActivityList.find(
          (item) => item && item.categoryName === "ACTIVITY_RECOMMEND"
        )?.data || [];

      console.log("第三步去重（专区+全部页所有链接）===>");
      console.log(thirdNewData);

      if (thirdNewData.length > 0 && thirdNewData.length <= 5) {
        // 全量返回
        this.recommendList = thirdNewData;
        // 处理曝光插码上报
        this.handleGdpImp(thirdNewData);
      } else if (thirdNewData.length > 5 && thirdNewData.length <= 20) {
        // 随机抽取五个
        const dataArr = [];
        const randomIndex = this.generateUniqueRandomNumbers(
          5,
          0,
          thirdNewData.length - 1
        );
        console.log("随机下标===>");
        console.log(randomIndex);
        randomIndex.map((item) => {
          dataArr.push(thirdNewData[item]);
        });
        this.recommendList = dataArr;
        // 处理曝光插码上报
        this.handleGdpImp(dataArr);
      } else if (thirdNewData.length > 20) {
        const targetArr = thirdNewData.slice(10, 50);
        // 前两位固定推荐   后38位随机抽3个
        const dataArr = [];
        dataArr[0] = targetArr[0];
        dataArr[1] = targetArr[1];
        const randomIndex = this.generateUniqueRandomNumbers(
          3,
          2,
          targetArr.length - 1
        );
        console.log("随机下标===>");
        console.log(randomIndex);
        randomIndex.map((item) => {
          dataArr.push(targetArr[item]);
        });
        this.recommendList = dataArr;
        // 处理曝光插码上报
        this.handleGdpImp(dataArr);
      } else {
        console.log("返回的数据==经过自去重==外去重为空");
        this.recommendList = [];
      }
    },

    // 随机返回不重复下标
    generateUniqueRandomNumbers(count, min, max) {
      const uniqueNumbers = new Set();
      while (uniqueNumbers.size < count) {
        const randomNumber = this.getRandomInt(min, max);
        uniqueNumbers.add(randomNumber);
      }
      return Array.from(uniqueNumbers);
    },

    // 随机数
    getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
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
          XY_first_class: "搜索结果页_全部",
          XY_second_class: "活动",
          WT_next_url: renderData[index].linkAdress,
          WT_plat: sessionStorage.pagePlat || "",
          WT_es: sessionStorage.pageUrl || "",
          WT_ti: "搜索结果页",
          XY_pageEntry: sessionStorage.pageEntrance || "",
          // 插码方案修改2025-1-16
          WT_area_type_1: "楼层",
          areaid: "", // 父物品id信息（无父物品传空）
          WT_area_type_2: "全部",
          WT_area_name: "活动推荐",
          XY_env_type: "button",
          WT_event: "P00000050508", // 全部页传P00000050508 垂直页传P00000050506
          XY_gd_source: "搜索平台",
          XY_scene: this.searchContent || "", // 搜索内容
          WT_si_n: renderData[index].title, // 物品对应的名称
          WT_goods_id: renderData[index].itemId, // 物品所对应的id信息
          XY_visit_source: sessionStorage.pageEntrance || "", // 访问来源
          WT_charge_phone: "",
          WT_errCode: "",
          WT_errMsg: "",
          XY_env_extend_attribute: "",
        };
        console.log("全部页-活动推荐-数据曝光上报===>");
        console.log(impGdpObj);
        if (isApp()) {
          gdp("track", "imp", impGdpObj);
        }
      }
    },

    async jumpPage(item, index) {
      console.log("全部页-活动推荐点击====>");
      console.log(item);
      this.$refs.loading.loadingShow();

      // 点击插码上报
      const clickGdpObj = {
        XY_transaction_id: this.getSearchUUID(),
        WT_et: "clk",
        WT_envName: item.title,
        WT_markId: "",
        XY_point_position: index + 1,
        XY_first_class: "搜索结果页_全部",
        XY_second_class: "活动",
        WT_next_url: item.linkAdress,
        WT_plat: sessionStorage.pagePlat || "",
        WT_es: sessionStorage.pageUrl || "",
        WT_ti: "搜索结果页",
        XY_pageEntry: sessionStorage.pageEntrance || "",
        // 插码方案修改2025-1-16
        WT_area_type_1: "楼层",
        areaid: "", // 父物品id信息（无父物品传空）
        WT_area_type_2: "全部",
        WT_area_name: "活动推荐",
        XY_env_type: "button",
        WT_event: "P00000050508", // 全部页传P00000050508 垂直页传P00000050506
        XY_gd_source: "搜索平台",
        XY_scene: this.searchContent || "", // 搜索内容
        WT_si_n: item.title, // 物品对应的名称
        WT_goods_id: item.itemId, // 物品所对应的id信息
        XY_visit_source: sessionStorage.pageEntrance || "", // 访问来源
        WT_charge_phone: "",
        WT_errCode: "",
        WT_errMsg: "",
        XY_env_extend_attribute: "",
      };
      console.log("全部页-活动推荐-数据曝光上报===>");
      console.log(clickGdpObj);
      if (isApp()) {
        gdp("track", "clk", clickGdpObj);
      }

      await handleSaveClickInfo(item, this.searchContent).then((resolve) => {
        this.$refs.loading.loadingHide();
        if (resolve == "0") {
          // let jumpType = item.jumpType === '30' ? '5' : item.jumpType === '1' ? '4' : '1';
          // goPageUrl(item.jumpType, item.linkAdress);
          // window.location.href = item.linkAdress;
          if (isProtogenesisSkip(item)) {
            goProtogenesisPage(item.linkAdress1);
          } else {
            goPageUrl(item.jumpType, item.linkAdress);
          }
        }
      });
    },
  },
};
</script>

<style scoped lang='scss'>
.recommend-wrap {
  position: relative;
  margin: 0 40px;
  padding: 42px 0 40px 0;

  .recommend-title {
    display: flex;
    justify-content: space-between;
    font-size: 24px;
    color: #999;
    margin-bottom: 33px;

    i {
      padding-left: 6px;
      font-size: 24px;
    }

    .recommend-t-left {
      font-size: 32px;
      color: #000000;
      font-weight: 700;
      font-family: PingFangSC-Medium, sans-serif;
    }
  }

  .recommend-content {
    display: flex;
    flex-wrap: wrap;
    gap: 17px;
    // justify-content: space-between;

    .recommend-item {
      .content-img {
        width: 100px;
        height: 100px;
        border-radius: 12px;
        overflow: hidden;
        margin-bottom: 14px;
        display: flex;
        align-items: center;

        img {
          width: 100%;
          height: auto;
          border-radius: 12px;
        }
      }

      .content-title {
        width: 108px;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        font-size: 24px;
        color: #333333;
        line-height: 32px;
        text-align: left;
        font-style: normal;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        text-overflow: ellipsis;

        ::v-deep span {
          color: #2892ff !important;
        }
      }
    }
  }
}

.recommend-wrap::after {
  content: " ";
  height: v-bind(borderHeight);
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  background-color: #e5e5e5;
}

@media (-webkit-min-device-pixel-ratio: 1.5) and (-webkit-max-device-pixel-ratio: 2.49) {
  .recommend-wrap::after {
    // height: 1.3px;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }
}

@media (-webkit-min-device-pixel-ratio: 2.5) {
  .recommend-wrap::after {
    // height: 1.3px;
    -webkit-transform: scaleY(0.33);
    transform: scaleY(0.33);
  }
}
</style>
