<template>
  <div v-show="searchDataList.length > 0" class="everyone-search">
    <div class="search-title">
      <div class="search-t-left">大家都在搜</div>
    </div>
    <div class="search-content">
      <template v-for="(item, index) in searchDataList">
        <div :key="index" class="search-item" @click="jumpPage(item, index)">
          <span v-if="index === 0 || index === 1" class="item-fire">
            <img
              :src="require('@/assets/images/icon-hot.png')"
              draggable="false"
              alt=""
            />
          </span>
          <span class="item-text"> {{ item }} </span>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import CommonApi from "@/api/index";
import {
  isApp,
  updateHistoryData,
  goPageUrl,
  isProtogenesisSkip,
  goProtogenesisPage,
} from "@/utils/tool";

export default {
  name: "EverySearch",
  components: {},
  data() {
    return {
      directParam: {
        params: {
          keyWord: "",
        },
        provCode: "351",
        clientVersion: "10_10",
        entryPage: "1",
        beans: [],
        loginProvince: "", // 用户归属地-省份
        loginCity: "", // 用户归属地-地市
      },
      pageEntrance: "1", // 当前栏目标识，用户通过地址栏传过来
      initDataList: [
        "宽带",
        "流量",
        "话费",
        "积分商城",
        "权益超市",
        "资费专区",
      ],
      searchDataList: [],
    };
  },
  inject: [
    "getSearchUUID",
    "getSearchContent",
    "updateSearchContent",
    "updateCurrentCom",
    "getResult",
    "updateSearchUUID",
    "updateWordType",
  ],
  computed: {
    searchContent() {
      return this.getSearchContent();
    },
  },
  props: {},
  watch: {},
  mounted() {
    // 获取大家都在搜数据
    this.getEverySearchData();
  },
  methods: {
    // 获取大家都在搜数据
    getEverySearchData() {
      try {
        CommonApi.queryTriggerWord({
          params: {
            keyWord: this.searchContent || "",
          },
        })
          .then((res) => {
            if (res.code === "000000") {
              if (res.data && res.data.length > 0) {
                // 渲染页面
                this.handleDJDZSData(res);
              } else {
                console.log("大家都在搜查询数据为空");
                this.dataErrorHandle();
              }
            } else {
              console.log("大家都在搜查询失败");
              this.dataErrorHandle();
            }
          })
          .catch((error) => {
            console.log("大家都在搜接口失败");
            console.log(error);
            this.dataErrorHandle();
          });
      } catch (error) {
        console.log("大家都在搜接口调用失败");
        console.log(error);
        this.dataErrorHandle();
      }
    },

    handleDJDZSData(resObj) {
      const resSearchData = resObj.data;
      this.searchDataList = resSearchData;
      // 处理曝光插码上报
      this.handleGdpImp(resSearchData);
    },

    // 数据接口请求异常执行方法
    dataErrorHandle() {
      console.error("数据接口请求异常执行-使用兜底数据");
      this.searchDataList = this.initDataList;
      // 处理曝光插码上报
      this.handleGdpImp(this.initDataList);
    },

    // 曝光插码上报
    handleGdpImp(renderData) {
      for (let index = 0; index < renderData.length; index++) {
        const impGdpObj = {
          XY_transaction_id: this.getSearchUUID(),
          WT_et: "imp",
          WT_envName: renderData[index],
          WT_event: "",
          WT_markId: "", // [如果source=qqd，取接口markid的值，如果source=app，取接口advertype_markid的值]
          XY_point_position: index + 1,
          XY_first_class: "搜索结果页_全部",
          XY_second_class: "大家都在搜",
          WT_next_url: "",
          WT_plat: sessionStorage.pagePlat || "",
          WT_es: sessionStorage.pageUrl || "",
          WT_ti: "搜索结果页",
          XY_pageEntry: sessionStorage.pageEntrance || "",
          // 插码方案修改2025-1-16
          WT_area_type_1: "楼层",
          areaid: "", // [区域id_模板id]
          WT_area_type_2: "全部",
          WT_area_name: "大家都在搜",
          XY_env_type: "button",
          WT_event: "",
          XY_gd_source: "搜索平台", // [如果source=qqd，传qqd；如果source=app，传app]
          XY_scene: this.searchContent || "", // 搜索内容
          WT_si_n: "", // 物品对应的名称
          WT_goods_id: "", // 物品所对应的id信息
          XY_visit_source: sessionStorage.pageEntrance || "", // 访问来源
          WT_charge_phone: "",
          WT_errCode: "",
          WT_errMsg: "",
          XY_env_extend_attribute: "",
        };
        console.log("全部页-大家都在搜-数据曝光上报===>");
        console.log(impGdpObj);
        if (isApp()) {
          gdp("track", "imp", impGdpObj);
        }
      }
    },

    jumpPage(item, index) {
      console.log("全部页-大家都在搜点击====>");
      console.log(item);
      const clickGdpObj = {
        XY_transaction_id: this.getSearchUUID(),
        WT_et: "clk",
        WT_envName: item,
        WT_event: "",
        WT_markId: "", // [如果source=qqd，取接口markid的值，如果source=app，取接口advertype_markid的值]
        XY_point_position: index + 1,
        XY_first_class: "搜索结果页_全部",
        XY_second_class: "大家都在搜",
        WT_next_url: "",
        WT_plat: sessionStorage.pagePlat || "",
        WT_es: sessionStorage.pageUrl || "",
        WT_ti: "搜索结果页",
        XY_pageEntry: sessionStorage.pageEntrance || "",
        // 插码方案修改2025-1-16
        WT_area_type_1: "楼层",
        areaid: "", // [区域id_模板id]
        WT_area_type_2: "全部",
        WT_area_name: "大家都在搜",
        XY_env_type: "button",
        WT_event: "P00000049488", // 触发搜索，就传P00000049488
        XY_gd_source: "搜索平台", // [如果source=qqd，传qqd；如果source=app，传app]
        XY_scene: this.searchContent || "", // 搜索内容
        WT_si_n: "", // 物品对应的名称
        WT_goods_id: "", // 物品所对应的id信息
        XY_visit_source: sessionStorage.pageEntrance || "", // 访问来源
        WT_charge_phone: "",
        WT_errCode: "",
        WT_errMsg: "",
        XY_env_extend_attribute: "",
      };
      console.log("全部页-大家都在搜-数据点击上报===>");
      console.log(clickGdpObj);
      if (isApp()) {
        gdp("track", "clk", clickGdpObj);
      }

      // let hisData = {
      //   markName: item,
      //   actionUrl: "",
      //   actionType: "",
      // };
      // updateHistoryData(this.pageEntrance, hisData);
      // this.updateSearchContent(item);
      // this.$nextTick(() => {
      //   this.updateCurrentCom("result");
      //   this.updateSearchUUID();
      //   // 更新搜索类型
      //   this.updateWordType(4);
      //   this.getResult();
      // });

      // 点击词搜索直达校验
      this.getDirectData(item, 4);
    },

    /**
     * 搜索直达，如果有url跳转搜索直达页面，如果没有则到搜索结果页
     */
    getDirectData(textVal, type) {
      const userInfo = localStorage.getItem("userInfo")
        ? JSON.parse(localStorage.getItem("userInfo"))
        : null;
      const urlInfoObj = sessionStorage.getItem("newUrlParams")
        ? JSON.parse(sessionStorage.getItem("newUrlParams"))
        : null;
      this.pageEntrance = urlInfoObj?.pageEntrance;

      CommonApi.queryDirect({
        params: {
          keyWord: textVal,
        },
        provCode: userInfo?.province || "",
        clientVersion: userInfo?.version
          ? `10_10,${userInfo?.version}`
          : "10_10",
        entryPage: this.pageEntrance,
        beans: [],
        loginProvince: userInfo?.loginProvince || "", // 用户归属地-省份
        loginCity: userInfo?.loginCity || "", // 用户归属地-地市
      })
        .then((res) => {
          if (res.data && res.data.linkAdress) {
            let url = res.data.linkAdress;
            let jumpType = res.data.jumpType;
            let hisData = {
              markName: textVal,
              actionUrl: url || "",
              actionType: jumpType || "",
              isDirect: true,
            };
            updateHistoryData(this.pageEntrance, hisData);
            localStorage.setItem("directName", textVal);

            // 跳转直达链接
            if (isProtogenesisSkip(res.data)) {
              goProtogenesisPage(res.data.linkAdress1);
            } else {
              setTimeout(() => {
                goPageUrl(jumpType, url);
              }, 500);
            }
          } else {
            console.log("大家都在搜点击--不是直达词");
            let hisData = {
              markName: textVal,
              actionUrl: "",
              actionType: "",
            };
            updateHistoryData(this.pageEntrance, hisData);
            this.updateSearchContent(textVal);
            this.$nextTick(() => {
              this.updateCurrentCom("result");
              this.updateSearchUUID();
              // 更新搜索类型
              this.updateWordType(type);
              this.getResult();
            });
          }
        })
        .catch((error) => {
          console.log("直达词失败===>");
          console.log(error);
          console.log("大家都在搜点击---请求直达接口失败");
          let hisData = {
            markName: textVal,
            actionUrl: "",
            actionType: "",
          };
          updateHistoryData(this.pageEntrance, hisData);
          this.updateSearchContent(textVal);
          this.$nextTick(() => {
            this.updateCurrentCom("result");
            this.updateSearchUUID();
            // 更新搜索类型
            this.updateWordType(type);
            this.getResult();
          });
        });
    },
  },
};
</script>

<style scoped lang='scss'>
.everyone-search {
  background: #ffffff;
  box-shadow: 0px 4px 20px 0px #f6f6f6;
  border-radius: 18px;
  padding: 32px 30px 32px 30px;

  .search-title {
    display: flex;
    justify-content: space-between;
    font-size: 24px;
    color: #999;
    margin-bottom: 24px;

    i {
      padding-left: 6px;
      font-size: 24px;
    }

    .search-t-left {
      font-size: 32px;
      color: #000000;
      font-weight: 700;
      font-family: PingFangSC-Medium, sans-serif;
    }
  }

  .search-content {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;

    .search-item {
      width: 200px;
      height: 60px;
      line-height: 60px;
      font-weight: 400;
      font-size: 24px;
      color: #333333;
      text-align: center;
      background: #f8f8f8;
      border-radius: 30px;
      margin-bottom: 15px;
      padding: 0 16px;
      display: flex;
      align-items: center;
      justify-content: center;

      .item-fire {
        display: inline-block;
        width: 32px;
        height: 32px;
        line-height: 32px;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .item-text {
        display: inline-block;
        max-width: 140px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      &:nth-child(4) {
        margin-bottom: 0;
      }

      &:nth-child(5) {
        margin-bottom: 0;
      }

      &:nth-child(6) {
        margin-bottom: 0;
      }
    }
  }
}
</style>
