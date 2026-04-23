<template>
  <div class="default-wrap">
    <!-- 搜索发现 -->
    <div class="dicovery-search">
      <div class="head-con">
        <div class="left-con">搜索发现</div>
        <div class="right-con" @click="changeShowStatus('dicovery')">
          <template v-if="!isDisHidden">
            <span class="icon s-iconfont ic-icon-show"></span>
          </template>
          <template v-else>
            <p>已隐藏</p>
            <span class="icon s-iconfont ic-icon-hidden"></span>
          </template>
        </div>
      </div>
      <div
        class="dicovery-con"
        :class="isDisHidden ? 'height-0' : isExpand ? 'height-auto' : ''"
        :style="{ 'margin-top': !isDisHidden ? '0.32rem' : '' }"
      >
        <div
          class="dicovery-item"
          v-for="(item, index) in disCoveryData"
          :key="index"
          @click="jumpPage('dicovery', item, index)"
        >
          <div v-if="item.imgUrl" class="serial">
            <img
              :src="require('@/assets/images/' + item.imgUrl + '.png')"
              draggable="false"
              alt=""
            />
          </div>
          <div class="content">{{ item.markName }}</div>
        </div>
        <!-- <div
          class="btn-con"
          v-if="
            (!isExpand && currentData.length < disCoveryData.length) ||
            (isExpand && currentData.length <= disCoveryData.length)
          "
          @click="changeExpandStatus()"
        >
          <span class="icon s-iconfont ic-xiajiantou" v-if="!isExpand"></span>
          <span class="icon s-iconfont ic-shangjiantou" v-else></span>
        </div> -->
      </div>
    </div>
    <!-- 服务优选 -->
    <div class="service-choose">
      <div class="head-con">
        <div class="left-con">服务优选</div>
        <div class="right-con" @click="changeShowStatus('service')">
          <template v-if="!isSerHidden">
            <span class="icon s-iconfont ic-icon-show"></span>
          </template>
          <template v-else>
            <p>已隐藏</p>
            <span class="icon s-iconfont ic-icon-hidden"></span>
          </template>
        </div>
      </div>
      <div
        class="service-con"
        :class="isSerHidden ? 'height-0' : isExpand ? 'height-auto' : ''"
        :style="{ 'margin-top': !isSerHidden ? '0.32rem' : '' }"
      >
        <div
          class="service-item"
          v-for="(item, index) in serverData"
          :key="index"
          @click="jumpPage('service', item, index)"
        >
          <div class="img-wrap">
            <img
              class="server-img"
              :src="require('@/assets/images/' + item.imgUrl + '.png')"
              draggable="false"
              alt=""
            />
          </div>
          <div class="server-title">{{ item.markName }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { updateHistoryData, goPage, getConWidth, isApp } from "@/utils/tool";

export default {
  name: "DefaultPage",
  data() {
    return {
      offsetWidth: null,
      isExpand: false,
      isDisHidden: false, // 搜索发现隐藏
      isSerHidden: false, // 服务优选隐藏
      pageEntrance: null,
      disCoveryData: [
        {
          markName: "充话费",
          imgUrl: "icon-hot",
          actionUrl: "",
          actionType: "",
        },
        {
          markName: "流量超市",
          imgUrl: "icon-tuijian",
          actionUrl: "",
          actionType: "",
        },
        {
          markName: "套餐办理",
          actionUrl: "",
          actionType: "",
        },
        {
          markName: "宽带福利",
          imgUrl: "",
          actionUrl: "",
          actionType: "",
        },
        {
          markName: "权益领取",
          imgUrl: "icon-tuijian",
          actionUrl: "",
          actionType: "",
        },
        {
          markName: "会员7折",
          imgUrl: "",
          actionUrl: "",
          actionType: "",
        },
        {
          markName: "签到领奖",
          imgUrl: "",
          actionUrl: "",
          actionType: "",
        },
        {
          markName: "AI豆兑换",
          imgUrl: "",
          actionUrl: "",
          actionType: "",
        },
      ],
      serverData: [
        {
          markName: "充值缴费",
          imgUrl: "czjf",
          actionUrl:
            "https://touch.10086.cn/i/reapp/v2.0/pages/recharge/recharge.html",
          actionType: "1",
        },
        {
          markName: "余量查询",
          imgUrl: "ylcx",
          actionUrl:
            "https://h.app.coc.10086.cn/cmcc-app/setMealSurplus/setMealSurplusNew.html",
          actionType: "1",
        },
        {
          markName: "我的套餐",
          imgUrl: "wdtc",
          actionUrl: "https://touch.10086.cn/i/mobile/maindetailqry.html",
          actionType: "1",
        },
        {
          markName: "卡券中心",
          imgUrl: "kqzx",
          actionUrl: "https://touch.10086.cn/i/mobile/mycoupons.html",
          actionType: "1",
        },
      ],
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
  props: {},
  watch: {},
  computed: {
    currentData() {
      let firstNum = 0;
      let secondNum = 0;
      let lastIndex = 0;
      firstNum = this.getIndex(-1);
      if (firstNum > 0) {
        if (!this.isExpand) {
          lastIndex = this.getIndex(firstNum, true);
        } else {
          secondNum = this.getIndex(firstNum);
          lastIndex = this.getIndex(secondNum, true);
        }
      }
      const currentData = this.disCoveryData.slice(0, lastIndex + 1);
      return currentData;
    },
  },
  filters: {},
  mounted() {
    this.pageEntrance = sessionStorage.getItem("pageEntrance");
    this.offsetWidth = document.body.offsetWidth;
    this.isDisHidden = false;
    this.isSerHidden = false;
  },
  methods: {
    changeShowStatus(mouduleFlag) {
      if (mouduleFlag === "dicovery") {
        this.isDisHidden = !this.isDisHidden;
      } else if (mouduleFlag === "service") {
        this.isSerHidden = !this.isSerHidden;
      }
    },

    // 获取下标
    getIndex(startIndex, isEnd = false) {
      const { offsetWidth } = document.body;
      const containerWith = offsetWidth - (offsetWidth * 60) / 750;
      let eleWidth = 0;
      for (let i = startIndex + 1; i < this.disCoveryData.length; i++) {
        let iconWidth = this.disCoveryData[i].imgUrl ? 32 : 0; // 图标宽度
        let width =
          getConWidth(this.disCoveryData[i].markName) +
          iconWidth +
          (offsetWidth * 18) / 750;
        if (width >= (offsetWidth * 255) / 750) {
          width = (offsetWidth * 127.5) / 375 + (offsetWidth * 18) / 750;
        }
        eleWidth += width;
        if (i === this.disCoveryData.length - 1) {
          if (eleWidth <= containerWith) {
            return i;
          }
        }
        if (eleWidth + (isEnd ? (offsetWidth * 60) / 750 : 0) > containerWith) {
          eleWidth = 0;
          return i - 1;
        }
      }
      return this.disCoveryData.length - 1;
    },

    // 展开折叠状态
    changeExpandStatus() {
      this.isExpand = !this.isExpand;
    },

    jumpPage(mouduleFlag, item, index) {
      console.log("默认兜底页点击事件暂不做插码上报====>");
      console.log(mouduleFlag);
      console.log(item);
      let hisData = {
        markName: item.markName,
        actionUrl: item?.actionUrl || "",
        actionType: item?.actionType || "",
      };
      updateHistoryData(this.pageEntrance, hisData);
      if (item.actionUrl) {
        this.handleBlur();
        goPage(item.actionType, item.actionUrl);
      } else {
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
.default-wrap {
  .height-0 {
    height: 0 !important;
    max-height: 0 !important;
    overflow: hidden !important;
    padding: 0 !important;
    margin: 0 !important;
  }

  .height-auto {
    max-height: 234px !important;
  }

  .service-choose,
  .dicovery-search {
    display: flex;
    flex-direction: column;
    margin-bottom: 30px;

    .head-con {
      display: flex;
      justify-content: space-between;

      .left-con {
        font-size: 32px;
        font-weight: 700;
        color: #000000;
        font-family: PingFangSC, sans-serif;
      }

      .right-con {
        font-size: 36px;
        font-weight: 500;
        color: #999999;
        display: flex;
        align-items: center;

        p {
          font-size: 24px;
          margin-right: 19px;
        }
      }
    }
  }

  .dicovery-con {
    //max-height: 156px;
    //overflow: hidden;
    display: flex;
    flex-wrap: wrap;
    max-height: none;
    overflow: visible;

    .dicovery-item {
      //float: left;
      font-size: 24px;
      font-weight: 500;
      padding: 0 24px;
      height: 60px;
      line-height: 60px;
      background: #f8f8f8;
      border-radius: 30px;
      margin-right: 18px;
      margin-bottom: 18px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      display: flex;
      align-items: center;
      &:nth-child(4) {
        margin-right: 0;
      }
      
      .serial {
        height: 32px;
        display: flex;
        align-items: center;

        img {
          height: 32px;
          position: relative;
          top: -1px;
        }
      }

      .content {
        flex: 1;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      .icon {
        font-size: 20px;
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
        font-weight: 500;
        background: #f8f8f8;
        border-radius: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }

  .service-con {
    overflow: hidden;
    display: flex;
    justify-content: space-between;

    .service-item {
      width: 25%;

      .img-wrap {
        margin: 0 auto;
        margin-bottom: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .server-img {
        width: 72px;
        height: 72px;
      }

      .server-title {
        font-weight: 400;
        font-size: 24px;
        line-height: 36px;
        color: rgba(0, 0, 0, 0.9);
        text-align: center;
      }
    }
  }
}
</style>
