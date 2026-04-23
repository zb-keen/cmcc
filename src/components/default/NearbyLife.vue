<template>
  <div class="nearby-life">
    <InnerLoading ref="loading" />
    <div v-if="noLocation" class="no-location">
      <div class="location-map">
        <div class="location-title">开启位置访问</div>
      </div>
      <div class="location-info">获取您所在区域的美食、电影等周边生活信息</div>
      <div class="location-btn" @click="openLocation">立即开启</div>
    </div>
    <div v-else class="life-wrap">
      <!-- 美食 -->
      <template v-if="shopList.length > 0">
        <div class="food-header">
          <div class="header-left">美食</div>
          <div v-if="!trueLocation" class="header-right">
            开启定位获取精准服务
          </div>
        </div>
        <div class="life-food">
          <template v-for="(shopItem, shopIndex) in shopList">
            <div
              :key="shopIndex"
              class="food-item"
              @click="jumpShopPage(shopItem, shopIndex)"
            >
              <div class="food-left">
                <img :src="shopItem.salesPageCdnUrl" alt="" />
              </div>
              <div class="food-right">
                <div class="right-top">
                  <div class="shop-name">
                    {{ shopItem.shopName }}
                  </div>
                  <div class="shop-distance">
                    {{ disCalculation(shopItem.distance) }}
                  </div>
                </div>
                <div class="right-middle">
                  <div class="shop-area">{{ shopItem.area }}</div>
                  <!-- <div class="shop-divider"></div>
                  <div class="shop-number">附近共13家门店??</div> -->
                </div>
                <template v-if="shopItem.skuList.length > 0">
                  <div class="right-bottom">
                    <template v-if="shopItem.skuList[0].skuPrice">
                      <div class="food-price">
                        <div class="price-unit">¥</div>
                        <div class="price-num">
                          {{ shopItem.skuList[0].skuPrice | filterPrice }}
                        </div>
                      </div>
                    </template>
                    <template v-if="shopItem.skuList[0].skuVipPrice">
                      <div class="food-vip">
                        <span class="price-unit">¥</span>
                        <span class="vip-price">
                          {{ shopItem.skuList[0].skuVipPrice | filterPrice }}
                        </span>
                        <span class="vip-desc">{{ ` 会员价` }}</span>
                      </div>
                    </template>
                    <div class="discount-coupon">
                      {{ shopItem.skuList[0].skuName }}
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </template>
        </div>
      </template>
      <!-- 电影 -->
      <template v-if="movieList.length > 0">
        <div class="movie-header">
          <div class="header-left">电影</div>
        </div>
        <div class="life-movie">
          <template v-for="(movieItem, movieIndex) in movieList">
            <div
              :key="movieIndex"
              class="movie-item"
              @click="jumpMoviePage(movieItem, movieIndex)"
            >
              <div class="bitem-img">
                <img :src="movieItem.imgUrl" alt="" />
                <div class="movie-score">评分 {{ movieItem.score }}</div>
              </div>
              <div class="bitem-title">
                {{ movieItem.filmName }}
              </div>
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
  isAndroid,
  isIOS,
  isHarmony,
  updateHistoryData,
  goPageUrl,
  getDefaultPageLocalInfo,
} from "@/utils/tool";
import { getCatchInfo, getNewLocation } from "@/utils/native";
import { zbshData } from "./HomeNewPhoneList"; // 新版首页周边生活兜底数据
import InnerLoading from "./InnerLoading.vue";

export default {
  name: "NearbyLife",
  components: {
    InnerLoading,
  },
  data() {
    return {
      mockZBSHData: null, // 周边生活兜底数据
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
      initLocationInfo: {
        latitude: "39.911651",
        longitude: "116.359109",
        provinceName: "北京",
        cityName: "北京",
      },
      noLocation: false, // 位置权限
      trueLocation: false, // 是否是准确的位置信息
      shopList: [],
      movieList: [],
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
  props: {
    impAttrsHot: {
      type: Object,
      default: () => {},
    },
  },
  watch: {},
  filters: {
    filterPrice(price) {
      if (!price) {
        return "";
      } else {
        // 价格返回的是分
        const tagetPrice = price / 100;
        if (tagetPrice % 1 === 0) {
          // 整数时直接返回
          return tagetPrice.toString();
        } else {
          // 小数时保留一位小数
          let str = tagetPrice.toFixed(2);
          if (str.endsWith("0")) {
            str = str.substring(0, str.length - 1);
          }
          return str;
        }
      }
    },
  },
  mounted() {
    // 承接异常兜底数据
    this.mockZBSHData = JSON.parse(JSON.stringify(zbshData));

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
    const localZbshData = getDefaultPageLocalInfo("local_default_zbsh");
    const nowTime = Date.now();
    // 本地存储有效 使用本地存储信息渲染页面
    if (localZbshData && localZbshData.expiredTime > nowTime) {
      console.log("周边生活--缓存有效期内使用缓存信息--不再请求接口");
      this.handleZBSHData(localZbshData, false);
    } else {
      console.log("周边生活--缓存不在有效期--获取位置信息--获取周边数据");
      // 获取客户端定位信息
      this.getAppLocationInfo();
    }
  },
  methods: {
    // 引导打开位置授权弹窗--未授权-调用方法就会弹窗授权弹窗
    openLocation() {
      // getNewLocation()
      //   .then((res) => {
      //     console.log("ios-安卓开启定位弹窗成功===>");
      //     console.log(res);
      //   })
      //   .catch((error) => {
      //     console.log("ios-安卓开启定位弹窗失败===>");
      //     console.log(error);
      //   });

      getNewLocation()
        .then((res) => {
          console.log("开启定位--新的cmcc获取定位信息方法====>");
          console.log(res);
          if (res && res.latitude && res.longitude) {
            this.noLocation = false;
            this.trueLocation = true;
            // 定位信息赋值
            this.param.latitude = res.latitude;
            this.param.longitude = res.longitude;
            this.param.provinceName = res.province;
            this.param.cityName = res.city;
            // 存储定位信息
            const setKey = `local_nearby_info`;
            localStorage.setItem(
              setKey,
              JSON.stringify({
                provinceName: res.province,
                cityName: res.city,
                latitude: res.latitude,
                longitude: res.longitude,
              })
            );
            // 获取周边生活数据
            this.getNearbyLifeData();
          } else {
            // ios-鸿蒙的异常状态会进到这里
            // Ios  res.locationState -7无定位权限  -8定位失败
            // 鸿蒙无异常状态码
            console.log("开启定位--ios-鸿蒙获取定位信息失败===>");
            console.log(res);
            this.getLocationError(res);
          }
        })
        .catch((error) => {
          // 只有安卓的异常走这里
          console.log("开启定位--获取定位信息失败===>");
          // errCode -7无定位权限  -8定位失败
          console.log(error);
          this.getLocationError(error);
        });

      // if (isAndroid || isIOS) {
      //   getNewLocation()
      //     .then((res) => {
      //       console.log("ios-安卓开启定位弹窗成功===>");
      //       console.log(res);
      //     })
      //     .catch((error) => {
      //       console.log("ios-安卓开启定位弹窗失败===>");
      //       console.log(error);
      //     });
      // } else if (isHarmony()) {
      //   cmcc.getCatchInfo({
      //     debug: false,
      //     isShowLocationAlert: true, // 用户禁止定位权限时，是否显示定位权限申请弹框，bool类型，默认不显示。-V5.8新增
      //     timeoutInterval: "5", // 不填写的话默认2秒，超过时间自动触发回调
      //     success: function (res) {
      //       console.log("鸿蒙开启定位弹窗成功===>");
      //       console.log(res);
      //     },
      //     error: function (res) {
      //       console.log("鸿蒙开启定位弹窗失败===>");
      //       console.log(error);
      //     },
      //   });
      // }
    },

    // 从设置页返回端内 或 从美食-电影详情返回时不要刷新
    returnPageGetData() {
      const sessionData = sessionStorage.getItem("session_zbsh")
        ? JSON.parse(sessionStorage.getItem("session_zbsh"))
        : null;
      if (sessionData) {
        console.log("详情页返回端内--周边生活");
        // 渲染页面
        this.handleZBSHData(sessionData, false);
      } else {
        console.log("权限设置返回端内--周边生活");
        this.getAppLocationInfo();
      }
    },

    getAppLocationInfo() {
      // 显示加载效果
      this.$refs.loading.loadingShow();

      // 先判断是否能获取到定位信息
      if (isApp()) {
        getNewLocation()
          .then((res) => {
            console.log("新的cmcc获取定位信息方法====>");
            console.log(res);
            if (res && res.latitude && res.longitude) {
              this.noLocation = false;
              this.trueLocation = true;
              // 定位信息赋值
              this.param.latitude = res.latitude;
              this.param.longitude = res.longitude;
              this.param.provinceName = res.province;
              this.param.cityName = res.city;
              // 存储定位信息
              const setKey = `local_nearby_info`;
              localStorage.setItem(
                setKey,
                JSON.stringify({
                  provinceName: res.province,
                  cityName: res.city,
                  latitude: res.latitude,
                  longitude: res.longitude,
                })
              );
              // 获取周边生活数据
              this.getNearbyLifeData();
            } else {
              // ios-鸿蒙的异常状态会进到这里
              // Ios  res.locationState -7无定位权限  -8定位失败
              // 鸿蒙无异常状态码
              console.log("ios-鸿蒙获取定位信息失败===>");
              console.log(res);
              this.getLocationError(res);
            }
          })
          .catch((error) => {
            // 只有安卓的异常走这里
            console.log("获取定位信息失败===>");
            // errCode -7无定位权限  -8定位失败
            console.log(error);
            this.getLocationError(error);
          });
        // if (isAndroid || isIOS) {
        //   getNewLocation()
        //     .then((res) => {
        //       console.log("新的cmcc获取定位信息方法====>");
        //       console.log(res);
        //       if (res && res.latitude && res.longitude) {
        //         this.noLocation = false;
        //         this.trueLocation = true;
        //         // 定位信息赋值
        //         this.param.latitude = res.latitude;
        //         this.param.longitude = res.longitude;
        //         this.param.provinceName = res.province;
        //         this.param.cityName = res.city;
        //         // 存储定位信息
        //         const setKey = `local_nearby_info`;
        //         localStorage.setItem(
        //           setKey,
        //           JSON.stringify({
        //             provinceName: res.province,
        //             cityName: res.city,
        //             latitude: res.latitude,
        //             longitude: res.longitude,
        //           })
        //         );
        //         // 获取周边生活数据
        //         this.getNearbyLifeData();
        //       } else {
        //         // ios-鸿蒙的异常状态会进到这里
        //         // Ios  res.locationState -7无定位权限  -8定位失败
        //         // 鸿蒙无异常状态码
        //         console.log("ios-鸿蒙获取定位信息失败===>");
        //         console.log(res);
        //         this.getLocationError(res);
        //       }
        //     })
        //     .catch((error) => {
        //       // 只有安卓的异常走这里
        //       console.log("获取定位信息失败===>");
        //       // errCode -7无定位权限  -8定位失败
        //       console.log(error);
        //       this.getLocationError(error);
        //     });
        // } else if (isHarmony()) {
        //   getCatchInfo()
        //     .then((res) => {
        //       console.log("旧的cmcc--鸿蒙--获取定位信息方法====>");
        //       console.log(res);
        //       if (
        //         res &&
        //         res.coords &&
        //         res.coords.latitude &&
        //         res.coords.longitude
        //       ) {
        //         this.noLocation = false;
        //         this.trueLocation = true;
        //         // 定位信息赋值
        //         this.param.latitude = res.coords.latitude;
        //         this.param.longitude = res.coords.longitude;
        //         this.param.provinceName = res.coords.locProvince;
        //         this.param.cityName = res.coords.locCity;
        //         // 存储定位信息
        //         const setKey = `local_nearby_info`;
        //         localStorage.setItem(
        //           setKey,
        //           JSON.stringify({
        //             provinceName: res.coords.locProvince,
        //             cityName: res.coords.locCity,
        //             latitude: res.coords.latitude,
        //             longitude: res.coords.longitude,
        //           })
        //         );
        //         // 获取周边生活数据
        //         this.getNearbyLifeData();
        //       } else {
        //         // 鸿蒙的异常状态会进到这里
        //         console.log("鸿蒙获取定位信息失败===>");
        //         console.log(res);
        //         this.getLocationError(res);
        //       }
        //     })
        //     .catch((error) => {
        //       // 只有安卓的异常走这里
        //       console.log("获取定位信息失败===>");
        //       // errCode -7无定位权限  -8定位失败
        //       console.log(error);
        //       this.getLocationError(error);
        //     });
        // }
      } else {
        // pc测试模拟数据
        const res = {
          latitude: "34.80765177623971",
          longitude: "113.55262565209307",
          province: "河南",
          city: "郑州",
        };
        this.noLocation = false;
        this.trueLocation = true;
        // 定位信息赋值
        this.param.latitude = res.latitude;
        this.param.longitude = res.longitude;
        this.param.provinceName = res.province;
        this.param.cityName = res.city;
        // 获取周边生活数据
        this.getNearbyLifeData();
      }
    },

    // 获取定位信息失败 使用上一次的缓存位置信息
    getLocationError(errorObj) {
      if (errorObj.errCode === -7 || errorObj.locationState == -7) {
        // 无权限
        this.$refs.loading.loadingHide();
        this.noLocation = true;
      } else if (errorObj.errCode === -2) {
        // ios超时或未定位成功
        this.$refs.loading.loadingHide();
        this.noLocation = true;
      } else if (errorObj.errCode === -8 || errorObj.locationState == -8) {
        // 无定位信息
        const localNearbyInfo = localStorage.getItem("local_nearby_info")
          ? JSON.parse(localStorage.getItem("local_nearby_info"))
          : null;
        // 优先使用缓存--再使用北京
        if (localNearbyInfo) {
          this.noLocation = false;
          this.trueLocation = false; // 非精准定位--上一次缓存的定位信息
          this.param.provinceName = localNearbyInfo.provinceName;
          this.param.cityName = localNearbyInfo.cityName;
          this.param.latitude = localNearbyInfo.latitude;
          this.param.longitude = localNearbyInfo.longitude;
        } else {
          this.noLocation = false;
          this.trueLocation = false; // 非精准定位--北京的定位信息
          this.param.provinceName = this.initLocationInfo.provinceName;
          this.param.cityName = this.initLocationInfo.cityName;
          this.param.latitude = this.initLocationInfo.latitude;
          this.param.longitude = this.initLocationInfo.longitude;
        }
        // 获取周边生活数据
        this.getNearbyLifeData();
      } else if (!errorObj.errCode && !errorObj.locationState) {
        console.log("鸿蒙未开权限处理===>");
        console.log(errorObj);
        // 无定位信息
        const localNearbyInfo = localStorage.getItem("local_nearby_info")
          ? JSON.parse(localStorage.getItem("local_nearby_info"))
          : null;
        // 优先使用缓存--再使用北京
        if (localNearbyInfo) {
          this.noLocation = false;
          this.trueLocation = false; // 非精准定位--上一次缓存的定位信息
          this.param.provinceName = localNearbyInfo.provinceName;
          this.param.cityName = localNearbyInfo.cityName;
          this.param.latitude = localNearbyInfo.latitude;
          this.param.longitude = localNearbyInfo.longitude;
        } else {
          this.noLocation = false;
          this.trueLocation = false; // 非精准定位--北京的定位信息
          this.param.provinceName = this.initLocationInfo.provinceName;
          this.param.cityName = this.initLocationInfo.cityName;
          this.param.latitude = this.initLocationInfo.latitude;
          this.param.longitude = this.initLocationInfo.longitude;
        }
        // 获取周边生活数据
        this.getNearbyLifeData();
      } else {
        // 未知异常关闭loading
        this.$refs.loading.loadingHide();
      }
    },

    // 获取周边生活数据
    getNearbyLifeData() {
      console.log("查询周边好生活的参数====?>");
      console.log(this.param);
      CommonApi.listNearbyLife(this.param)
        .then((res) => {
          if (res.code === "000000" && res.data) {
            // 分页面入口存储
            const setKey = `local_default_zbsh_${this.param.loginProvince}_${this.param.pageEntrance}`;
            localStorage.setItem(
              setKey,
              JSON.stringify({
                ...res,
                expiredTime: Date.now() + 5 * 60 * 1000,
              })
            );
            // 存储一个会话信息--区分从设置页返回(重新请求数据) 还是详情返回(不请求)
            sessionStorage.setItem(
              "session_zbsh",
              JSON.stringify({
                ...res,
              })
            );
            // 渲染页面
            this.handleZBSHData(res, true);
          } else {
            this.$refs.loading.loadingHide();
            console.log("周边生活接口查询失败");
            this.dataErrorHandle();
          }
        })
        .catch((error) => {
          console.log("周边生活接口调用失败");
          console.log(error);
          this.dataErrorHandle();
        });
    },

    handleZBSHData(resObj, gdpFlag) {
      const resLifeData = resObj.data;
      this.shopList = resLifeData.shopFoodList;
      this.movieList = resLifeData.movieList;

      // 曝光插码上报--曝光未作同id 单一once上报 后续优化（插码方案要求电影once上报  电影返回数据无id 美食数据返回有id）
      // 参照结果页：以数据id存储标识  上报时 比对数据id
      // 修改为请求数据才上报--使用缓存（5分钟内）||会话存储--更新页面不上报
      if (gdpFlag) {
        this.handleGdpImp(this.shopList, "shop");
        this.handleGdpImp(this.movieList, "movie");
      }

      this.$refs.loading.loadingHide();
    },

    // 数据接口请求异常执行方法
    dataErrorHandle() {
      const localZbshData = getDefaultPageLocalInfo("local_default_zbsh");
      this.$refs.loading.loadingHide();
      if (localZbshData) {
        this.handleZBSHData(localZbshData, true);
      } else {
        console.error("数据接口请求异常执行--也没有缓存");
        this.handleZBSHData(this.mockZBSHData, true);
      }
    },

    disCalculation(distance) {
      let returnDisStr = "";
      if (!distance) {
        return;
      }
      const disNum = distance * 1;
      if (disNum > 1000) {
        returnDisStr = `<${(disNum / 1000).toFixed(1)}km`;
      } else {
        returnDisStr = `<${disNum}m`;
      }
      return returnDisStr;
    },

    // 曝光插码上报
    handleGdpImp(renderData, renderArea) {
      for (let index = 0; index < renderData.length; index++) {
        const impGdpObj = {
          XY_transaction_id: this.getSearchUUID(),
          WT_et: "imp",
          WT_envName:
            renderArea === "movie"
              ? renderData[index].filmName
              : renderData[index].shopName,
          WT_markId: "",
          XY_point_position: index + 1,
          XY_first_class: "搜索默认页",
          XY_second_class:
            renderArea === "movie" ? "周边生活_电影" : "周边生活_美食",
          WT_next_url:
            renderArea === "movie"
              ? renderData[index].filmDetailUrl
              : renderData[index].detailUrl,
          WT_plat: sessionStorage.pagePlat || "",
          WT_es: sessionStorage.pageUrl || "",
          WT_ti: "搜索默认页",
          XY_pageEntry: sessionStorage.pageEntrance || "",
          // 插码方案修改2025-1-16
          WT_area_type_1: "楼层",
          areaid: "", // [区域id_模板id]
          WT_area_type_2: "tab页",
          WT_area_name:
            renderArea === "movie" ? "周边生活_电影" : "周边生活_美食",
          XY_env_type: "pic",
          WT_event: "",
          XY_gd_source: "搜索平台", // [如果source=qqd，传qqd；如果source=app，传app]
          XY_scene: "", // 搜索内容
          WT_si_n: "",
          WT_goods_id: renderArea === "movie" ? "" : renderData[index].id,
          XY_visit_source: sessionStorage.pageEntrance || "", // 访问来源
          WT_charge_phone: "",
          WT_errCode: "",
          WT_errMsg: "",
          XY_env_extend_attribute: "",
        };
        console.log("默认页-周边生活tab-数据曝光上报===>");
        console.log(impGdpObj);
        if (isApp()) {
          gdp("track", "imp", impGdpObj);
        }
      }
    },

    jumpShopPage(item, index) {
      console.log("首页重构-周边生活-美食点击====>");
      console.log(item);

      const clickGdpObj = {
        XY_transaction_id: this.getSearchUUID(),
        WT_et: "clk",
        WT_envName: item.shopName,
        WT_markId: "",
        XY_point_position: index + 1,
        XY_first_class: "搜索默认页",
        XY_second_class: "周边生活_美食",
        WT_next_url: item.detailUrl,
        WT_plat: sessionStorage.pagePlat || "",
        WT_es: sessionStorage.pageUrl || "",
        WT_ti: "搜索默认页",
        XY_pageEntry: sessionStorage.pageEntrance || "",
        // 插码方案修改2025-1-16
        WT_area_type_1: "楼层",
        areaid: "", // [区域id_模板id]
        WT_area_type_2: "tab页",
        WT_area_name: "周边生活_美食",
        XY_env_type: "pic",
        WT_event: "",
        XY_gd_source: "搜索平台", // [如果source=qqd，传qqd；如果source=app，传app]
        XY_scene: "", // 搜索内容
        WT_si_n: "",
        WT_goods_id: item.id,
        XY_visit_source: sessionStorage.pageEntrance || "", // 访问来源
        WT_charge_phone: "",
        WT_errCode: "",
        WT_errMsg: "",
        XY_env_extend_attribute: "",
      };
      console.log("默认页-周边生活tab-数据点击上报===>");
      console.log(clickGdpObj);
      if (isApp()) {
        gdp("track", "clk", clickGdpObj);
      }

      let hisData = {
        markName: item.shopName,
        actionUrl: item?.detailUrl || "",
        actionType: item?.dataType || "",
      };
      updateHistoryData(this.pageEntrance, hisData);

      if (item.detailUrl) {
        this.handleBlur();
        goPageUrl(item.dataType, item.detailUrl);
      } else {
        this.updateSearchContent(item.shopName);
        this.$nextTick(() => {
          this.updateCurrentCom("result");
          this.updateSearchUUID();
          // 更新搜索类型
          this.updateWordType(4);
          this.getResult();
        });
      }
    },

    jumpMoviePage(item, index) {
      console.log("首页重构-周边生活-电影点击====>");
      console.log(item);

      const clickGdpObj = {
        XY_transaction_id: this.getSearchUUID(),
        WT_et: "clk",
        WT_envName: item.filmName,
        WT_markId: "",
        XY_point_position: index + 1,
        XY_first_class: "搜索默认页",
        XY_second_class: "周边生活_电影",
        WT_next_url: item.filmDetailUrl,
        WT_plat: sessionStorage.pagePlat || "",
        WT_es: sessionStorage.pageUrl || "",
        WT_ti: "搜索默认页",
        XY_pageEntry: sessionStorage.pageEntrance || "",
        // 插码方案修改2025-1-16
        WT_area_type_1: "楼层",
        areaid: "", // [区域id_模板id]
        WT_area_type_2: "tab页",
        WT_area_name: "周边生活_电影",
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
      console.log("默认页-周边生活tab-数据点击上报===>");
      console.log(clickGdpObj);
      if (isApp()) {
        gdp("track", "clk", clickGdpObj);
      }

      let hisData = {
        markName: item.filmName,
        actionUrl: item?.filmDetailUrl || "",
        actionType: item?.dataType || "",
      };
      updateHistoryData(this.pageEntrance, hisData);

      if (item.filmDetailUrl) {
        this.handleBlur();
        goPageUrl(item.dataType, item.filmDetailUrl);
      } else {
        this.updateSearchContent(item.filmName);
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
.nearby-life {
  width: 690px;
  background: linear-gradient(180deg, #eff8ff 0%, #ffffff 120px);
  border-radius: 18px;
  border: 1px solid #d8ebf0;
  min-height: 400px;
  position: relative;

  .no-location {
    padding: 180px 45px 307px 45px;
    text-align: center;

    .location-map {
      width: 600px;
      height: 320px;
      background-image: url("../../assets/images/map-bg.png");
      background-position: center top;
      background-size: 100% 100%;
      // padding: 255px 204px 20px 204px;
      padding: 255px 0px 20px 0px;

      .location-title {
        font-family: PingFangSC, PingFang SC;
        font-weight: 700;
        font-size: 32px;
        color: #000000;
        text-align: center;
        font-style: normal;
      }
    }

    .location-info {
      width: 580px;
      height: 33px;
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      font-size: 24px;
      color: #666666;
      line-height: 33px;
      text-align: center;
      font-style: normal;
      margin-bottom: 30px;
    }

    .location-btn {
      width: 280px;
      height: 72px;
      border-radius: 12px;
      border: 2px solid #2892ff;
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      font-size: 28px;
      color: #2892ff;
      line-height: 72px;
      text-align: center;
      font-style: normal;
      margin: 0 auto;
    }
  }

  .life-wrap {
    padding: 24px 30px 37px 30px;

    .food-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
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

      .header-right {
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        font-size: 24px;
        color: #666666;
        line-height: 34px;
        text-align: left;
        font-style: normal;
      }
    }

    .life-food {
      // display: flex;
      // align-items: center;
      // justify-content: space-between;
      // flex-wrap: wrap;

      .food-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 24px;

        .food-left {
          width: 100px;
          height: 100px;
          border-radius: 12px;
          overflow: hidden;

          img {
            width: 100%;
            height: 100%;
          }
        }

        .food-right {
          width: 510px;
          font-size: 22px;

          .right-top {
            display: flex;
            justify-content: space-between;
            align-items: center;

            .shop-name {
              // width: 416px;
              font-family: PingFangSC, PingFang SC;
              font-weight: 700;
              font-size: 26px;
              color: #000000;
              line-height: 38px;
              text-align: left;
              font-style: normal;
              max-width: 380px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }

            .shop-distance {
              font-family: PingFangSC, PingFang SC;
              font-weight: 400;
              font-size: 22px;
              color: #666666;
              line-height: 38px;
              text-align: right;
              font-style: normal;
            }
          }

          .right-middle {
            display: flex;
            align-items: center;
            margin-top: 4px;
            margin-bottom: 4px;

            .shop-area {
              font-family: PingFangSC, PingFang SC;
              font-weight: 400;
              font-size: 20px;
              color: #999999;
              line-height: 26px;
              text-align: left;
              font-style: normal;
            }

            .shop-divider {
              width: 1px;
              height: 15px;
              border: 1px solid #cccccc;
              margin-left: 12px;
              margin-right: 12px;
            }

            .shop-number {
              font-family: PingFangSC, PingFang SC;
              font-weight: 400;
              font-size: 20px;
              color: #999999;
              line-height: 26px;
              text-align: left;
              font-style: normal;
            }
          }

          .right-bottom {
            display: flex;
            align-items: center;

            .food-price {
              display: flex;

              .price-unit,
              .price-num {
                font-family: PingFangSC, PingFang SC;
                font-weight: 500;
                color: #333333;
                line-height: 32px;
                text-align: left;
                font-style: normal;
              }

              .price-unit {
                font-size: 18px;
                position: relative;
                top: 2px;
              }

              .price-num {
                font-size: 22px;
              }
            }

            .food-vip {
              display: flex;
              align-items: center;
              margin-left: 12px;
              padding: 2px 6px;
              background: #fff1f1;
              border-radius: 6px;

              .price-unit {
                font-family: PingFangSC, PingFang SC;
                font-weight: 500;
                color: #f3513b;
                text-align: left;
                font-style: normal;
                font-size: 18px;
                line-height: 26px;
                position: relative;
                top: 3px;
              }

              .vip-price {
                display: inline-block;
                height: 26px;
                font-family: PingFangSC, PingFang SC;
                font-weight: 500;
                font-size: 22px;
                line-height: 26px;
                color: #f3513b;
                text-align: left;
                font-style: normal;
              }

              .vip-desc {
                margin-left: 2px;
                display: inline-block;
                height: 26px;
                font-family: PingFangSC, PingFang SC;
                font-weight: 400;
                font-size: 18px;
                color: #f3513b;
                line-height: 26px;
                text-align: left;
                font-style: normal;
                position: relative;
                top: 2px;
              }
            }

            .discount-coupon {
              flex: 1;
              margin-left: 12px;
              font-family: PingFangSC, PingFang SC;
              font-weight: 400;
              font-size: 20px;
              color: #999999;
              line-height: 26px;
              text-align: left;
              font-style: normal;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              max-width: 310px;
            }
          }
        }
      }
    }

    .movie-header {
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
    }

    .life-movie {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;

      .movie-item {
        .bitem-img {
          width: 100px;
          height: 150px;
          border-radius: 12px;
          margin-bottom: 14px;
          overflow: hidden;
          position: relative;

          img {
            width: 100%;
            height: 100%;
          }

          .movie-score {
            position: absolute;
            bottom: 0px;
            left: 0px;
            right: 0px;
            font-family: PingFangSC, PingFang SC;
            font-weight: 500;
            font-size: 18px;
            color: #ffffff;
            line-height: 44px;
            text-align: center;
            font-style: normal;
            background: linear-gradient(
              180deg,
              rgba(0, 0, 0, 0) 0%,
              rgba(0, 0, 0, 0.95) 99%
            );
          }
        }

        .bitem-title {
          width: 108px;
          height: 64px;
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
  }
}
</style>
