<template>
  <div class="manager-wrap">
    <div v-if="showTitle" class="manager-title"></div>
    <div class="manager-header">
      <div class="header-left">
        <!-- <img class="left-avatar" src="@/assets/images/manager.png" alt="" /> -->
        <img
          class="left-avatar"
          :src="dataInfo.base64Image ? dataInfo.base64Image : dataInfo.headLink"
          alt=""
        />
      </div>
      <div class="header-right">
        <div class="work-post">
          <div class="post-name medium-text">
            {{ dataInfo.staffName ? dataInfo.staffName : "专属客户经理" }}
          </div>
          <div class="post-more" @click="jumpBasicPage(dataInfo.detailUrl)">
            <img src="@/assets/images/three-yjt.png" alt="" />
          </div>
        </div>
        <div class="work-info">
          <div>
            <span>工作年限 </span>
            <template v-if="dataInfo.workYear <= 2">
              <span class="info-num">2</span>
              <span class="info-unit">年+</span>
            </template>
            <template v-else>
              <span class="info-num">{{ Math.floor(dataInfo.workYear) }}</span>
              <span class="info-unit">年+</span>
            </template>
          </div>
          <div>
            <span>累计应答 </span>
            <template v-if="dataInfo.serviceNum < 2000">
              <span class="info-num">2000</span>
              <span class="info-unit">次+</span>
            </template>
            <template
              v-else-if="
                dataInfo.serviceNum >= 2000 && dataInfo.serviceNum < 10000
              "
            >
              <span class="info-num">{{ dataInfo.serviceNum }}</span>
              <span class="info-unit">次</span>
            </template>
            <template v-else>
              <span class="info-num">
                {{ (dataInfo.serviceNum / 10000).toFixed(2) }}
              </span>
              <span class="info-unit">万次</span>
            </template>
          </div>
          <div>
            <span>星级 </span>
            <span class="info-num">{{
              dataInfo.staffLevel <= 4 ? 4 : dataInfo.staffLevel
            }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="manager-server">
      <div
        v-if="serverList.includes('语音通话')"
        :class="serverClassName"
        @click="openVoiceOrVideo(dataInfo.buttonList.voiceInfo)"
      >
        <div class="img-wrap">
          <template v-if="dataInfo.buttonList.voiceInfo.imgUrl">
            <img
              class="server-img"
              :src="dataInfo.buttonList.voiceInfo.imgUrl"
              alt=""
            />
          </template>
          <template v-else>
            <img class="server-img" src="@/assets/images/yyth.png" alt="" />
          </template>
        </div>
        <div class="server-title">
          {{ dataInfo.buttonList.voiceInfo.title }}
        </div>
      </div>
      <div
        v-if="serverList.includes('在线沟通')"
        :class="serverClassName"
        @click="
          onlineDiscuss(dataInfo.buttonList.onlineCommunicationInfo.linkUrl)
        "
      >
        <div class="img-wrap">
          <template v-if="dataInfo.buttonList.onlineCommunicationInfo.imgUrl">
            <img
              class="server-img"
              :src="dataInfo.buttonList.onlineCommunicationInfo.imgUrl"
              alt=""
            />
          </template>
          <template v-else>
            <img class="server-img" src="@/assets/images/zxgt.png" alt="" />
          </template>
        </div>
        <div class="server-title">
          {{ dataInfo.buttonList.onlineCommunicationInfo.title }}
        </div>
      </div>
      <div
        v-if="serverList.includes('预约联系')"
        :class="serverClassName"
        @click="
          appointmentContact(dataInfo.buttonList.appointmentContact.linkUrl)
        "
      >
        <div class="img-wrap">
          <template v-if="dataInfo.buttonList.appointmentContact.imgUrl">
            <img
              class="server-img"
              :src="dataInfo.buttonList.appointmentContact.imgUrl"
              alt=""
            />
          </template>
          <template v-else>
            <img class="server-img" src="@/assets/images/yylx.png" alt="" />
          </template>
        </div>
        <!-- 已经预约过显示我的预约 -->
        <div class="server-title">
          {{
            hasAppointment
              ? "我的预约"
              : dataInfo.buttonList.appointmentContact.title
          }}
        </div>
      </div>
      <div
        v-if="serverList.includes('10088专席')"
        :class="serverClassName"
        @click="call10088Phone"
      >
        <div class="img-wrap">
          <template v-if="dataInfo.buttonList.specialSeat.imgUrl">
            <img
              class="server-img"
              :src="dataInfo.buttonList.specialSeat.imgUrl"
              alt=""
            />
          </template>
          <template v-else>
            <img class="server-img" src="@/assets/images/zx10088.png" alt="" />
          </template>
        </div>
        <div class="server-title">
          {{ dataInfo.buttonList.specialSeat.title }}
        </div>
      </div>
      <!-- 只有一个服务功能-自动补全其它服务 -->
      <div
        v-if="serverList.length === 1"
        :class="serverClassName"
        @click="jumpOtherPage(dataInfo.detailUrl)"
      >
        <div class="img-wrap">
          <img class="server-img" src="@/assets/images/khjlfw.png" alt="" />
        </div>
        <div class="server-title">其它服务</div>
      </div>
    </div>

    <!-- 运营位数据暂无 -->
    <template v-if="dataInfo.showOperateList.length">
      <div class="manager-operate" @touchmove.stop>
        <!-- <div class="operate-item">
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
      <div class="operate-item">
        <div class="operate-desc">跨省宽带3</div>
        <div class="operate-icon">
          <img src="@/assets/images/kskd.png" alt="" />
        </div>
      </div>
      <div class="operate-item">
        <div class="operate-desc">跨省宽带4</div>
        <div class="operate-icon">
          <img src="@/assets/images/kskd.png" alt="" />
        </div>
      </div> -->
        <div class="operate-wrap">
          <div
            v-for="(item, index) in dataInfo.showOperateList"
            :key="index"
            @click="jumpPage(item, index)"
            class="operate-item"
            :style="{
              width: `${dataInfo.showOperateList.length > 2 ? '42%' : '48%'}`,
            }"
          >
            <div class="operate-desc medium-text">{{ item.title }}</div>
            <div class="operate-icon">
              <template v-if="item.imgUrl">
                <img :src="item.imgUrl" alt="" />
              </template>
              <template v-else>
                <img src="@/assets/images/llzq.png" alt="" />
              </template>
            </div>
          </div>
        </div>
      </div>
    </template>
    <van-overlay :show="overlayShow" @click="overlayShow = false">
      <div class="overlay-content" @click.stop>
        <div class="confirm-div" @click="confirmCall">
          <span>拨打</span>
          <span class="phone-span">10088</span>
        </div>
        <div class="cancel-div" @click="hideOverlay">取消</div>
      </div>
    </van-overlay>
  </div>
</template>

<script>
import CommonApi from "@/api/index";
import { Debounce, isIOS, isHarmony, goPageUrl, isApp } from "@/utils/tool";

export default {
  name: "AccountManager",
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
      serverList: [], // 服务功能区按钮
      serverClassName: "server-item4", // 服务功能区域按钮类名
      hasAppointment: false, // 是否已经有预约
      overlayShow: false, // 10088安卓拨号二次确认
    };
  },
  inject: ["showLoading", "hideLoading", "getSearchContent", "getSearchUUID"],
  computed: {},
  watch: {},
  created() {},
  mounted() {
    console.log("父级传递过来的客户经理信息===>");
    console.log(this.dataInfo);
    const staffLevelStr = this.dataInfo.staffLevel;
    this.dataInfo.staffLevel = staffLevelStr.replace("星", "");
    this.dataInfo.base64Image = this.dataInfo.photo
      ? `data:image/png;base64,${this.dataInfo.photo}`
      : "";
    // 从详情页返回触发组件激活方法-重新请求查询预约状态接口-预约联系和我的预约切换
    this.hasAppointment = this.dataInfo.appointmentStatus;
    // 根据返回的配置服务功能
    const buttonListArr = this.dataInfo.buttonList;
    if (buttonListArr.voiceInfo.showStatus) {
      this.serverList.push("语音通话");
    }
    if (buttonListArr.onlineCommunicationInfo.showStatus) {
      this.serverList.push("在线沟通");
    }
    if (buttonListArr.appointmentContact.showStatus) {
      this.serverList.push("预约联系");
    }
    if (buttonListArr.specialSeat.showStatus) {
      this.serverList.push("10088专席");
    }
    // 只有一个服务功能的话 自动补齐其它服务按钮 跳转地址与客户经理详情一致
    if (this.serverList.length === 1 || this.serverList.length === 2) {
      this.serverClassName = "server-item2";
    } else if (this.serverList.length === 3) {
      this.serverClassName = "server-item3";
    } else if (this.serverList.length === 4) {
      this.serverClassName = "server-item4";
    }

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
        WT_envName: "客户经理",
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
        WT_area_name: "AI智答_客户经理", // AI智答_[三个入驻分类tab名称]
        XY_env_type: "tab",
        WT_event: "",
        XY_gd_source: "", // [如果source=qqd，传qqd；如果source=app，传app]
        XY_scene: this.getSearchContent(), // 搜索内容
        WT_si_n: "", // 物品对应的名称
        WT_goods_id: "", // 物品所对应的id信息
        XY_visit_source: sessionStorage.pageEntrance || "", // 访问来源
        WT_charge_phone: "",
        WT_errCode: "",
        WT_errMsg: "",
        XY_env_extend_attribute: "",
      };
      console.log("结果页-三个入驻-tab卡片客户经理曝光上报===>");
      console.log(tabImpGdpObj);
      if (isApp()) {
        gdp("track", "imp", tabImpGdpObj);
      }
      // 基本信息上报
      const basicImpGdpObj = {
        XY_transaction_id: this.getSearchUUID(),
        WT_et: "imp",
        WT_envName: `基本信息_${this.dataInfo.staffName}`,
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
        WT_area_name: "AI智答_客户经理", // AI智答_[三个入驻分类tab名称]
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
      console.log("结果页-三个入驻-客户经理基本信息-曝光上报===>");
      console.log(basicImpGdpObj);
      if (isApp()) {
        gdp("track", "imp", basicImpGdpObj);
      }
      // 服务功能上报
      this.serverList.map((item, index) => {
        let serverFlag = null;
        if (item === "语音通话") {
          serverFlag = "voiceInfo";
        } else if (item === "在线沟通") {
          serverFlag = "onlineCommunicationInfo";
        } else if (item === "预约联系") {
          serverFlag = "appointmentContact";
        } else if (item === "10088专席") {
          serverFlag = "specialSeat";
        }
        const serverImpGdpObj = {
          XY_transaction_id: this.getSearchUUID(),
          WT_et: "imp",
          WT_envName: `服务功能_${this.dataInfo.buttonList[serverFlag].title}`,
          WT_markId: "",
          XY_point_position: index + 1,
          XY_first_class: "搜索结果页",
          XY_second_class: "",
          WT_next_url: this.dataInfo.buttonList[serverFlag].linkUrl || "",
          WT_plat: sessionStorage.pagePlat || "",
          WT_es: sessionStorage.pageUrl || "",
          WT_ti: "搜索结果页",
          XY_pageEntry: sessionStorage.pageEntrance || "",
          // 插码方案修改2025-1-16
          WT_area_type_1: "楼层",
          areaid: "", // [区域id_模板id]
          WT_area_type_2: "全部",
          WT_area_name: "AI智答_客户经理", // AI智答_[三个入驻分类tab名称]
          XY_env_type: "button",
          WT_event: "",
          XY_gd_source: "", // [如果source=qqd，传qqd；如果source=app，传app]
          XY_scene: this.getSearchContent(), // 搜索内容
          WT_si_n: "", // 物品对应的名称
          WT_goods_id: "", // 物品所对应的id信息
          XY_visit_source: sessionStorage.pageEntrance || "", // 访问来源
          WT_charge_phone: "",
          WT_errCode: "",
          WT_errMsg: "",
          XY_env_extend_attribute: "",
        };
        console.log("结果页-三个入驻-客户经理服务功能-曝光上报===>");
        console.log(serverImpGdpObj);
        if (isApp()) {
          gdp("track", "imp", serverImpGdpObj);
        }
      });
      // 服务功能只有一个会自动补齐其它服务--使用客户经理基本信息详情跳转地址
      if (this.serverList.length === 1) {
        const serverImpGdpObj = {
          XY_transaction_id: this.getSearchUUID(),
          WT_et: "imp",
          WT_envName: `服务功能_其它服务`,
          WT_markId: "",
          XY_point_position: 2,
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
          WT_area_name: "AI智答_客户经理", // AI智答_[三个入驻分类tab名称]
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
        console.log("结果页-三个入驻-客户经理服务功能-曝光上报===>");
        console.log(serverImpGdpObj);
        if (isApp()) {
          gdp("track", "imp", serverImpGdpObj);
        }
      }
      // 活动推广上报
      this.dataInfo.showOperateList.map((item, index) => {
        const activityImpGdpObj = {
          XY_transaction_id: this.getSearchUUID(),
          WT_et: "imp",
          WT_envName: `活动推广_${item.title}`,
          WT_markId: "",
          XY_point_position: index + 1,
          XY_first_class: "搜索结果页",
          XY_second_class: "",
          WT_next_url: item.linkUrl || "",
          WT_plat: sessionStorage.pagePlat || "",
          WT_es: sessionStorage.pageUrl || "",
          WT_ti: "搜索结果页",
          XY_pageEntry: sessionStorage.pageEntrance || "",
          // 插码方案修改2025-1-16
          WT_area_type_1: "楼层",
          areaid: "", // [区域id_模板id]
          WT_area_type_2: "全部",
          WT_area_name: "AI智答_客户经理", // AI智答_[三个入驻分类tab名称]
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
        console.log("结果页-三个入驻-客户经理活动推广-曝光上报===>");
        console.log(activityImpGdpObj);
        if (isApp()) {
          gdp("track", "imp", activityImpGdpObj);
        }
      });
    },

    // 语音通话：调用音视频客服SDK
    openVoiceOrVideo: Debounce(function (voiceInfoObj) {
      const clickGdpObj = {
        XY_transaction_id: this.getSearchUUID(),
        WT_et: "clk",
        WT_envName: `服务功能_${this.dataInfo.buttonList["voiceInfo"].title}`,
        WT_markId: "",
        XY_point_position: 1,
        XY_first_class: "搜索结果页",
        XY_second_class: "",
        WT_next_url: this.dataInfo.buttonList["voiceInfo"].linkUrl || "",
        WT_plat: sessionStorage.pagePlat || "",
        WT_es: sessionStorage.pageUrl || "",
        WT_ti: "搜索结果页",
        XY_pageEntry: sessionStorage.pageEntrance || "",
        // 插码方案修改2025-1-16
        WT_area_type_1: "楼层",
        areaid: "", // [区域id_模板id]
        WT_area_type_2: "全部",
        WT_area_name: "AI智答_客户经理", // AI智答_[三个入驻分类tab名称]
        XY_env_type: "button",
        WT_event: "",
        XY_gd_source: "", // [如果source=qqd，传qqd；如果source=app，传app]
        XY_scene: this.getSearchContent(), // 搜索内容
        WT_si_n: "", // 物品对应的名称
        WT_goods_id: "", // 物品所对应的id信息
        XY_visit_source: sessionStorage.pageEntrance || "", // 访问来源
        WT_charge_phone: "",
        WT_errCode: "",
        WT_errMsg: "",
        XY_env_extend_attribute: "",
      };
      console.log("结果页-三个入驻-客户经理-语音通话-点击上报===>");
      console.log(clickGdpObj);
      if (isApp()) {
        gdp("track", "clk", clickGdpObj);
      }
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
        appKey: voiceInfoObj.appKey || "jtztty_sdk#HA61357248748", // 渠道申请的AppKey
        companyId: voiceInfoObj.channelId || "jtztty_sdk", // 渠道申请CompanyId
        phoneNum: userInfo.phoneNumber, // 需传入11位手机号
        userName: userInfo.phoneNumber, // 用户名，可传递手机号
        nickName: "", // 昵称
        provinceCode: userInfo.loginProvince, // 省编码
        sceneEntry: voiceInfoObj.sceneEntry || "383", // 小场景值，用于统计报表，限定最多两个字符，如果没有可不定义，不传值。(英文字母、数字)。具体传值可以咨询运营或者产品(7.4新增)
        guideVideoNumber: "0", // 视频客服引导页出现次数(7.4新增)
        guideVoiceNumber: "0", // 语音客服引导页出现次数(7.4新增)
        isLoadingDimensionModel: false, // 是否为装维模式。boolean类型,true使用装维模式，false不使用装维模式(7.9.0新增)
        callNum: "", // 呼叫号码。string类型，如果是装维模式需要传入指定装维号码(7.9.0新增)
        businessType: "", // 人证比对。string类型，01身份认证，02销号重入网，03宽带智能组网，04预开机(7.9.0新增)
        ext: {
          // 扩展字段,透传内容给SDK相关属性，非必须字段。(8.0.0新增)
          goodsId: "", // 商品id
          goodsIcon: "", // 商品缩略图
          goodsName: "", // 商品名称
          goodsPrice: "", // 商品价格
          goodsUrl: "", // 商品链接，URL需encode
        },
        success: function (res) {
          console.log("音视频调用成功===>");
          console.log(res);
        },
        error: function (err) {
          console.log("音视频调用失败===>");
          console.log(err);
        },
      });
    }, 150),

    // 10088专席通话
    call10088Phone: Debounce(function () {
      const clickGdpObj = {
        XY_transaction_id: this.getSearchUUID(),
        WT_et: "clk",
        WT_envName: `服务功能_${this.dataInfo.buttonList["specialSeat"].title}`,
        WT_markId: "",
        XY_point_position: 4,
        XY_first_class: "搜索结果页",
        XY_second_class: "",
        WT_next_url: this.dataInfo.buttonList["specialSeat"].linkUrl || "",
        WT_plat: sessionStorage.pagePlat || "",
        WT_es: sessionStorage.pageUrl || "",
        WT_ti: "搜索结果页",
        XY_pageEntry: sessionStorage.pageEntrance || "",
        // 插码方案修改2025-1-16
        WT_area_type_1: "楼层",
        areaid: "", // [区域id_模板id]
        WT_area_type_2: "全部",
        WT_area_name: "AI智答_客户经理", // AI智答_[三个入驻分类tab名称]
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
      console.log("结果页-三个入驻-客户经理-10088专席点击上报===>");
      console.log(clickGdpObj);
      if (isApp()) {
        gdp("track", "clk", clickGdpObj);
      }

      if (!isIOS) {
        this.overlayShow = true;
      } else {
        cmcc.callPhone({
          phoneNum: "10088",
          success: function (res) {
            // res为空
            console.log(res);
          },
          error: function (err) {
            console.log(err);
          },
        });
      }
    }, 150),

    hideOverlay() {
      this.overlayShow = false;
    },

    // 非ios确认呼叫10088客服
    confirmCall() {
      this.overlayShow = false;
      cmcc.callPhone({
        phoneNum: "10088",
        success: function (res) {
          // res为空
          console.log(res);
        },
        error: function (err) {
          console.log(err);
        },
      });
    },

    onlineDiscuss(jumpUrl) {
      console.log("在线沟通");
      const clickGdpObj = {
        XY_transaction_id: this.getSearchUUID(),
        WT_et: "clk",
        WT_envName: `服务功能_${this.dataInfo.buttonList["onlineCommunicationInfo"].title}`,
        WT_markId: "",
        XY_point_position: 2,
        XY_first_class: "搜索结果页",
        XY_second_class: "",
        WT_next_url:
          this.dataInfo.buttonList["onlineCommunicationInfo"].linkUrl || "",
        WT_plat: sessionStorage.pagePlat || "",
        WT_es: sessionStorage.pageUrl || "",
        WT_ti: "搜索结果页",
        XY_pageEntry: sessionStorage.pageEntrance || "",
        // 插码方案修改2025-1-16
        WT_area_type_1: "楼层",
        areaid: "", // [区域id_模板id]
        WT_area_type_2: "全部",
        WT_area_name: "AI智答_客户经理", // AI智答_[三个入驻分类tab名称]
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
      console.log("结果页-三个入驻-客户经理--在线沟通点击上报===>");
      console.log(clickGdpObj);
      if (isApp()) {
        gdp("track", "clk", clickGdpObj);
      }

      setTimeout(() => {
        this.hideLoading();
        goPageUrl("2", jumpUrl);
      }, 500);
    },

    appointmentContact(jumpUrl) {
      console.log("预约联系");
      const clickGdpObj = {
        XY_transaction_id: this.getSearchUUID(),
        WT_et: "clk",
        WT_envName: `服务功能_${this.dataInfo.buttonList["appointmentContact"].title}`,
        WT_markId: "",
        XY_point_position: 3,
        XY_first_class: "搜索结果页",
        XY_second_class: "",
        WT_next_url:
          this.dataInfo.buttonList["appointmentContact"].linkUrl || "",
        WT_plat: sessionStorage.pagePlat || "",
        WT_es: sessionStorage.pageUrl || "",
        WT_ti: "搜索结果页",
        XY_pageEntry: sessionStorage.pageEntrance || "",
        // 插码方案修改2025-1-16
        WT_area_type_1: "楼层",
        areaid: "", // [区域id_模板id]
        WT_area_type_2: "全部",
        WT_area_name: "AI智答_客户经理", // AI智答_[三个入驻分类tab名称]
        XY_env_type: "button",
        WT_event: "",
        XY_gd_source: "",
        XY_scene: this.getSearchContent(), // 搜索内容
        WT_si_n: "",
        WT_goods_id: "", // 物品所对应的id信息
        XY_visit_source: sessionStorage.pageEntrance || "", // 访问来源
        WT_charge_phone: "",
        WT_errCode: "",
        WT_errMsg: "",
        XY_env_extend_attribute: "",
      };
      console.log("结果页-三个入驻-客户经理-预约联系点击上报===>");
      console.log(clickGdpObj);

      setTimeout(() => {
        this.hideLoading();
        goPageUrl("2", jumpUrl);
      }, 500);
    },

    // 跳转客户经理详情页面
    jumpBasicPage(jumpUrl) {
      // 点击插码上报
      const clickGdpObj = {
        XY_transaction_id: this.getSearchUUID(),
        WT_et: "clk",
        WT_envName: `基本信息_${this.dataInfo.staffName}`,
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
        WT_area_name: "AI智答_客户经理", // AI智答_[三个入驻分类tab名称]
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
      console.log("结果页-三个入驻-客户经理-基本信息-点击上报===>");
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

    // 其它服务
    jumpOtherPage(jumpUrl) {
      const clickGdpObj = {
        XY_transaction_id: this.getSearchUUID(),
        WT_et: "clk",
        WT_envName: `服务功能_其它服务`,
        WT_markId: "",
        XY_point_position: 2,
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
        WT_area_name: "AI智答_客户经理", // AI智答_[三个入驻分类tab名称]
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
      console.log("结果页-三个入驻-客户经理-服务功能-其它服务-点击上报===>");
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

    jumpPage(item, index) {
      const clickGdpObj = {
        XY_transaction_id: this.getSearchUUID(),
        WT_et: "clk",
        WT_envName: `活动推广_${item.title}`,
        WT_markId: "",
        XY_point_position: index + 1,
        XY_first_class: "搜索结果页",
        XY_second_class: "",
        WT_next_url: item.linkUrl || "",
        WT_plat: sessionStorage.pagePlat || "",
        WT_es: sessionStorage.pageUrl || "",
        WT_ti: "搜索结果页",
        XY_pageEntry: sessionStorage.pageEntrance || "",
        // 插码方案修改2025-1-16
        WT_area_type_1: "楼层",
        areaid: "", // [区域id_模板id]
        WT_area_type_2: "全部",
        WT_area_name: "AI智答_客户经理", // AI智答_[三个入驻分类tab名称]
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
      console.log("结果页-三个入驻-客户经理-活动推广--点击上报===>");
      console.log(clickGdpObj);
      if (isApp()) {
        gdp("track", "clk", clickGdpObj);
      }

      this.showLoading();
      setTimeout(() => {
        this.hideLoading();
        goPageUrl("2", item.linkUrl);
      }, 500);
    },

    // ios详情页返回时--查询更新客户经理预约状态信息
    updateAppointment() {
      const userInfo = localStorage.getItem("userInfo")
        ? JSON.parse(localStorage.getItem("userInfo"))
        : null;
      const version = userInfo?.version ? userInfo?.version.split("_")[1] : "";
      console.log("版本信息===>", version);

      CommonApi.queryAppointStatus({
        searchWords: this.getSearchContent(),
        cellNum: userInfo ? userInfo.phoneNumber : "",
        province: userInfo ? userInfo.loginProvince : "",
        cv: version, // 客户端版本号
        st: isHarmony() ? 10 : isIOS ? 2 : 1, // 客户端类型 1 安卓 2 ios  10 鸿蒙
      })
        .then((res) => {
          if (res.code === "000000") {
            this.hasAppointment = res.data;
          } else {
            console.log("查询客户经理预约状态失败==>");
          }
        })
        .catch((error) => {
          console.log("查询客户经理预约状态调用失败==>");
          console.log(error);
        });
    },
  },
};
</script>

<style scoped lang='scss'>
.manager-wrap {
  padding: 20px 30px 20px 30px;
}

.manager-title {
  // font-weight: 700;
  // font-size: 32px;
  // color: #000000;
  margin-bottom: 35px;
  // font-family: PingFangSC, sans-serif;
  width: 130px;
  height: 40px;
  background-image: url("../../../assets/images/kehu-active.png");
  background-position: center top;
  background-size: 100% 100%;
}

.manager-header {
  display: flex;
  margin-bottom: 30px;
}

.header-left {
  width: 116px;
  height: 102px;
  text-align: center;
  margin-right: 30px;
  background-image: url("../../../assets/images/avatar-bg.png");
  background-position: center top;
  background-size: 100% 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.left-avatar {
  width: 94px;
  height: 94px;
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
  font-weight: 700;
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
  color: #874d17;
  font-family: DIN-Condensed;
  text-align: left;
  font-style: normal;
}

.info-unit {
  font-weight: 400;
  font-size: 22px;
  color: #874d17;
}

.manager-server {
  display: flex;
  justify-content: space-between;
}

.server-item2 {
  width: 46%;
}

.server-item3 {
  width: 35%;
}

.server-item4 {
  width: 24%;
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
  background: #fff2e9;
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

.manager-operate {
  margin-top: 28px;
  margin-left: -28px;
  margin-right: -28px;
}

.operate-wrap {
  padding-left: 28px;
  display: -webkit-box;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.operate-wrap::-webkit-scrollbar {
  display: none;
}

.operate-item {
  width: 48%;
  padding: 14px 18px 16px 26px;
  background: #f8f8f8;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-right: 2%;
}

.operate-desc {
  font-size: 26px;
  font-weight: 700;
  color: #333333;
  max-width: 75%;
  white-space: nowrap; /* 禁止文本换行 */
  overflow: hidden; /* 隐藏超出容器的文本 */
  text-overflow: ellipsis; /* 使用省略号表示溢出的文本 */
}

// .medium-text {
//   font-weight: 500;
// }

// @supports not (font-weight: 500) {
//   .medium-text {
//     font-weight: 700;
//   }
// }

.operate-icon {
  display: flex;
}

.operate-icon img {
  width: 48px;
  height: 48px;
  background: lightcyan;
}

.van-overlay {
  z-index: 101; // 为了覆盖掉tabs 左右可滑动隐藏的元素(灰白色--left-cover-right-cover)
}

.overlay-content {
  position: absolute;
  left: 15px;
  right: 15px;
  bottom: 60px;

  .confirm-div {
    font-family: Arial;
    margin-bottom: 15px;
    background: #fff;
    color: #2892ff;
    font-weight: 700;
    font-size: 36px;
    text-align: center;
    line-height: 100px;
    border-radius: 24px;

    .phone-span {
      margin-left: 4px;
    }
  }

  .cancel-div {
    background: #fff;
    color: #2892ff;
    font-size: 36px;
    text-align: center;
    line-height: 100px;
    border-radius: 24px;
  }
}
</style>
