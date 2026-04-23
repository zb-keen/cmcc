<template>
  <div class="h100">
    <traffic-peak-fallback v-if="trafficPeakFallback"  />
    <template v-else>
    <result-skeleton v-show="false"></result-skeleton>
    <van-list
      v-model="loading"
      :finished="finished"
      :finished-text="finishedText"
      @load="onLoad"
      class="class100"
    >
      <!-- <hot-selling-card-set v-if="paramData.verticalTemplateId != 'CATEALL'"
        :nowCategoryCode="categoryCode"></hot-selling-card-set> -->
      <search-zone
        ref="searchZoneRef"
        v-if="paramData.verticalTemplateId != 'CATEALL'"
        :nowCategoryCode="paramData.categoryCode"
        :nowTemplateId="paramData.verticalTemplateId"
      ></search-zone>
      <template v-if="!noDataShow">
        <div
          class="module-wrap"
          v-for="(item, index) in moreArrList"
          :key="index"
          :id="'imp-more-content_' + item.categoryCode"
        >
          <!-- <div class="m-title">
            <div class="m-t-left">{{ item.categoryName }}</div>
            <div class="m-t-right" @click="handleMore(item)"><span>更多<i class="s-iconfont ic-youjiantou"></i></span></div>
          </div> -->
          <div class="m-content">
            <div
              class="content-item"
              v-for="(itemD, indexD) in getMap(
                moreArrDataList,
                'title',
                $isDistinct
              )"
              :key="indexD"
              @click="handleClickTo(itemD, indexD)"
              imp-type="once"
              imp-track="imp"
              :imp-attrs="itemD.impAttrsList"
              :data-value="JSON.stringify(itemD.impAttrsList)"
            >
              <div class="c-i-pic">
                <!-- <img :src="itemD.iconUrl?itemD.iconUrl:item.verticalDefaultPic" draggable="false" alt=""/> -->
                <van-image
                  :src="itemD.iconUrl ? itemD.iconUrl : item.verticalDefaultPic"
                  draggable="false"
                  class="img-10"
                >
                  <template v-slot:loading>
                    <van-loading type="spinner" size="20" />
                    <!-- <img :src="item.verticalDefaultPic" draggable="false" :style="{'max-width':((offsetWidth * 48) / 750) + 'px'}" alt=""/> -->
                  </template>
                  <template v-slot:error
                    ><img
                      :src="item.verticalDefaultPic"
                      draggable="false"
                      alt=""
                  /></template>
                </van-image>
              </div>
              <div
                class="c-i-title"
                :data-value="itemD._id"
                v-html="itemD.titleHL ? itemD.titleHL : itemD.title"
              ></div>
              <!-- <div class="c-i-title" :data-value="itemD._id" v-html="itemD.subTitleHL?itemD.subTitleHL:itemD.subTitle"></div> -->
            </div>
          </div>
        </div>
      </template>
      <div v-if="finished" class="bottom-line">我是有底线的</div>
    </van-list>
    <no-data v-if="noDataShow && !searchZoneHasData" ref="noDataRef"></no-data>
    </template>
    <!-- 加载中 -->
    <Loadding ref="loading" />
  </div>
</template>

<script>
import CommonApi from "@/api/index";
import NoData from "@/components/NoData.vue";
import TrafficPeakFallback from "@/components/TrafficPeakFallback.vue";
import {
  isQueryIndexTrafficPeak,
  isQueryIndexTrafficPeakByError,
} from "@/utils/queryIndexResponse";
import {
  handleSaveClickInfo,
  handleGetUrlParam,
  goPageUrl,
  isApp,
  handleGdpImp,
  getMap,
  isProtogenesisSkip,
  goProtogenesisPage,
  mergeSearchAndZoneData
} from "@/utils/tool";
import Loadding from "../../Loadding.vue";
import SearchZone from "../TemplatePage/SearchZone.vue"; //搜索专区轮播图
import ResultSkeleton from "../ResultSkeleton.vue"; //骨架屏
import HotSellingCardSet from "../HotSellingCardSet.vue";

export default {
  name: "more-x-list",
  components: {
    Loadding,
    NoData,
    TrafficPeakFallback,
    SearchZone,
    ResultSkeleton,
    HotSellingCardSet
  },
  inject: ["getSearchContent", "getSearchUUID", "getWordType", "userLoginState", "updateRefresh"],
  computed: {
    searchContent() {
      return this.getSearchContent();
    },
  },
  watch: {
    searchContent: {
      handler(newVal, oldVal) {
        // this.paramData.params.keyWord = newVal;
        if (newVal && newVal !== oldVal) {
          // this.getData();
        }
      },
      immediate: true,
    },
  },
  data() {
    return {
      finishedText: " ",
      noDataShow: false,
      trafficPeakFallback: false,
      loading: false,
      finished: false,
      moreArrList: [],
      moreArrDataList: [],
      currentCode: "",
      totalPage: null,
      paramData: {},
      pagePage: 1,
      latitude: "",
      longtitude: "",
      offsetWidth: null,
      searchZoneHasData: false, //搜索专区有值
      resultSkeletonShow: false, //骨架屏默认展示
      getMap: getMap,
    };
  },
  props: {
    categoryCode: {
      type: String,
      default: "",
    },
  },
  watch: {
    categoryCode: {
      handler(newVal) {
        if (newVal) {
          let data = sessionStorage.searchZoneResultListSes;
          if (data && JSON.parse(data).length) {
            let index = JSON.parse(data).findIndex(
              (e) => e.categoryCode === newVal
            );
            console.log("页面切换X", index);
            this.searchZoneHasData = index !== -1;
          }
        }
      },
      immediate: true,
    },
  },
  mounted() {
    this.offsetWidth = document.body.offsetWidth;
  },
  methods: {
    onLoad() {
      if (this.totalPage) {
        if (parseInt(this.pagePage, 10) >= this.totalPage) {
          this.finished = true;
        } else {
          this.pagePage++;
          this.handleQueryResult(this.paramData.categoryCode);
        }
      } else {
        this.loading = false;
      }
    },
    handleQueryResult(categoryCodeIn, templateId) {
      let search_source_type = "2";
      console.log("搜索请求来源MoreXList", search_source_type);

      const that = this;
      that.trafficPeakFallback = false;
      // that.resultSkeletonShow = true;
      that.paramData = handleGetUrlParam();
      that.paramData.page = that.pagePage;
      that.paramData.size = 50; //一次请求多点
      that.latitude = sessionStorage.latitude || "";
      that.longtitude = sessionStorage.longtitude || "";
      that.paramData.location =
        that.latitude && that.longtitude
          ? `${that.latitude},${that.longtitude}`
          : "";
      that.paramData.categoryCode =
        categoryCodeIn == "CSRDC_ALL" ? "" : categoryCodeIn;
      that.paramData.params.keyWord = that.searchContent;

      const userInfo = localStorage.getItem("userInfo")
        ? JSON.parse(localStorage.getItem("userInfo"))
        : null;
      that.paramData.cityCode = userInfo.city;
      that.$refs.loading.loadingShow();
      that.paramData.tranId = that.getSearchUUID();
      that.paramData.wordType = that.getWordType();
      that.paramData.searchSourceType = search_source_type;
      that.paramData.userState = that.userLoginState();
      that.paramData.birthday = userInfo?.birthday || "";
      console.log("垂直页moreXList--搜索结果传参", that.paramData);

      CommonApi.queryResult(that.paramData)
        .then((res) => {
          if (isQueryIndexTrafficPeak(res)) {
            that.trafficPeakFallback = true;
            that.noDataShow = false;
            this.loading = false;
            that.$refs.loading.loadingHide();
    
            return;
          }
          that.trafficPeakFallback = false;
          this.$isDistinct = !res.data?.distinct;
          this.loading = false;
          that.$refs.loading.loadingHide();
          // that.resultSkeletonShow = false;

          if (res.code == "000000") {
            if (res.data.result && res.data.result.length > 0) {
              sessionStorage.setItem(
                "transactionIdSes",
                res.data.transactionId
              );
              that.noDataShow = false;
              // res.data.result.forEach((item)=>{
              //   if(item.data){}
              // })
              that.moreArrList = res.data.result;

              that.moreArrList.forEach((item, index) => {
                item.verticalTemplateId = templateId;

                let templateListArr = sessionStorage.templateListSes
                  ? JSON.parse(sessionStorage.templateListSes)
                  : [];
                templateListArr.forEach((itemT, indexT) => {
                  if (itemT.verticalTemplateId == templateId) {
                    item.verticalDefaultPic = itemT.verticalDefaultPic;
                  }
                });

                if (item.subList && item.subList.length > 0) {
                  item.subList.forEach((itemS, indexS) => {
                    if (categoryCodeIn == itemS.categoryCode) {
                      itemS.data.forEach((itemD, indexD) => {
                        itemD.pCode = "P00000050506";
                        itemD.parentCategoryName = itemS.categoryName;

                        that.moreArrDataList.push(itemD);
                        that.moreArrDataList.forEach((itemFi, indexFi) => {
                          // 组装触点曝光所需impAttrs参数
                          const impAttrs = {};

                          let categoryNameFlg =
                            sessionStorage.pageEntrance == "6"
                              ? "权益"
                              : sessionStorage.pageEntrance == "8"
                              ? "商城"
                              : itemFi.parentCategoryName;
                          // impAttrs.position_id = indexFi+1;
                          // impAttrs.type = "once";

                          impAttrs.WT_et = "imp";
                          impAttrs.WT_event = itemFi.pCode;
                          impAttrs.WT_envName = itemFi.title;
                          impAttrs.XY_point_position = indexFi + 1;
                          impAttrs.WT_markId = itemFi._id;
                          impAttrs.XY_first_class = categoryNameFlg;
                          // impAttrs.XY_second_class =
                          //   itemFi.parentCategoryName == itemFi.dispCategoryName
                          //     ? " "
                          //     : itemFi.dispCategoryName;
                          impAttrs.WT_next_url = itemFi.linkAdress;
                          impAttrs.WT_plat = sessionStorage.pagePlat || "";
                          impAttrs.WT_es = sessionStorage.pageUrl || "";
                          impAttrs.WT_ti = "搜索结果页";
                          impAttrs.XY_pageEntry =
                            sessionStorage.pageEntrance || ""; //新增页面入口
                          // 插码方案修改2025-1-16
                          impAttrs.XY_second_class =
                            itemFi.parentCategoryName == itemFi.dispCategoryName
                              ? " "
                              : itemFi.dispCategoryName;
                          impAttrs.WT_area_type_1 = "楼层";
                          impAttrs.areaid = ""; // 父物品id信息（无父物品传空）
                          impAttrs.WT_area_type_2 = itemFi.parentCategoryName;
                          impAttrs.WT_area_name = itemFi.dispCategoryName; // 若没有二级分类，此名称则记录为一级分类名称
                          impAttrs.XY_env_type = "icon";
                          impAttrs.XY_gd_source = "搜索平台";
                          impAttrs.XY_scene = this.getSearchContent() || ""; // 搜索内容
                          impAttrs.WT_si_n = itemFi.title; // 物品对应的名称
                          impAttrs.WT_goods_id = itemFi.itemId; // 物品所对应的id信息
                          impAttrs.XY_visit_source =
                            sessionStorage.pageEntrance || ""; // 访问来源
                          // impAttrs.XY_transaction_id = that.getSearchUUID(); // 这里没有设置XY_transaction_id 是在上报传参时统一设置了

                          itemFi.impAttrsList = impAttrs;
                        });
                      });
                    }
                  });
                } else {
                  item.data.forEach((itemD, indexD) => {
                    itemD.pCode = "P00000050506";
                    itemD.parentCategoryName = item.categoryName;

                    that.moreArrDataList.push(itemD);
                    that.moreArrDataList.forEach((itemFi, indexFi) => {
                      // 组装触点曝光所需impAttrs参数
                      const impAttrs = {};

                      let categoryNameFlg =
                        sessionStorage.pageEntrance == "6"
                          ? "权益"
                          : sessionStorage.pageEntrance == "8"
                          ? "商城"
                          : itemFi.parentCategoryName;
                      // impAttrs.position_id = indexFi+1;
                      // impAttrs.type = "once";

                      impAttrs.WT_et = "imp";
                      impAttrs.WT_event = itemFi.pCode;
                      impAttrs.WT_envName = itemFi.title;
                      impAttrs.XY_point_position = indexFi + 1;
                      impAttrs.WT_markId = itemFi._id;
                      impAttrs.XY_first_class = categoryNameFlg;
                      // impAttrs.XY_second_class =
                      //   itemFi.parentCategoryName == itemFi.dispCategoryName
                      //     ? " "
                      //     : itemFi.dispCategoryName;
                      impAttrs.WT_next_url = itemFi.linkAdress;
                      impAttrs.WT_plat = sessionStorage.pagePlat || "";
                      impAttrs.WT_es = sessionStorage.pageUrl || "";
                      impAttrs.WT_ti = "搜索结果页";
                      impAttrs.XY_pageEntry = sessionStorage.pageEntrance || ""; //新增页面入口
                      // 插码方案修改2025-1-16
                      impAttrs.XY_second_class =
                        itemFi.parentCategoryName == itemFi.dispCategoryName
                          ? " "
                          : itemFi.dispCategoryName;
                      impAttrs.WT_area_type_1 = "楼层";
                      impAttrs.areaid = ""; // 父物品id信息（无父物品传空）
                      impAttrs.WT_area_type_2 = itemFi.dispCategoryName;
                      impAttrs.WT_area_name = itemFi.dispCategoryName; // 若没有二级分类，此名称则记录为一级分类名称
                      impAttrs.XY_env_type = "icon";
                      impAttrs.XY_gd_source = "搜索平台";
                      impAttrs.XY_scene = this.getSearchContent() || ""; // 搜索内容
                      impAttrs.WT_si_n = itemFi.title; // 物品对应的名称
                      impAttrs.WT_goods_id = itemFi.itemId; // 物品所对应的id信息
                      impAttrs.XY_visit_source =
                        sessionStorage.pageEntrance || ""; // 访问来源
                      // impAttrs.XY_transaction_id = that.getSearchUUID(); // 这里没有设置XY_transaction_id 是在上报传参时统一设置了

                      itemFi.impAttrsList = impAttrs;
                    });
                  });
                }
              });
              that.totalPage = res.data?.pageCount;
              if (parseInt(that.pagePage, 10) >= that.totalPage) {
                that.finished = true;
              }

              if (this.$isProvinceDistinct) {
                // 水平页去重：直接对当前批次分组数据去重
                that.moreArrList = mergeSearchAndZoneData(that.moreArrList, this.$isProvinceDistinct);

                // 按当前分类重建横向展示平铺数据
                that.moreArrDataList = [];
                that.moreArrList.forEach((item) => {
                  if (item.subList && item.subList.length > 0) {
                    item.subList.forEach((itemS) => {
                      if (categoryCodeIn == itemS.categoryCode && itemS.data) {
                        that.moreArrDataList.push(...itemS.data);
                      }
                    });
                  } else if (item.data) {
                    that.moreArrDataList.push(...item.data);
                  }
                });
                console.log("moreArrDataList去重结束", that.moreArrDataList);
              }

              //分页曝光-不重复曝光
              const arr = that.moreArrDataList;
              // 定义每页显示的数量
              const arrpageSize = 50;
              // 定义要显示的页数
              const pageNumber = that.pagePage;
              // 计算起始位置和结束位置
              const startIndex = (pageNumber - 1) * arrpageSize;
              const endIndex = pageNumber * arrpageSize;
              let impArrDataList = arr.slice(startIndex, endIndex);
              this.$nextTick(() => {
                /**
                 * 埋点-插码-上报
                 * 曝光事件采集
                 * 搜索结果页_tab标签下物品名称
                 */
                const elements = document.querySelectorAll(".content-item");
                // const impContent = document.querySelectorAll('#imp-more-content_'+parentCodeIn);
                elements.forEach((elementE, indexE) => {
                  const obj = JSON.parse(elementE.dataset.value);
                  impArrDataList.forEach((elementF, indexF) => {
                    // 判断当前元素是否是需要的元素
                    if (obj.WT_markId == elementF._id) {
                      // console.log(JSON.stringify(elementE.impAttrsList),'-------------moreX-商品-曝光事件传参----------------');
                      // if(isApp()){
                      elementF.impAttrsList.XY_transaction_id =
                        that.getSearchUUID();
                      handleGdpImp(
                        elementE,
                        elementF.impAttrsList,
                        "moreX",
                        elementF.impAttrsList.WT_markId,
                        "moreX_搜索结果页_tab标签下物品名称"
                      );
                      // }
                    }
                  });
                });
              });
            } else {
              // that.resultSkeletonShow = false;
              that.finishedText = " ";
              that.noDataShow = true;
              that.$nextTick(() => {
                //为您推荐专区查询
                setTimeout(() => {
                  that.$refs.noDataRef?.$refs.recommendRef?.handleQueryResult(
                    that.paramData.categoryCode,
                    that.paramData.parentCode,
                    that.paramData.templateId
                  );
                }, 500);
              });
              // that.currentCompList = [{ path: 'NoData', refD: 'NoDataRef' }];
            }
          } else {
            that.finishedText = " ";
            that.noDataShow = true;
            that.$nextTick(() => {
              //为您推荐专区查询
              setTimeout(() => {
                that.$refs.noDataRef?.$refs.recommendRef?.handleQueryResult(
                  that.paramData.categoryCode,
                  that.paramData.parentCode,
                  that.paramData.templateId
                );
              }, 500);
            });
            this.loading = false;
            that.$refs.loading.loadingHide();
            console.log("请求接口失败");
          }
        })
        .catch((err) => {
          if (isQueryIndexTrafficPeakByError(err)) {
            that.trafficPeakFallback = true;
            that.noDataShow = false;
            this.loading = false;
            that.$refs.loading.loadingHide();
            return;
          }
          that.trafficPeakFallback = false;
          // that.resultSkeletonShow = false;
          that.finishedText = " ";
          that.noDataShow = true;
          that.$nextTick(() => {
            //为您推荐专区查询
            setTimeout(() => {
              that.$refs.noDataRef?.$refs.recommendRef?.handleQueryResult(
                that.paramData.categoryCode,
                that.paramData.parentCode,
                that.paramData.templateId
              );
            }, 500);
          });
          this.loading = false;
          that.$refs.loading.loadingHide();
          console.log("请求接口失败");
        });
    },

    async handleClickTo(item, index) {
      this.$refs.loading.loadingShow();
      console.log(
        JSON.stringify(item.impAttrsList),
        "-------------moreX-点击商品-点击事件传参----------------"
      );
      console.log("-----moreX-商品position-----" + (index + 1));
      /**
       * 埋点-插码-上报
       * 点击事件采集
       * 搜索结果页_tab标签下物品名称
       */
      const clickGdpObj = {
        XY_transaction_id: this.getSearchUUID(),
        WT_et: "clk",
        WT_envName: item.title,
        WT_event: item.pCode,
        WT_markId: item._id,
        XY_point_position: index + 1,
        XY_first_class:
          sessionStorage.pageEntrance == "6"
            ? "权益"
            : sessionStorage.pageEntrance == "8"
            ? "商城"
            : item.parentCategoryName,
        // XY_second_class:
        //   item.parentCategoryName == item.disCategoryName
        //     ? " "
        //     : item.disCategoryName,
        WT_next_url: item.linkAdress,
        WT_plat: sessionStorage.pagePlat || "",
        WT_es: sessionStorage.pageUrl || "",
        WT_ti: "搜索结果页",
        XY_pageEntry: sessionStorage.pageEntrance || "",
        // 插码方案修改2025-1-16
        XY_second_class:
          item.parentCategoryName == item.disCategoryName
            ? " "
            : item.disCategoryName,
        WT_area_type_1: "楼层",
        areaid: "", // 父物品id信息（无父物品传空）
        WT_area_type_2: item.dispCategoryName,
        WT_area_name: item.dispCategoryName, // 若没有二级分类，此名称则记录为一级分类名称
        XY_env_type: "icon",
        WT_event: "P00000050506", // 全部页传P00000050508 垂直页传P00000050506
        XY_gd_source: "搜索平台",
        XY_scene: this.getSearchContent() || "", // 搜索内容
        WT_si_n: item.title, // 物品对应的名称
        WT_goods_id: item.itemId, // 物品所对应的id信息
        XY_visit_source: sessionStorage.pageEntrance || "", // 访问来源
      };
      console.log("点击moreXList垂直页-服务-数据上报===>");
      console.log(clickGdpObj);

      if (isApp()) {
        gdp("track", "clk", clickGdpObj);
      }

      await handleSaveClickInfo(item, this.searchContent).then((resolve) => {
        this.$refs.loading.loadingHide();
        if (resolve == "0") {
          //  let jumpType = item.jumpType === '30' ? '5' : item.jumpType === '1' ? '4' : '1';
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

    refreshHotMobileNum() {
      console.log('---垂直页刷新')
      this.updateRefresh()
    }
  },
};
</script>

<style scoped lang='scss'>
.module-wrap {
  background: #ffffff;
  box-shadow: 0px 4px 20px 0px #f6f6f6;
  border-radius: 18px;
  padding: 32px 24px 0px 29px;
  margin-bottom: 18px;
  .m-title {
    display: flex;
    justify-content: space-between;
    font-size: 24px;
    color: #999;
    margin-bottom: 24px;
    i {
      padding-left: 6px;
      font-size: 24px;
    }
    .m-t-left {
      font-size: 32px;
      color: #000000;
    }
  }
  .m-content {
    display: flex;
    flex-wrap: wrap;
    margin-top: 30px;
    // justify-content:start;
    .content-item {
      width: 25%;
      display: flex;
      flex-direction: column;
      text-align: center;
      margin-bottom: 50px;
      .van-image {
        // border-radius: 12px;
        // overflow: hidden;
        img {
          // border-radius: 12px;
        }
      }
      ::v-deep .van-image__img {
        max-width: 48px;
      }
      ::v-deep .van-image__error {
        position: relative;
        background-color: initial !important;
      }
      .c-i-pic {
        width: 100%;
        min-height: 48px;
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        img {
          max-width: 48px;
          height: 48px;
        }
      }
      .c-i-title {
        width: 100%;
        font-size: 24px;
        height: 31px;
        line-height: 31px;
        color: #333333;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        ::v-deep span {
          color: #2892ff !important;
        }
      }
    }
  }
}
.bottom-line {
  font-size: 24px;
  font-weight: 400;
  color: #cccccc;
  line-height: 33px;
  // margin:30px 0px 0px 0px;
  text-align: center;
  margin: 36px 0;
}
.h100 {
  height: 100%;
  overflow: hidden;
  border-radius: 18px;
}
::v-deep.van-list {
  //
  // height: calc((100% - 58px));
  height: 100%;
  overflow-y: auto;
  scrollbar-width: none;
  // border-radius: 18px;
  // margin-top: 100px;
}

::v-deep.van-list__finished-text {
  font-size: 24px;
  font-weight: 400;
  color: #cccccc;
  line-height: 33px;
  text-align: center;
  margin: 36px 0px 94px 0px;
  width: 100%;
}
::v-deep.van-list::-webkit-scrollbar {
  display: none;
}
::v-deep.van-list::-moz-scrollbar {
  display: none;
}
.class100 {
  height: 100%;
}
.img-10 {
  ::v-deep .van-image__img {
    max-width: 48px;
    max-height: 48px;
  }
  ::v-deep .van-image__error {
    max-width: 48px;
    max-height: 48px;
  }
}
</style>
