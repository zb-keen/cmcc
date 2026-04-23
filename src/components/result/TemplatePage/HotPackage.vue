<template>
  <!-- 热销套卡 -->
  <div class="plan">
    <div class="plan-main">
      <!-- 展示个数大于3，正常展示 -->
        <!-- <img class="main-img" v-for="(item, index) in hotMobilePlanShowList" :src="require('@/assets/images/rxtk-plan-img.png')" alt="" /> -->
        <img class="main-img" v-for="item in hotMobilePlanShowList" :key="item.itemId" :src="item.iconUrl" alt=""  @click="jumpPage(item, index)"/>
    </div>
  </div>
</template>

<script>
import { isProtogenesisSkip, goProtogenesisPage, goPageUrl, Debounce, isApp } from "@/utils/tool";

export default {
  name: "HotPackage",
  components: {},
  props: {
    dataInfo: {
      type: Array,
      default: () => [],
    }
  },
  data() {
    return {
      hotMobilePlanDataList: [], // 套餐总列表数据
      hotMobilePlanShowList: [], // 套餐展示列表数据
    };
  },
  inject: ["getSearchUUID", "getSearchContent"],
  computed: {
  },
  watch: {},
  created() {
    this.init()
  },
  mounted() {
  },
  methods: {
    init() {
      // 截取第一个到第七个点位的数据，第八个点位为兜底数据
      this.hotMobilePlanDataList = this.dataInfo
        .slice(1, 7)
        .filter(item => item.dataList && item.dataList.length > 0)
        .map(item => item.dataList)

      this.hotMobilePlanShowList = this.hotMobilePlanDataList.map(item => {
        return item[0]
      })
      const searchContent = this.getSearchContent()
      this.hotMobilePlanShowList.forEach((item, index) => {
        const clickGdpObj = {
          XY_transaction_id: this.getSearchUUID(),
          WT_et: "imp",
          type: "",
          WT_envName: item.title,
          WT_markId: "",
          XY_first_class: "搜索结果页",
          XY_second_class: "",
          WT_next_url: item.linkAdress || '',
          WT_plat: sessionStorage.pagePlat || "",
          WT_es: sessionStorage.pageUrl || "",
          WT_ti: "搜索结果页",
          XY_pageEntry: sessionStorage.pageEntrance || "",
          // 插码方案修改2025-1-16
          WT_area_type_1: "楼层",
          areaid: "", // [区域id_模板id]
          WT_area_type_2: "全部",
          WT_area_name: "号卡卡片_选套餐",
          XY_env_type: "button",
          WT_event: 'P00000132680' || "",
          XY_gd_source: "搜索平台", // [如果source=qqd，传qqd；如果source=app，传app]
          XY_scene: searchContent, // 搜索内容
          WT_si_n: "", // 物品对应的名称
          WT_goods_id: "", // 物品所对应的id信息
          XY_visit_source: sessionStorage.pageEntrance || "", // 访问来源
          WT_charge_phone: "",
          WT_errCode: "",
          WT_errMsg: "",
          XY_env_extend_attribute: "",
          XY_gd_position: index + 1
        };
        console.log("套餐曝光上报", clickGdpObj);
        if (isApp()) {
          gdp("track", "clk", clickGdpObj);
        }
      })
    },
    planRefresh() {
      console.log('套餐换一批')
      const _hotMobilePlanShowList = []
      this.hotMobilePlanDataList.forEach((item, index) => {
        // 点位只有一个数据
        if (item.length === 1) {
          _hotMobilePlanShowList[index] = item[0]
        }else {
          // 点位有多个数据，进行索引累加处理
          // 找到对应位置的展示索引
          let findIndex = item.findIndex(i => {
            return i.itemId === this.hotMobilePlanShowList[index].itemId
          })
          // 进行索引累加
          let nextIndex = findIndex + 1
          // 索引超出总索引，进行0索引重置
          if (nextIndex > (item.length -1)) {
            nextIndex = 0
          }
          // 对应索引赋值
          _hotMobilePlanShowList[index] = item[nextIndex]          
        }
      })
      // 更新套餐展示列表数据
      this.hotMobilePlanShowList = _hotMobilePlanShowList
    },
    jumpPage(item, index) {
      const searchContent = this.getSearchContent()
      const clickGdpObj = {
        XY_transaction_id: this.getSearchUUID(),
        WT_et: "clk",
        type: "",
        WT_envName: item.title,
        WT_markId: "",
        XY_first_class: "搜索结果页",
        XY_second_class: "",
        WT_next_url: item.linkAdress || '',
        WT_plat: sessionStorage.pagePlat || "",
        WT_es: sessionStorage.pageUrl || "",
        WT_ti: "搜索结果页",
        XY_pageEntry: sessionStorage.pageEntrance || "",
        // 插码方案修改2025-1-16
        WT_area_type_1: "楼层",
        areaid: "", // [区域id_模板id]
        WT_area_type_2: "全部",
        WT_area_name: "号卡卡片_选套餐",
        XY_env_type: "button",
        WT_event: 'P00000132680' || "",
        XY_gd_source: "搜索平台", // [如果source=qqd，传qqd；如果source=app，传app]
        XY_scene: searchContent, // 搜索内容
        WT_si_n: "", // 物品对应的名称
        WT_goods_id: "", // 物品所对应的id信息
        XY_visit_source: sessionStorage.pageEntrance || "", // 访问来源
        WT_charge_phone: "",
        WT_errCode: "",
        WT_errMsg: "",
        XY_env_extend_attribute: "",
        XY_gd_position: index + 1
      };
      console.log("套餐点击曝光", clickGdpObj);
      if (isApp()) {
        gdp("track", "clk", clickGdpObj);
      }
      if (isProtogenesisSkip(item)) {
        console.log("跳转链接", item.linkAdress1);
        goProtogenesisPage(item.linkAdress1);
      } else {
        console.log("跳转url", item.linkAdress);
        goPageUrl(item.jumpType, item.linkAdress);
      }
    }
  },
};
</script>

<style scoped lang='scss'>
.plan{
    width: 666px;
    padding: 4px 18px 12px 18px;
    .plan-header{
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
      .left{
        font-family: PingFangSC, PingFang SC;
        font-weight: 500;
        font-size: 28px;
        color: #333333;
        line-height: 34px;
      }
      .right{
        display: flex;
        align-items: center;
        .refresh-icon{
          width: 32px;
          height: 32px;
          margin-right: 6px;
        }
        .text{
          font-family: PingFangSC, PingFang SC;
          font-size: 24px;
          color: #666666;
          line-height: 36px;
        }
      }
    }
    .plan-main{
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      .main-img{
        width: 198px;
        height: 222px;
        border-radius: 12px;
        margin-bottom: 18px;
        margin-right: 18px;
        &:nth-child(3n){
          margin-right: 0px;
        }
      }
      .plan-def-img{
        margin-top: 8px;
        width: 630px;
        height: 200px;
        border-radius: 12px;
      }
    }
  }
</style>