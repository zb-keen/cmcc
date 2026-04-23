<template>
  <div class="wonderful-content">
    <InnerLoading ref="loading" />
    <div class="wonderful-wrap">
      <!-- 视频 -->
      <template v-if="videoList.length > 0">
        <div class="video-header">
          <div class="header-left">视频</div>
          <div class="no-flow">免流量 放心刷</div>
        </div>
        <div class="wonderful-video">
          <template v-for="(videoItem, videoIndex) in videoList">
            <div
              :key="videoIndex"
              class="video-item"
              @click="jumpPage(videoItem, videoIndex)"
            >
              <div class="bitem-img">
                <img :src="videoItem.feedCoverUrl" alt="" />
                <div class="video-play"></div>
              </div>
              <div class="bitem-title">
                {{ videoItem.videoName }}
              </div>
            </div>
          </template>
        </div>
      </template>
      <!-- 微博 -->
      <template v-if="weiboList.length > 0">
        <div class="weibo-header">
          <div class="header-left">微博</div>
        </div>
        <div class="wonderful-weibo">
          <template v-for="(weiboItem, weiboIndex) in weiboList">
            <div :key="weiboIndex" class="weibo-item">
              <div class="bitem-title">
                {{ weiboItem.title }}
              </div>
              <div v-if="weiboItem.newFlag" class="bitem-new">新</div>
            </div>
          </template>
        </div>
      </template>
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
} from "@/utils/tool";
import { jcnrData } from "./HomeNewPhoneList"; // 新版首页精彩内容兜底数据
import InnerLoading from "./InnerLoading.vue";

export default {
  name: "WonderfulContent",
  components: {
    InnerLoading,
  },
  data() {
    return {
      mockJCNRData: null, // 精选推荐兜底数据
      pageEntrance: null,
      param: {
        provinceCode: "571", // 省编码
        cityCode: "0000", // 市编码
        cv: "7.9.0", // 客户端版本号
        st: "1", // 系统类型
        cellNum: "19805289925", // 登录手机号码
        pageEntrance: "1", // 页面入口枚举,1:普通版首页,2:PLUS 版首页,3:全球通首页,4:动感地带首页,5:分类页,6:权益页,7:探索页,8:商城页
        loginProvince: "", // 用户归属地-省份
        loginCity: "", // 用户归属地-地市
      },
      videoList: [],
      weiboList: [],
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
  ],
  props: {},
  watch: {},
  mounted() {
    // 承接异常兜底数据
    this.mockJCNRData = JSON.parse(JSON.stringify(jcnrData));

    const userInfo = localStorage.getItem("userInfo")
      ? JSON.parse(localStorage.getItem("userInfo"))
      : null;
    const pageEntrance = sessionStorage.getItem("pageEntrance");
    this.pageEntrance = pageEntrance;

    this.param = {
      provinceCode: userInfo?.province || "",
      cityCode: userInfo?.city || "",
      cv: userInfo?.version ? `10_10,${userInfo.version}` : "10_10",
      st: userInfo?.st || "",
      cellNum: userInfo?.phoneNumber || "",
      pageEntrance,
      loginProvince:
        userInfo?.loginProvince ||
        (userInfo?.province ? userInfo?.province : ""), // 省份参数兜底优化
      loginCity: userInfo?.loginCity || "",
    };

    // 获取缓存信息
    const localJcnrData = getDefaultPageLocalInfo("local_default_jcnr");
    const nowTime = Date.now();
    // 本地存储有效 使用本地存储信息渲染页面
    if (localJcnrData && localJcnrData.expiredTime > nowTime) {
      this.handleJCNRData(localJcnrData, false);
      console.log("精彩内容--缓存有效期内使用缓存信息--不再请求接口");
    } else {
      // 获取精彩内容数据
      this.getFeedVideoData();

      // 微博数据
      // for (let index = 0; index < 4; index++) {
      //   this.weiboList.push({
      //     title: `金饰价金饰价格涨到95金饰价格涨到95金饰价格涨到95格涨到95${index}元`,
      //     newFlag: index === 0 ? true : false,
      //   });
      // }
    }
  },
  methods: {
    // 获取精彩内容数据
    getFeedVideoData() {
      // 显示加载效果
      this.$refs.loading.loadingShow();
      try {
        CommonApi.listFeedVideo(this.param)
          .then((res) => {
            if (res.code === "000000") {
              if (res.data && res.data.length > 0) {
                // 分页面入口存储
                const setKey = `local_default_jcnr_${this.param.loginProvince}_${this.param.pageEntrance}`;
                localStorage.setItem(
                  setKey,
                  JSON.stringify({
                    ...res,
                    expiredTime: Date.now() + 5 * 60 * 1000,
                  })
                );
                // 渲染页面
                this.handleJCNRData(res, true);
              } else {
                console.log("精彩内容查询成功但返回0条数据");
                console.log(res);
                this.handleJCNRData(this.mockJCNRData, true);
              }
            } else {
              console.log("精彩内容查询失败");
              console.log(error);
              this.dataErrorHandle();
            }
          })
          .catch((error) => {
            console.log("精彩内容接口失败");
            console.log(error);
            this.dataErrorHandle();
          });
      } catch (error) {
        console.log("精选内容接口调用失败");
        console.log(error);
        this.dataErrorHandle();
      }
    },

    handleJCNRData(resObj, gdpFlag) {
      const resVideoData = resObj.data;
      this.videoList = resVideoData;

      // 曝光插码上报--曝光未作同id 单一once上报 后续优化（返回数据无id标识）
      // 参照结果页：以数据id存储标识  上报时 比对数据id
      // 修改为请求数据才上报--使用缓存（5分钟内）更新页面不上报
      if (gdpFlag) {
        this.handleGdpImp(resVideoData);
      }

      this.$refs.loading.loadingHide();
    },

    // 数据接口请求异常执行方法
    dataErrorHandle() {
      const localJcnrData = getDefaultPageLocalInfo("local_default_jcnr");
      this.$refs.loading.loadingHide();
      if (localJcnrData) {
        this.handleJCNRData(localJcnrData, true);
      } else {
        console.error("数据接口请求异常执行--也没有缓存--使用兜底");
        this.handleJCNRData(this.mockJCNRData, true);
      }
    },

    // 曝光插码上报
    handleGdpImp(renderData) {
      for (let index = 0; index < renderData.length; index++) {
        const impGdpObj = {
          XY_transaction_id: this.getSearchUUID(),
          WT_et: "imp",
          WT_envName: renderData[index].videoName,
          WT_markId: "",
          XY_point_position: index + 1,
          XY_first_class: "搜索默认页",
          XY_second_class: "精彩内容_视频",
          WT_next_url: renderData[index].videoUrl
            ? renderData[index].videoUrl
            : "",
          WT_plat: sessionStorage.pagePlat || "",
          WT_es: sessionStorage.pageUrl || "",
          WT_ti: "搜索默认页",
          XY_pageEntry: sessionStorage.pageEntrance || "",
          // 插码方案修改2025-1-16
          WT_area_type_1: "楼层",
          areaid: "", // [区域id_模板id]
          WT_area_type_2: "tab页",
          WT_area_name: "精彩内容_视频",
          XY_env_type: "pic",
          WT_event: "",
          XY_gd_source: "搜索平台", // [如果source=qqd，传qqd；如果source=app，传app]
          XY_scene: "", // 搜索内容
          WT_si_n: "",
          WT_goods_id: "",
          XY_visit_source: sessionStorage.pageEntrance || "", // 访问来源
          WT_charge_phone: "",
          WT_errCode: "",
          WT_errMsg: "",
          XY_env_extend_attribute: "",
        };
        console.log("默认页-精彩内容tab-数据曝光上报===>");
        console.log(impGdpObj);
        if (isApp()) {
          gdp("track", "imp", impGdpObj);
        }
      }
    },

    jumpPage(item, index) {
      console.log("首页重构-精彩内容点击====>");
      console.log(item);
      const clickGdpObj = {
        XY_transaction_id: this.getSearchUUID(),
        WT_et: "clk",
        WT_envName: item.videoName,
        WT_markId: "",
        XY_point_position: index + 1,
        XY_first_class: "搜索默认页",
        XY_second_class: "精彩内容_视频",
        WT_next_url: item.videoUrl ? item.videoUrl : "",
        WT_plat: sessionStorage.pagePlat || "",
        WT_es: sessionStorage.pageUrl || "",
        WT_ti: "搜索默认页",
        XY_pageEntry: sessionStorage.pageEntrance || "",
        // 插码方案修改2025-1-16
        WT_area_type_1: "楼层",
        areaid: "", // [区域id_模板id]
        WT_area_type_2: "tab页",
        WT_area_name: "精彩内容_视频",
        XY_env_type: "pic",
        WT_event: "",
        XY_gd_source: "搜索平台", // [如果source=qqd，传qqd；如果source=app，传app]
        XY_scene: "", // 搜索内容
        WT_si_n: "",
        WT_goods_id: "",
        XY_visit_source: sessionStorage.pageEntrance || "", // 访问来源
        WT_charge_phone: "",
        WT_errCode: "",
        WT_errMsg: "",
        XY_env_extend_attribute: "",
      };
      console.log("默认页-精彩内容tab-数据点击上报===>");
      console.log(clickGdpObj);
      if (isApp()) {
        gdp("track", "clk", clickGdpObj);
      }

      let hisData = {
        markName: item.videoName,
        actionUrl: item?.videoUrl || "",
        actionType: item?.dataType || "",
      };
      updateHistoryData(this.pageEntrance, hisData);

      if (item.videoUrl) {
        this.handleBlur();
        goPageUrl(item.dataType, item.videoUrl);
      } else {
        this.updateSearchContent(item.videoName);
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
.wonderful-content {
  background: linear-gradient(180deg, #fff7f0 0%, #ffffff 120px);
  border-radius: 18px;
  border: 1px solid #ffedd0;
  padding: 24px 30px 26px 30px;
  min-height: 400px;
  position: relative;

  .wonderful-wrap {
    .video-header {
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

      .no-flow {
        margin-left: 12px;
        min-width: 148px;
        height: 26px;
        background: linear-gradient(270deg, #fea469 0%, #ff5c45 100%);
        border-radius: 13px 13px 13px 0px;
        padding: 0px 8px 0px 6px;
        font-family: PingFangSC, PingFang SC;
        font-weight: 500;
        font-size: 20px;
        color: #ffffff;
        line-height: 26px;
        text-align: center;
        font-style: normal;
      }
    }

    .wonderful-video {
      display: -webkit-flex;
      display: flex;
      -webkit-justify-content: flex-start;
      justify-content: flex-start;
      -webkit-flex-wrap: wrap;
      flex-wrap: wrap;

      .video-item {
        width: -webkit-calc(33.333% - 16px);
        width: calc(33.333% - 16px);
        margin-right: 24px;
        margin-bottom: 24px;

        &:nth-child(3n) {
          margin-right: 0;
        }

        &:nth-child(7),
        &:nth-child(8),
        &:nth-child(9) {
          margin-bottom: 0;
        }

        .bitem-img {
          width: 100%;
          height: 242px;
          margin-bottom: 14px;
          -webkit-border-radius: 12px;
          border-radius: 12px;
          position: relative;
          overflow: hidden;

          img {
            width: 100%;
            height: 100%;
          }

          .video-play {
            position: absolute;
            top: 8px;
            right: 8px;
            width: 22px;
            height: 22px;
            background-image: url("../../assets/images/video-play.png");
            background-position: center top;
            background-size: 100% 100%;
          }
        }

        .bitem-title {
          width: 100%;
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          font-size: 24px;
          color: #333333;
          line-height: 32px;
          text-align: left;
          font-style: normal;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
    
    .weibo-header {
      display: flex;
      align-items: center;
      margin-top: 40px;
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
    }

    .wonderful-weibo {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;

      .weibo-item {
        width: 300px;
        height: 60px;
        background: #fafafa;
        border-radius: 12px;
        padding-left: 13px;
        padding-right: 23px;
        margin-bottom: 12px;
        display: flex;
        align-items: center;

        .bitem-title {
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          font-size: 24px;
          color: #333333;
          line-height: 60px;
          text-align: left;
          font-style: normal;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .bitem-new {
          display: inline-block;
          width: 30px;
          height: 30px;
          background: #fff1f1;
          border-radius: 6px;
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          font-size: 22px;
          color: #f3513b;
          line-height: 30px;
          text-align: center;
          font-style: normal;
          margin-left: 10px;
        }
      }
    }
  }
}
</style>
