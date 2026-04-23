<template>
  <div
    class="voice-wrapper"
    :class="showStatus ? 'mask' : 'fixed'"
    :style="showStatus ? '' : { bottom: bottomValue + 'px' }"
    @mousedown.prevent="emptyFun()"
  >
    <div
      class="voice-con"
      :class="showStatus ? 'fixed' : ''"
      :style="!showStatus ? '' : { bottom: bottomValue + 'px' }"
      @mousedown.prevent="emptyFun()"
    >
      <div class="vocie-status" v-if="showStatus" ref="vocieStatus">
        <div class="close-con">
          <img
            src="../assets/images/icon-close.png"
            alt=""
            @mousedown.prevent.stop="closeVoicePop()"
          />
        </div>
        <div class="content" :class="status === 1 ? 'voice-content' : ''">
          {{ content }}
        </div>

        <div
          v-show="status === 3"
          class="voice-load"
          @mousedown.prevent.stop="emptyFun"
        >
          <div class="svg-loading">
            <!-- 弧形线条 -->
            <svg class="animated-path" viewBox="0 0 80 80">
              <g
                id="loading"
                stroke="none"
                stroke-width="1"
                fill="none"
                fill-rule="evenodd"
              >
                <g
                  id="loadong"
                  transform="translate(6.320000, 6.800000)"
                  fill="#2892FF"
                >
                  <path
                    d="M34.5023265,18.7442561 C28.2990994,12.5264265 19.8739591,9.03666306 11.0909458,9.04702056 C4.45610532,9.04702056 -1.94603845,11.0026144 -7.4203785,14.7033876 C-7.99796732,15.0740735 -8.32943791,15.7285509 -8.28649895,16.4135131 C-8.24355998,17.0984752 -7.83294973,17.706433 -7.2135895,18.0020844 C-6.59422927,18.2977358 -5.86331334,18.2346852 -5.30373312,17.8373354 C-0.463531857,14.5642063 5.24793117,12.8197443 11.0909458,12.8298805 C27.2618778,12.8298805 40.4181937,25.9861965 40.4181937,42.1556368 C40.4181937,43.200232 41.2650054,44.0470436 42.3096006,44.0470436 C43.3541957,44.0470436 44.2010074,43.200232 44.2010074,42.1556368 C44.2010074,37.6881577 43.3254113,33.3519434 41.5995772,29.2678172 C39.936299,25.3337369 37.5264522,21.7597471 34.5023265,18.7442561 Z"
                    id=""
                    transform="translate(17.955395, 26.547032) rotate(-89.000000) translate(-17.955395, -26.547032) "
                  />
                </g>
              </g>
            </svg>
            <!-- cmcc logo -->
            <svg class="loading-logo" viewBox="0 0 80 80">
              <g
                id="loading"
                stroke="none"
                stroke-width="1"
                fill="none"
                fill-rule="evenodd"
              >
                <g id="logo" transform="translate(14.620000, 15.330000)">
                  <circle id="" fill="#2892FF" cx="25" cy="25" r="25" />
                  <g
                    id="CMCC"
                    transform="translate(7.000000, 7.000000)"
                    fill="#FFFFFF"
                  >
                    <path
                      d="M1.35300074,12.2643924 C1.35300074,12.2643924 5.00132782,17.0812608 9.0214125,20.2874598 C9.0214125,20.2874598 10.544329,21.5807614 12.1740628,20.1102722 C13.8032358,18.6400634 20.5335624,12.5119505 20.5335624,12.5119505 C20.5335624,12.5119505 23.0657756,9.99711963 25.900217,12.4942878 C25.900217,12.4942878 31.8511423,17.789731 35.1094884,22.235122 C35.1094884,22.235122 35.3046191,22.394647 35.1448138,22.6780911 C34.9855692,22.9615353 34.6667996,23.7409366 34.6667996,23.7409366 C34.6667996,23.7409366 31.089684,19.1183579 26.9625018,15.6999261 C26.9625018,15.6999261 25.3509914,14.4781165 23.9693764,15.7708573 C22.5874811,17.0641588 16.0351832,23.0501291 14.9902808,23.8118677 C13.9448177,24.573326 12.2270508,25.3653435 9.78287076,23.191711 C7.87810367,21.4991765 2.89021563,16.780995 0.927694337,13.805252 C0.927694337,13.805252 0.750787061,13.6457271 0.892649314,13.3272379 C1.06310831,12.9423034 1.35300074,12.2643924 1.35300074,12.2643924"
                      id="Fill-1"
                    />
                    <path
                      d="M2.09909526,10.8083699 L4.17852675,13.1028376 C4.17852675,13.1028376 4.44038316,13.4375877 4.92792952,13.0148045 C5.41547588,12.5920213 11.8346027,6.36017517 14.2810256,4.60932582 C15.6822658,3.60647744 17.1861179,2.95744362 18.8640736,2.8427763 C20.1158818,2.75838788 21.4604892,2.88819465 22.9085496,3.53750884 C24.4749219,4.2412129 26.8610675,6.17373565 29.1045097,8.49483762 C30.687984,10.1332625 32.2616457,11.951118 33.5880297,13.7106585 C34.484902,14.8993857 35.3416827,16.0965237 35.9957996,17.1428279 C35.9957996,17.1428279 36.0120239,15.6950479 35.3596257,14.4704346 C35.3596257,14.4704346 32.7427438,9.45423017 27.6253293,4.73745043 C27.1262882,4.27737936 22.7641641,-0.0917537489 18.5270806,0.00384907394 C18.5270806,0.00384907394 14.5768056,-0.219597993 10.9789434,2.73848231 C10.3854209,3.22686975 4.0711488,8.67090381 2.09909526,10.8083699"
                      id="Fill-3"
                    />
                    <path
                      d="M6.58154996,15.6429569 L8.94807027,17.9295746 C8.94807027,17.9295746 9.49168867,18.3453488 10.1154901,17.7535084 C10.1154901,17.7535084 12.3861272,15.5313736 14.3318269,13.749965 C16.1667843,12.0700468 18.0126758,10.3458316 18.7026422,9.85436022 C18.7026422,9.85436022 21.6772637,6.76871603 25.4668923,9.77417721 C25.4668923,9.77417721 30.6162678,13.8197747 35.7008801,20.7519606 L35.8682552,19.9361124 C35.8682552,19.9361124 36.0603019,19.253155 35.6047166,18.6293536 C35.6047166,18.6293536 31.6317324,12.76534 26.7366436,8.54928356 C26.7366436,8.54928356 24.2977904,5.97137167 21.1796244,5.32682361 C21.1796244,5.32682361 18.6014321,4.71675984 16.1622985,6.63274134 C14.9637587,7.5744712 12.3575305,10.001269 10.1864212,12.0680842 C8.17007076,13.9882711 6.58154996,15.6429569 6.58154996,15.6429569"
                      id="Fill-5"
                    />
                    <path
                      d="M33.8961456,25.1918846 L31.8167141,22.8974169 C31.8167141,22.8974169 31.5554184,22.5629472 31.067872,22.9848893 C30.5797649,23.4082332 24.1611989,29.639799 21.7142152,31.3909287 C20.3132554,32.3937771 18.8096837,33.0428109 17.1314476,33.1569175 C15.8796394,33.2427077 14.5353123,33.1123402 13.087252,32.4621849 C11.5203189,31.7584809 9.13445372,29.8267992 6.89073117,27.5051365 C5.30725685,25.8664312 3.73359513,24.0494169 2.4072111,22.289596 C1.51033887,21.1003081 0.653277789,19.9037308 -5.80759581e-16,18.857707 C-5.80759581e-16,18.857707 -0.0165026915,20.3052066 0.635615097,21.5298199 C0.635615097,21.5298199 3.2522167,26.545744 8.3699115,31.2625237 C8.86867227,31.7231555 13.2313571,36.0920083 17.4684406,35.9961251 C17.4684406,35.9961251 21.4184352,36.2201329 25.0162974,33.2617722 C25.60982,32.7731044 31.924092,27.3290703 33.8961456,25.1918846"
                      id="Fill-7"
                    />
                    <path
                      d="M29.4133825,20.3574658 L27.0471425,18.0702874 C27.0471425,18.0702874 26.5032438,17.655074 25.8794423,18.2463536 C25.8794423,18.2463536 23.6090856,20.4690491 21.6639466,22.249897 C19.8289892,23.9298152 17.9828174,25.6540304 17.2931313,26.1460625 C17.2931313,26.1460625 14.3182294,29.2317067 10.5286008,26.2256848 C10.5286008,26.2256848 5.37950567,22.1800873 0.294613005,15.2479014 L0.126677255,16.0637495 C0.126677255,16.0637495 -0.0650891114,16.747548 0.390496188,17.3705084 C0.390496188,17.3705084 4.3632,23.2350827 9.25828882,27.4511392 C9.25828882,27.4511392 11.6971421,30.0296118 14.8158688,30.6738795 C14.8158688,30.6738795 17.3943414,31.2831022 19.833475,29.3671207 C21.0320148,28.4253908 23.637402,25.998593 25.8087916,23.9317778 C27.825142,22.0121516 29.4133825,20.3574658 29.4133825,20.3574658"
                      id="Fill-9"
                    />
                  </g>
                </g>
              </g>
            </svg>
          </div>
        </div>
        <div
          class="voice-operate"
          v-show="status === 0 || status === 2 || status === 4 || status === 6"
        >
          <div class="wave-btn">
            <img
              class="stop-img"
              v-if="status === 0 || status === 4"
              src="../assets/images/icon01.png"
              alt="停止收音"
            />
            <img
              class="start-img"
              v-else
              src="../assets/images/icon02.png"
              @mousedown.prevent.stop="onMouseDown()"
              alt="开始收音"
            />
          </div>
          <div
            class="wave-sequence"
            v-show="status === 0 || status === 4"
          ></div>
        </div>
        <div class="voice-operate" v-show="status === 5">
          <div class="wave-btn">
            <img class="start-img" src="../assets/images/icon03.png" />
            <div class="load">
              <img class="load-img" src="../assets/images/icon02-loading.png" />
            </div>
          </div>
        </div>
      </div>
      <div class="voice-start" @mousedown.prevent.stop="onMouseDown()" v-else>
        <span class="icon s-iconfont ic-yuyin"></span>点击语音搜索
      </div>
    </div>
  </div>
</template>
<script>
import { isIOS } from "@/utils/tool";
export default {
  data() {
    return {
      showStatus: false,
      status: 0, // 0: 小移在听，请说~ 1: 实时语音2：未检测到语音，请重试 3：语音识别中 4：小移在听，请说~ 5：请稍等 6：请重试
      content: "小移在听，请说~",
      offsetWidth: null,
      isMounseDownStatus5: false,
      userInfo: null,
      isAllowStop: false, // 客户端版本号是否是910及以上版本
    };
  },
  props: {
    showVoice: {
      type: Boolean,
    },
    keyBoardHeight: {
      type: Number,
      default: 190,
    },
  },
  inject: ["getSearchContent", "updateSearchContent", "handleBlur"],
  computed: {
    bottomValue() {
      if (this.showStatus) {
        return this.keyBoardHeight - (this.offsetWidth * 80) / 390;
      } else {
        return this.keyBoardHeight - (this.offsetWidth * 15) / 390;
      }
    },
    searchContent() {
      return this.getSearchContent();
    },
  },
  watch: {
    searchContent(newVal) {
      // 键盘输入 手动结束收音
      if (newVal && this.status !== 1) {
        this.showStatus = false;
      }
    },
    status(newVal) {
      !isIOS ? localStorage.setItem("vocieStatus", newVal) : "";
    },
  },
  mounted() {
    const userInfo = localStorage.getItem("userInfo")
      ? JSON.parse(localStorage.getItem("userInfo"))
      : null;
    this.userInfo = userInfo;
    const version = this.userInfo?.version
      ? this.userInfo?.version.split("_")[1]
      : "";
    const versionArr = version.split(".");
    if (versionArr[0] > 9) {
      this.isAllowStop = true;
    } else if (versionArr[0] == 9 && versionArr[1] >= 1) {
      this.isAllowStop = true;
    } else {
      this.isAllowStop = false;
    }
    // this.isAllowStop = version >= "9.1.0" ? true : false;

    this.offsetWidth = document.body.offsetWidth;
    const that = this;
    // 监听键盘事件
    document.addEventListener("input", function (event) {
      if (that.showStatus) {
        // 如果语音输入处于活动状态，则终止语音输入
        that.updateSearchContent("");
        that.showStatus = false;
      }
    });
  },
  methods: {
    emptyFun() {},
    closeVoicePop() {
      // var inputClass = document.querySelectorAll(".voice-con");
      // inputClass[0].className = 'voice-con fixed popup';
      console.log("closeVoicePop~");
      this.showStatus = false;
      (this.status === 4 && this.isAllowStop && isIOS) ||
      (this.status === 4 && !isIOS)
        ? this.stopVoiceRecognizer(true)
        : "";
    },
    stopVoice() {
      // 非自然收音
      if (this.status !== 1) {
        this.status = 3;
        this.content = "语音识别中~";
        console.log("调用了停止收音的按钮~~~");
        this.stopVoiceRecognizer();
      } else {
        this.handleBlur();
        this.updateSearchContent(this.content);
        this.showStatus = false;
        this.$emit("onSearch");
      }
    },
    /**
     * 开始语音识别
     * 这里调用语音识别的时候状态置为4，是为了和初始化的时候作区分，表示调用了语音识别接口但是还未返回语音结果
     */
    newVoiceRecognizer() {
      console.log("newVoiceRecognizer~");
      const that = this;
      that.status = 4;
      that.content = "小移在听，请说~";
      return new Promise((resolve, reject) => {
        cmcc.newVoiceRecognizer({
          debug: false,
          time: "10000", //String类型，最大录音时长，单位为毫秒，10000表示10秒,7.6失效
          isStop: false, //是否立即停止录音
          isNeedAutoStop: true, //是否在用户停止说话后自动停止录音，默认false
          accent: "mandarin", //语言类型，默认普通话， 5.7新增，取值参见下表, 7.6失效
          success: function (res) {
            console.log(res, "000000000000");
            // 这里区分了ios和android，因为ios，只会有一次回调而android至少有两次回调使用resolve的方式，只会走一次,第二次不会走，所以区分了ios和android
            if (isIOS) {
              resolve(res);
            } else {
              res ? that.handleSuccess(res) : "";
            }
          },
          error: function (res) {
            console.log(res, "11111111111111111");
            if (isIOS) {
              reject(res);
            } else {
              res ? that.handelError(res) : "";
            }
          },
        });
      });
    },
    /**
     * 点击语音识别按钮
     */
    onMouseDown() {
      console.log("onMouseDown~");
      console.log(this.status, "this.status");
      const that = this;
      that.showStatus = true;
      if (
        that.status === 0 ||
        that.status === 1 ||
        that.status === 2 ||
        that.status === 6
      ) {
        that.status = 0;
        that.content = "小移在听，请说~";
        that
          .newVoiceRecognizer()
          .then((res) => {
            res ? that.handleSuccess(res) : "";
          })
          .catch((res) => {
            res ? that.handelError(res) : "";
          });
      } else if (that.status === 5) {
        that.isMounseDownStatus5 = true;
        that.content = "请稍等";
      } else {
        that.status = 3;
        that.content = "语音识别中~";
      }
    },
    /**
     * 停止语音识别
     * isHandle:对于回调结果作不作处理，如果自动语音识别返回结果后调用的语音识别，就不做处理，如果是手动点击关闭按钮调用的停止语音识别就做处理
     */
    stopVoiceRecognizer(isHandle = true) {
      console.log(this.status, "this.status");
      console.log("调用了stopVoiceRecognizer~");
      const that = this;
      cmcc.newVoiceRecognizer({
        debug: false,
        time: "10000", //String类型，最大录音时长，单位为毫秒，10000表示10秒,7.6失效
        isStop: true, //是否立即停止录音
        isNeedAutoStop: true, //是否在用户停止说话后自动停止录音，默认false
        accent: "mandarin", //语言类型，默认普通话， 5.7新增，取值参见下表, 7.6失效
        success: function (res) {
          console.log(res, "stopVoiceRecognizer-success");
          // 安卓手机会返回来两次，第一次rescode:0第二次是识别结果，这里判断如果是0的话不作处理，等待第二次结果返回，ios暂时不会有rescode为0的返回信息
          if (res?.resCode === 0) {
            return;
          }
          if (!isHandle) {
            that.status = 6;
            if (that.isMounseDownStatus5) {
              that.status = 0;
              that.content = "小移在听，请说~";
              that.isMounseDownStatus5 = false;
              that.onMouseDown();
            }
          }
          isHandle ? that.handleSuccess(res, true) : "";
        },
        error: function (res) {
          console.log(res, "stopVoiceRecognizer-error");
          if (res?.errCode === -2 && !that.isAllowStop && isIOS) {
            return;
          }
          if (!isHandle) {
            that.status = 6;
            if (that.isMounseDownStatus5) {
              that.status = 0;
              that.content = "小移在听，请说~";
              that.isMounseDownStatus5 = false;
              that.onMouseDown();
            }
          }
          isHandle ? that.handelError(res, true) : "";
        },
      });
    },
    /**
     * 语音识别，停止语音识别成功回调的处理
     */
    handleSuccess(res, isStop = false) {
      console.log(res?.data, "0000");
      if (res?.data) {
        //返回识别后的字符串
        this.content = res.data;
        this.status = 1;
        setTimeout(() => {
          if (
            this.content === res.data &&
            this.$refs.vocieStatus &&
            this.showVoice
          ) {
            this.updateSearchContent("");
            this.handleBlur();
            this.updateSearchContent(res.data);
            this.showStatus = false;
            this.$emit("onSearch");
          }
        }, 300);
      } else if (res?.resCode === 0) {
        console.log("区分安卓");
        return;
      } else {
        this.status = 2;
        this.content = "未检测到语音，请重试";
      }
      // if(!isStop){
      //   isIOS ? this.status = 5 : '';
      //   this.stopVoiceRecognizer(false)
      // }
    },
    /**
     * 语音识别，停止语音识别失败回调的处理
     */
    handelError(res, isStop) {
      console.log("handelError");
      this.status = 2;
      this.content = "未检测到语音，请重试";
      // 910 以前版本如果出现一下这种情况，就调用一下停止识别方法
      if (
        isIOS &&
        !this.isAllowStop &&
        res?.errCode === -5 &&
        res?.errDescrip === "recognizing"
      ) {
        this.status = 5;
        this.stopVoiceRecognizer(false);
      }
      // if(res?.errCode === -5 && res?.errDescrip === 'not authorized') return
      // if(!isStop){
      //   isIOS ? this.status = 5 : '';
      //   this.stopVoiceRecognizer(false)
      // }
    },
  },
};
</script>
<style lang="scss" scoped>
.popup {
  /* 弹窗样式 */
  animation: fadeOut 0.5s forwards;
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
// 波形
@keyframes waves {
  from {
    background-position: left top;
  }
  to {
    background-position: left -3300px;
  }
}
@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes rotateAnimation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.fixed {
  position: fixed;
  position: -webkit-fixed;
  bottom: 190px;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
}
.mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
}
.voice-wrapper {
  .voice-start {
    width: 324px;
    height: 72px;
    background: #ffffff;
    border: 2px solid #e5e5e5;
    border-radius: 36px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 28px;
    font-weight: 500;
    color: #000000;
    span {
      margin-right: 6px;
    }
    .ic-yuyin {
      font-size: 40px;
    }
  }
  .vocie-status {
    background: linear-gradient(
      -35deg,
      #edf6ff 3%,
      #f1f4ff 28.999999999999996%,
      #ecf6ff 54%,
      #e5f2ff 77%,
      #eef2ff 100%
    );
    box-shadow: 0px 4px 20px 0px #f6f6f6;
    padding: 20px 20px 30px 30px;
    width: 624px;
    height: 328px;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: hidden;
    border-radius: 30px;
    .close-con {
      width: 100%;
      img {
        width: 50px;
        height: 50px;
        float: right;
      }
    }
    .content {
      font-size: 36px;
      font-family: PingFang SC;
      font-weight: 500;
      color: #000000;
      margin-top: 7px;
    }
    .voice-load {
      margin-top: 42px;
      width: 100%;
      display: flex;
      justify-content: center;
    }
    .voice-content {
      display: -webkit-box;
      -webkit-line-clamp: 2; /* 设置行数为2行 */
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: normal; /* 设置为normal以允许换行 */
      margin-top: 39px;
      padding: 0 44px 0 34px;
      text-align: center;
    }
    .voice-operate {
      width: 100%;
      position: relative;
      text-align: center;
      .line {
        margin: 0 auto;
        width: 100%;
        height: 100px;
        position: relative;
        top: -110px;
        img {
          width: 100%;
        }
      }
      .stop-img {
        margin-top: 50px;
        width: 114px;
        height: 114px;
      }
      .start-img {
        width: 130px;
        height: 130px;
        margin-top: 42px;
      }
      .wave-sequence {
        margin: 0 auto;
        width: 100%;
        height: 100px;
        -webkit-animation: waves 3s steps(33) infinite;
        animation: waves 3s steps(33) infinite;
        background: url("../assets/images/wave-sequence.png") center top;
        background-size: 600px 3300px;
        position: relative;
        top: -120px;
      }
      .wave-btn {
        position: relative;
        z-index: 1;
        .load {
          width: 140px;
          height: 140px;
          position: absolute;
          top: 50%;
          left: 50%;
          margin-left: -70px;
          margin-top: -50px;
          img {
            width: 130px;
            height: 130px;
            animation: rotate 2s linear infinite;
          }
        }

        .load-finish {
          width: 120px;
          height: 120px;
          position: absolute;
          top: 50%;
          left: 50%;
          margin-left: -60.42px;
          margin-top: -68.75px;
          border-radius: 50%;
          border: 2px solid #fff;
        }
      }
    }
  }
  .svg-loading {
    width: 120px;
    height: 120px;
    position: relative;
    svg {
      width: 120px;
      height: 120px;
      position: absolute;
      left: 0;
      top: 0;
    }
  }
  .animated-path {
    animation: rotateAnimation 1s linear infinite;
    transform-origin: center center;
  }
}
</style>
