<template>
  <div
    class="c-i-right"
    :data-value="itemData._id"
    :data-code="itemParentTemplateId"
  >
    <!-- {{ itemParentTemplateFieldList }} -->
    <div
      v-if="itemParentTemplateId == CONSTANTS.TEMPLATEPAGE.PRODPT006"
      :class="
        itemParentTemplateId == CONSTANTS.TEMPLATEPAGE.PRODPT006
          ? 'r-title-hw'
          : 'r-title'
      "
      :data-value="itemParentTemplateId"
    >
      <div v-html="itemData.titleHL ? itemData.titleHL : itemData.title"></div>
    </div>
    <div
      v-else
      :class="
        itemParentTemplateId == CONSTANTS.TEMPLATEPAGE.PRODHW004 ||
        itemParentTemplateId == CONSTANTS.TEMPLATEPAGE.PRODMS012 ||
        itemParentTemplateId == CONSTANTS.TEMPLATEPAGE.PRODMB0053
          ? 'r-title-hw'
          : 'r-title'
      "
      :data-value="itemParentTemplateId"
    >
      <!-- <img v-if="itemData.buyTypeUrl &&　itemParentTemplateId == CONSTANTS.TEMPLATEPAGE.PRODHW004" 
      :class="itemData.buyTypeUrl &&　itemParentTemplateId == CONSTANTS.TEMPLATEPAGE.PRODHW004?'title-front-tag':'title-front-tag'"
       :src="itemData.buyTypeUrl" draggable="false" alt=""/> -->
      <!-- :style="{ 'textIndent':itemData.tagWidth?((offsetWidth * (itemData.tagWidth + 15))/750) + 'px' :'initial'}" -->
      <span
        v-if="
          itemData.buyTypeUrl &&
          (itemParentTemplateId == CONSTANTS.TEMPLATEPAGE.PRODHW004 ||
            itemParentTemplateId == CONSTANTS.TEMPLATEPAGE.PRODMS012 ||
            itemParentTemplateId == CONSTANTS.TEMPLATEPAGE.PRODMB0053)
        "
        :class="
          itemData.buyType == 'u1'
            ? 'title-front-tag-text bg-2892FF'
            : itemData.buyType == 'u2'
            ? 'title-front-tag-text bg-00BB7C'
            : itemData.buyType == 'u3'
            ? 'title-front-tag-text bg-FF7627'
            : 'title-front-tag-text bg-FF7627'
        "
        >{{ itemData.buyTypeName }}</span
      >
      <a v-html="itemData.titleHL ? itemData.titleHL : itemData.title"></a>
    </div>

    <div
      class="r-intro"
      v-if="
        itemParentTemplateId == CONSTANTS.TEMPLATEPAGE.RECOMMEND &&
        (itemData.subTitleHL || itemData.subTitle)
      "
      v-html="itemData.subTitleHL ? itemData.subTitleHL : itemData.subTitle"
    ></div>

    <div
      class="r-intro"
      v-if="
        isFieldToShow('subTitle') &&
        itemParentTemplateId == CONSTANTS.TEMPLATEPAGE.ACTI002 &&
        (itemData.subTitleHL || itemData.subTitle)
      "
      v-html="itemData.subTitleHL ? itemData.subTitleHL : itemData.subTitle"
    ></div>

    <price-model
      v-if="itemParentTemplateId == CONSTANTS.TEMPLATEPAGE.ACTI002"
      :itemData="itemData"
      :itemParentTemplateId="itemParentTemplateId"
      :itemParentTemplateFieldList="itemParentTemplateFieldList"
    ></price-model>

    <div
      class="r-intro"
      v-if="
        isFieldToShow('subTitle') &&
        itemParentTemplateId == CONSTANTS.TEMPLATEPAGE.BIZ003 &&
        (itemData.subTitleHL || itemData.subTitle)
      "
      v-html="itemData.subTitleHL ? itemData.subTitleHL : itemData.subTitle"
    ></div>
    <price-model
      v-if="itemParentTemplateId == CONSTANTS.TEMPLATEPAGE.BIZ003"
      :itemData="itemData"
      :itemParentTemplateId="itemParentTemplateId"
      :itemParentTemplateFieldList="itemParentTemplateFieldList"
    ></price-model>

    <div
      class="r-digital-intro"
      v-if="
        isFieldToShow('subTitle') &&
        (itemParentTemplateId == CONSTANTS.TEMPLATEPAGE.PRODHW004 ||
          itemParentTemplateId == CONSTANTS.TEMPLATEPAGE.PRODMB0053) &&
        (itemData.subTitleHL || itemData.subTitle)
      "
      v-html="itemData.subTitleHL ? itemData.subTitleHL : itemData.subTitle"
    ></div>
    <price-model
      v-if="
        itemParentTemplateId == CONSTANTS.TEMPLATEPAGE.PRODHW004 ||
        itemParentTemplateId == CONSTANTS.TEMPLATEPAGE.PRODMB0053
      "
      :itemData="itemData"
      :itemParentTemplateId="itemParentTemplateId"
      :itemParentTemplateFieldList="itemParentTemplateFieldList"
    ></price-model>

    <!-- 门店信息 -->
    <div
      class="r-store"
      v-if="
        (itemParentTemplateId == CONSTANTS.TEMPLATEPAGE.PRODHW004 ||
          itemParentTemplateId == CONSTANTS.TEMPLATEPAGE.PRODMB0053) &&
        itemData.merchantName &&
        isFieldToShow('merchantName')
      "
    >
      <span>{{ itemData.merchantName }}</span>
    </div>
    <!-- 距离 -->
    <div
      class="r-position"
      v-if="
        (itemParentTemplateId == CONSTANTS.TEMPLATEPAGE.PRODHW004 ||
          itemParentTemplateId == CONSTANTS.TEMPLATEPAGE.PRODMB0053) &&
        itemData.merchantAddress &&
        isFieldToShow('merchantAddress')
      "
    >
      <i class="s-iconfont ic-icon-position"></i
      ><span class="text">{{ itemData.merchantAddress }}</span>
      <!-- <span v-if="isFieldToShow('distance') && !isApp" data-value="noApp">{{
        getDistance(itemData.location, locationInfo)
      }}</span>
      <span v-if="isFieldToShow('distance') && isApp">{{
        getDistance(itemData.location, locationInfo)
      }}</span> -->
    </div>

    <div
      class="r-digital-intro"
      v-if="
        isFieldToShow('subTitle') &&
        itemParentTemplateId == CONSTANTS.TEMPLATEPAGE.PRODMS012 &&
        (itemData.subTitleHL || itemData.subTitle)
      "
      v-html="itemData.subTitleHL ? itemData.subTitleHL : itemData.subTitle"
    ></div>
    <price-model
      v-if="itemParentTemplateId == CONSTANTS.TEMPLATEPAGE.PRODMS012"
      :itemData="itemData"
      :itemParentTemplateId="itemParentTemplateId"
      :itemParentTemplateFieldList="itemParentTemplateFieldList"
    ></price-model>

    <div
      class="r-store"
      v-if="
        itemParentTemplateId == CONSTANTS.TEMPLATEPAGE.PRODMS012 &&
        itemData.merchantName &&
        isFieldToShow('merchantName')
      "
    >
      <span>{{ itemData.merchantName }}</span>
    </div>
    <div
      class="r-position"
      v-if="
        itemParentTemplateId == CONSTANTS.TEMPLATEPAGE.PRODMS012 &&
        itemData.merchantAddress &&
        isFieldToShow('merchantAddress')
      "
    >
      <i class="s-iconfont ic-icon-position"></i
      ><span class="text">{{ itemData.merchantAddress }}</span>
      <!-- <span v-if="isFieldToShow('distance') && !isApp" data-value="noApp">{{
        getDistance(itemData.location, locationInfo)
      }}</span>
      <span v-if="isFieldToShow('distance') && isApp">{{
        getDistance(itemData.location, locationInfo)
      }}</span> -->
    </div>

    <div
      class="r-digital-intro"
      v-if="
        isFieldToShow('subTitle') &&
        (itemParentTemplateId == CONSTANTS.TEMPLATEPAGE.PRODMB005 ||
          itemParentTemplateId == CONSTANTS.TEMPLATEPAGE.PRODMB0050 ||
          itemParentTemplateId == CONSTANTS.TEMPLATEPAGE.PRODMB0051 ||
          itemParentTemplateId == CONSTANTS.TEMPLATEPAGE.PRODMB0052) &&
        (itemData.subTitleHL || itemData.subTitle)
      "
      v-html="itemData.subTitleHL ? itemData.subTitleHL : itemData.subTitle"
    ></div>
    <price-model
      v-if="
        itemParentTemplateId == CONSTANTS.TEMPLATEPAGE.PRODMB005 ||
        itemParentTemplateId == CONSTANTS.TEMPLATEPAGE.PRODMB0050 ||
        itemParentTemplateId == CONSTANTS.TEMPLATEPAGE.PRODMB0051 ||
        itemParentTemplateId == CONSTANTS.TEMPLATEPAGE.PRODMB0052
      "
      :itemData="itemData"
      :itemParentTemplateId="itemParentTemplateId"
      :itemParentTemplateFieldList="itemParentTemplateFieldList"
    ></price-model>

    <div
      class="r-digital-intro"
      v-if="
        isFieldToShow('subTitle') &&
        itemParentTemplateId == CONSTANTS.TEMPLATEPAGE.PRODPT006 &&
        (itemData.subTitleHL || itemData.subTitle)
      "
      v-html="itemData.subTitleHL ? itemData.subTitleHL : itemData.subTitle"
    ></div>
    <div
      class="r-price"
      v-if="itemParentTemplateId == CONSTANTS.TEMPLATEPAGE.PRODPT006"
    >
      <!-- <span class="price-height-color" v-if="itemData.currentPrice >= 0">{{ Number(itemData.currentPrice || 0).toFixed(2) }}{{itemData.currentPriceUnit || '积分'}}</span> -->
      <!-- <span class="line" v-if="itemData.originalPrice >= 0">{{ Number(itemData.originalPrice || 0).toFixed(2) }}{{itemData.originalPriceUnit || '积分'}}</span> -->
      <div
        v-if="
          itemData.currentPrice &&
          itemData.currentPrice >= 0 &&
          isFieldToShow('currentPrice')
        "
      >
        <div class="price-height-color" v-if="itemData.currentPrice >= 0">
          <!-- <div class="p-h-unit">{{itemData.currentPriceUnit && itemData.currentPriceUnit == '元'?'¥':''}}</div> -->
          <div class="p-h-price">
            {{ Number(itemData.currentPrice || 0).toFixed(2) }}
          </div>
          <div class="p-h-text">{{ itemData.currentPriceUnit || "积分" }}</div>
          <div class="p-aiDou" v-if="itemData.supportAiDouPayment && itemData.supportAiDouPayment == '1'">
            <img class="p-ai-img" :src="require('@/assets/images/aidou.png')" />
            <span class="p-ai-text">AI豆可抵</span>
          </div>
        </div>
      </div>
      <div
        v-if="
          (itemData.currentPrice == '' ||
            itemData.currentPrice == undefined ||
            itemData.currentPrice == null) &&
          itemData.originalPrice &&
          itemData.originalPrice >= 0 &&
          isFieldToShow('originalPrice')
        "
      >
        <!--现价没有原价有，原价按现价展示-->
        <div class="price-height-color" v-if="itemData.originalPrice >= 0">
          <!-- <div class="p-h-unit">{{itemData.currentPriceUnit && itemData.currentPriceUnit == '元'?'¥':''}}</div> -->
          <div class="p-h-price">
            {{ Number(itemData.originalPrice || 0).toFixed(2) }}
          </div>
          <div class="p-h-text">{{ itemData.originalPriceUnit || "积分" }}</div>
          <div class="p-aiDou" v-if="itemData.supportAiDouPayment && itemData.supportAiDouPayment == '1'">
            <img class="p-ai-img" :src="require('@/assets/images/aidou.png')" />
            <span class="p-ai-text">AI豆可抵</span>
          </div>
        </div>
      </div>
      <div
        v-if="
          itemData.originalPrice &&
          itemData.originalPrice >= 0 &&
          isFieldToShow('originalPrice')
        "
      >
        <div
          class="line"
          v-if="
            itemData.originalPrice >= 0 &&
            itemData.currentPrice &&
            Number(itemData.currentPrice || 0)
              .toFixed(2)
              .split('.')[0]
              .toString().length <= 6
          "
        >
          <!-- <div class="p-h-unit">{{itemData.originalPriceUnit && itemData.originalPriceUnit == '元'?'¥':''}}</div> -->
          <div class="line-text">
            {{ Number(itemData.originalPrice || 0).toFixed(2)
            }}{{ itemData.originalPriceUnit || "积分" }}
          </div>
        </div>
      </div>
    </div>
    <div
      class="r-comments"
      v-if="
        itemParentTemplateId == CONSTANTS.TEMPLATEPAGE.PRODPT006 &&
        ((itemData.productEvaluation && isFieldToShow('productEvaluation')) ||
          (itemData.favorableComment && isFieldToShow('favorableComment')))
      "
    >
      <span v-if="itemData.productEvaluation" class="r-c-title">
        评价<span class="mr-20 ml-10">{{ itemData.productEvaluation }}条</span>
      </span>
      <span v-if="itemData.favorableComment" class="r-c-title"
        >好评<span class="ml-10">{{ itemData.favorableComment }}%</span>
      </span>
    </div>

    <!-- 商品-扶贫商城 -->
    <!-- 返回数据的currentPrice通常为null  null >= 0 成立-->
    <div
      class="r-price"
      v-if="itemParentTemplateId == CONSTANTS.TEMPLATEPAGE.PRODHP007"
    >
      <!-- <span class="price-height-color" v-if="itemData.currentPrice >= 0">{{ Number(itemData.currentPrice).toFixed(2) }}{{itemData.currentPriceUnit || '元'}}</span> -->
      <!-- <span class="line" v-if="itemData.originalPrice >= 0">{{itemData.originalPriceUnit || '￥'}}{{ Number(itemData.originalPrice).toFixed(2) }}</span> -->
      <div
        class="price-height-color"
        v-if="
          itemData.currentPrice >= 0 &&
          itemData.currentPriceUnit &&
          itemData.currentPrice >= 0 &&
          isFieldToShow('currentPrice')
        "
      >
        <div class="p-h-unit" v-if="itemData.currentPricePrefix">
          {{ itemData.currentPricePrefix || "" }}
        </div>
        <div class="p-h-unit" v-else>
          {{
            itemData.currentPriceUnit && itemData.currentPriceUnit == "元"
              ? "¥"
              : ""
          }}
        </div>
        <div class="p-h-price">
          {{ Number(itemData.currentPrice || 0).toFixed(2) }}
        </div>
        <div class="p-h-text" v-if="itemData.currentPriceUnit !== '元'">
          {{ itemData.currentPriceUnit ? itemData.currentPriceUnit : "" }}
        </div>
        <div
          class="p-h-text"
          v-else-if="
            itemData.currentPricePrefix && itemData.currentPriceUnit == '元'
          "
        >
          {{ "元" }}
        </div>
        <div class="p-aiDou" v-if="itemData.supportAiDouPayment && itemData.supportAiDouPayment == '1'">
          <img class="p-ai-img" :src="require('@/assets/images/aidou.png')" />
          <span class="p-ai-text">AI豆可抵</span>
        </div>
      </div>
      <div class="price-height-color" v-else-if="itemData.currentPrice >= 0">
        <div class="p-h-unit" v-if="itemData.currentPricePrefix">
          {{ itemData.currentPricePrefix || "" }}
        </div>
        <div class="p-h-unit" v-else>{{ "¥" }}</div>
        <div class="p-h-price">
          {{ Number(itemData.currentPrice || 0).toFixed(2) }}
        </div>
        <div class="p-h-text" v-if="itemData.currentPricePrefix">
          {{ itemData.currentPriceUnit ? itemData.currentPriceUnit : "元" }}
        </div>
        <div class="p-aiDou" v-if="itemData.supportAiDouPayment && itemData.supportAiDouPayment == '1'">
          <img class="p-ai-img" :src="require('@/assets/images/aidou.png')" />
          <span class="p-ai-text">AI豆可抵</span>
        </div>
      </div>
    </div>

    <div
      class="r-book"
      v-if="
        isFieldToShow('subTitle') &&
        itemParentTemplateId == CONSTANTS.TEMPLATEPAGE.LIFERD008 &&
        (itemData.subTitleHL || itemData.subTitle)
      "
      v-html="itemData.subTitleHL ? itemData.subTitleHL : itemData.subTitle"
    ></div>
    <div
      class="r-tag"
      v-if="
        itemParentTemplateId == CONSTANTS.TEMPLATEPAGE.LIFERD008 &&
        itemData.bookTag &&
        isFieldToShow('dataTag')
      "
    >
      <span>{{ itemData.bookTag }}</span>
    </div>
    <div
      class="r-movie"
      v-if="
        itemParentTemplateId == CONSTANTS.TEMPLATEPAGE.LIFERD008 &&
        itemData.author &&
        isFieldToShow('author')
      "
    >
      <div class="text-title">作者：</div>
      <div class="text-over">{{ itemData.author }}</div>
    </div>

    <!-- <div class="r-music-title" v-if="itemParentTemplateId == CONSTANTS.TEMPLATEPAGE.LIFEMU009" v-html="itemData.titleHL?itemData.titleHL:itemData.title"></div> -->
    <div
      class="r-book-one"
      v-if="
        isFieldToShow('subTitle') &&
        itemParentTemplateId == CONSTANTS.TEMPLATEPAGE.LIFEMU009 &&
        (itemData.subTitleHL || itemData.subTitle)
      "
      v-html="itemData.subTitleHL ? itemData.subTitleHL : itemData.subTitle"
    ></div>
    <div
      class="r-movie"
      v-if="
        itemParentTemplateId == CONSTANTS.TEMPLATEPAGE.LIFEMU009 &&
        itemData.actor &&
        isFieldToShow('actor')
      "
    >
      {{ itemData.actor }}
    </div>

    <div
      class="r-movie"
      v-if="
        itemParentTemplateId == CONSTANTS.TEMPLATEPAGE.LIFEVD010 &&
        itemData.author &&
        isFieldToShow('author')
      "
    >
      <div class="text-title">导演：</div>
      <div class="text-over">{{ itemData.author }}</div>
    </div>
    <div
      class="r-movie"
      v-if="
        itemParentTemplateId == CONSTANTS.TEMPLATEPAGE.LIFEVD010 &&
        itemData.actor &&
        isFieldToShow('actor')
      "
    >
      <div class="text-title">主演：</div>
      <div class="text-over">{{ itemData.actor }}</div>
    </div>
    <div
      class="r-movie"
      v-if="
        itemParentTemplateId == CONSTANTS.TEMPLATEPAGE.LIFEVD010 &&
        itemData.dataTag &&
        isFieldToShow('dataTag')
      "
    >
      <div class="text-title">类型：</div>
      <div class="text-over">{{ itemData.dataTag }}</div>
    </div>

    <div
      class="r-intro"
      v-if="
        isFieldToShow('subTitle') &&
        itemParentTemplateId == CONSTANTS.TEMPLATEPAGE.LIFEGM011 &&
        (itemData.subTitleHL || itemData.subTitle)
      "
      v-html="itemData.subTitleHL ? itemData.subTitleHL : itemData.subTitle"
    ></div>
    <div
      class="r-intro"
      v-if="
        isFieldToShow('subTitle') &&
        itemParentTemplateId == CONSTANTS.TEMPLATEPAGE.LIFELB012 &&
        (itemData.subTitleHL || itemData.subTitle)
      "
      v-html="itemData.subTitleHL ? itemData.subTitleHL : itemData.subTitle"
    ></div>

    <div
      class="r-intro"
      v-if="
        isFieldToShow('subTitle') &&
        itemParentTemplateId == CONSTANTS.TEMPLATEPAGE.RECO001 &&
        (itemData.subTitleHL || itemData.subTitle)
      "
      v-html="itemData.subTitleHL ? itemData.subTitleHL : itemData.subTitle"
    ></div>

    <div
      class="r-intro-two"
      v-if="
        isFieldToShow('subTitle') &&
        itemParentTemplateId == CONSTANTS.TEMPLATEPAGE.PRODNR011 &&
        (itemData.subTitleHL || itemData.subTitle)
      "
      v-html="itemData.subTitleHL ? itemData.subTitleHL : itemData.subTitle"
    ></div>
    <price-model
      v-if="itemParentTemplateId == CONSTANTS.TEMPLATEPAGE.PRODNR011"
      :itemData="itemData"
      :itemParentTemplateId="itemParentTemplateId"
      :itemParentTemplateFieldList="itemParentTemplateFieldList"
    ></price-model>

    <!-- 左图右文两行副标题（政企客户案例） -->
    <template v-if="itemParentTemplateId == CONSTANTS.TEMPLATEPAGE.SLSRC308">
      <div class="r-government">
        <div
          v-if="
            isFieldToShow('subTitle') &&
            (itemData.subTitleHL || itemData.subTitle)
          "
          class="text-subTitleT"
          v-html="itemData.subTitleHL ? itemData.subTitleHL : itemData.subTitle"
        ></div>
      </div>
    </template>
    <!-- 左图右文副标题一行多了一行发布时间（政企新闻） -->
    <template v-if="itemParentTemplateId == CONSTANTS.TEMPLATEPAGE.SLSRC309">
      <div class="r-government">
        <div
          v-if="
            isFieldToShow('subTitle') &&
            (itemData.subTitleHL || itemData.subTitle)
          "
          class="text-subTitleO"
          v-html="itemData.subTitleHL ? itemData.subTitleHL : itemData.subTitle"
        ></div>
        <div
          v-if="isFieldToShow('publishTime') && itemData.publishTime"
          class="text-publishTime"
        >
          {{ itemData.publishTime }}
        </div>
      </div>
    </template>
    <!-- 左图右文副标题一行（政企视频） -->
    <template v-if="itemParentTemplateId == CONSTANTS.TEMPLATEPAGE.SLSRC310">
      <div class="r-government">
        <div
          v-if="
            isFieldToShow('subTitle') &&
            (itemData.subTitleHL || itemData.subTitle)
          "
          class="text-subTitleO"
          v-html="itemData.subTitleHL ? itemData.subTitleHL : itemData.subTitle"
        ></div>
      </div>
    </template>
  </div>
</template>
<script>
import { isApp, isIOS, calculateDistance } from "@/utils/tool";
import PriceModel from "./PriceModel.vue"; // 价格处理组件

export default {
  name: "alignList",
  components: {
    PriceModel,
  },
  props: {
    itemData: {
      type: Object,
    },
    itemParent: {
      type: Object,
    },
    itemParentTemplateId: {
      type: String,
    },
    itemParentTemplateFieldList: {
      type: Array,
    },
  },
  inject: ["getLocationInfo"],
  mounted() {
    this.offsetWidth = document.body.offsetWidth;
  },
  computed: {
    locationInfo() {
      return this.getLocationInfo();
    },
  },
  data() {
    return {
      offsetWidth: null,
      isApp: isApp(),
      isIOS: isIOS,
      sessionStorageValue: "",
    };
  },
  methods: {
    getDistance(itemLocation, locationInfo) {
      let { latitude, longtitude } = locationInfo;
      if (!latitude || !longtitude) return;
      const userLatitude = latitude
        ? latitude
        : sessionStorage.latitude
        ? sessionStorage.latitude
        : ""; // 用户的纬度
      const userLongtitude = longtitude
        ? longtitude
        : sessionStorage.longtitude
        ? sessionStorage.longtitude
        : ""; // 用户的经度
      const destinationLatitude = itemLocation
        ? itemLocation.split(",")[0]
        : ""; // 目的地的纬度
      const destinationLongtitude = itemLocation
        ? itemLocation.split(",")[1]
        : ""; // 目的地的经度
      const distance = calculateDistance(
        userLatitude,
        userLongtitude,
        destinationLatitude,
        destinationLongtitude
      );
      return `${Number(distance || 0).toFixed(2)}km`;
    },
    /**
     * wholeTemplateFieldList/verticalTemplateFieldList --字段是否展示
     * @param {*} field
     */
    isFieldToShow(field) {
      if (this.itemParentTemplateFieldList) {
        return this.itemParentTemplateFieldList.includes(field);
      }
    },
  },
};
</script>

<style scoped lang='scss'>
$theme-color: #2892ff;
.module-wrap {
  background: #ffffff;
  box-shadow: 0px 4px 20px 0px #f6f6f6;
  border-radius: 18px;
  padding: 32px 24px 34px 29px;
  margin-bottom: 18px;
  .m-title {
    display: flex;
    justify-content: space-between;
    font-size: 24px;
    color: #999;
    margin-bottom: 24px;
    i {
      padding-left: 6px;
      font-size: 24px;
    }
    .m-t-left {
      font-size: 32px;
      color: #000000;
    }
  }
  .m-content {
    .content-item {
      display: flex;
      align-items: center;
      .c-i-left {
        margin-right: 20px;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 180px;
        .van-image {
          border-radius: 12px;
          overflow: hidden;
          img {
            width: 100%;
            border-radius: 12px;
          }
        }
        ::v-deep .van-image__img {
          min-width: 100px;
        }
        ::v-deep .van-image__error {
          position: relative;
          background-color: initial !important;
        }
        img {
          width: 150px;
          border-radius: 10px;
          // height: 150px;
        }
        .l-tag {
          width: auto;
          height: 24px;
          position: absolute;
          right: -10px;
          top: -10px;
          border-radius: 0px !important;
        }
      }
      .c-i-right {
        flex: 1;
        overflow: hidden;
        // div{
        //   margin-bottom: 12px;
        // }
        .r-title-hw {
          font-size: 28px;
          // max-height: 76px;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-bottom: 12px;
          // display: flex;
          // align-items: flex-start;
          position: relative;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          font-weight: 700;
          font-family: PingFangSC-Medium, sans-serif;
          // display: flex;
          // justify-content: start;
          // align-items: center;
          .title-front-tag {
            position: absolute;
            left: 0px;
            width: 94px;
            // height:32px;
            top: 4px;
          }
          .title-front-tag-text {
            transform: scale(1);
            // position: absolute;
            // left:0px;
            // width: 110px;
            // height:32px;
            // top: 4px;
            font-size: 16px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #ffffff !important;
            line-height: 28px;
            border-radius: 6px;
            height: 30px;
            text-align: center;
            padding: 0px 10px;
            margin-right: 8px;
            position: relative;
            top: -6px;
            display: inline-block;
            // display: flex;
            // justify-content: center;
            // align-items: center;
          }
          .text-indent-100 {
            text-indent: 120px;
          }
          .text-indent-160 {
            text-indent: 130px;
          }
          .text-indent-0 {
            // text-indent: 0px;
            // padding-left:10px;
          }
          img {
            width: 94px;
            vertical-align: text-bottom;
          }
          ::v-deep span {
            color: #2892ff !important;
          }
        }
        .r-title {
          font-size: 28px;
          // max-height: 76px;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-bottom: 12px;
          // display: flex;
          // align-items: flex-start;
          position: relative;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          font-weight: 700;
          font-family: PingFangSC-Medium, sans-serif;
          // font-weight: 700;
          // font-family:PingFangSC-Medium, sans-serif;
          .title-front-tag {
            position: absolute;
            left: 0px;
            width: 94px;
            // height:28px;
            top: 4px;
          }
          .title-front-tag-text {
            transform: scale(1);
            // position: absolute;
            // left:0px;
            // width: 110px;
            // height:32px;
            // top: 4px;
            font-size: 16px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #ffffff !important;
            line-height: 28px;
            border-radius: 6px;
            height: 30px;
            text-align: center;
            padding: 0px 10px;
            margin-right: 8px;
            position: relative;
            top: -6px;
            display: inline-block;
            // display: flex;
            // justify-content: center;
            // align-items: center;
          }
          .text-indent-100 {
            text-indent: 120px;
          }
          .text-indent-160 {
            text-indent: 160px;
          }
          .text-indent-0 {
            // text-indent: 0px;
          }
          img {
            width: 94px;
            vertical-align: text-bottom;
          }
          ::v-deep span {
            color: #2892ff !important;
          }
        }
        .r-intro {
          font-size: 28px;
          color: #999;
          overflow: hidden;
          text-overflow: ellipsis;
          position: relative;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          ::v-deep span {
            color: #2892ff !important;
          }
        }
        .r-intro-two {
          font-size: 28px;
          color: #999;
          overflow: hidden;
          text-overflow: ellipsis;
          position: relative;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          ::v-deep span {
            color: #2892ff !important;
          }
        }
        .r-price {
          font-size: 28px;
          color: #999;
          font-weight: 600;
          margin-bottom: 8px;
          margin-top: 8px;
          display: flex;
          align-items: flex-end;
          flex-wrap: wrap;
          .price-height-color {
            font-size: 32px;
            font-weight: 600;
            padding-right: 24px;
            display: flex;
            align-items: center;
            .p-h-unit {
              font-size: 24px;
              line-height: 26px;
              font-weight: normal;
            }
            .p-h-price {
              line-height: 28px;
            }
            .p-h-text {
              font-size: 24px;
              font-weight: normal;
              line-height: 26px;
            }
            .p-aiDou {
              display: flex;
              align-items: center;
              justify-content: flex-start;
              width: 132px;
              height: 32px;
              background: #F5F5F5;
              border-radius: 6px;
              margin-left: 12px;
              padding: 0px 0px 0 8px;
              // line-height: 32px;
              .p-ai-img {
                height: 28px;
                width: 28px;
              }

              .p-ai-text {
                display: flex;
                align-items: center;
                font-family: PingFangSC, PingFang SC;
                font-weight: 500;
                font-size: 20px;
                color: #333333;
                // line-height: 28px;
                margin-left: 6px;
              }
            }
          }
          .line {
            font-size: 24px;
            text-decoration: line-through;
            font-weight: normal;
            display: flex;
            align-items: flex-end;
            line-height: 24px;
            .line-text {
              line-height: 24px;
            }
          }
        }
        .r-digital-intro {
          font-size: 24px;
          color: #999;
          margin-bottom: 16px;
          ::v-deep span {
            color: #2892ff !important;
          }
        }
        .r-store {
          font-size: 20px;
          color: #333;
          font-weight: 500;
          text-align: left;
          display: inline-block;
          width: 100%;
          display: flex;
          margin: 10px 0px 12px 0px;
          span {
            // width:100%;
            transform: scale(0.95);
            transform-origin: left;
            display: inline-block;
            vertical-align: text-top;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            font-family: PingFangSC-Medium;
            text-align: left;
            background: #f5f5f5;
            padding: 2px 10px;
            border-radius: 6px;
          }
        }
        .r-comments {
          font-size: 24px;
          color: #999;
          .r-c-title {
            color: #999 !important;
          }
          span {
            color: #333;
            // margin-left: 10px;
          }
        }
        .r-movie {
          font-size: 24px;
          color: #999;
          display: flex;
          justify-content: start;
          margin-bottom: 0px;
          .text-title {
            width: 17%;
          }
          .text-over {
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            width: 80%;
          }
        }

        .r-government {
          font-size: 24px;
          color: #999;
          // display: flex;
          // justify-content: start;
          margin-bottom: 0px;

          // 副标题一行
          .text-subTitleO {
            font-size: 24px;
            line-height: 32px;
            color: #999999;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            overflow: hidden;
            text-overflow: ellipsis;

            ::v-deep span {
              color: #2892ff !important;
            }
          }

          // 副标题两行
          .text-subTitleT {
            font-size: 24px;
            line-height: 32px;
            color: #999999;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
            text-overflow: ellipsis;

            ::v-deep span {
              color: #2892ff !important;
            }
          }
          .text-publishTime {
            margin-top: 6px;
            font-size: 24px;
            color: #999999;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
        .r-book {
          width: 90%;
          font-size: 24px;
          color: #999999;
          line-height: 32px;
          height: 63px;
          text-overflow: ellipsis;
          overflow: hidden;
          margin-bottom: 0px;
          // white-space: nowrap;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          ::v-deep span {
            color: #2892ff !important;
          }
        }
        .r-book-one {
          width: 90%;
          font-size: 24px;
          color: #999999;
          line-height: 32px;
          // height: 63px;
          text-overflow: ellipsis;
          overflow: hidden;
          margin-bottom: 0px;
          // white-space: nowrap;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          ::v-deep span {
            color: #2892ff !important;
          }
        }
        .r-tag {
          vertical-align: text-top;
          span {
            border-radius: 4px;
            border: 1px solid #2892ff;
            color: #2892ff;
            font-size: 20px;
            padding: 0px 10px;
            text-align: center;
            margin-right: 15px;
            line-height: 30px;
            height: 30px;
            display: inline-block;
          }
        }
        .r-music-title {
          font-size: 28px;
          font-weight: 500;
          color: #333333;
          line-height: 38px;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
        .r-position {
          font-size: 20px;
          color: #999999;
          display: flex;
          justify-content: start;
          align-items: center;

          // font-family:PingFangSC-Medium;
          i {
            font-size: 20px;
            margin-right: 3px;
          }
          span {
            color: #333;
          }
          .text {
            width: 100%;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            display: inline-block;
            color: #999999;
            transform: scale(0.95);
            transform-origin: left;
            text-align: left;
          }
        }
      }
    }
  }
}
.ml-10 {
  margin-left: 10px;
}
</style>
