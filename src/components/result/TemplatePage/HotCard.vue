<template>
  <!-- 靓号 -->
  <div class="number">
    <div class="number-main">
      <template>
        <div v-for="(item,index) in dataInfo" class="number-container" :key="item.number" @click="numJumpPage(item, numberChooseUrl, index)">
          <div class="number-tag">{{ item.tagCategory }}</div>
          <div class="number-text">
            <span v-for="splitItem in item.splitPhoneNumberArr" :class="{ 'text-marking': splitItem.highlight}">{{ splitItem.value }}</span>
          </div>
        </div>
        <div class="number-container" @click="defJumpPage(numberDefJumpUrl)">
          <span class="number-text number-def-text">海量靓号任你选 ></span>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { goPageUrl, goProtogenesisPage, isApp } from "@/utils/tool";

export default {
  name: "HotCard",
  components: {},
  props: {
    dataInfo: {
      type: Array,
      default: () => [],
    }
  },
  data() {
    return {
      numberChooseUrl: 'https://dev.coc.10086.cn/coc/web6/informationRedirect/?dataList=',
      numberDefJumpUrl: 'https://chinamobileapp/rn/common/XDS00025?pageId=1956292865159372800&channelId=P00000132680'
    };
  },
  inject: ["getSearchContent", "getSearchUUID"],
  computed: {},
  watch: {},
  created() {},
  mounted() {
  },
  methods: {
    // 默认兜底跳转
    defJumpPage(url) {
      console.log(url, '海量靓号link')
      goProtogenesisPage(url)
      //goPageUrl('2', url);
    },
    numJumpPage(item, url, ids) {
      const searchContent = this.getSearchContent();
       const clickGdpObj = {
        XY_transaction_id: this.getSearchUUID(),
        WT_et: "clk",
        type: "",
        WT_envName: item.title,
        WT_markId: "",
        XY_first_class: "搜索结果页",
        XY_second_class: "",
        WT_next_url: url || '',
        WT_plat: sessionStorage.pagePlat || "",
        WT_es: sessionStorage.pageUrl || "",
        WT_ti: "搜索结果页",
        XY_pageEntry: sessionStorage.pageEntrance || "",
        // 插码方案修改2025-1-16
        WT_area_type_1: "楼层",
        areaid: "", // [区域id_模板id]
        WT_area_type_2: "全部",
        WT_area_name: "号卡卡片_选靓号",
        XY_env_type: "button",
        WT_event: 'P00000132680' || "",
        XY_gd_source: "", // [如果source=qqd，传qqd；如果source=app，传app]
        XY_scene: searchContent, // 搜索内容
        WT_si_n: "", // 物品对应的名称
        WT_goods_id: "", // 物品所对应的id信息
        XY_visit_source: sessionStorage.pageEntrance || "", // 访问来源
        WT_charge_phone: "",
        WT_errCode: "",
        WT_errMsg: "",
        XY_env_extend_attribute: "",
        XY_gd_position: ids + 1
      };
      console.log("靓号曝光", clickGdpObj);
      if (isApp()) {
        gdp("track", "clk", clickGdpObj);
      }
      const hotMobileNumDataSession = JSON.parse(sessionStorage.getItem('hotNumData'))
      console.log('numJumpPage--->', item, url, hotMobileNumDataSession, location.href)
      const configData = JSON.stringify([
        {
          sequence: '',
          chooseNumber: item.number,
          provinceCode: hotMobileNumDataSession.province,
          cityCode: hotMobileNumDataSession.city,
          selectCityAddress: hotMobileNumDataSession.cityName,
          provinceName: hotMobileNumDataSession.provinceName,
          checkCode: item.checkCode,
          reselectNumberUrl: "",
          isReselectNumberBtn: false
        }
      ])
      const urlParams = encodeURIComponent(encodeURIComponent(configData))
      const baseUrl = process.env.NODE_ENV === "production" ? url : 'https://dev.coc.10086.cn/staging-coc/web6/informationRedirect/?dataList='
      const link = baseUrl + urlParams + '&channelId=P00000132679&pageId=1943555273440882688'
      console.log('link--->', link)
      goPageUrl('2', link);
    },
  },
};
</script>

<style scoped lang='scss'>
.number {
  width: 666px;
  padding: 4px 18px 12px 18px;

  .number-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;

    .left {
      font-family: PingFangSC, PingFang SC;
      font-weight: 500;
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
        margin-top: 8px;
        .text-marking {
          color: #F3513B;
        }
      }

      .number-def-text {
        font-weight: 500;
        font-size: 28px;
      }
    }

    .number-def-img {
      margin-top: 8px;
      width: 630px;
      height: 200px;
      border-radius: 12px;
    }
  }
}
</style>