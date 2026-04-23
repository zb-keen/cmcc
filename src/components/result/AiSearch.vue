<template>
  <!-- <div id="aiSearchNode" class="ai-search">
    <div class="ai-title">
      <span class="ai-title-en">AI</span>
      <span class="ai-title-ch">智答</span>
    </div>
    <div class="ai-content">
      当然有啦，目前有很多活动，您可以按需选择，也可以联系VIP专属客户经理进一步了解详情哦！
    </div>
  </div> -->
  <!-- 实际发布时不要添加样式-只提供一个初始化dom即可 -->
  <!-- 外层再包裹一层div 控制显隐 第二次进入结果页 上次ai查询结果展示未清除 -->
  <div v-show="aiDomShow" class="ai-wrap">
    <div id="aiSearchNode"></div>
  </div>
</template>

<script>
import CommonApi from "@/api/index";

export default {
  name: "AiSearch",
  components: {},
  props: {},
  data() {
    return {
      isInitFlag: false, // 是否已初始化
      aiDomShow: false,
    };
  },
  inject: ["getSearchContent"],
  computed: {},
  watch: {},
  created() {},
  mounted() {
    console.log("大模型sdk加载状态==>");
    console.log(window.zxkf_AI_sdk);
    console.log("dom显隐状态==>");
    console.log(this.aiDomShow);
    console.log("是否已初始化完成==>");
    console.log(this.isInitFlag);
    this.aiDomShow = false;

    if (this.isInitFlag === true) {
      // this.aiDomShow = true
      this.sendSearch();
    } else {
      if (window.zxkf_AI_sdk) {
        this.$nextTick(() => {
          // this.aiDomShow = true
          console.log("初始化前去掉上一次初始化的dom====>");
          // 初始化前去掉上一次初始化的dom
          var elementToRemove = document.getElementsByClassName(
            "zxkf_AI_sdk-container"
          );
          if (elementToRemove.length > 0) {
            elementToRemove[0].remove();
          }
          console.log("又一次的初始化33");
          this.aiSearchInit();
        });
      }
      // 测试接口
      // this.testAiSdkPost()
    }
  },
  methods: {
    aiSearchInit() {
      if (window.zxkf_AI_sdk) {
        window.zxkf_AI_sdk("#aiSearchNode", {
          productExplain: [
            // 商品解读信息 营销场景使用
            {
              goodsId: "",
              goodsName: "",
              goodsType: "",
            },
          ],
          /**
           * 插件使用环境，grayscale灰度环境，production生产环境, test测试环境
           * 测试环境中，authCode为写死的值，测试使用，调用大模型接口为灰度接口
           * 灰度环境中，authCode动态生成，与APP登录手机号关联，调用大模型接口为灰度接口
           * 生产环境中，authCode动态生成，与APP登录手机号关联，调用大模型接口为正式接口
           */
          env:
            process.env.NODE_ENV === "production" ? "production" : "grayscale", // 使用环境 grayscale灰度环境，production生产环境
          scene: "search", //插件使用场景 搜索场景使用search，营销场景使用market
          success: () => {
            /**
             * 搜索场景需要传入回调函数，sdk初始化成功后执行回调函数
             * 搜索场景执行过回调函数后才能调用 send 方法发送搜索词
             */
            console.log("ai大模型dom初始化完成===>");
            this.sendSearch();
          },
        });
      }
    },
    sendSearch() {
      console.log("ai大模型发送消息使用回调==>");
      const wordText = this.getSearchContent();
      window.zxkf_AI_sdk.send(wordText);
      console.log("ai大模型发送消息后再显示==>");
      this.$nextTick(() => {
        this.aiDomShow = true;
      });
    },
    testAiSdkPost() {
      CommonApi.aiSearchTest()
        .then((testRes) => {
          console.log("ai搜索调用测试==>");
          console.log(testRes);
        })
        .catch((error) => {
          console.log("ai搜索调用测试==>");
          console.log(error);
        });
    },
    hideAiWrap() {
      var elementToRemove = document.getElementsByClassName("ai-wrap");
      if (elementToRemove.length > 0) {
        elementToRemove[0].style.display = "none";
      }
    },
  },
  activated() {
    // 当组件被激活时调用
    console.log("组件被激活");
    this.aiDomShow = false;
    // this.hideAiWrap()
    // if (window.zxkf_AI_sdk) {
    //   window.zxkf_AI_sdk.stop();
    // }
  },
  deactivated() {
    // 当组件被停用时调用
    console.log("组件被停用");
    this.aiDomShow = false;
    // this.hideAiWrap()
    // 在这里执行你需要的清理工作
    // if (window.zxkf_AI_sdk) {
    //   window.zxkf_AI_sdk.stop();
    // }
  },
  beforeDestroy() {
    // 当组件被销毁时调用
    console.log("组件被销毁前");
    this.aiDomShow = false;
    // this.hideAiWrap()
    // if (window.zxkf_AI_sdk) {
    //   window.zxkf_AI_sdk.stop();
    // }
  },
};
</script>

<style scoped>
.ai-search {
  position: relative;
  width: 100%;
  background: url("../../assets/images/ai-search.png") center top;
  background-size: 100% 100%;
  margin-bottom: 18px;
  padding: 10px 14px 0px 16px;
  min-height: 120px;
}

.ai-title {
}

.ai-title-en {
  font-family: PingFangSC, PingFang SC;
  font-weight: 600;
  font-size: 16px;
  color: #333333;
}

.ai-title-ch {
  font-weight: 500;
  font-size: 14px;
  color: #333333;
}

.ai-content {
  font-weight: 400;
  font-size: 13px;
  color: #333333;
}
</style>
