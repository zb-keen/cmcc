<template>
  <div class="hot-saleCard">
    <InnerLoading ref="loading" />
    <!-- 热销套卡 -->
    <div v-if="!loading">
    <div class="plan">
      <div class="plan-header">
        <div class="left">套餐</div>
        <div class="right" v-if="planRefreshShow" @click="planRefresh">
          <img :class="['refresh-icon', { 'change-refresh': refreshing }]"
            :src="require('@/assets/images/rxtk-refresh.png')" alt="">
          <div class="text">换一批</div>
        </div>
      </div>
      <div class="plan-main">
        <!-- 展示个数大于3，正常展示 -->
        <template v-if="planRightShow">
          <!-- <img class="main-img" v-for="(item, index) in hotMobilePlanShowList" :src="require('@/assets/images/rxtk-plan-img.png')" alt="" /> -->
          <img class="main-img" v-for="(item, index) in hotMobilePlanShowList" :key="item.itemId" :src="item.iconUrl" alt=""
            @click="jumpPage(item, index)" />
        </template>
        <!-- 展示个数小于3，展示兜底 -->
        <template
          v-else-if="hotMobilePlanShowList.length < 3 && hotMobilePlanDefData.dataList && hotMobilePlanDefData.dataList.length > 0">
          <img class="plan-def-img" :src="hotMobilePlanDefData.dataList[0].iconUrl" alt=""
            @click="jumpPage(hotMobilePlanDefData.dataList[0])"></img>
        </template>
        <!-- 接口异常，且触点兜底数据异常 -->
        <template v-else>
          <img class="plan-def-img" :src="require('@/assets/images/rxtk-plan-def.png')" alt=""
            @click="defJumpPage(planDefJumpUrl)"></img>
        </template>
      </div>
    </div>
    <!-- 靓号 -->
    <div class="number">
      <div class="number-header">
        <div class="left">靓号</div>
        <div class="right" v-if="numberRightShow" @click="handleNumberRefresh()">
          <img :class="['refresh-icon', { 'number-refresh': numberRefresh }]"
            :src="require('@/assets/images/rxtk-refresh.png')" alt="">
          <div class="text">换一批</div>
        </div>
      </div>
      <div class="number-main">
        <template v-if="numberRightShow">
          <div v-for="(item,index) in hotMobileNumList" class="number-container" :key="item.number" @click="numJumpPage(item, numberChooseUrl, index)">
            <div class="number-tag">{{ item.tagCategory }}</div>
            <div class="number-text">
              <span v-for="splitItem in item.splitPhoneNumberArr" :class="{ 'text-marking': splitItem.highlight }">{{
                splitItem.value }}</span>
            </div>
          </div>
        </template>
        <template v-else>
          <img class="number-def-img" :src="require('@/assets/images/rxtk-card-def.png')" alt=""
            @click="defJumpPage(numberDefJumpUrl)"></img>
        </template>
      </div>
    </div>
    </div>
  </div>
</template>

<script>
import InnerLoading from "./InnerLoading.vue";
import { isIOS, isHarmony, isApp, getDefaultPageLocalInfo } from "@/utils/tool";
import { checkHighlightNumber } from "@/utils/phoneNumberHighlight";
import { getQueryStringNew, handleGetUrlParam, checkoutKeywordsToSession, isProtogenesisSkip, goProtogenesisPage, goPageUrl, Debounce } from "@/utils/tool";
import CommonApi from "@/api/index";

export default {
  name: "HotSaleCard",
  components: {
    InnerLoading,
  },
  data() {
    return {
      paramData: {
        province: "571",
        version: "10_10",
        beans: [],
        pageEntrance: "1",
        loginProvince: "", // 用户归属地-省份
        loginCity: "", // 用户归属地-地市
        phoneNumber: "",
        cid: "",
        xk: "",
        osType: "",
        iopResult: "",
        correctionFlag: true,
        city: "0000",
      },
      planDefJumpUrl: 'https://dev.coc.10086.cn/coc/web2/mengCard/?pageId=1505840151669555200&channelId=P00000132679', // 套餐兜底跳转
      numberDefJumpUrl: 'https://dev.coc.10086.cn/coc/web6/campusCardPolymerization/?pageId=1943555273440882688&channelId=P00000132679', // 号卡兜底跳转
      numberChooseUrl: 'https://dev.coc.10086.cn/coc/web6/informationRedirect/?dataList=', // 选号跳转
      hotMobilePlanData: [], // 套餐数据
      hotMobilePlanDataList: [], // 套餐总列表数据
      hotMobilePlanShowList: [], // 套餐展示列表数据
      hotMobilePlanDefData: {}, // 套餐兜底数据
      hotMobileNumList: [], // 靓号列表数据
      hotMobileNumInfo: {}, // 靓号数据信息
      refreshing: false,
      numberRefresh: false,
      loading: true
    };
  },
  inject: [
    "getSearchContent",
    "getCorrectionFlag",
    "getSearchUUID",
  ],
  props: {
    isShow: {
      type: Boolean,
    }
  },
  computed: {
    // 套餐是否正确展示
    planRightShow() {
      // 大于等于三个
      return this.hotMobilePlanShowList.length >= 3
    },
    // 套餐刷新是否展示
    planRefreshShow() {
      // 套餐正确展示且，总数据中有点位有两条数据以上
      return this.planRightShow && this.hotMobilePlanDataList.some(item => item.length > 1)
    },
    numberRightShow() {
      return this.hotMobileNumList.length >= 2
    }
  },
  watch: {
    isShow: {
      handler(newVal) {
        console.log('HotSaleCard--watch-isShow', newVal)
        if (!newVal) {
          this.loading = true
          return
        }
        this.init()
      },
    }
  },
  created() {
    //this.init()
  },
  mounted() {},
  methods: {
    init() {
      this.getParamData()
      // 本地数据
      if (this.hotMobilePlanData && this.hotMobilePlanData.length > 0) {
        console.log('keep---data', this.hotMobilePlanData)
        this.loading = true
        this.$refs.loading.loadingShow()
        this.handlePlanData(this.hotMobilePlanData)  
      } else {
        // 获取精彩内容数据
        this.getHotMobilePlan()
      }
      this.getHotMobileNum()
    },
    handlePlanData(data) {
      this.hotMobilePlanData = data
      // 提前截取前六个点位，第七个点位为兜底数据
      this.hotMobilePlanDataList = data
        .slice(0, 6)
        .filter(item => item.dataList && item.dataList.length > 0)
        .map(item => item.dataList)
      // 点位7为兜底数据
      this.hotMobilePlanDefData = data.find(item => item.position === "7")

      // 展示套餐数据，一开始默认为第一索引
      this.hotMobilePlanShowList = this.hotMobilePlanDataList.map(item => {
        return item[0]
      })
      this.hotMobilePlanShowList.forEach((item, index) => {
        console.log('展示套餐数据--->', item)
        const clickGdpObj = {
          XY_transaction_id: this.getSearchUUID(),
          WT_et: "imp",
          type: "",
          WT_envName: '',
          WT_markId: "",
          XY_first_class: "搜索默认页",
          XY_second_class: "",
          WT_next_url: "",
          WT_plat: sessionStorage.pagePlat || "",
          WT_es: sessionStorage.pageUrl || "",
          WT_ti: "搜索默认页",
          XY_pageEntry: sessionStorage.pageEntrance || "",
          // 插码方案修改2025-1-16
          WT_area_type_1: "楼层",
          areaid: "", // [区域id_模板id]
          WT_area_type_2: "tab页",
          WT_area_name: "热销套卡_套餐",
          XY_env_type: "button",
          WT_event: "P00000132679",
          XY_gd_source: "搜索平台", // [如果source=qqd，传qqd；如果source=app，传app]
          XY_scene: "", // 搜索内容
          WT_si_n: "", // 物品对应的名称
          WT_goods_id: "", // 物品所对应的id信息
          XY_visit_source: sessionStorage.pageEntrance || "", // 访问来源
          WT_charge_phone: "",
          WT_errCode: "",
          WT_errMsg: "",
          XY_env_extend_attribute: "",
          XY_point_position: index + 1
        };
        console.log("热销套卡曝光--->", clickGdpObj);
        if (isApp()) {
          gdp("track", "clk", clickGdpObj);
        }
      })
    },
    getParamData() {
      const pageEntrance = getQueryStringNew().pageEntrance;
      const userInfo = localStorage.getItem("userInfo")
        ? JSON.parse(localStorage.getItem("userInfo"))
        : null;
      const getUrlParam = handleGetUrlParam();
      const loginProvince = userInfo?.loginProvince || (userInfo?.province ? userInfo?.province : ""); // 省份参数兜底优化
      const searchContent = this.getSearchContent();
      const iopResultRes =
        checkoutKeywordsToSession(searchContent) != "999999"
          ? checkoutKeywordsToSession(searchContent)
          : null;
      this.paramData.province = userInfo?.province || "";
      this.paramData.version = userInfo?.version ? `10_10,${userInfo?.version}` : '10_10';
      this.paramData.beans = getUrlParam.beans;
      this.paramData.pageEntrance = pageEntrance || "";
      this.paramData.loginProvince = loginProvince;
      this.paramData.loginCity = userInfo?.loginCity || "";
      this.paramData.phoneNumber = userInfo?.phoneNumber || "";
      this.paramData.cid = userInfo?.cid || "";
      this.paramData.xk = userInfo?.xk || "";
      this.paramData.osType = userInfo?.osType || "";
      this.paramData.iopResult = "";
      this.paramData.correctionFlag = this.getCorrectionFlag();
      this.paramData.city = userInfo?.city || "";
    },
    getHotMobilePlan() {
      console.log(this.paramData, 'data-query')
      this.loading = true
      this.$refs.loading.loadingShow();
      try {
        CommonApi.queryHotMobilePlan(this.paramData).then((res => {
          if (res.code == "000000" && res.data?.length > 0) {
            console.log('getHotMobilePlan--result', res.data)
            this.handlePlanData(res.data)
            this.refreshing = false
          } else {
            this.hotMobilePlanData = []
            this.hotMobilePlanDataList = []
            this.hotMobilePlanShowList = []
            this.hotMobilePlanDefData = {}
            this.refreshing = false
          }
        })).catch((error) => {
          console.log("套餐调用失败---catch");
          console.log(error);
          this.hotMobilePlanData = []
          this.hotMobilePlanDataList = []
          this.hotMobilePlanShowList = []
          this.hotMobilePlanDefData = {}
          this.refreshing = false
        });
      } catch (error) {
        console.log(error, '套餐接口失败')
        this.hotMobilePlanData = []
        this.hotMobilePlanShowList = []
        this.hotMobilePlanDataList = []
        this.refreshing = false
    
      }
    },
    getHotMobileNum() {
      console.log('号码查询---接口')
      try {
        const params = {
          province: this.paramData.province || "",
          city: this.paramData.city || "",
          version: this.paramData.version || "",
          st: isHarmony() ? 10 : isIOS ? 2 : 1, // 客户端类型 1 安卓 2 ios  10 鸿蒙
          phoneNumber: this.paramData.phoneNumber || "",
          pageEntrance: this.paramData.pageEntrance || "",
          loginProvince: this.paramData.loginProvince || "",
          loginCity: this.paramData.loginCity || "",
          touchCode: "P00000132679",
          xk: this.paramData.xk || "",
        }
        console.log('号卡请求参数', params)
        CommonApi.queryHotMobileNum(params).then(res => {
          if (res.code == "000000" && res.data) {
            console.log(res.data, '首页号码')
            setTimeout(() => {
              this.numberRefresh = false
              console.log('getHotMobileNum---end', this.numberRefresh)
            }, 1000);
            this.hotMobileNumInfo = res.data || {}
            if (!res.data?.hotMobileNumVOList || res.data?.hotMobileNumVOList.length < 2) {
              this.hotMobileNumList = []
              this.$refs.loading && this.$refs.loading.loadingHide();
              this.loading = false
              return
            }
            this.hotMobileNumList = res.data?.hotMobileNumVOList?.map((item, index) => {
              const clickGdpObj = {
                XY_transaction_id: this.getSearchUUID(),
                WT_et: "imp",
                type: "",
                WT_envName: '',
                WT_markId: "",
                XY_first_class: "搜索默认页",
                XY_second_class: "",
                WT_next_url: "",
                WT_plat: sessionStorage.pagePlat || "",
                WT_es: sessionStorage.pageUrl || "",
                WT_ti: "搜索默认页",
                XY_pageEntry: sessionStorage.pageEntrance || "",
                // 插码方案修改2025-1-16
                WT_area_type_1: "楼层",
                areaid: "", // [区域id_模板id]
                WT_area_type_2: "",
                WT_area_name: "热销套卡_靓号",
                XY_env_type: "button",
                WT_event: "P00000132679",
                XY_gd_source: "", // [如果source=qqd，传qqd；如果source=app，传app]
                XY_scene: "", // 搜索内容
                WT_si_n: "", // 物品对应的名称
                WT_goods_id: "", // 物品所对应的id信息
                XY_visit_source: sessionStorage.pageEntrance || "", // 访问来源
                WT_charge_phone: "",
                WT_errCode: "",
                WT_errMsg: "",
                XY_env_extend_attribute: "",
                XY_point_position: index + 1
              };
              console.log("热销靓号曝光--->", clickGdpObj);
              if (isApp()) {
                gdp("track", "clk", clickGdpObj);
              }
              this.loading = false
              this.$refs.loading.loadingHide();
              // 对号码信息进行高亮处理
              const splitPhoneNumberArr = this.highlightPhoneNumber(item)
              return {
                splitPhoneNumberArr,
                ...item
              }
            })
          } else {
              this.hotMobileNumList = []
              this.$refs.loading && this.$refs.loading.loadingHide();
              this.loading = false
          }
        }).catch((error) => {
            console.log("号卡调用失败---catch");
             this.hotMobileNumList = []
             this.$refs.loading && this.$refs.loading.loadingHide();
             this.loading = false
            console.log(error);
        });

      } catch (error) {
        console.log(error, '靓号接口调用失败');
        this.hotMobileNumList = []
        this.$refs.loading && this.$refs.loading.loadingHide();
        this.loading = false
      }
    },
    planRefresh() {
      this.refreshing = true
      const _hotMobilePlanShowList = []
      this.hotMobilePlanDataList.forEach((item, index) => {
        // 点位只有一个数据
        if (item.length === 1) {
          _hotMobilePlanShowList[index] = item[0]
        } else {
          // 点位有多个数据，进行索引累加处理
          // 找到对应位置的展示索引
          let findIndex = item.findIndex(i => {
            return i.itemId === this.hotMobilePlanShowList[index].itemId
          })
          // 进行索引累加
          let nextIndex = findIndex + 1
          // 索引超出总索引，进行0索引重置
          if (nextIndex > (item.length - 1)) {
            nextIndex = 0
          }
          // 对应索引赋值
          _hotMobilePlanShowList[index] = item[nextIndex]
        }
      })
      // 更新套餐展示列表数据
      this.hotMobilePlanShowList = _hotMobilePlanShowList
      setTimeout(() => {
        this.refreshing = false
        console.log('planRefresh---end', this.refreshing)
      }, 1000);
      const clickGdpObj = {
        XY_transaction_id: this.getSearchUUID(),
        WT_et: "clk",
        type: "",
        WT_envName: '换一批',
        WT_markId: "",
        XY_first_class: "搜索默认页",
        XY_second_class: "",
        WT_next_url: "",
        WT_plat: sessionStorage.pagePlat || "",
        WT_es: sessionStorage.pageUrl || "",
        WT_ti: "搜索默认页",
        XY_pageEntry: sessionStorage.pageEntrance || "",
        // 插码方案修改2025-1-16
        WT_area_type_1: "楼层",
        areaid: "", // [区域id_模板id]
        WT_area_type_2: "",
        WT_area_name: "热销套卡_套餐",
        XY_env_type: "button",
        WT_event: "P00000132679",
        XY_gd_source: "搜索平台", // [如果source=qqd，传qqd；如果source=app，传app]
        XY_scene: "", // 搜索内容
        WT_si_n: "", // 物品对应的名称
        WT_goods_id: "", // 物品所对应的id信息
        XY_visit_source: sessionStorage.pageEntrance || "", // 访问来源
        WT_charge_phone: "",
        WT_errCode: "",
        WT_errMsg: "",
        XY_env_extend_attribute: "",
      };
      console.log("套卡点击换一换埋点--->", clickGdpObj);
      if (isApp()) {
        gdp("track", "clk", clickGdpObj);
      }
    },
    handleNumberRefresh() {
      const clickGdpObj = {
        XY_transaction_id: this.getSearchUUID(),
        WT_et: "clk",
        type: "",
        WT_envName: '换一批',
        WT_markId: "",
        XY_first_class: "搜索默认页",
        XY_second_class: "",
        WT_next_url: "",
        WT_plat: sessionStorage.pagePlat || "",
        WT_es: sessionStorage.pageUrl || "",
        WT_ti: "搜索默认页",
        XY_pageEntry: sessionStorage.pageEntrance || "",
        // 插码方案修改2025-1-16
        WT_area_type_1: "楼层",
        areaid: "", // [区域id_模板id]
        WT_area_type_2: "",
        WT_area_name: "热销套卡_靓号",
        XY_env_type: "button",
        WT_event: "P00000132679",
        XY_gd_source: "搜索平台", // [如果source=qqd，传qqd；如果source=app，传app]
        XY_scene: "", // 搜索内容
        WT_si_n: "", // 物品对应的名称
        WT_goods_id: "", // 物品所对应的id信息
        XY_visit_source: sessionStorage.pageEntrance || "", // 访问来源
        WT_charge_phone: "",
        WT_errCode: "",
        WT_errMsg: "",
        XY_env_extend_attribute: "",
      };
      console.log("靓号点击换一换埋点--->", clickGdpObj);
      if (isApp()) {
        gdp("track", "clk", clickGdpObj);
      }
      this.numberRefresh = true
      this.getHotMobileNum()
    },
    jumpPage(item, index) {
      const clickGdpObj = {
        XY_transaction_id: this.getSearchUUID(),
        WT_et: "clk",
        type: "",
        WT_envName: '热销套卡',
        WT_markId: "",
        XY_first_class: "搜索默认页",
        XY_second_class: "",
        WT_next_url: item.linkAdress || '',
        WT_plat: sessionStorage.pagePlat || "",
        WT_es: sessionStorage.pageUrl || "",
        WT_ti: "搜索默认页",
        XY_pageEntry: sessionStorage.pageEntrance || "",
        // 插码方案修改2025-1-16
        WT_area_type_1: "楼层",
        areaid: "", // [区域id_模板id]
        WT_area_type_2: "tab页",
        WT_area_name: "热销套卡_套餐",
        XY_env_type: "button",
        WT_event: item.pCode || "",
        XY_gd_source: "搜索平台", // [如果source=qqd，传qqd；如果source=app，传app]
        XY_scene: "", // 搜索内容
        WT_si_n: "", // 物品对应的名称
        WT_goods_id: "", // 物品所对应的id信息
        XY_visit_source: sessionStorage.pageEntrance || "", // 访问来源
        WT_charge_phone: "",
        WT_errCode: "",
        WT_errMsg: "",
        XY_env_extend_attribute: "",
        XY_point_position: index + 1 // 位置
      };
      console.log("套卡点击埋点--->", clickGdpObj);
      if (isApp()) {
        gdp("track", "clk", clickGdpObj);
      }
      if (isProtogenesisSkip(item)) {
        goProtogenesisPage(item.linkAdress1);
      } else {
        goPageUrl(item.jumpType, item.linkAdress);
      }
    },
    // 默认兜底跳转
    defJumpPage(url) {
      goPageUrl('2', url);
    },
    //选号跳转
    numJumpPage(item, url, index) {
      const clickGdpObj = {
        XY_transaction_id: this.getSearchUUID(),
        WT_et: "clk",
        type: "",
        WT_envName: `靓号${index + 1}`,
        WT_markId: "",
        XY_first_class: "搜索默认页",
        XY_second_class: "",
        WT_next_url: url || '',
        WT_plat: sessionStorage.pagePlat || "",
        WT_es: sessionStorage.pageUrl || "",
        WT_ti: "搜索默认页",
        XY_pageEntry: sessionStorage.pageEntrance || "",
        // 插码方案修改2025-1-16
        WT_area_type_1: "楼层",
        areaid: "", // [区域id_模板id]
        WT_area_type_2: "tab页",
        WT_area_name: "热销套卡_靓号",
        XY_env_type: "button",
        WT_event: item.pCode || "",
        XY_gd_source: "", // [如果source=qqd，传qqd；如果source=app，传app]
        XY_scene: "", // 搜索内容
        WT_si_n: "", // 物品对应的名称
        WT_goods_id: "", // 物品所对应的id信息
        XY_visit_source: sessionStorage.pageEntrance || "", // 访问来源
        WT_charge_phone: "",
        WT_errCode: "",
        WT_errMsg: "",
        XY_env_extend_attribute: "",
        XY_point_position: index + 1 // 位置
      };
      console.log("靓号点击埋点--->", clickGdpObj);
      if (isApp()) {
        gdp("track", "clk", clickGdpObj);
      }
      const configData = JSON.stringify([
        {
          sequence: '',
          chooseNumber: item.number,
          provinceCode: this.hotMobileNumInfo.province,
          cityCode: this.hotMobileNumInfo.city,
          selectCityAddress: this.hotMobileNumInfo.cityName,
          provinceName: this.hotMobileNumInfo.provinceName,
          checkCode: item.checkCode,
          reselectNumberUrl: "",
          isReselectNumberBtn: false
        }
      ])
      console.log('page-configData--->', configData)
      const urlParams = encodeURIComponent(encodeURIComponent(configData))
      const baseUrl = process.env.NODE_ENV === "production" ? url : 'https://dev.coc.10086.cn/staging-coc/web6/informationRedirect/?dataList='
      const link = baseUrl + urlParams + '&channelId=P00000132679&pageId=1943555273440882688'
      console.log('page-link--->', link)
      goPageUrl('2', link);
    },
    // 号码信息高亮处理
    highlightPhoneNumber(item) {
      const userInfo = localStorage.getItem("userInfo")
        ? JSON.parse(localStorage.getItem("userInfo"))
        : null;
      // 获取到对应的号码高亮信息
      const highlightInfo = checkHighlightNumber(item, userInfo)
      // 获取号码的高亮数组，用于进行样式高亮渲染
      const numberArr = item.number.split('').map((item, index) => {
        let highlight = false
        if (highlightInfo && index >= highlightInfo.startIndex && index <= highlightInfo.endIndex) {
          highlight = true
        }
        return {
          value: item,
          highlight
        }
      })
      // 进行空格分段处理
      const spaceItem = {
        value: " ",
        highlight: false
      }
      numberArr.splice(7, 0, spaceItem)
      numberArr.splice(3, 0, spaceItem)
      return numberArr
    },
    refresh() {
      this.refreshing = true;
    }
  },
};
</script>
<style scoped lang="scss">
@keyframes planRefresh {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(180deg);
  }
}

@keyframes numberRefresh {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(180deg);
  }
}

.hot-saleCard {
  width: 690px;
  background: linear-gradient( 180deg, #FEF7F6 0%, #FFFFFF 13%, #FFFFFF 100%);;
  border: 0.02rem solid #FEDFDA;
  border-radius: 18px;
  padding: 12px;
  min-height: 400px;

  .plan {
    width: 666px;
    padding: 23px 18px 18px 18px;

    .plan-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;

      .left {
        font-family: PingFangSC, PingFang SC;
        font-weight: 600;
        font-size: 28px;
        color: #333333;
        line-height: 34px;
      }

      .right {
        display: flex;
        align-items: center;

        .refresh-icon {
          width: 32px;
          height: 32px;
          margin-right: 6px;
        }

        .text {
          font-family: PingFangSC, PingFang SC;
          font-size: 24px;
          color: #666666;
          line-height: 36px;
        }

        .change-refresh {
          animation: planRefresh 0.6s linear 0s infinite both;
        }
      }
    }

    .plan-main {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;

      .main-img {
        width: 198px;
        height: 222px;
        border-radius: 12px;
        margin-bottom: 18px;
        margin-right: 18px;
        &:nth-child(3n) {
          margin-right: 0px;
        }
      }

      .plan-def-img {
        margin-top: 8px;
        width: 630px;
        height: 200px;
        border-radius: 12px;
      }
    }
  }

  .number {
    width: 666px;
    padding: 16px 18px 18px 18px;
    .number-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;

      .left {
        font-family: PingFangSC, PingFang SC;
        font-weight: 600;
        font-size: 28px;
        color: #333333;
        line-height: 34px;
      }

      .right {
        display: flex;
        align-items: center;

        .refresh-icon {
          width: 32px;
          height: 32px;
          margin-right: 6px;
        }

        .text {
          font-family: PingFangSC, PingFang SC;
          font-size: 24px;
          color: #666666;
          line-height: 36px;
        }

        .number-refresh {
          animation: numberRefresh 0.6s linear 0s infinite both;
        }
      }
    }

    .number-main {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;

      .number-container {
        width: 306px;
        height: 99px;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #F8F8F8;
        position: relative;
        border-radius: 12px;
        margin-bottom: 18px;
        &:nth-last-child(-n+2) {
           margin-bottom: 0;
        }

        .number-tag {
          text-align: center;
          line-height: 24px;
          padding-top: 3px;
          display: inline-flex;        
          align-items: center;
          height: 28px;
          padding: 0 12px;
          background: #FDE3C9;
          border-radius: 8px 0 12px 0;
          position: absolute;
          top: 0;
          left: 0;
          font-family: PingFangSC, PingFang SC;
          font-weight: 500;
          font-size: 18px;
          color: #6F4E2F;
        }

        .number-text {
          font-family: PingFangSC, PingFang SC;
          font-weight: 600;
          font-size: 32px;
          color: #333333;
          line-height: 36px;
          margin-top: 4px;
          .text-marking {
            color: #F3513B;
          }
        }
      }

      .number-def-img {
        width: 630px;
        height: 200px;
        border-radius: 12px;
      }
    }
  }
}
</style>