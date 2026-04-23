<template>
  <div
    v-if="isShowEnter"
    class="satisfaction-enter"
    :style="bottomValue"
    @mousedown.prevent.stop="jumpPage"
  >
    <div class="enter-icon">
      <img src="@/assets/images/survey.png" draggable="false" alt="" />
    </div>
    <div class="enter-title">调研</div>
  </div>
</template>

<script>
import { isApp, isIOS, goPageUrl } from "@/utils/tool";
import CommonApi from "@/api/index";

export default {
  name: "SatisfactionEnter",
  data() {
    return {
      isApp: isApp(),
      isIOS: isIOS,
      offsetWidth: null,
      isShowEnter: false, // 默认页是否展示满意度调研入口
      enterUrl: "", // 调研入口地址
    };
  },
  inject: [
    "showLoading",
    "hideLoading",
    "getShowVoice",
    "updateInputState",
    "handleBlur",
  ],
  props: {
    keyBoardHeight: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    bottomValue() {
      // console.log("isApp===>");
      // console.log(this.isApp);
      // console.log("getShowVoice===>");
      // console.log(this.getShowVoice());
      // console.log("isIOS===>");
      // console.log(isIOS);
      // console.log("keyBoardHeight====>");
      // console.log(this.keyBoardHeight);
      // console.log(this.keyBoardHeight - (this.offsetWidth * 15) / 390);
      // let showVoice = this.getShowVoice();
      // if (this.isApp) {
      //   if (showVoice) {
      //     if (isIOS) {
      //       return {
      //         position: "fixed",
      //         bottom:
      //           this.keyBoardHeight - (this.offsetWidth * 15) / 390 + 18 + "px",
      //       };
      //       // 18 点击语音搜索div高度 / 2
      //     } else {
      //       return {
      //         position: "fixed",
      //         bottom:
      //           this.keyBoardHeight - (this.offsetWidth * 15) / 390 + 18 + "px",
      //       };
      //     }
      //   } else {
      //     if (isIOS) {
      //       return {
      //         position: "absolute",
      //         bottom: "15px",
      //       };
      //     } else {
      //       return {
      //         position: "absolute",
      //         bottom: "15px",
      //       };
      //     }
      //   }
      // } else {
      //   return {
      //     position: "fixed",
      //     bottom: "15px",
      //   };
      // }
      let showVoice = this.getShowVoice();
      if (this.isApp) {
        if (showVoice) {
          return {
            position: "fixed",
            bottom:
              this.keyBoardHeight - (this.offsetWidth * 15) / 390 + 18 + "px",
          };
          // 18 点击语音搜索div高度 / 2
        } else {
          return {
            position: "absolute",
            bottom: "15px",
          };
        }
      } else {
        return {
          position: "fixed",
          bottom: "15px",
        };
      }
    },
  },
  mounted() {
    this.offsetWidth = document.body.offsetWidth;
    // 查询是否显示满意度调研入口
    this.getEnterFlag();
  },
  methods: {
    // 满意度调查入口
    getEnterFlag() {
      const userInfo = localStorage.getItem("userInfo")
        ? JSON.parse(localStorage.getItem("userInfo"))
        : null;
      const urlInfoObj = sessionStorage.getItem("newUrlParams")
        ? JSON.parse(sessionStorage.getItem("newUrlParams"))
        : null;
      console.log(
        "满意度入口暂时不传页面入口参数===>",
        urlInfoObj.pageEntrance
      );
      const queryParams = {
        provCode: userInfo?.province || "",
        pageCode: 0, // 现在只按照省份配置，传默认 0
      };
      CommonApi.querySurveyUrl(queryParams)
        .then((res) => {
          if (res.data) {
            this.isShowEnter = true;
            this.enterUrl = res.data;
          } else {
            console.log("无调研入口数据");
          }
        })
        .catch(() => {
          console.log("调研入口接口查询失败");
        });
    },
    // 跳转满意度调研页面
    jumpPage() {
      // const that = this;
      // that.showLoading();
      // 跳转前 手动触发输入框失焦状态
      // this.updateInputState();
      // 触发输入框失焦
      this.handleBlur();
      const userInfo = localStorage.getItem("userInfo")
        ? JSON.parse(localStorage.getItem("userInfo"))
        : null;
      // 已登录情况下，在点击调研链接时把号码给拼到这个链接上的mobilenum参数上
      const jumpUrl = userInfo?.phoneNumber
        ? `${this.enterUrl}${userInfo.phoneNumber}`
        : this.enterUrl;
      setTimeout(() => {
        // that.hideLoading();
        goPageUrl("2", jumpUrl);
      }, 500);
    },
  },
};
</script>

<style scoped lang="scss">
.satisfaction-enter {
  position: fixed;
  right: 30px;
  bottom: 30px;
  z-index: 1;
  width: 92px;
  height: 92px;
  padding-top: 10px;
  background: #ffffff;
  border: 2px solid #d6d6d6;
  opacity: 0.75;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  text-align: center;
  .enter-icon {
    width: 100%;
    font-size: 0;

    img {
      width: 36px;
      height: 36px;
    }
  }

  .enter-title {
    font-size: 22px;
    color: #000000;
    font-style: normal;
    text-transform: none;
  }
}
</style>
