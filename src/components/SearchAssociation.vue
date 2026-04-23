<template>
  <div class="search-association" @mousedown.prevent="emptyFun()">
    <van-list :loading="false" :finished="finished" finished-text="没有更多了">
      <template v-if="associationData.length">
        <div
          class="item association-item"
          v-for="(item, index) in associationData"
          :key="index"
          :class="{'no-underline': item.isCardConfig && item.isCardConfig == '1' && index === 0}"
          :style="{'padding-top': item.isCardConfig && item.isCardConfig == '1' && index === 0 ? '0.08rem' : '', 'padding-bottom': item.isCardConfig && item.isCardConfig == '1' && index === 0 ? '0.08rem' : ''}"
          @click="jumpPage(item, index)"
          :id="'imp-recommend-content_P00000082783'"
          :imp-position-id="item + 1"
          imp-type="once"
          imp-track="imp"
          :imp-attrs="item.impAttrs"
          :data-value="JSON.stringify(item.impAttrs)"
        >
          <div class="wrap-card" v-if="item.isCardConfig && item.isCardConfig == '1' && index === 0">
            <img class="wrap-img" :src="item.iconUrl" alt="">
            <div class="wrap-text">
              <div class="wrap-top">
                <div class="wrap-title">{{item.mainTitle}}</div>
                <div v-if="item.contactType && item.contactType === '7'" class="item-direct1">直达</div>
              </div>
              <div v-if="item.subTitle && item.subTitle !== ''" class="wrap-span">{{item.subTitle}}</div>
            </div>
          </div>
          <div class="wrap-l" v-else>
            <template v-if="item.titleSuggestHL">
              <div
                v-html="item.titleSuggestHL"
                class="item-l item-common"
              ></div>
            </template>
            <template v-else>
              <div class="item-l item-common">{{ item.titleSuggest }}</div>
            </template>
            <div
              v-if="item.contactType && item.contactType === '7'"
              class="item-direct"
            >
              直达
            </div>
          </div>
          <div
            class="item-ass-words item-common"
            v-if="item.clickQuantity"
            v-html="handleClickQuantity(item.clickQuantity)"
          ></div>
        </div>
      </template>
    </van-list>
    <!-- 加载中 -->
    <Loadding ref="loading" v-show="false" :marginTop="marginTop" />
  </div>
</template>

<script>
import CommonApi from "@/api/index";
import {
  goPageUrl,
  isApp,
  getQueryStringNew,
  associationEscalation,
  handleGdpImp,
  isProtogenesisSkip,
  goProtogenesisPage,
} from "@/utils/tool";
import { updateHistoryData, Debounce, getQueryString } from "@/utils/tool";
import Loadding from "./Loadding.vue";

export default {
  name: "search-association",
  components: {
    Loadding,
  },
  data() {
    return {
      loading: false,
      borderHeight: "1px",
      finished: false,
      paramData: {
        params: {
          keyWord: "",
        },
        provCode: "351",
        clientVersion: "10_10",
        entryPage: "1",
        loginProvince: "", // 用户归属地-省份
        loginCity: "", // 用户归属地-地市
        birthday: "", // 用户生日
      },
      directParam: {
        params: {
          keyWord: "",
        },
        itemId: "",
        provCode: "351",
        clientVersion: "10_10",
        entryPage: "1",
        beans: [],
        loginProvince: "", // 用户归属地-省份
        loginCity: "", // 用户归属地-地市
      },
      jumpFlag: false,
      pageEntrance: null,
    };
  },
  inject: [
    "getShowVoice",
    "getKeyBoardHeight",
    "getSearchContent",
    "updateSearchContent",
    "updateCurrentCom",
    "updateAssociationData",
    "getAssociationData",
    "getResult",
    "handleBlur",
    "getCurrentCom",
    "getSearchUUID",
    "updateSearchUUID",
    "updateWordType",
    "getAssociationFlag",
  ],
  computed: {
    marginTop() {
      let keyBoardHeight = this.getKeyBoardHeight();
      let showVoice = this.getShowVoice();
      console.log(showVoice, "showVoice");
      return isApp() && showVoice ? -keyBoardHeight : 0;
    },
    searchContent() {
      return this.getSearchContent();
    },
    associationData() {
      return this.getAssociationData();
    },
    currentCom() {
      return this.getCurrentCom();
    },
    associationFlag() {
      return this.getAssociationFlag();
    },
  },
  watch: {
    searchContent: {
      handler(newVal, oldVal) {
        this.loading = false;
        if (oldVal === "") {
          this.updateAssociationData([]);
        }
        this.paramData.params.keyWord = newVal;
        this.directParam.params.keyWord = newVal;
        this.watchSearchontent(newVal, oldVal);
      },
      immediate: true,
    },
    // 页面变化重置jumpflag
    currentCom: {
      handler() {
        this.jumpFlag = false;
      },
    },
  },
  filters: {},
  mounted() {
    this.initParams();
  },
  methods: {
    initParams() {
      this.jumpFlag = false;
      // 从会话中获取页面入口信息
      // this.pageEntrance = getQueryStringNew().pageEntrance;
      this.pageEntrance = sessionStorage.getItem("pageEntrance");
      const userInfo = localStorage.getItem("userInfo")
        ? JSON.parse(localStorage.getItem("userInfo"))
        : null;
      this.paramData.provCode = userInfo?.province || "";
      this.paramData.entryPage = this.pageEntrance;
      this.paramData.clientVersion = userInfo?.version
        ? `10_10,${userInfo?.version}`
        : "10_10";
      this.paramData.params.keyWord = this.searchContent;
      this.paramData.loginProvince = userInfo?.loginProvince || "";
      this.paramData.loginCity = userInfo?.loginCity || "";

      this.directParam.provCode = userInfo?.province || "";
      this.directParam.clientVersion = userInfo?.version
        ? `10_10,${userInfo?.version}`
        : "10_10";
      this.directParam.entryPage = this.pageEntrance;
      this.directParam.loginProvince = userInfo?.loginProvince || "";
      this.directParam.loginCity = userInfo?.loginCity || "";

      this.paramData.phoneNum = userInfo?.phoneNumber || "";
      this.paramData.cityCode = userInfo?.city || "";
      this.paramData.birthday = userInfo?.birthday || "";

      this.directParam.params.keyWord = this.searchContent;
    },

    handleClickQuantity(val) {
      if (val > 99999999) {
        return `${(val / 100000000).toFixed(2)}亿<p>点击量</p>`;
      } else if (val > 9999) {
        return `${(val / 10000).toFixed(2)}W<p>点击量</p>`;
      }
      return `${val}<p>点击量</p>`;
    },

    emptyFun() {},

    watchSearchontent(newVal, oldVal) {
      this.finished = false;
      if (newVal && !this.jumpFlag) {
        // 仅删除防抖
        if (newVal < oldVal) {
          this.debounceGetData();
        } else {
          this.getData();
        }
      }
    },

    debounceGetData: Debounce(function () {
      this.getData();
    }, 150),

    async jumpPage(item, index) {
      this.jumpFlag = true;
      this.directParam.itemId = item.itemId;
      // 跳转到相应的页面，同时作为历史搜索词存入客户端缓存。
      if (item.contactType && item.contactType === "7") {
        // 搜索直达
        this.directParam.params.keyWord = item.titleSuggest;
        this.getDirectData(item, index);
      } else {
        // 搜索联想词点击上报
        if (!item.noWord) {
          item.searchUUID = this.getSearchUUID();
          associationEscalation(item, "clk", index);
          // 搜索运营报表优化
          console.log("搜索运营报表优化--普通点击");
          const clickGdpObj = {
            WT_et: "clk",
            WT_area_type_1: "楼层",
            WT_area_type_2: "搜索",
            WT_area_name: "搜索页卡片",
            XY_env_type: "button",
            WT_event: "P00000082783",
            XY_gd_source: "搜索平台",
            WT_markId: "",
            WT_next_url: "",
            WT_envName: item.titleSuggest,
            XY_scene: item.titleSuggest,
            WT_es: sessionStorage.pageUrl || "", // 页面路径
            WT_ti: "搜索默认页", // 页面名称
            XY_visit_source: sessionStorage.pageEntrance || "", // 访问来源
            WT_plat: sessionStorage.pagePlat || "", // 渠道
            XY_transaction_id: item.searchUUID, // 事务流水号
          };

          // 插码方案修改2025-1-16
          // 联想词非直达点击上报两次-一个联想词点击上报 一个搜索词点击上报
          // 联想词点击上报
          const clickAssociaGdpObj = {
            WT_et: "clk",
            WT_area_type_1: "搜索框",
            areaid: "SSY_12",
            WT_area_type_2: "联想词",
            WT_area_name: item.contactType,
            XY_env_type: "",
            XY_point_position: index + 1,
            WT_event: "P00000082783",
            XY_gd_source: "搜索平台",
            WT_markId: "",
            WT_next_url: "",
            WT_envName: item.titleSuggest,
            XY_scene: item.titleSuggest,
            WT_es: sessionStorage.pageUrl || "", // 页面路径
            WT_ti: "搜索结果页", // 页面名称
            XY_visit_source: sessionStorage.pageEntrance || "", // 访问来源
            WT_plat: sessionStorage.pagePlat || "", // 渠道
            XY_transaction_id: item.searchUUID, // 事务流水号
          };
          console.log("联想词点击上报两次--作为联想词上报==>");
          console.log(clickAssociaGdpObj);
          // 搜索词点击上报
          const clickSearchGdpObj = {
            WT_et: "clk",
            WT_area_type_1: "搜索框",
            areaid: "SSY_12",
            WT_area_type_2: "联想词",
            WT_area_name: item.contactType,
            XY_env_type: "",
            XY_point_position: index + 1,
            WT_event: "P00000049488",
            XY_gd_source: "搜索平台",
            WT_markId: "",
            WT_next_url: "",
            WT_envName: item.titleSuggest,
            XY_scene: item.titleSuggest,
            WT_es: sessionStorage.pageUrl || "", // 页面路径
            WT_ti: "搜索结果页", // 页面名称
            XY_visit_source: sessionStorage.pageEntrance || "", // 访问来源
            WT_plat: sessionStorage.pagePlat || "", // 渠道
            XY_transaction_id: item.searchUUID, // 事务流水号
          };
          console.log("联想词点击上报两次--作为搜索词上报==>");
          console.log(clickSearchGdpObj);

          if (isApp()) {
            console.log("app开始上报搜索运营报表优化普通点击-app");
            // gdp("track", "clk", {
            //   XY_transaction_id: item.searchUUID,
            //   WT_et: "clk",
            //   WT_event: "P00000049488",
            //   WT_envName: item.titleSuggest,
            //   WT_plat: sessionStorage.pagePlat || "",
            //   WT_es: sessionStorage.pageUrl || "",
            //   WT_ti: "搜索结果页",
            //   XY_pageEntry: sessionStorage.pageEntrance || "",
            // });

            if (item && item?.isCardConfig == '1' && index === 0) {
                console.log('卡片')
                gdp("track", "clk", clickGdpObj)
              } else {
                // 联想词点击上报
                gdp("track", "clk", clickAssociaGdpObj);
                // 搜索词点击上报
                gdp("track", "clk", clickSearchGdpObj);
              }
            console.log("app结束上报搜索运营报表优化普通点击-app");
          }
          // 搜索运营报表优化
        }
        let hisData = {
          markName: item.titleSuggest,
          actionUrl: "",
          actionType: "",
        };
        await this.updateSearchContent(item.titleSuggest);
        this.updateCurrentCom("result");
        updateHistoryData(this.pageEntrance, hisData);
        // 更新搜索类型
        this.updateWordType(2);
        this.getResult();
      }
    },

    getData() {
      // this.$refs.loading?.loadingShow();
      // this.loading = true
      this.updateSearchUUID();
      let that = this;
      if (!this.searchContent) {
        return;
      }

      // 如果点击搜索就不触发接口调用--关闭了联想词查询开关
      console.log("联想词开关===>");
      console.log(this.associationFlag);
      // if (!this.associationFlag) {
      //   return;
      // }

      this.initParams();
      // const userInfo = localStorage.getItem("userInfo")
      //   ? JSON.parse(localStorage.getItem("userInfo"))
      //   : null;
      this.paramData.tranId = this.getSearchUUID();
      // this.paramData.phoneNum = userInfo?.phoneNumber || "";
      // this.paramData.cityCode = userInfo?.city || "";

      console.log(this.paramData, "联想词传参");

      CommonApi.queryindex(this.paramData)
        .then((res) => {
          if (res.data && res.data.length) {
            this.updateAssociationData([]);
          } else {
            this.updateAssociationData([
              {
                titleSuggest: this.searchContent,
                titleSuggestHL: "",
                titleSuggestHLWord: "",
                noWord: true,
              },
            ]);
          }

          // 搜索联想词曝光上报
          if (this.getCurrentCom() == "searchAssociation") {
            res.data?.forEach(function (item, index) {
              // associationEscalation(item, 'imp', index, undefined, 'once', 'SSY_12')
              // const impAttrs = {
              //   XY_transaction_id: that.getSearchUUID(),
              //   WT_et: "imp",
              //   // area_id: 'SSY_12',
              //   // type: 'once',
              //   WT_event: "P00000082783",
              //   WT_envName: item.titleSuggest,
              //   WT_plat: sessionStorage.pagePlat || "",
              //   WT_es: sessionStorage.pageUrl || "", // 页面路径
              //   WT_ti: "搜索输入页", // 页面名称
              //   XY_pageEntry: sessionStorage.pageEntrance || "", // 页面入口
              //   XY_point_position: index + 1, // 搜索联想词位置
              //   XY_asword_type: item.contactType, // 联想词类型
              //   XY_asword_id: item.dataNo, // 联想词ID
              // };

              // 插码方案修改2025-1-16
              let impAttrsImpObj = {};
              index === 0 ? (impAttrsImpObj = {
                // area_id: 'SSY_12',
                // type: 'once',
                XY_pageEntry: sessionStorage.pageEntrance || "", // 页面入口
                XY_asword_type: item.contactType, // 联想词类型
                XY_asword_id: item.dataNo, // 联想词ID---这个字段不要丢 联想词曝光比对时用到
                WT_et: "imp",
                WT_area_type_1: "楼层",
                WT_area_type_2: "搜索",
                WT_area_name: "搜索页卡片",
                XY_env_type: "button",
                XY_point_position: index + 1,
                WT_event: "P00000082783",
                XY_gd_source: "搜索平台",
                WT_markId: "",
                WT_next_url: "",
                WT_envName: item.titleSuggest,
                XY_scene: that.searchContent, // foreach中的this
                WT_es: sessionStorage.pageUrl || "", // 页面路径
                WT_ti: "搜索默认页", // 页面名称
                XY_visit_source: sessionStorage.pageEntrance || "", // 访问来源
                WT_plat: sessionStorage.pagePlat || "", // 渠道
                XY_transaction_id: that.getSearchUUID(), // 事务流水号
              }) :
              impAttrsImpObj = {
                // area_id: 'SSY_12',
                // type: 'once',
                XY_pageEntry: sessionStorage.pageEntrance || "", // 页面入口
                XY_asword_type: item.contactType, // 联想词类型
                XY_asword_id: item.dataNo, // 联想词ID---这个字段不要丢 联想词曝光比对时用到
                // 插码方案修改2025-1-16
                WT_et: "imp",
                WT_area_type_1: "搜索框",
                areaid: "SSY_12",
                WT_area_type_2: "联想词",
                WT_area_name: item.contactType,
                XY_env_type: "",
                XY_point_position: index + 1,
                WT_event: "P00000082783",
                XY_gd_source: "搜索平台",
                WT_markId: "",
                WT_next_url: "",
                WT_envName: item.titleSuggest,
                XY_scene: that.searchContent, // foreach中的this
                WT_es: sessionStorage.pageUrl || "", // 页面路径
                WT_ti: "搜索输入页", // 页面名称
                XY_visit_source: sessionStorage.pageEntrance || "", // 访问来源
                WT_plat: sessionStorage.pagePlat || "", // 渠道
                XY_transaction_id: that.getSearchUUID(), // 事务流水号
              };
              item.impAttrs = impAttrsImpObj;
            });
          }

          const associationData = this.associationData.concat(res?.data || []);

          // 存入会话-点击搜索是判断使用(可以只存储联想词中的直达数据--精简数组)
          // sessionStorage.setItem("associationWord", this.searchContent);
          // sessionStorage.setItem(
          //   "associationArr",
          //   JSON.stringify(associationData)
          // );
          // const associateDirectData = associationData.map((item) => {
          //   if (item.contactType === "7") {
          //     return item;
          //   }
          // });
          // sessionStorage.setItem(
          //   "associationArr",
          //   JSON.stringify(associateDirectData)
          // );

          this.updateAssociationData(associationData);
          let impArrDataList = associationData;

          this.$nextTick(() => {
            const elements = document.querySelectorAll(".association-item");
            elements.forEach((elementE, indexE) => {
              if (elementE.dataset.value) {
                const obj = JSON.parse(elementE.dataset.value);
                impArrDataList?.forEach((elementF, indexF) => {
                  // 判断当前元素是否是需要的元素
                  if (obj.XY_asword_id == elementF.dataNo) {
                    handleGdpImp(
                      elementE,
                      elementF.impAttrs,
                      "associationList",
                      elementF.impAttrs.XY_asword_id,
                      "搜索输入页_搜索联想词"
                    );
                  }
                });
              }
            });
          });

          this.finished = true;
          // this.loading = false;
          // this.$refs.loading?.loadingHide();
        })
        .catch((err) => {
          this.loading = false;
          // this.$refs.loading?.loadingHide();
          console.log("请求接口失败");
          console.log(err);
        });
    },

    getDirectData(item, index) {
      console.log("searchAssociation1getDirectData");
      CommonApi.queryDirect(this.directParam)
        .then(async (res) => {
          if (res.data && res.data.linkAdress) {
            let url = res.data.linkAdress;
            // 搜索联想词点击上报
            if (!item.noWord) {
              item.searchUUID = this.getSearchUUID();
              associationEscalation(item, "clk", index, url);
              // 搜索运营报表优化
              console.log("搜索运营报表优化需求--直达");

              // 插码方案修改2025-1-16
              // 联想词非直达点击上报两次-一个联想词点击上报 一个搜索词点击上报
              // 联想词点击上报
              const clickGdpObj = {
                WT_et: "clk",
                WT_area_type_1: "楼层",
                WT_area_type_2: "搜索",
                WT_area_name: "搜索页卡片",
                XY_env_type: "button",
                WT_event: "P00000082783",
                XY_gd_source: "搜索平台",
                WT_markId: "",
                WT_next_url: url || "",
                WT_envName: item.titleSuggest,
                XY_scene: item.titleSuggest,
                WT_es: sessionStorage.pageUrl || "", // 页面路径
                WT_ti: "搜索默认页", // 页面名称
                XY_visit_source: sessionStorage.pageEntrance || "", // 访问来源
                WT_plat: sessionStorage.pagePlat || "", // 渠道
                XY_transaction_id: item.searchUUID, // 事务流水号
              };

              const clickAssociaGdpObj = {
                WT_et: "clk",
                WT_area_type_1: "搜索框",
                areaid: "SSY_12",
                WT_area_type_2: "联想词",
                WT_area_name: item.contactType,
                XY_env_type: "",
                XY_point_position: index + 1,
                WT_event: "P00000082783",
                XY_gd_source: "搜索平台",
                WT_markId: "",
                WT_next_url: "",
                WT_envName: item.titleSuggest,
                XY_scene: item.titleSuggest,
                WT_es: sessionStorage.pageUrl || "", // 页面路径
                WT_ti: "搜索结果页", // 页面名称
                XY_visit_source: sessionStorage.pageEntrance || "", // 访问来源
                WT_plat: sessionStorage.pagePlat || "", // 渠道
                XY_transaction_id: item.searchUUID, // 事务流水号
              };
              console.log("联想词点击上报两次--作为联想词上报==>");
              console.log(clickAssociaGdpObj);

              // 搜索词点击上报
              const clickSearchGdpObj = {
                WT_et: "clk",
                WT_area_type_1: "搜索框",
                areaid: "SSY_12",
                WT_area_type_2: "联想词",
                WT_area_name: item.contactType,
                XY_env_type: "",
                XY_point_position: index + 1,
                WT_event: "P00000049488",
                XY_gd_source: "搜索平台",
                WT_markId: "",
                WT_next_url: "",
                WT_envName: item.titleSuggest,
                XY_scene: item.titleSuggest,
                WT_es: sessionStorage.pageUrl || "", // 页面路径
                WT_ti: "搜索结果页", // 页面名称
                XY_visit_source: sessionStorage.pageEntrance || "", // 访问来源
                WT_plat: sessionStorage.pagePlat || "", // 渠道
                XY_transaction_id: item.searchUUID, // 事务流水号
              };
              console.log("联想词点击上报两次--作为搜索词上报==>");
              console.log(clickSearchGdpObj);

              if (isApp()) {
                console.log("app开始上报搜索运营报表优化直达-app");
                // gdp("track", "clk", {
                //   XY_transaction_id: item.searchUUID,
                //   WT_et: "clk",
                //   WT_event: "P00000049488",
                //   WT_envName: item.titleSuggest,
                //   WT_plat: sessionStorage.pagePlat || "",
                //   WT_es: sessionStorage.pageUrl || "",
                //   WT_ti: "搜索结果页",
                //   XY_pageEntry: sessionStorage.pageEntrance || "",
                // });

              if (item && item?.isCardConfig == '1' && index === 0) {
                  gdp("track", "clk", clickGdpObj)
                  console.log("点击上报==>");
                } else {
                  // 联想词点击上报
                  gdp("track", "clk", clickAssociaGdpObj);
                  // 搜索词点击上报
                  gdp("track", "clk", clickSearchGdpObj);
                }
              console.log("app结束上报搜索运营报表优化直达-app");
              }
              // 搜索运营报表优化
            }
            let jumpType = res.data.jumpType;
            let hisData = {
              markName: item.titleSuggest,
              actionUrl: url || "",
              actionType: jumpType || "",
              isDirect: true,
            };
            updateHistoryData(this.pageEntrance, hisData);
            localStorage.setItem("directName", item.titleSuggest);
            this.handleBlur();
            if (isProtogenesisSkip(item)) {
              goProtogenesisPage(item.linkAdress1);
            } else {
              setTimeout(() => {
                goPageUrl(jumpType, url);
              }, 500);
            }
          } else {
            await this.updateSearchContent(item.titleSuggest);
            this.updateCurrentCom("result");
            // 更新搜索类型
            this.updateWordType(2);
            this.getResult();
          }
        })
        .catch(async () => {
          console.log("搜索直达catch-------");
          await this.updateSearchContent(item.titleSuggest);
          this.updateCurrentCom("result");
          // 更新搜索类型
          this.updateWordType(2);
          this.getResult();
          console.log("请求接口失败");
        });
    },
  },
};
</script>

<style scoped lang='scss'>
.search-association {
  padding: 24px 0;

  .item {
    font-size: 28px;
    font-weight: 500;
    color: #333;
    padding: 24px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    word-break: break-all;
    gap: 6px;
    position: relative;

    ::v-deep span:not(.s-iconfont) {
      color: #2892ff;
    }

    &::after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: v-bind(borderHeight);
      background: #e5e5e5;
      overflow: hidden;
    }

    &.no-underline::after {
      display: none;
    }

    @media (-webkit-min-device-pixel-ratio: 1.5) and (-webkit-max-device-pixel-ratio: 2.49) {
      &::after {
        transform: scaleY(0.5);
      }
    }

    @media (-webkit-min-device-pixel-ratio: 2.5) {
      &::after {
        transform: scaleY(0.3333);
      }
    }

    .item-common {
      height: 40px;
      line-height: 40px;
    }

    .wrap-card {
      background-image: url("../assets/images/search-bg.png");
      background-position: center top;
      background-size: 100% 100%;
      width: 100%;
      height: 122px;
      padding: 22px 0 24px 42px;
      display: flex;
      align-items: center;
      gap: 40px;
      .wrap-img {
        height: 72px;
        width: 72px;
      }
      .wrap-text {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .wrap-top {
          display: flex;
          flex-direction: row;
          align-items: center;
          font-size: 28px;
          font-weight: 500;
          color: #333;
          .wrap-title { 
            max-width: 336px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .item-direct1 {
            min-width: 70px;
            width: auto;
            height: 30px;
            padding: 0 15px;
            border-radius: 4px;
            background-color: #E5F2FF;
            color: #2892FF;
            line-height: 30px;
            font-size: 20px;
            text-align: center;
            white-space: nowrap;
            flex-shrink: 0;
            margin-left: 12px;
          }
        }
        .wrap-span {
          font-size: 20px;
          color: #999999;
          line-height: 28px;
          max-width: 440px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin-top: 4px;
        }
      }
    }

    .wrap-l {
      width: calc(100% - 170px);
      display: flex;
      align-items: center;
      gap: 12px;

      .item-l {
        width: auto;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .item-direct {
        min-width: 70px;
        width: auto;
        height: 30px;
        padding: 0 15px;
        border-radius: 6px;
        background-color: #e3efff;
        color: #007eff;
        line-height: 30px;
        font-size: 20px;
        text-align: center;
        white-space: nowrap;
        flex-shrink: 0;
      }
    }

    .item-ass-words {
      width: 164px;
      font-size: 20px;
      color: #999999;
      display: flex;
      gap: 4px;
      justify-content: flex-end;
      line-height: 40px;

      ::v-deep p {
        font-size: 20px;
      }
    }
  }

  .s-iconfont {
    font-size: 36px;
    color: #ccc;
  }
}
</style>
