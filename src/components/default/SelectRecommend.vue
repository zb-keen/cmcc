<template>
  <div class="select-recommend">
    <InnerLoading ref="loading" />
    <div class="choice-wrap">
      <template v-if="rectangleData.length > 0 || squareData.length > 0">
        <div class="choice-header">
          <div class="header-left">人气专区</div>
          <div class="header-icon">
            <img
              :src="require('@/assets/images/purple-fire.png')"
              draggable="false"
              alt=""
            />
          </div>
        </div>
      </template>
      <!-- 大图 -->
      <div v-if="rectangleData.length > 0" class="choice-body">
        <template v-for="(rectItem, rectIndex) in rectangleData">
          <div
            :key="rectIndex"
            class="choice-bitem"
            @click="jumpPage(rectItem, rectIndex, 'rect')"
          >
            <div class="bitem-img">
              <!-- <img :src="rectItem.iconUrl" alt="" /> -->
              <!-- <img src="../../assets/images/100appzsll.png" alt="" /> -->
              <img
                :src="rectItem.iconUrl"
                alt=""
              />
            </div>
            <div class="bitem-title">{{ rectItem.title }}</div>
          </div>
        </template>
      </div>
      <!-- 小图 -->
      <div v-if="squareData.length > 0" class="choice-footer">
        <template v-for="(squItem, squIndex) in squareData">
          <div
            :key="squIndex"
            class="choice-fitem"
            @click="jumpPage(squItem, squIndex, 'square')"
          >
            <div class="fitem-img">
              <img :src="squItem.iconUrl" alt="" />
            </div>
            <div class="fitem-title">{{ squItem.title }}</div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import CommonApi from "@/api/index";
import {
  isApp,
  updateHistoryData,
  goPageUrl,
  getDefaultPageLocalInfo,
  handleGetUrlParam
} from "@/utils/tool";
import {
  jxtjDataNew,
  rectangleData,
  zsczData,
  kequnData,
} from "./HomeNewPhoneList"; // 新版首页精选推荐兜底数据
import InnerLoading from "./InnerLoading.vue";

export default {
  name: "SelectRecommend",
  components: {
    InnerLoading,
  },
  data() {
    return {
      mockJXTJData: null, // 精选推荐兜底数据
      mockRectangleData: null, // 精选推荐长图前端资源数据
      pageEntrance: null,
      isKeQun: false, // 当前登录用户是否客群用户
      param: {
        province: "571", // 省编码
        city: "0000", // 市编码
        version: "7.9.0", // 客户端版本号
        phoneNumber: "19805289925", // 登录手机号码
        pageEntrance: "1", // 页面入口枚举,1:普通版首页,2:PLUS 版首页,3:全球通首页,4:动感地带首页,5:分类页,6:权益页,7:探索页,8:商城页
        loginProvince: "", // 用户归属地-省份
        loginCity: "", // 用户归属地-地市
      },
      rectangleData: [], // 人气专区顶部大图
      squareData: [], // 人气专区底部小图
      rectMetaList: [],
      squMetaList: [],
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
    "getCorrectionFlag"
  ],
  props: {
    isShow: {
      type: Boolean
    },
    impAttrsHot: {
      type: Object,
      default: () => {},
    },
  },  
  watch: {
    isShow: {
      handler(newV) {
        if (!newV) {
          return
        }
        // 轮播计数值
        const key = `recommend_last_count`;
        let loopCount = localStorage.getItem(key)
        if (!loopCount) {
          loopCount = '0'
          localStorage.setItem(key, '1')
        } else {
          let c = Number(loopCount) + 1
          localStorage.setItem(key, String(c))
        }
        this.getRecommendMetaDt().then(()=> {
          this.rectangleData = this.getCurRenderListByCount(this.rectMetaList, loopCount)
          this.squareData = this.getCurRenderListByCount(this.squMetaList, loopCount)
          this.handleGdpImp(this.rectangleData, "rect");
          this.handleGdpImp(this.squareData, "square");
        })
      }
    }
  },
  mounted() {
    // 承接异常兜底数据
    let tempjxtjDt = JSON.parse(JSON.stringify(jxtjDataNew))
    tempjxtjDt.data.rectangleVOList = tempjxtjDt.data.rectangleVOList.sort(() => Math.random() - 0.5).slice(0, 4)
    this.mockJXTJData = tempjxtjDt;
    this.mockRectangleData = JSON.parse(JSON.stringify(rectangleData));

    const userInfo = localStorage.getItem("userInfo")
      ? JSON.parse(localStorage.getItem("userInfo"))
      : null;
    const getUrlParam = handleGetUrlParam();
    const pageEntrance = sessionStorage.getItem("pageEntrance");
    this.pageEntrance = pageEntrance;

    this.param = {
      province: userInfo?.province || "",
      city: userInfo?.city || "",
      beans: getUrlParam.beans,
      version: userInfo.version ? `10_10,${userInfo.version}` : "10_10",
      // st: userInfo?.st || "",
      loginCity: userInfo?.loginCity || "",
      phoneNumber: userInfo?.phoneNumber || "",
      cid: "",
      xk: userInfo?.xk || "",
      osType: userInfo?.osType || "",
      pageEntrance,
      loginProvince:
        userInfo?.loginProvince ||
        (userInfo?.province ? userInfo?.province : ""), // 省份参数兜底优化
      loginCity: userInfo?.loginCity || "",
      iopResult: "",
      correctionFlag: this.getCorrectionFlag()
    };
    // 轮播计数重置
    const key = `recommend_last_count`;
    localStorage.setItem(key, '0')
  },
  methods: {    
    // 客群匹配
    // 29元80GB大流量卡 数据洞察  数据洞察ID：LZYZXUTS0250525
    getKeQunData() {
      const userInfo = localStorage.getItem("userInfo")
        ? JSON.parse(localStorage.getItem("userInfo"))
        : null;
      try {
        CommonApi.queryCustomerMatch({
          provinceCode:
            userInfo?.loginProvince ||
            (userInfo?.province ? userInfo?.province : ""),
          mobile: userInfo?.phoneNumber || "",
          sysSource: "sys_wmh",
          customerMap: {
            SJDC: [],
            UTS: ["LZYZXUTS0250525"],
            IOP: [],
          },
        })
          .then((res) => {
            if (res.code === "000000") {
              console.log(res.data);
              if (
                res.data &&
                res.data.data &&
                res.data.data["LZYZXUTS0250525"] === "1"
              ) {
                console.log("匹配到客群");
                this.isKeQun = true;
              } else {
                console.log("未匹配到客群");
                this.isKeQun = false;
              }
            } else {
              console.log("客群匹配查询失败");
              this.isKeQun = false;
            }
          })
          .catch((error) => {
            console.log("客群匹配失败");
            console.log(error);
            this.isKeQun = false;
          });
      } catch (error) {
        console.log("客群匹配调用失败");
        console.log(error);
        this.isKeQun = false;
      }
    },

    // 获取精选推荐数据--目前只有底部小图数据使用接口返回
    async getRecommendMetaDt() {
      if (this.rectMetaList.length > 0 && this.squMetaList.length > 0) {
        return
      }
      let rectDt, squDt = []
      // 显示加载效果
      this.$refs.loading.loadingShow();
      let res = await CommonApi.querySelectedRecommendNew(this.param).catch(err=> {})
      this.$refs.loading.loadingHide();
      let rectPass =  this.dtCheck(res?.data?.rectangleVOList)
      let squPass =  this.dtCheck(res?.data?.squareVOList)
      rectDt = rectPass ? res?.data?.rectangleVOList : this.mockJXTJData.data?.rectangleVOList
      squDt = squPass ? res?.data?.squareVOList : this.mockJXTJData.data?.squareVOList
      this.rectMetaList = rectDt || []
      this.squMetaList = squDt || []
    },

    dtCheck(dt) {
      return (dt || []).some(n=> (n?.selectRecommondResultVOS || []).length !== 0)
    },

    getCurRenderListByCount(listDt, loopCount) {
      return listDt.map(n=> {
        let arr = (n.selectRecommondResultVOS || [])
        if (arr.length === 0) {
          return null
        }
        let imgIndex = Number(loopCount) % n.selectRecommondResultVOS.length
        return n.selectRecommondResultVOS[imgIndex] || null
      }).filter(n=> !!n)
    },

    // 曝光插码上报
    handleGdpImp(renderData, renderArea) {
      for (let index = 0; index < renderData.length; index++) {
        const itemDt = renderData[index]
        const event = itemDt.pCode || ''
        const source = (itemDt.dataSource == 1 ? 'qqd' : '') || ''
        const markId = (itemDt.dataSource == 1 ? itemDt.workOrderId : '') || ''
        const goods_id = (itemDt.dataSource == 1 ? itemDt.itemId : '') || ''
        const impGdpObj = {
          XY_transaction_id: this.getSearchUUID(),
          WT_et: "imp",
          WT_envName: renderData[index].title,
          WT_markId: markId,
          XY_point_position: renderArea === "rect" ? index + 1 : index + 5,
          XY_first_class: "搜索默认页",
          XY_second_class: "精选推荐",
          WT_next_url: renderData[index].linkAddressUrl
            ? renderData[index].linkAddressUrl
            : "",
          WT_plat: sessionStorage.pagePlat || "",
          WT_es: sessionStorage.pageUrl || "",
          WT_ti: "搜索默认页",
          XY_pageEntry: sessionStorage.pageEntrance || "",
          // 插码方案修改2025-1-16
          WT_area_type_1: "楼层",
          areaid: "", // [区域id_模板id]
          WT_area_type_2: "tab页",
          WT_area_name: "精选推荐",
          XY_env_type: "pic",
          WT_event: event,
          XY_gd_source: source,
          XY_scene: "", // 搜索内容
          WT_si_n: renderData[index].title, // 若是搜索物品传具体物品名称，否则传空
          WT_goods_id: goods_id, // 若是搜索物品传物品对应的id信息，否则传空
          XY_visit_source: sessionStorage.pageEntrance || "", // 访问来源
          WT_charge_phone: "",
          WT_errCode: "",
          WT_errMsg: "",
          XY_env_extend_attribute: "",
        };
        console.log("默认页-精选推荐tab-数据曝光上报===>");
        console.log(impGdpObj);
        if (isApp()) {
          gdp("track", "imp", impGdpObj);
        }
      }
    },

    jumpPage(item, index, renderArea) {
      console.log("首页重构-精选推荐点击====>");
      console.log(item);
      const itemDt = item
      const event = itemDt.pCode || ''
      const source = (itemDt.dataSource == 1 ? 'qqd' : '') || ''
      const markId = (itemDt.dataSource == 1 ? itemDt.workOrderId : '') || ''
      const goods_id = (itemDt.dataSource == 1 ? itemDt.itemId : '') || ''
      const clickGdpObj = {
        XY_transaction_id: this.getSearchUUID(),
        WT_et: "clk",
        WT_envName: item.title,
        WT_markId: markId,
        XY_point_position: renderArea === "rect" ? index + 1 : index + 5,
        XY_first_class: "搜索默认页",
        XY_second_class: "精选推荐",
        WT_next_url: item.linkAddressUrl ? item.linkAddressUrl : "",
        WT_plat: sessionStorage.pagePlat || "",
        WT_es: sessionStorage.pageUrl || "",
        WT_ti: "搜索默认页",
        XY_pageEntry: sessionStorage.pageEntrance || "",
        // 插码方案修改2025-1-16
        WT_area_type_1: "楼层",
        areaid: "", // [区域id_模板id]
        WT_area_type_2: "tab页",
        WT_area_name: "精选推荐",
        XY_env_type: "pic",
        WT_event: event,
        XY_gd_source: source, // [如果source=qqd，传qqd；如果source=app，传app]
        XY_scene: "", // 搜索内容
        WT_si_n: item.title, // 若是搜索物品传具体物品名称，否则传空
        WT_goods_id: goods_id, // 若是搜索物品传物品对应的id信息，否则传空
        XY_visit_source: sessionStorage.pageEntrance || "", // 访问来源
        WT_charge_phone: "",
        WT_errCode: "",
        WT_errMsg: "",
        XY_env_extend_attribute: "",
      };
      console.log("默认页-精选推荐tab-数据点击上报===>");
      console.log(clickGdpObj);
      if (isApp()) {
        gdp("track", "clk", clickGdpObj);
      }

      let hisData = {
        markName: item.title,
        actionUrl: item?.linkAddressUrl || "",
        actionType: item?.dataType || "",
      };
      updateHistoryData(this.pageEntrance, hisData);

      if (item.linkAddressUrl) {
        this.handleBlur();
        goPageUrl(item.dataType, item.linkAddressUrl);
      } else {
        this.updateSearchContent(item.title);
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

<style scoped lang='scss'>
.select-recommend {
  background: linear-gradient(180deg, #fbf2ff 0%, #ffffff 120px);
  border-radius: 18px;
  border: 1px solid #f8e8ff;
  padding: 24px 29px 30px 29px;
  box-sizing: border-box;
  min-height: 400px;
  position: relative;

  .choice-wrap {
    .choice-header {
      display: flex;
      align-items: center;
      margin-bottom: 24px;

      .header-left {
        font-family: PingFangSC, PingFang SC;
        font-weight: 700;
        font-size: 28px;
        color: #000000;
        line-height: 34px;
        text-align: left;
        font-style: normal;
      }

      .header-icon {
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;

        img {
          width: 32px;
          height: 32px;
        }
      }
    }

    .choice-body {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;

      .choice-bitem {
        margin-bottom: 24px;

        .bitem-img {
          width: 300px;
          height: 152px;
          margin-bottom: 14px;
          border-radius: 12px;
          overflow: hidden;

          img {
            width: 100%;
            height: 100%;
          }
        }

        .bitem-title {
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          font-size: 24px;
          color: #333333;
          line-height: 32px;
          text-align: left;
          font-style: normal;
          width: 300px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }

    .choice-footer {
      display: flex;
      //justify-content: space-between;
      justify-content: flex-start;
      flex-wrap: wrap;

      .choice-fitem {
        margin-bottom: 24px;
        margin-right: 22px;
        &:nth-child(5n) {
          margin-right: 0;
        }

        .fitem-img {
          width: 100px;
          height: 100px;
          margin-bottom: 14px;
          border-radius: 12px;
          overflow: hidden;

          img {
            width: 100%;
            height: 100%;
          }
        }

        .fitem-title {
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          font-size: 24px;
          color: #333333;
          line-height: 32px;
          text-align: left;
          font-style: normal;
          width: 108px;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        &:nth-child(6) {
          margin-bottom: 0;
        }

        &:nth-child(7) {
          margin-bottom: 0;
        }

        &:nth-child(8) {
          margin-bottom: 0;
        }

        &:nth-child(9) {
          margin-bottom: 0;
        }

        &:nth-child(10) {
          margin-bottom: 0;
        }
      }
    }
  }
}
</style>
