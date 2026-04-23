<template>
  <div class="engineer-wrap">
    <div v-if="showTitle" class="engineer-title"></div>
    <div class="engineer-header">
      <div class="header-left">
        <!-- <img class="left-avatar" src="@/assets/images/engineer.png" alt="" /> -->
        <img
          class="left-avatar"
          :src="
            dataInfo.photo ? dataInfo.photo : '@/assets/images/engineer.png'
          "
          alt=""
        />
      </div>
      <div class="header-right">
        <div class="work-post">
          <div class="post-name">
            {{ dataInfo ? dataInfo.realName : "" }}
          </div>
          <div class="post-more" @click="jumpPage(dataInfo.detailUrl)">
            <img src="@/assets/images/three-yjt.png" alt="" />
          </div>
        </div>
        <div class="work-info">
          <div>
            服务满意度
            <span class="info-num">{{ dataInfo.satisfaction }}</span>
            <span class="info-unit">分</span>
          </div>
          <div>
            <span>工作年限 </span>
            <template v-if="dataInfo.workYear <= 1">
              <span class="info-num">1</span>
              <span class="info-unit">年</span>
            </template>
            <template v-else>
              <span class="info-num">{{ Math.floor(dataInfo.workYear) }}</span>
              <span class="info-unit">年</span>
            </template>
          </div>
          <div>
            星级
            <span class="info-num">{{ dataInfo.starLevel }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="engineer-server">
      <div class="server-item" @click="contactEngineer">
        <div class="img-wrap">
          <img class="server-img" src="@/assets/images/lxgcs.png" alt="" />
        </div>
        <div class="server-title">联系工程师</div>
      </div>
      <div class="server-item" @click="otherService(dataInfo.otherServiceUrl)">
        <div class="img-wrap">
          <img class="server-img" src="@/assets/images/qtfw.png" alt="" />
        </div>
        <div class="server-title">其它服务</div>
      </div>
    </div>
    <van-dialog
      v-model="showDialog"
      title="确认呼叫"
      :message="dialogMessage"
      show-cancel-button
      confirm-button-text="确认呼叫"
      cancel-button-text="取消"
      @confirm="dialogConfirm"
      @cancel="dialogCancel"
    >
    </van-dialog>
    <!-- <div class="engineer-server">
      <div class="server-item">
        <div class="img-wrap">
          <img class="server-img" src="@/assets/images/lxgcs.png" alt="" />
        </div>
        <div class="server-title">联系工程师</div>
      </div>
      <div class="server-item">
        <div class="img-wrap">
          <img class="server-img" src="@/assets/images/qjWifi.png" alt="" />
        </div>
        <div class="server-title">全家WiFi</div>
      </div>
      <div class="server-item">
        <div class="img-wrap">
          <img class="server-img" src="@/assets/images/gqds.png" alt="" />
        </div>
        <div class="server-title">高清电视</div>
      </div>
      <div class="server-item">
        <div class="img-wrap">
          <img class="server-img" src="@/assets/images/zhkj.png" alt="" />
        </div>
        <div class="server-title">智慧看家</div>
      </div>
    </div> -->
    <!-- 运营位数据暂无 -->
    <!-- <div class="engineer-operate">
      <div class="operate-item">
        <div class="operate-desc">流量专区</div>
        <div class="operate-icon">
          <img src="@/assets/images/llzq.png" alt="" />
        </div>
      </div>
      <div class="operate-item">
        <div class="operate-desc">跨省宽带</div>
        <div class="operate-icon">
          <img src="@/assets/images/kskd.png" alt="" />
        </div>
      </div>
    </div> -->
  </div>
</template>

<script>
import CommonApi from "@/api/index";
import { Debounce, goPageUrl, isApp } from "@/utils/tool";
import { Dialog } from "vant";

export default {
  name: "ZhiJiaEngineer",
  components: {},
  props: {
    dataInfo: {
      type: Object,
    },
    showTitle: {
      type: Boolean,
    },
  },
  data() {
    return {
      isInitFlag: false, // 是否已初始化
      dialogMessage: "", // 确认呼叫弹窗的内容信息
      showDialog: false,
      userAuthorizeState: "0",
    };
  },
  inject: ["showLoading", "hideLoading", "getSearchContent", "getSearchUUID"],
  computed: {},
  watch: {},
  created() {},
  mounted() {
    console.log("父级传递过来的爱家工程师信息===>");
    console.log(this.dataInfo);
    this.userAuthorizeState = this.dataInfo.userAuthorize;

    // 处理插码上报
    this.handleGdpImp();
  },
  methods: {
    // 曝光上报插码
    handleGdpImp() {
      // tba卡片曝光上报
      const tabImpGdpObj = {
        XY_transaction_id: this.getSearchUUID(),
        WT_et: "imp",
        WT_envName: "爱家工程师",
        WT_markId: "",
        XY_point_position: "",
        XY_first_class: "搜索结果页",
        XY_second_class: "",
        WT_next_url: "",
        WT_plat: sessionStorage.pagePlat || "",
        WT_es: sessionStorage.pageUrl || "",
        WT_ti: "搜索结果页",
        XY_pageEntry: sessionStorage.pageEntrance || "",
        // 插码方案修改2025-1-16
        WT_area_type_1: "楼层",
        areaid: "", // [区域id_模板id]
        WT_area_type_2: "全部",
        WT_area_name: "AI智答_爱家工程师", // AI智答_[三个入驻分类tab名称]
        XY_env_type: "tab",
        WT_event: "",
        XY_gd_source: "",
        XY_scene: this.getSearchContent(), // 搜索内容
        WT_si_n: "", // 物品对应的名称
        WT_goods_id: "", // 物品所对应的id信息
        XY_visit_source: sessionStorage.pageEntrance || "", // 访问来源
        WT_charge_phone: "",
        WT_errCode: "",
        WT_errMsg: "",
        XY_env_extend_attribute: "",
      };
      console.log("结果页-三个入驻-爱家工程师tab卡片-曝光上报===>");
      console.log(tabImpGdpObj);
      if (isApp()) {
        gdp("track", "imp", tabImpGdpObj);
      }
      // 基本信息上报
      const basicImpGdpObj = {
        XY_transaction_id: this.getSearchUUID(),
        WT_et: "imp",
        WT_envName: `基本信息_${this.dataInfo.realName}`,
        WT_markId: "",
        XY_point_position: "",
        XY_first_class: "搜索结果页",
        XY_second_class: "",
        WT_next_url: this.dataInfo.detailUrl,
        WT_plat: sessionStorage.pagePlat || "",
        WT_es: sessionStorage.pageUrl || "",
        WT_ti: "搜索结果页",
        XY_pageEntry: sessionStorage.pageEntrance || "",
        // 插码方案修改2025-1-16
        WT_area_type_1: "楼层",
        areaid: "", // [区域id_模板id]
        WT_area_type_2: "全部",
        WT_area_name: "AI智答_爱家工程师", // AI智答_[三个入驻分类tab名称]
        XY_env_type: "pic",
        WT_event: "",
        XY_gd_source: "",
        XY_scene: this.getSearchContent(), // 搜索内容
        WT_si_n: "", // 物品对应的名称
        WT_goods_id: "", // 物品所对应的id信息
        XY_visit_source: sessionStorage.pageEntrance || "", // 访问来源
        WT_charge_phone: "",
        WT_errCode: "",
        WT_errMsg: "",
        XY_env_extend_attribute: "",
      };
      console.log("结果页-三个入驻-爱家工程师-基本信息-曝光上报===>");
      console.log(basicImpGdpObj);
      if (isApp()) {
        gdp("track", "imp", basicImpGdpObj);
      }
      // 服务功能前端固定
      const serverImpGdpObj1 = {
        XY_transaction_id: this.getSearchUUID(),
        WT_et: "imp",
        WT_envName: `服务功能_联系工程师`,
        WT_markId: "",
        XY_point_position: 1,
        XY_first_class: "搜索结果页",
        XY_second_class: "",
        WT_next_url: "",
        WT_plat: sessionStorage.pagePlat || "",
        WT_es: sessionStorage.pageUrl || "",
        WT_ti: "搜索结果页",
        XY_pageEntry: sessionStorage.pageEntrance || "",
        // 插码方案修改2025-1-16
        WT_area_type_1: "楼层",
        areaid: "", // [区域id_模板id]
        WT_area_type_2: "全部",
        WT_area_name: "AI智答_爱家工程师", // AI智答_[三个入驻分类tab名称]
        XY_env_type: "button",
        WT_event: "",
        XY_gd_source: "",
        XY_scene: this.getSearchContent(), // 搜索内容
        WT_si_n: "", // 物品对应的名称
        WT_goods_id: "", // 物品所对应的id信息
        XY_visit_source: sessionStorage.pageEntrance || "", // 访问来源
        WT_charge_phone: "",
        WT_errCode: "",
        WT_errMsg: "",
        XY_env_extend_attribute: "",
      };
      const serverImpGdpObj2 = {
        XY_transaction_id: this.getSearchUUID(),
        WT_et: "imp",
        WT_envName: `服务功能_其它服务`,
        WT_markId: "",
        XY_point_position: 2,
        XY_first_class: "搜索结果页",
        XY_second_class: "",
        WT_next_url: this.dataInfo.otherServiceUrl,
        WT_plat: sessionStorage.pagePlat || "",
        WT_es: sessionStorage.pageUrl || "",
        WT_ti: "搜索结果页",
        XY_pageEntry: sessionStorage.pageEntrance || "",
        // 插码方案修改2025-1-16
        WT_area_type_1: "楼层",
        areaid: "", // [区域id_模板id]
        WT_area_type_2: "全部",
        WT_area_name: "AI智答_爱家工程师", // AI智答_[三个入驻分类tab名称]
        XY_env_type: "button",
        WT_event: "",
        XY_gd_source: "",
        XY_scene: this.getSearchContent(), // 搜索内容
        WT_si_n: "", // 物品对应的名称
        WT_goods_id: "", // 物品所对应的id信息
        XY_visit_source: sessionStorage.pageEntrance || "", // 访问来源
        WT_charge_phone: "",
        WT_errCode: "",
        WT_errMsg: "",
        XY_env_extend_attribute: "",
      };
      console.log("结果页-三个入驻-爱家工程师服务-联系工程师-曝光上报===>");
      console.log(serverImpGdpObj1);
      console.log("结果页-三个入驻-爱家工程师服务-其它服务-曝光上报===>");
      console.log(serverImpGdpObj2);
      if (isApp()) {
        gdp("track", "imp", serverImpGdpObj1);
        gdp("track", "imp", serverImpGdpObj2);
      }
      // 活动功能无
    },

    // 跳转爱家工程师详情页面
    jumpPage(jumpUrl) {
      const clickGdpObj = {
        XY_transaction_id: this.getSearchUUID(),
        WT_et: "clk",
        WT_envName: `基本信息_${this.dataInfo.realName}`,
        WT_markId: "",
        XY_point_position: "",
        XY_first_class: "搜索结果页",
        XY_second_class: "",
        WT_next_url: this.dataInfo.detailUrl,
        WT_plat: sessionStorage.pagePlat || "",
        WT_es: sessionStorage.pageUrl || "",
        WT_ti: "搜索结果页",
        XY_pageEntry: sessionStorage.pageEntrance || "",
        // 插码方案修改2025-1-16
        WT_area_type_1: "楼层",
        areaid: "", // [区域id_模板id]
        WT_area_type_2: "全部",
        WT_area_name: "AI智答_爱家工程师", // AI智答_[三个入驻分类tab名称]
        XY_env_type: "pic",
        WT_event: "",
        XY_gd_source: "",
        XY_scene: this.getSearchContent(), // 搜索内容
        WT_si_n: "", // 物品对应的名称
        WT_goods_id: "", // 物品所对应的id信息
        XY_visit_source: sessionStorage.pageEntrance || "", // 访问来源
        WT_charge_phone: "",
        WT_errCode: "",
        WT_errMsg: "",
        XY_env_extend_attribute: "",
      };
      console.log("结果页-三个入驻-爱家工程师-基本信息-点击上报===>");
      console.log(clickGdpObj);
      if (isApp()) {
        gdp("track", "clk", clickGdpObj);
      }
      this.showLoading();
      setTimeout(() => {
        this.hideLoading();
        goPageUrl("2", jumpUrl);
      }, 500);
    },

    // 联系工程师
    contactEngineer: Debounce(function () {
      // 点击插码上报
      const clickGdpObj = {
        XY_transaction_id: this.getSearchUUID(),
        WT_et: "clk",
        WT_envName: `服务功能_联系工程师`,
        WT_markId: "",
        XY_point_position: 1,
        XY_first_class: "搜索结果页",
        XY_second_class: "",
        WT_next_url: "",
        WT_plat: sessionStorage.pagePlat || "",
        WT_es: sessionStorage.pageUrl || "",
        WT_ti: "搜索结果页",
        XY_pageEntry: sessionStorage.pageEntrance || "",
        // 插码方案修改2025-1-16
        WT_area_type_1: "楼层",
        areaid: "", // [区域id_模板id]
        WT_area_type_2: "全部",
        WT_area_name: "AI智答_爱家工程师", // AI智答_[三个入驻分类tab名称]
        XY_env_type: "button",
        WT_event: "",
        XY_gd_source: "",
        XY_scene: this.getSearchContent(), // 搜索内容
        WT_si_n: "", // 物品对应的名称
        WT_goods_id: "", // 物品所对应的id信息
        XY_visit_source: sessionStorage.pageEntrance || "", // 访问来源
        WT_charge_phone: "",
        WT_errCode: "",
        WT_errMsg: "",
        XY_env_extend_attribute: "",
      };
      console.log("结果页-三个入驻-爱家工程师-联系工程师-点击上报===>");
      console.log(clickGdpObj);
      if (isApp()) {
        gdp("track", "clk", clickGdpObj);
      }
      var currentDate = new Date();
      var currentHour = currentDate.getHours();
      if (currentHour >= 8 && currentHour < 20) {
        // 如果授权直接打开音视频通话
        // 用户授权 0未授权 1授权
        if (this.userAuthorizeState === "1") {
          this.openEngineerVoice();
        } else {
          // 确认呼叫弹窗
          const userInfo = localStorage.getItem("userInfo")
            ? JSON.parse(localStorage.getItem("userInfo"))
            : null;
          const maskPhone =
            userInfo.phoneNumber.slice(0, 3) +
            "****" +
            userInfo.phoneNumber.slice(7);
          this.dialogMessage = `您即将呼叫爱家工程师，并将\n${maskPhone}作为您和工程师的联系号码`;
          this.showDialog = true;
        }
      } else {
        // 工程师工作时间弹窗
        Dialog.alert({
          title: "温馨提示",
          message: "工程师工作时间为：\n08:00-20:00",
          confirmButtonText: "我知道了",
        }).then(() => {
          // on close
          console.log("用户关闭工程师工作时间弹窗");
        });
      }
    }, 150),

    dialogConfirm() {
      // 处理号码授权呼叫信息---调用接口
      console.log("确认呼叫");
      const userInfo = localStorage.getItem("userInfo")
        ? JSON.parse(localStorage.getItem("userInfo"))
        : null;
      CommonApi.threeUserAuthorize({
        cellNum: userInfo ? userInfo.phoneNumber : "",
      })
        .then((res) => {
          if (res.code === "000000" && res.data) {
            console.log("爱家工程师呼叫授权成功==>");
            this.userAuthorizeState = 1;
            this.showDialog = false;
            this.openEngineerVoice();
          } else {
            console.log("爱家工程师呼叫授权失败==>");
          }
        })
        .catch((error) => {
          console.log("爱家工程师呼叫授权调用失败==>");
          console.log(error);
        });
    },

    dialogCancel() {
      // 视为未授权
      console.log("取消呼叫");
      this.showDialog = false;
    },

    // 拉起爱家工程师的音频通话
    openEngineerVoice() {
      const userInfo = localStorage.getItem("userInfo")
        ? JSON.parse(localStorage.getItem("userInfo"))
        : null;
      if (!userInfo) {
        return;
      }
      cmcc.startVoipVoiceOrVideo({
        debug: false,
        type: "0", // 0 语音客服  1 视频客服
        useOneScreen: false, // true  使用同屏 false 不使用同屏
        useGonetoneUserFlag: false, // 是否使用全球通用户专属视觉页面，如果传true，需先自行校验是全球通用户
        voiceCallUseOnline: false, // 是否走热线混排，看该省份该渠道是否支持， 大多数情况下为false
        appKey: "jtztty_sdk#ZH46048899506", // 渠道申请的AppKey
        companyId: "jtztty_sdk", // 渠道申请CompanyId
        phoneNum: userInfo.phoneNumber, // 需传入11位手机号
        userName: userInfo.phoneNumber, // 用户名，可传递手机号
        nickName: "", // 昵称
        provinceCode: userInfo.loginProvince, // 省编码
        sceneEntry: "354", // 小场景值，用于统计报表，限定最多两个字符，如果没有可不定义，不传值。(英文字母、数字)。具体传值可以咨询运营或者产品(7.4新增)
        guideVideoNumber: "0", // 视频客服引导页出现次数(7.4新增)
        guideVoiceNumber: "0", // 语音客服引导页出现次数(7.4新增)
        isLoadingDimensionModel: false, // 是否为装维模式。boolean类型,true使用装维模式，false不使用装维模式(7.9.0新增)
        callNum: "", // 呼叫号码。string类型，如果是装维模式需要传入指定装维号码(7.9.0新增)
        businessType: "", // 人证比对。string类型，01身份认证，02销号重入网，03宽带智能组网，04预开机(7.9.0新增)
        ext: {
          // 扩展字段,透传内容给SDK相关属性，非必须字段。(8.0.0新增)
          engMode: true,
          engPhoto: this.dataInfo.photo,
          engRefer: `爱家工程师${this.dataInfo.realName}`,
        }, // 呼叫工程师音频独有参数
        success: function (res) {
          console.log("音视频调用成功===>");
          console.log(res);
        },
        error: function (err) {
          console.log("音视频调用失败===>");
          console.log(err);
        },
      });
    },

    otherService(jumpUrl) {
      // 点击插码上报
      const clickGdpObj = {
        XY_transaction_id: this.getSearchUUID(),
        WT_et: "clk",
        WT_envName: `服务功能_其它服务`,
        WT_markId: "",
        XY_point_position: 2,
        XY_first_class: "搜索结果页",
        XY_second_class: "",
        WT_next_url: jumpUrl,
        WT_plat: sessionStorage.pagePlat || "",
        WT_es: sessionStorage.pageUrl || "",
        WT_ti: "搜索结果页",
        XY_pageEntry: sessionStorage.pageEntrance || "",
        // 插码方案修改2025-1-16
        WT_area_type_1: "楼层",
        areaid: "", // [区域id_模板id]
        WT_area_type_2: "全部",
        WT_area_name: "AI智答_爱家工程师", // AI智答_[三个入驻分类tab名称]
        XY_env_type: "button",
        WT_event: "",
        XY_gd_source: "",
        XY_scene: this.getSearchContent(), // 搜索内容
        WT_si_n: "", // 物品对应的名称
        WT_goods_id: "", // 物品所对应的id信息
        XY_visit_source: sessionStorage.pageEntrance || "", // 访问来源
        WT_charge_phone: "",
        WT_errCode: "",
        WT_errMsg: "",
        XY_env_extend_attribute: "",
      };
      console.log("结果页-三个入驻-爱家工程师-其它服务-点击上报===>");
      console.log(clickGdpObj);
      if (isApp()) {
        gdp("track", "clk", clickGdpObj);
      }
      this.showLoading();
      setTimeout(() => {
        this.hideLoading();
        goPageUrl("2", jumpUrl);
      }, 500);
    },
  },
};
</script>

<style scoped lang='scss'>
.engineer-wrap {
  padding: 20px 30px 20px 30px;
}

.engineer-title {
  // font-weight: 700;
  // font-size: 32px;
  // color: #000000;
  margin-bottom: 35px;
  // font-family: PingFangSC, sans-serif;
  width: 160px;
  height: 40px;
  background-image: url("../../../assets/images/zhijia-active.png");
  background-position: center top;
  background-size: 100% 100%;
}

.engineer-header {
  display: flex;
  margin-bottom: 30px;
}

.header-left {
  width: 116px;
  height: 102px;
  text-align: center;
  margin-right: 30px;
}

.left-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}

.header-right {
  flex-grow: 1;
  padding-right: 6px;
}

.work-post {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
}

.post-name {
  /* font-weight: 500; */
  font-weight: bold;
  font-size: 28px;
  color: #333333;
  text-align: left;
}

.post-more {
  font-size: 24px;
  display: flex;
  align-items: center;
}

.post-more img {
  width: 24px;
  height: 24px;
}

.work-info {
  display: flex;
  justify-content: space-between;
  font-weight: 400;
  font-size: 24px;
  color: rgba(0, 0, 0, 0.7);
  text-align: left;
  padding-right: 20px;
}

.info-num {
  /* font-weight: bold;
  font-size: 15px; */
  font-weight: normal;
  font-size: 30px;
  color: #006cdb;
  font-family: DIN-Condensed;
  text-align: left;
  font-style: normal;
}

.info-unit {
  font-weight: 400;
  font-size: 22px;
  color: #006cdb;
}

.engineer-server {
  display: flex;
  justify-content: space-between;
  padding: 0 10%;
}

.server-item {
  /* width: 24%; */
  width: 46%;
}

.img-wrap {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin: 0 auto;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ecf6ff;
}

.server-img {
  width: 48px;
  height: 48px;
}

.server-title {
  font-weight: 400;
  font-size: 24px;
  color: rgba(0, 0, 0, 0.9);
  text-align: center;
}

.engineer-operate {
  display: flex;
  justify-content: space-between;
  margin-top: 28px;
}

.operate-item {
  width: 48%;
  padding: 14px 18px 16px 26px;
  background: #f8f8f8;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.operate-desc {
  font-weight: 600;
  font-size: 26px;
  color: #333333;
}

.operate-icon {
  display: flex;
}

.operate-icon img {
  width: 48px;
  height: 48px;
  background: lightcyan;
}
</style>
