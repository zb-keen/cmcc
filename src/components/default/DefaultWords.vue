<template>
  <div
    class="default-words"
    v-if="
      (defaultWord && defaultWord.markName) || (realData && realData.length)
    "
    ref="DefaultWords"
    imp-position-id="default-words"
    imp-type="once"
    imp-track="imp"
    :imp-attrs="impAttrs"
  >
    <template v-if="defaultWord && defaultWord.markName">
      <span @click="jumpPage(defaultWord, 1)">
        {{ defaultWord.markName | filterChar }}
      </span>
      <!-- 数据回显默认词的点击index值从1或从2开始 -->
      <template v-if="realData && realData.length">
        <span
          v-for="(item, index) in realData"
          :key="item.markId"
          @click="jumpPage(item, index + 2)"
        >
          {{ item.markName | filterChar }}
        </span>
      </template>
    </template>
    <template v-else>
      <!-- 数据回显默认词的点击index值从1或从2开始 -->
      <template v-if="realData && realData.length">
        <span
          v-for="(item, index) in realData"
          :key="item.markId"
          @click="jumpPage(item, index + 1)"
        >
          {{ item.markName | filterChar }}
        </span>
      </template>
    </template>

    <!-- 默认词这里的显示逻辑 只显示三个 url获取一个默认词+接口返回匹配处理
    根据链接上的默认词和结果集中的数据进行匹配，匹配上的取结果集中与链接默认词一致的数据再加后两位，未匹配上直接取结果集中前三位数据
    如： 链接上的词：10元10GB（ID：100） 结果集返回的顺序如下：
    第一种情况（能够根据链接上的词/ID找到结果集中的数据）：会员（ID：90）、权益（ID：91）、10元10GB（ID：100）、抖音（ID：92）、爱奇艺（ID：93）、流量（ID：94）、手机（ID：95）
    --这种取10元10GB（ID：100）、抖音（ID：92）、爱奇艺（ID：93）返回前端展示；

    第二种情况（能够根据链接上的词/ID匹配不到结果集中的数据）：会员（ID：90）、权益（ID：91）、抖音（ID：92）、爱奇艺（ID：93）、流量（ID：94）、手机（ID：95）、账单（ID：96）
    --这种取会员（ID：90）、权益（ID：91）、抖音（ID：92）返回前端展示

    注：搜索框和搜索框下方在未匹配的时候都要注意下，搜索框中展示第一个词，也就是会员（未匹配的情况下） -->
  </div>
</template>

<script>
import {
  handleChar,
  updateHistoryData,
  goPage,
  isApp,
  intersectionObserver,
  getQueryString,
  getQueryStringNew,
} from "@/utils/tool";

export default {
  name: "default-words",
  inject: [
    "getDefaultWord",
    "updateSearchContent",
    "updateCurrentCom",
    "getResult",
    "handleBlur",
    "getSearchUUID",
    "updateSearchUUID",
    "updateWordType",
  ],
  props: {
    defaultWords: {
      type: Array,
      default: () => [],
    },
    impAttrsDefaultWords: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      dom: null,
      pageEntrance: null,
    };
  },
  watch: {
    dom: {
      handler(newVal) {
        if (newVal) {
          if (JSON.stringify(this.impAttrs) != "{}") {
            let temp = JSON.parse(JSON.stringify(this.impAttrs));
            delete temp?.area_id;
            delete temp?.type;
            delete temp?.WT_plat;
            delete temp?.WT_es;
            delete temp?.WT_ti;
            for (const key in temp) {
              temp[key] = JSON.stringify(temp[key]);
            }
            let obj = {
              XY_transaction_id: this.getSearchUUID(),
              area_id: this.impAttrs.area_id,
              type: this.impAttrs.type,
              WT_plat: sessionStorage.pagePlat || "",
              WT_es: sessionStorage.pageUrl || "",
              WT_ti: "搜索默认页",
              XY_pageEntry: sessionStorage.pageEntrance || "",
              ...temp,
            };
            // 区域曝光的参数格式有问题--暂时摒弃区域曝光的方式
            // intersectionObserver(this.$refs.DefaultWords, obj, "DefaultWords");
          }
        }
      },
      deep: true,
    },
    defaultWord: {
      handler(newVal) {
        if (newVal && newVal.markName) {
          this.$nextTick(() => {
            this.dom = this.$refs.DefaultWords.innerHTML;
          });
        }
      },
      deep: true,
    },
  },
  computed: {
    impAttrs() {
      let obj = this.impAttrsDefaultWords;
      if (JSON.stringify(obj) !== "{}") {
        // 逻辑调整 先判断url中默认词是否匹配到了
        let isMatchFlag = false;
        if (this.defaultWord && this.defaultWord.markName) {
          let indexD = this.defaultWords.findIndex(
            (e) => e.markId === this.defaultWord.markId
          ); // url默认词有pcode才上报
          if (indexD !== -1) {
            isMatchFlag = true;
            // 匹配上 默认词的index必定为1
            const impAttrsImpObj = {
              WT_et: "imp",
              WT_event: this.defaultWord?.pCode || "",
              WT_envName: this.defaultWord?.markName || "",
              WT_markId: `${this.defaultWord?.advBusiType || ""}_${
                this.defaultWord?.markId || ""
              }`,
              WT_next_url: this.defaultWord?.actionUrl || "",
              // WT_es: sessionStorage.pageUrl || '',
              // WT_ti: '搜索默认页',
              XY_pageEntry: sessionStorage.pageEntrance || "",
              // 插码方案修改2025-1-16
              WT_area_type_1: "楼层",
              areaid: `${obj.areaid}_1`, // 该区域对应的区域id_模板id_位置
              WT_area_type_2: "默认搜索词",
              WT_area_name: "默认搜索词",
              XY_env_type: "",
              XY_point_position: "1",
              XY_gd_source: "搜索平台",
              XY_scene: this.defaultWord?.markName || "",
              WT_es: sessionStorage.pageUrl || "", // 页面路径
              WT_ti: "搜索默认页", // 页面名称
              XY_visit_source: sessionStorage.pageEntrance || "", // 访问来源
              WT_plat: sessionStorage.pagePlat || "", // 渠道
              XY_transaction_id: this.getSearchUUID(),
            };
            obj[this.defaultWord.pCode || ""] = impAttrsImpObj;
            // 单一上报
            console.log("默认词url匹配上--单一曝光上报===>");
            console.log(impAttrsImpObj);
            if (isApp()) {
              gdp("track", "imp", impAttrsImpObj);
            }
          }
        }
        // 如果url匹配上默认词 index + 2  否则 index + 1
        this.realData.forEach((ele, index) => {
          const impAttrsImpObj = {
            WT_et: "imp",
            WT_event: ele?.pCode || "",
            WT_envName: ele?.markName || "",
            WT_markId: `${ele?.advBusiType || ""}_${ele?.markId || ""}`,
            WT_next_url: ele.actionType == "4" ? ele.iconCode : ele.actionUrl,
            // WT_es: sessionStorage.pageUrl || '',
            // WT_ti: '搜索默认页',
            XY_pageEntry: sessionStorage.pageEntrance || "",
            // 插码方案修改2025-1-16
            WT_area_type_1: "楼层",
            areaid: isMatchFlag
              ? `${obj.areaid}_${index + 2}`
              : `${obj.areaid}_${index + 1}`, // 该区域对应的区域id_模板id_位置
            WT_area_type_2: "默认搜索词",
            WT_area_name: "默认搜索词",
            XY_env_type: "",
            XY_point_position: isMatchFlag ? index + 2 : index + 1,
            XY_gd_source: "搜索平台",
            XY_scene: ele?.markName || "",
            WT_es: sessionStorage.pageUrl || "", // 页面路径
            WT_ti: "搜索默认页", // 页面名称
            XY_visit_source: sessionStorage.pageEntrance || "", // 访问来源
            WT_plat: sessionStorage.pagePlat || "", // 渠道
            XY_transaction_id: this.getSearchUUID(),
          };
          obj[ele.pCode || ""] = impAttrsImpObj;
          // 单一上报
          console.log("默认词数据截取后的--单一曝光上报===>");
          console.log(impAttrsImpObj);
          if (isApp()) {
            gdp("track", "imp", impAttrsImpObj);
          }
        });

        this.$nextTick(() => {
          this.dom = this.$refs.DefaultWords.innerHTML;
        });
      }
      return obj;
    },
    defaultWord() {
      return this.getDefaultWord();
    },
    realData() {
      let data;
      if (this.defaultWord && this.defaultWord.markName) {
        data = this.defaultWords.slice(0, 2);
      } else {
        data = this.defaultWords.slice(0, 3);
      }
      return data;
    },
  },
  filters: {
    filterChar(val) {
      return handleChar(val);
    },
  },
  mounted() {
    // 从会话中获取页面入口信息
    // this.pageEntrance = getQueryStringNew().pageEntrance;
    this.pageEntrance = sessionStorage.getItem("pageEntrance");
  },
  methods: {
    jumpPage(item, indexFlag) {
      const impAttrsObj = this.impAttrsDefaultWords;
      // 跳转时也要添加是否匹配上的判断
      let isMatchFlag = false;
      if (this.defaultWord && this.defaultWord.markName) {
        let indexD = this.defaultWords.findIndex(
          (e) => e.markId === this.defaultWord.markId
        ); // url默认词有pcode才上报
        if (indexD !== -1) {
          isMatchFlag = true;
        }
      }
      if (isApp()) {
        // let obj = {
        //   WT_event: item?.pCode || "",
        //   WT_envName: item?.markName || "",
        //   WT_markId: `${item.advBusiType}_${item?.markId}` || "",
        //   WT_next_url: item.actionType == "4" ? item.iconCode : item.actionUrl,
        //   // WT_es: sessionStorage.pageUrl || '',
        //   // WT_ti: '搜索默认页',
        //   XY_pageEntry: sessionStorage.pageEntrance || "",
        // };
        // 插码方案修改2025-1-16
        let obj1 = {
          WT_et: "clk",
          WT_area_type_1: "楼层",
          areaid: isMatchFlag
            ? `${impAttrsObj.areaid}_${indexFlag}`
            : `${impAttrsObj.areaid}_${indexFlag - 1}`, // 该区域对应的区域id_模板id_位置
          WT_area_type_2: "默认搜索词",
          WT_area_name: "默认搜索词",
          XY_env_type: "",
          XY_point_position: indexFlag,
          WT_event: item?.pCode || "",
          XY_gd_source: "搜索平台",
          WT_markId: "",
          WT_next_url: item.actionType == "4" ? item.iconCode : item.actionUrl,
          WT_envName: item?.markName || "",
          XY_scene: item.searchUUID,
          XY_scene: item?.markName || "",
          WT_es: sessionStorage.pageUrl || "", // 页面路径
          WT_ti: "搜索默认页", // 页面名称
          XY_visit_source: sessionStorage.pageEntrance || "", // 访问来源
          WT_plat: sessionStorage.pagePlat || "", // 渠道
          XY_transaction_id: this.getSearchUUID(),
        };
        console.log("点击默认词新上报===>");
        console.log(obj1);
        this.$emit("getTrack", obj1);
      }
      let hisData = {
        markName: item.markName,
        actionUrl: item?.actionUrl || "",
        // actionUrl: '',
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
          this.updateWordType(3);
          this.getResult();
        });
      }
    },
  },
};
</script>

<style scoped lang="scss">
.default-words {
  margin-bottom: 29px;
  font-weight: 500;
  font-size: 24px;

  span {
    height: 60px;
    background: #f8f8f8;
    border-radius: 30px;
    display: inline-block;
    line-height: 60px;
    padding: 0 24px;
    margin-right: 18px;
    margin-bottom: 18px;
  }
}
</style>
