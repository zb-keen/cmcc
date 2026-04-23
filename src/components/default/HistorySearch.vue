<template>
  <div class="history-search" v-show="isShowHistory && currentData.length">
    <div class="head-con">
      <div class="left-con">历史搜索</div>
      <div class="right-con" v-if="historyData.length">
        <div class="del-btn" v-if="!isDelete" @click="onDel()">
          <span class="icon s-iconfont ic-icon-trash del-icon"></span>
        </div>
        <div class="operate-btn" v-else>
          <span class="delete-all" @click="delAll()">全部删除</span>
          <span class="finish" @click="delFinsh()">完成</span>
        </div>
      </div>
    </div>
    <div
      class="main-con"
      :class="
        isExpand && !isDelete ? 'height-3' : isDelete ? 'height-auto' : ''
      "
    >
      <div
        class="item"
        :style="{
          'padding-left': isDelete
            ? (offsetWidth * 14.5) / 750 + 'px'
            : (offsetWidth * 24) / 750 + 'px',
          'padding-right': isDelete
            ? (offsetWidth * 14.5) / 750 + 'px'
            : (offsetWidth * 24) / 750 + 'px',
        }"
        v-for="(item, index) in currentData"
        :key="item.id"
        @click="isDelete ? '' : jumpPage(item, index)"
      >
        <span>{{ item.markName | filterChar }}</span>
        <span
          class="icon s-iconfont ic-icon-close"
          v-if="isDelete"
          @click.stop="delItem(item)"
        ></span>
      </div>
      <div
        class="btn-con"
        v-if="
          !isDelete &&
          ((!isExpand && currentData.length < historyData.length) ||
            (isExpand && currentData.length <= historyData.length))
        "
        @click="changeExpandStatus()"
      >
        <span class="icon s-iconfont ic-xiajiantou" v-if="!isExpand"></span>
        <span class="icon s-iconfont ic-shangjiantou" v-else></span>
      </div>
    </div>
    <van-popup v-model="isShowDelPop" class="del-popup">
      <div class="title">确认清空历史搜索？</div>
      <div class="opreate-con">
        <div class="btn cancel-btn" @click="onCancel()">取消</div>
        <div class="btn confirm-btn" @click="confirmDel()">确认</div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import {
  updateHistoryData,
  deleteHistoryData,
  handleChar,
  getConWidth,
  isApp,
  getQueryString,
  goPage,
  goPageUrl,
  getQueryStringNew,
} from "@/utils/tool";
import CommonApi from "@/api/index";

export default {
  name: "history-search",
  data() {
    return {
      interval: null,
      offsetWidth: null,
      isDelete: false,
      isExpand: false,
      isShowDelPop: false,
      isShowHistory: true,
      tempIsExpand: false,
      historyData: [],
      pageEntrance: null,
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
  computed: {
    currentData() {
      let firstNum = 0;
      let secondNum = 0;
      let lastIndex = 0;
      firstNum = this.getIndex(-1);
      if (firstNum >= 0) {
        if (!this.isExpand) {
          lastIndex = this.getIndex(firstNum, true);
        } else {
          secondNum = this.getIndex(firstNum);
          lastIndex = this.getIndex(secondNum, true);
        }
      }
      const currentData = this.historyData?.slice(0, lastIndex + 1);
      return currentData;
    },
  },
  filters: {
    filterChar(val) {
      return handleChar(val);
    },
  },
  beforeUnmount() {
    window.removeEventListener("storage", this.handleSessionStorageChange);
  },
  mounted() {
    window.addEventListener("storage", this.handleSessionStorageChange);
    // 从会话中获取页面入口信息
    // this.pageEntrance = getQueryStringNew().pageEntrance;
    this.pageEntrance = sessionStorage.getItem("pageEntrance");
    this.offsetWidth = document.body.offsetWidth;
    // let historyData = localStorage.getItem(this.pageEntrance);
    //   this.historyData = historyData ? JSON.parse(historyData).reverse() : [];
    const xkTag =
      localStorage.getItem("userInfo") &&
      JSON.parse(localStorage.getItem("userInfo")).xk
        ? JSON.parse(localStorage.getItem("userInfo")).xk
        : "";
    let configList = sessionStorage.configListSes
      ? JSON.parse(sessionStorage.configListSes)
      : {};
    let pageColumnTagArr = configList.UNIFY_ENTRY_PAGE_COLUMN || [];
    let pageColumnWriteTag = [];
    let pageColumnReadTag = [];
    if (pageColumnTagArr && pageColumnTagArr.length > 0) {
      pageColumnTagArr.forEach((item, index) => {
        if (item.write == true) {
          pageColumnWriteTag.push(item.column);
        }
        if (item.read == true) {
          pageColumnReadTag.push(item.column);
        }
      });
    }
    let pageColumnTag = pageColumnReadTag[0];
    let pageEntranceFlag = "";
    // if(this.pageEntrance == '6' || this.pageEntrance == '8'){
    //   pageEntranceFlag = '_pageColumn_' +'_'+ pageColumnTag +'_'+ xkTag + '';
    // }else{
    pageEntranceFlag = "_pageColumn_" + "_" + pageColumnTag + "_" + xkTag + "";
    // }
    let historyData = localStorage.getItem(pageEntranceFlag);
    // 历史搜索词
    this.historyData = historyData ? JSON.parse(historyData).reverse() : [];

    // 处理历史搜索词的曝光--单一上报
    // 插码方案修改2025-1-16
    this.historyData.map((item, index) => {
      let impAttrsImpObj = {
        WT_et: "imp",
        WT_area_type_1: "楼层",
        areaid: "", // 该区域对应的区域id_模板id_位置
        WT_area_type_2: "历史搜索",
        WT_area_name: "历史搜索",
        XY_env_type: "",
        XY_point_position: index + 1,
        WT_event: "",
        XY_gd_source: "搜索平台",
        WT_markId: "",
        WT_next_url: item.actionUrl || "",
        WT_envName: item?.markName || "",
        XY_scene: item?.markName || "",
        WT_es: sessionStorage.pageUrl || "", // 页面路径
        WT_ti: "搜索默认页", // 页面名称
        XY_visit_source: sessionStorage.pageEntrance || "", // 访问来源
        WT_plat: sessionStorage.pagePlat || "", // 渠道
        XY_transaction_id: this.getSearchUUID(),
      };
      console.log("历史词单一曝光上报===>");
      console.log(impAttrsImpObj);
      if (isApp()) {
        gdp("track", "imp", impAttrsImpObj);
      }
    });
  },
  activated() {
    this.isDelete = false;
    this.isExpand = false;
  },
  methods: {
    handleSessionStorageChange(event) {
      const xkTag = JSON.parse(localStorage.getItem("userInfo")).xk || "";
      let configList = sessionStorage.configListSes
        ? JSON.parse(sessionStorage.configListSes)
        : {};
      let pageColumnTagArr = configList.UNIFY_ENTRY_PAGE_COLUMN || [];
      let pageColumnWriteTag = [];
      let pageColumnReadTag = [];
      if (pageColumnTagArr && pageColumnTagArr.length > 0) {
        pageColumnTagArr.forEach((item, index) => {
          if (item.write == true) {
            pageColumnWriteTag.push(item.column);
          }
          if (item.read == true) {
            pageColumnReadTag.push(item.column);
          }
        });
      }
      let pageColumnTag = pageColumnReadTag[0];

      let pageEntranceFlag = "";
      // if(this.pageEntrance == '6' || this.pageEntrance == '8'){
      //   pageEntranceFlag = this.pageEntrance + '_pageColumn_' +'_'+ pageColumnTag +'_'+ xkTag + '';
      // }else{
      pageEntranceFlag =
        "_pageColumn_" + "_" + pageColumnTag + "_" + xkTag + "";
      // }
      // if (event.key === pageEntranceFlag) {
      let data = [];
      if (
        event.currentTarget.localStorage &&
        event.currentTarget.localStorage[pageEntranceFlag]
      ) {
        data = JSON.parse(event.currentTarget.localStorage[pageEntranceFlag]);
      } else {
        data = [];
      }
      // let data = event.currentTarget.localStorage && event.currentTarget.localStorage[pageEntranceFlag]
      // ?JSON.parse(event.currentTarget.localStorage[pageEntranceFlag]) : [];
      // 手动触发响应式数据的更新
      setTimeout(() => {
        this.$set(this, "historyData", data.reverse());
      }, 1000);
      // }
    },
    onDel() {
      this.isDelete = !this.isDelete;
      this.tempIsExpand = this.isExpand ? false : true;
      this.isExpand = true;
    },
    onCancel() {
      this.isShowDelPop = false;

      // 插码方案修改2025-1-16
      const clickGdpObj = {
        XY_transaction_id: this.getSearchUUID(),
        WT_et: "clk",
        WT_event: "P00000048858",
        WT_envName: "默认搜索页_搜索历史清空弹窗_取消",
        WT_plat: sessionStorage.pagePlat || "",
        WT_es: sessionStorage.pageUrl || "",
        WT_ti: "搜索默认页",
        XY_pageEntry: sessionStorage.pageEntrance || "",
      };
      console.log("点击默认搜索页_搜索历史清空弹窗_取消数据上报===>");
      console.log(clickGdpObj);

      if (isApp()) {
        gdp("track", "clk", clickGdpObj);
      }
    },
    // 获取下标
    getIndex(startIndex, isEnd = false) {
      const { offsetWidth } = document.body;
      const containerWith = offsetWidth - (offsetWidth * 60) / 750;
      let eleWidth = 0;
      for (let i = startIndex + 1; i < this.historyData?.length; i++) {
        eleWidth +=
          getConWidth(this.historyData[i].markName) + (offsetWidth * 18) / 750;
        if (i === this.historyData.length - 1) {
          if (eleWidth <= containerWith) {
            return i;
          }
        }
        if (eleWidth + (isEnd ? (offsetWidth * 60) / 750 : 0) > containerWith) {
          eleWidth = 0;
          return i - 1;
        }
      }
      return this.historyData?.length - 1;
    },
    // 切换删除按钮
    changeDelStatus() {
      this.isDelete = !this.isDelete;
    },
    // 点击单个删除
    delItem(item) {
      const index = this.historyData.findIndex(
        (e) => e.markName === item.markName
      );
      if (this.historyData.length === 1) {
        this.isShowDelPop = true;
      } else {
        // 插码方案修改2025-1-16
        const clickGdpObj = {
          XY_transaction_id: this.getSearchUUID(),
          WT_et: "clk",
          WT_event: "P00000048857",
          WT_envName: "默认搜索页_历史搜索_删除",
          WT_plat: sessionStorage.pagePlat || "",
          WT_es: sessionStorage.pageUrl || "",
          WT_ti: "搜索默认页",
          XY_pageEntry: sessionStorage.pageEntrance || "",
        };
        console.log("点击默认搜索页_历史搜索_删除数据上报===>");
        console.log(clickGdpObj);
        if (isApp()) {
          gdp("track", "clk", clickGdpObj);
        }
        this.historyData.splice(index, 1);
        deleteHistoryData(
          this.pageEntrance,
          JSON.parse(JSON.stringify(this.historyData)).reverse()
        );
      }
    },
    // 单个删除完成
    delFinsh() {
      this.isDelete = !this.isDelete;
      this.isExpand = this.tempIsExpand ? !this.isExpand : this.isExpand;
      this.tempIsExpand = false;
    },
    // 全部删除
    delAll() {
      this.isShowDelPop = true;
    },
    // 展开折叠状态
    changeExpandStatus() {
      this.isExpand = !this.isExpand;
    },
    // 返回一个特定的 DOM 节点，作为挂载的父节点
    getContainer() {
      return document.querySelector(".my-container");
    },
    // 确认删除
    confirmDel() {
      this.isShowDelPop = false;
      this.isDelete = false;
      this.isExpand = this.tempIsExpand ? !this.isExpand : this.isExpand;
      this.tempIsExpand = false;
      console.log("删除历史记录+++" + this.pageEntrance);
      deleteHistoryData(this.pageEntrance, []);
      this.historyData = [];

      // 插码方案修改2025-1-16
      const clickGdpObj = {
        XY_transaction_id: this.getSearchUUID(),
        WT_et: "clk",
        WT_event: "P00000048859",
        WT_envName: "默认搜索页_搜索历史清空弹窗_确认",
        WT_plat: sessionStorage.pagePlat || "",
        WT_es: sessionStorage.pageUrl || "",
        WT_ti: "搜索默认页",
        XY_pageEntry: sessionStorage.pageEntrance || "",
      };
      console.log("点击默认搜索页_搜索历史清空弹窗_确认上报===>");
      console.log(clickGdpObj);
      if (isApp()) {
        gdp("track", "clk", clickGdpObj);
      }
    },
    getDirectData(item) {
      console.log("searchAssociation1getDirectData");
      const userInfo = localStorage.getItem("userInfo")
        ? JSON.parse(localStorage.getItem("userInfo"))
        : null;
      const param = {
        provCode: userInfo?.province || "",
        clientVersion: userInfo?.version
          ? `10_10,${userInfo?.version}`
          : "10_10",
        entryPage: this.pageEntrance,
        loginProvince: userInfo?.loginProvince || "",
        loginCity: userInfo?.loginCity || "",
        beans: [],
        params: {
          keyWord: item.markName,
        },
      };
      const that = this;
      return new Promise((resolve, reject) => {
        CommonApi.queryDirect(param)
          .then((res) => {
            if (res.data && res.data.linkAdress) {
              let url = res.data.linkAdress;
              let jumpType = res.data.jumpType;
              let hisData = {
                markName: item.markName,
                actionUrl: url || "",
                actionType: jumpType || "",
                isDirect: true,
              };
              updateHistoryData(that.pageEntrance, hisData);
              localStorage.setItem("directName", item.markName);
              setTimeout(() => {
                goPageUrl(jumpType, url);
              }, 500);
              resolve(true);
            } else {
              resolve(false);
            }
          })
          .catch(() => {
            console.log("搜索直达catch-------");
            resolve(false);
          });
      });
    },
    async jumpPage(item, index) {
      console.log("点击历史搜索跳转===>");
      console.log(item);
      // 测试新电商原生链接跳转
      // goPage(
      //   "3",
      //   "https://chinamobileapp/rn/common/XDS00001?productCode=405844"
      // );
      console.log("历史搜索====>");
      console.log(item);
      if (isApp()) {
        // 插码方案修改2025-1-16
        let obj1 = {
          WT_et: "clk",
          WT_area_type_1: "楼层",
          areaid: "", // 该区域对应的区域id_模板id_位置
          WT_area_type_2: "历史搜索",
          WT_area_name: "历史搜索",
          XY_env_type: "",
          XY_point_position: index + 1,
          WT_event: "P00000049488",
          XY_gd_source: "搜索平台",
          WT_markId: "",
          WT_next_url: item.actionUrl || "",
          WT_envName: item?.markName || "",
          XY_scene: item?.markName || "",
          WT_es: sessionStorage.pageUrl || "", // 页面路径
          WT_ti: "搜索默认页", // 页面名称
          XY_visit_source: sessionStorage.pageEntrance || "", // 访问来源
          WT_plat: sessionStorage.pagePlat || "", // 渠道
          XY_transaction_id: this.getSearchUUID(),
        };
        this.$emit("getTrack", obj1);
      }
      if (item.isDirect) {
        isDirect = await this.getDirectData(item);
        if (isDirect) return;
      }
      let hisData = {
        markName: item.markName,
        actionUrl: "",
        actionType: item?.actionType || "",
      };
      updateHistoryData(this.pageEntrance, hisData);
      this.updateSearchContent(item.markName);
      this.$nextTick(() => {
        this.updateCurrentCom("result");
        this.updateSearchUUID();
        // 更新搜索类型
        this.updateWordType(4);
        this.getResult();
      });
    },
    async jumpPage1(item) {
      // 直达未下线需正常跳转
      let isDirect = false;
      if (item.isDirect) {
        isDirect = await this.getDirectData(item);
        if (isDirect) return;
      }
      let hisData = {
        markName: item.markName,
        actionUrl: item?.actionUrl || "",
        actionType: item?.actionType || "",
      };
      updateHistoryData(this.pageEntrance, hisData);
      this.isExpand = false;
      if (item.actionUrl && !item.isDirect) {
        this.handleBlur();
        setTimeout(() => {
          goPageUrl(item.actionType, item.actionUrl);
        }, 500);
      } else {
        hisData.actionUrl = "";
        updateHistoryData(this.pageEntrance, hisData);
        this.updateSearchContent(item.markName);
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
<style scoped lang="scss">
.height-3 {
  max-height: 234px !important;
}

.height-auto {
  max-height: 100% !important;
}

.history-search {
  margin-bottom: 30px;
  display: flex;
  flex-direction: column;

  .head-con {
    display: flex;
    justify-content: space-between;
    margin-bottom: 24px;

    .left-con {
      font-size: 32px;
      font-weight: 700;
      color: #000000;
      font-family: PingFangSC, sans-serif;
    }

    .right-con {
      font-weight: 400;
      color: #999999;

      .del-btn {
        font-size: 36px;
        // font-size: 34px!important;
      }

      .operate-btn {
        font-size: 24px;
      }

      .finish {
        color: #2892ff;
      }

      .delete-all {
        position: relative;
        margin-right: 25px;
      }

      .delete-all::after {
        position: absolute;
        content: "";
        right: -12px;
        top: calc(50% - 7px);
        width: 1px;
        height: 14px;
        background: #cccccc;
        border-radius: 1px;
      }
    }
  }

  .main-con {
    max-height: 156px;
    overflow: hidden;

    .item {
      float: left;
      font-size: 24px;
      font-weight: 400;
      height: 60px;
      display: flex;
      align-items: center;
      background: #f8f8f8;
      border-radius: 30px;
      margin-right: 18px;
      margin-bottom: 18px;

      .icon {
        font-size: 24px;
        margin-left: 5px;
      }
    }

    .btn-con {
      width: 60px;
      float: left;

      span {
        width: 60px;
        height: 60px;
        font-size: 24px;
        font-weight: 400;
        background: #f8f8f8;
        border-radius: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }

  .del-popup {
    width: 624px;
    height: 264px;
    background: #ffffff;
    border-radius: 18px;
    padding: 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: hidden;

    .title {
      font-size: 32px;
      font-weight: 500;
      color: #333333;
      line-height: 38px;
      margin-top: 30px;
    }

    .opreate-con {
      display: flex;
      justify-content: space-around;
      font-size: 32px;
      font-weight: 500;
      color: #666666;
      margin-top: 54px;

      .btn {
        width: 270px;
        height: 90px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 18px;
      }

      .cancel-btn {
        margin-right: 24px;
        background: #f6f6f6;
      }

      .confirm-btn {
        background: linear-gradient(-90deg, #007eff, #2892ff);
        color: #ffffff;
      }
    }
  }
}
</style>
