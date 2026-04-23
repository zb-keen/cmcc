<template>
  <div>
    <template v-if="pageEntrance == '6'">
      <div
        v-for="(itemJs, indexJS) in moreArrDataList"
        :key="indexJS + Math.random()"
      >
        <!-- 可领权益区 -->
        <!-- {{ itemParent.verticalTemplateFieldList }} -->
        <div class="module-wrap">
          <div class="m-title">
            <div class="m-t-left" v-if="itemJs[0].jsDataType == '1'">
              可领权益区
            </div>
            <div class="m-t-left" v-if="itemJs[0].jsDataType == '2'">
              优惠购买区
            </div>
            <div class="m-t-left" v-if="itemJs[0].jsDataType == '3'">
              包月优惠区
            </div>
          </div>
          <div
            class="m-content"
            data-value="1"
            v-for="(itemD, indexD) in itemJs"
            :key="itemD._id + Math.random()"
          >
            <div
              class="content-item"
              v-if="itemD.jsDataType == '1'"
              @click="handleClickTo(itemD, indexD, '可领权益区')"
              :imp-position-id="indexD + 1"
              imp-type="once"
              imp-track="imp"
              :imp-attrs="itemD.impAttrsList"
              :data-value="JSON.stringify(itemD.impAttrsList)"
            >
              <div class="c-i-left">
                <van-image
                  :src="
                    itemD.iconUrl
                      ? itemD.iconUrl
                      : itemParent.verticalDefaultPic
                  "
                  draggable="false"
                  lazy-load
                  :loading-icon="itemParent.verticalDefaultPic"
                  :style="{ 'max-width': (offsetWidth * 140) / 750 + 'px' }"
                >
                  <template v-slot:loading>
                    <van-loading type="spinner" size="20" />
                  </template>
                  <template v-slot:error>
                    <img
                      :src="itemParent.verticalDefaultPic"
                      :style="{
                        'max-width': (offsetWidth * 140) / 750 + 'px',
                        width: 'auto',
                        height: 'auto',
                      }"
                      draggable="false"
                      alt=""
                  /></template>
                </van-image>
                <img
                  class="l-tag"
                  v-if="isFieldToShow('cornerMark') && itemD.cornerMarkUrl"
                  :src="itemD.cornerMarkUrl"
                  draggable="false"
                  alt=""
                />
              </div>
              <div class="c-i-right" :data-value="itemD._id">
                <div class="r-title">
                  <!-- :style="{ 'textIndent':itemData.tagWidth?((offsetWidth * (itemData.tagWidth + 15))/750) + 'px' :'initial'}" -->
                  <span
                    v-if="itemD.buyTypeUrl"
                    :class="
                      itemD.buyType == 'u1'
                        ? 'title-front-tag-text bg-2892FF'
                        : itemD.buyType == 'u2'
                        ? 'title-front-tag-text bg-00BB7C'
                        : itemD.buyType == 'u3'
                        ? 'title-front-tag-text bg-FF7627'
                        : 'title-front-tag-text bg-FF7627'
                    "
                    >{{ itemD.buyTypeName }}</span
                  >
                  <a v-html="itemD.titleHL ? itemD.titleHL : itemD.title"></a>
                </div>
                <div
                  class="r-intro"
                  v-if="
                    isFieldToShow('subTitle') &&
                    (itemD.subTitleHL || itemD.subTitle)
                  "
                  v-html="itemD.subTitleHL ? itemD.subTitleHL : itemD.subTitle"
                ></div>
                <price-model
                  :itemData="itemD"
                  :itemParentTemplateId="itemParentTemplateId"
                  :itemParentTemplateFieldList="itemParentTemplateFieldList"
                ></price-model>
              </div>
            </div>
          </div>
          <!-- </div> -->
          <!-- 可领权益区 -->
          <!-- 优惠购买区 -->
          <!-- <div class="module-wrap">
			<div class="m-title">
				<div class="m-t-left">优惠购买区</div>
			</div> -->
          <div
            class="m-content"
            data-value="2"
            v-for="(itemD, indexD) in itemJs"
            :key="itemD._id + Math.random()"
          >
            <div
              class="content-item"
              v-if="itemD.jsDataType == '2'"
              @click="handleClickTo(itemD, indexD, '优惠购买区')"
              :imp-position-id="indexD + 1"
              imp-type="once"
              imp-track="imp"
              :imp-attrs="itemD.impAttrsList"
              :data-value="JSON.stringify(itemD.impAttrsList)"
            >
              <div class="c-i-left">
                <van-image
                  :src="
                    itemD.iconUrl
                      ? itemD.iconUrl
                      : itemParent.verticalDefaultPic
                  "
                  draggable="false"
                  lazy-load
                  :loading-icon="itemParent.verticalDefaultPic"
                  :style="{ 'max-width': (offsetWidth * 140) / 750 + 'px' }"
                >
                  <template v-slot:loading>
                    <van-loading type="spinner" size="20" />
                  </template>
                  <template v-slot:error>
                    <img
                      :src="itemParent.verticalDefaultPic"
                      :style="{
                        'max-width': (offsetWidth * 140) / 750 + 'px',
                        width: 'auto',
                        height: 'auto',
                      }"
                      draggable="false"
                      alt=""
                  /></template>
                </van-image>
                <img
                  class="l-tag"
                  v-if="itemD.cornerMarkUrl"
                  :src="itemD.cornerMarkUrl"
                  draggable="false"
                  alt=""
                />
              </div>
              <div class="c-i-right" :data-value="itemD._id">
                <div class="r-title">
                  <div
                    v-if="itemD.buyTypeUrl"
                    :class="
                      itemD.buyType == 'u1'
                        ? 'title-front-tag-text bg-2892FF'
                        : itemD.buyType == 'u2'
                        ? 'title-front-tag-text bg-00BB7C'
                        : itemD.buyType == 'u3'
                        ? 'title-front-tag-text bg-FF7627'
                        : 'title-front-tag-text bg-FF7627'
                    "
                  >
                    {{ itemD.buyTypeName }}
                  </div>
                  <!-- <img v-if="itemD.buyTypeUrl"
							:class="itemD.buyTypeUrl?'title-front-tag':'title-front-tag'"
							src="../../../assets/images/trustBuy.png" draggable="false" alt=""/> -->
                  <div
                    :style="{
                      textIndent: itemD.tagWidth
                        ? (offsetWidth * (itemD.tagWidth + 15)) / 750 + 'px'
                        : 'initial',
                    }"
                  >
                    <div
                      v-html="itemD.titleHL ? itemD.titleHL : itemD.title"
                    ></div>
                  </div>
                </div>
                <div
                  class="r-intro"
                  v-if="
                    isFieldToShow('subTitle') &&
                    (itemD.subTitleHL || itemD.subTitle)
                  "
                  v-html="itemD.subTitleHL ? itemD.subTitleHL : itemD.subTitle"
                ></div>
                <price-model
                  :itemData="itemD"
                  :itemParentTemplateId="itemParentTemplateId"
                  :itemParentTemplateFieldList="itemParentTemplateFieldList"
                ></price-model>
              </div>
            </div>
          </div>
          <!-- </div> -->
          <!-- 优惠购买区 -->
          <!-- 包月优惠区 -->
          <!-- <div class="module-wrap">
			<div class="m-title">
				<div class="m-t-left">包月优惠区</div>
			</div> -->
          <div
            class="m-content m-content-cloumn"
            data-value="3"
            v-for="(itemD, indexD) in itemJs"
            :key="itemD._id + Math.random()"
          >
            <div
              class="content-item"
              v-if="itemD.jsDataType == '3'"
              @click="handleClickTo(itemD, indexD, '包月优惠区')"
              :imp-position-id="indexD + 1"
              imp-type="once"
              imp-track="imp"
              :imp-attrs="itemD.impAttrsList"
              :data-value="JSON.stringify(itemD.impAttrsList)"
            >
              <div class="c-i-top">
                <div class="t-left">
                  <div
                    v-html="itemD.titleHL ? itemD.titleHL : itemD.title"
                  ></div>
                </div>
                <div class="t-right">
                  <div
                    class="r-price"
                    v-if="
                      isFieldToShow('currentPrice') &&
                      itemD.currentPrice &&
                      itemD.currentPrice > 0
                    "
                  >
                    <div class="price-height-color">
                      <div class="p-h-unit" v-if="itemD.currentPricePrefix">
                        {{ itemD.currentPricePrefix || "" }}
                      </div>
                      <div class="p-h-unit">
                        {{
                          itemD.currentPriceUnit &&
                          itemD.currentPriceUnit == "元"
                            ? "¥"
                            : ""
                        }}
                      </div>
                      <div class="p-h-price">
                        {{ Number(itemD.currentPrice || 0).toFixed(2) }}
                      </div>
                      <div
                        class="p-h-text"
                        v-if="itemD.currentPriceUnit !== '元'"
                      >
                        /{{
                          itemD.currentPriceUnit ? itemD.currentPriceUnit : ""
                        }}
                      </div>
                      <div
                        class="p-h-text"
                        v-else-if="
                          itemD.currentPricePrefix &&
                          itemD.currentPriceUnit == '元'
                        "
                      >
                        /{{ "元" }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="c-i-text"
                v-if="
                  isFieldToShow('subTitle') &&
                  (itemD.subTitleHL || itemD.subTitle)
                "
                v-html="itemD.subTitleHL ? itemD.subTitleHL : itemD.subTitle"
              ></div>
              <div class="c-i-img">
                <div
                  class="i-div"
                  v-for="(itemList, rightIndex) in itemD.subItemList"
                  :key="itemList._id + Math.random()"
                  @click="directGoPage(itemList, rightIndex, itemD)"
                  @click.stop
                >
                  <van-image
                    :src="
                      itemList.iconUrl
                        ? itemList.iconUrl
                        : itemParent.verticalDefaultPic
                    "
                    draggable="false"
                    lazy-load
                    :loading-icon="itemParent.verticalDefaultPic"
                    :style="{ 'max-width': (offsetWidth * 60) / 750 + 'px' }"
                  >
                    <template v-slot:loading>
                      <van-loading type="spinner" size="20" />
                    </template>
                    <template v-slot:error>
                      <img
                        :src="
                          itemList.iconUrl
                            ? itemList.iconUrl
                            : itemParent.verticalDefaultPic
                        "
                        :loading-icon="itemParent.verticalDefaultPic"
                        :style="{
                          'max-width': (offsetWidth * 60) / 750 + 'px',
                          width: 'auto',
                          height: 'auto',
                        }"
                        draggable="false"
                        alt=""
                      />
                    </template>
                  </van-image>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 包月优惠区 -->
      </div>
    </template>
    <!-- 正常展示 -->
    <div class="module-wrap" v-if="hasData('99') && pageEntrance != '6'">
      <!-- 可领权益区 -->
      <div
        class="m-content"
        data-value="99"
        v-for="(itemD, indexD) in moreArrDataList"
        :key="itemD._id + Math.random()"
      >
        <div
          class="content-item"
          v-if="itemD.jsDataType == '1'"
          @click="handleClickTo(itemD, indexD, '可领权益区')"
          :imp-position-id="indexD + 1"
          imp-type="once"
          imp-track="imp"
          :imp-attrs="itemD.impAttrsList"
          :data-value="JSON.stringify(itemD.impAttrsList)"
        >
          <div class="c-i-left">
            <van-image
              :src="
                itemD.iconUrl ? itemD.iconUrl : itemParent.verticalDefaultPic
              "
              draggable="false"
              lazy-load
              :loading-icon="itemParent.verticalDefaultPic"
              :style="{ 'max-width': (offsetWidth * 140) / 750 + 'px' }"
            >
              <template v-slot:loading>
                <van-loading type="spinner" size="20" />
              </template>
              <template v-slot:error>
                <img
                  :src="itemParent.verticalDefaultPic"
                  :style="{
                    'max-width': (offsetWidth * 140) / 750 + 'px',
                    width: 'auto',
                    height: 'auto',
                  }"
                  draggable="false"
                  alt=""
                />
              </template>
            </van-image>
            <img
              class="l-tag"
              v-if="isFieldToShow('cornerMark') && itemD.cornerMarkUrl"
              :src="itemD.cornerMarkUrl"
              draggable="false"
              alt=""
            />
          </div>
          <div class="c-i-right" :data-value="itemD._id">
            <div class="r-title">
              <!-- :style="{ 'textIndent':itemData.tagWidth?((offsetWidth * (itemData.tagWidth + 15))/750) + 'px' :'initial'}" -->
              <span
                v-if="itemD.buyTypeUrl"
                :class="
                  itemD.buyType == 'u1'
                    ? 'title-front-tag-text bg-2892FF'
                    : itemD.buyType == 'u2'
                    ? 'title-front-tag-text bg-00BB7C'
                    : itemD.buyType == 'u3'
                    ? 'title-front-tag-text bg-FF7627'
                    : 'title-front-tag-text bg-FF7627'
                "
                >{{ itemD.buyTypeName }}</span
              >
              <a v-html="itemD.titleHL ? itemD.titleHL : itemD.title"></a>
            </div>
            <div
              class="r-intro"
              v-if="
                isFieldToShow('subTitle') &&
                (itemD.subTitleHL || itemD.subTitle)
              "
              v-html="itemD.subTitleHL ? itemD.subTitleHL : itemD.subTitle"
            ></div>
            <price-model
              :itemData="itemD"
              :itemParentTemplateId="itemParentTemplateId"
              :itemParentTemplateFieldList="itemParentTemplateFieldList"
            ></price-model>
          </div>
        </div>
        <!-- </div> -->
        <!-- 可领权益区 -->
        <!-- 优惠购买区 -->
        <!-- <div class="m-content"> -->
        <div
          class="content-item"
          v-if="itemD.jsDataType == '2'"
          @click="handleClickTo(itemD, indexD, '优惠购买区')"
          :imp-position-id="indexD + 1"
          imp-type="once"
          imp-track="imp"
          :imp-attrs="itemD.impAttrsList"
          :data-value="JSON.stringify(itemD.impAttrsList)"
        >
          <div class="c-i-left">
            <van-image
              :src="
                itemD.iconUrl ? itemD.iconUrl : itemParent.verticalDefaultPic
              "
              draggable="false"
              lazy-load
              class="img-2"
            >
              <template v-slot:loading>
                <van-loading type="spinner" size="20" />
              </template>
              <template v-slot:error>
                <img
                  :src="itemParent.verticalDefaultPic"
                  class="default-img default-2"
                  draggable="false"
                  alt=""
                />
              </template>
            </van-image>
            <img
              class="l-tag"
              v-if="itemD.cornerMarkUrl"
              :src="itemD.cornerMarkUrl"
              draggable="false"
              alt=""
            />
          </div>
          <div class="c-i-right" :data-value="itemD._id">
            <div class="r-title">
              <div
                v-if="itemD.buyTypeUrl"
                :class="
                  itemD.buyType == 'u1'
                    ? 'title-front-tag-text bg-2892FF'
                    : itemD.buyType == 'u2'
                    ? 'title-front-tag-text bg-00BB7C'
                    : itemD.buyType == 'u3'
                    ? 'title-front-tag-text bg-FF7627'
                    : 'title-front-tag-text bg-FF7627'
                "
              >
                {{ itemD.buyTypeName }}
              </div>
              <!-- <img
                v-if="itemD.buyTypeUrl"
                :class="
                  itemD.buyTypeUrl ? 'title-front-tag' : 'title-front-tag'
                "
                src="../../../assets/images/trustBuy.png"
                draggable="false"
                alt=""
              /> -->
              <div
                :style="{
                  textIndent: itemD.tagWidth
                    ? (offsetWidth * (itemD.tagWidth + 15)) / 750 + 'px'
                    : 'initial',
                }"
              >
                <div v-html="itemD.titleHL ? itemD.titleHL : itemD.title"></div>
              </div>
            </div>
            <div
              class="r-intro"
              v-if="
                isFieldToShow('subTitle') &&
                (itemD.subTitleHL || itemD.subTitle)
              "
              v-html="itemD.subTitleHL ? itemD.subTitleHL : itemD.subTitle"
            ></div>
            <price-model
              :itemData="itemD"
              :itemParentTemplateId="itemParentTemplateId"
              :itemParentTemplateFieldList="itemParentTemplateFieldList"
            ></price-model>
          </div>
        </div>
        <!-- </div> -->
        <!-- 优惠购买区 -->
        <!-- 包月优惠区 -->
        <div class="m-content-cloumn">
          <div
            class="content-item"
            v-if="itemD.jsDataType == '3'"
            @click="handleClickTo(itemD, indexD, '包月优惠区')"
            :imp-position-id="indexD + 1"
            imp-type="once"
            imp-track="imp"
            :imp-attrs="itemD.impAttrsList"
            :data-value="JSON.stringify(itemD.impAttrsList)"
          >
            <div class="c-i-top">
              <div class="t-left">
                <div v-html="itemD.titleHL ? itemD.titleHL : itemD.title"></div>
              </div>
              <div class="t-right">
                <div
                  class="r-price"
                  v-if="
                    isFieldToShow('currentPrice') &&
                    itemD.currentPrice &&
                    itemD.currentPrice > 0
                  "
                >
                  <div class="price-height-color">
                    <div class="p-h-unit" v-if="itemD.currentPricePrefix">
                      {{ itemD.currentPricePrefix || "" }}
                    </div>
                    <div class="p-h-unit">
                      {{
                        itemD.currentPriceUnit && itemD.currentPriceUnit == "元"
                          ? "¥"
                          : ""
                      }}
                    </div>
                    <div class="p-h-price">
                      {{ Number(itemD.currentPrice || 0).toFixed(2) }}
                    </div>
                    <div
                      class="p-h-text"
                      v-if="itemD.currentPriceUnit !== '元'"
                    >
                      /{{
                        itemD.currentPriceUnit ? itemD.currentPriceUnit : ""
                      }}
                    </div>
                    <div
                      class="p-h-text"
                      v-else-if="
                        itemD.currentPricePrefix &&
                        itemD.currentPriceUnit == '元'
                      "
                    >
                      /{{ "元" }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="c-i-text"
              v-if="
                isFieldToShow('subTitle') &&
                (itemD.subTitleHL || itemD.subTitle)
              "
              v-html="itemD.subTitleHL ? itemD.subTitleHL : itemD.subTitle"
            ></div>
            <div class="c-i-img">
              <div
                class="i-div"
                v-for="(itemList, rightIndex) in itemD.subItemList"
                :key="itemList._id + Math.random()"
                @click="directGoPage(itemList, rightIndex, itemD)"
                @click.stop
              >
                <van-image
                  :src="
                    itemList.iconUrl
                      ? itemList.iconUrl
                      : itemParent.verticalDefaultPic
                  "
                  draggable="false"
                  lazy-load
                  :loading-icon="itemParent.verticalDefaultPic"
                  :style="{ 'max-width': (offsetWidth * 60) / 750 + 'px' }"
                >
                  <template v-slot:loading>
                    <van-loading type="spinner" size="20" />
                  </template>
                  <template v-slot:error>
                    <img
                      :src="
                        itemList.iconUrl
                          ? itemList.iconUrl
                          : itemParent.verticalDefaultPic
                      "
                      :loading-icon="itemParent.verticalDefaultPic"
                      :style="{
                        'max-width': (offsetWidth * 60) / 750 + 'px',
                        width: 'auto',
                        height: 'auto',
                      }"
                      draggable="false"
                      alt=""
                  /></template>
                </van-image>
              </div>
            </div>
          </div>
        </div>
        <!-- 包月优惠区 -->
        <!-- <div class="m-content"> -->
        <div
          class="content-item"
          v-if="
            itemD.jsDataType == null ||
            itemD.jsDataType == undefined ||
            itemD.jsDatType == ''
          "
          @click="handleClickTo(itemD, indexD, '')"
          :imp-position-id="indexD + 1"
          imp-type="once"
          imp-track="imp"
          :imp-attrs="itemD.impAttrsList"
          :data-value="JSON.stringify(itemD.impAttrsList)"
        >
          <div class="c-i-left">
            <van-image
              :src="
                itemD.iconUrl ? itemD.iconUrl : itemParent.verticalDefaultPic
              "
              draggable="false"
              lazy-load
              :loading-icon="itemParent.verticalDefaultPic"
              :style="{ 'max-width': (offsetWidth * 140) / 750 + 'px' }"
            >
              <template v-slot:loading>
                <van-loading type="spinner" size="20" />
              </template>
              <template v-slot:error>
                <img
                  :src="itemParent.verticalDefaultPic"
                  :style="{
                    'max-width': (offsetWidth * 140) / 750 + 'px',
                    width: 'auto',
                    height: 'auto',
                  }"
                  draggable="false"
                  alt=""
              /></template>
            </van-image>
            <img
              class="l-tag"
              v-if="itemD.cornerMarkUrl"
              :src="itemD.cornerMarkUrl"
              draggable="false"
              alt=""
            />
          </div>

          <align-list
            :itemData="itemD"
            :itemParent="itemParent"
            :itemParentTemplateId="itemParent.verticalTemplateId"
            :itemParentTemplateFieldList="itemParent.verticalTemplateFieldList"
          ></align-list>
        </div>
      </div>
    </div>
    <!-- 正常展示 -->
    <!-- 加载中 -->
    <Loadding ref="loading" />
  </div>
</template>

<script>
import {
  handleSaveClickInfo,
  goPageUrl,
  isApp,
  isProtogenesisSkip,
  goProtogenesisPage,
} from "@/utils/tool";
import Loadding from "../../Loadding.vue";
import PriceModel from "./PriceModel.vue"; //价格处理组件
import AlignList from "./AlignList.vue";

export default {
  name: "JiangSuRights", //江苏权益（首页-垂直页）+ 江苏权益（单栏目）
  components: {
    Loadding,
    PriceModel,
    AlignList,
  },
  props: {
    moreArrDataList: {
      type: Array,
    },
    itemParent: {
      type: Object,
    },
    itemParentTemplateFieldList: {
      type: Array,
    },
    itemParentTemplateId: {
      type: String,
    },
    pageEntrance: {
      type: String,
    },
  },
  inject: ["getSearchContent", "getSearchUUID"],
  computed: {
    searchContent() {
      return this.getSearchContent();
    },
  },
  watch: {
    /**
     * 埋点-插码-上报
     * 曝光事件采集
     * 搜索结果页_全部
     */
    moreArrDataList: {
      handler(newVal) {
        console.log("江苏权益垂直页--数据更新---判断子权益需不需要曝光====>");
        console.log(newVal);
        console.log(newVal.length);

        if (newVal && newVal.length) {
          // 用session里的区域曝光key做曝光标识
          let allRightArr = [];

          // app权益进入端内 和 首页进入端内 垂直页数据结构不一样
          // 权益进入[[], []]
          // 首页进入[]
          if (sessionStorage.pageEntrance == "6") {
            newVal.map((newValArr) => {
              if (newValArr.length) {
                allRightArr = allRightArr.concat(newValArr);
              }
            });
          } else {
            allRightArr = newVal;
          }

          // 所有的权益外层数据
          allRightArr.map((rightItem) => {
            if (rightItem.jsDataType === "3") {
              // 只有包月优惠的要处理子权益上报
              let serverArr = null;
              serverArr = rightItem.subItemList;

              if (serverArr && serverArr.length) {
                serverArr.map((serverItem, serverIndex) => {
                  const sessionkey = serverItem._id; // 与dataNo值一致
                  let type = "jsright";

                  let temp = sessionStorage.getItem("observertimes" + type);
                  let observertimes = temp ? JSON.parse(temp) : {};
                  let times = observertimes[sessionkey];

                  if (times !== "1") {
                    // 元素进入可视区域
                    observertimes[sessionkey] = "1";
                    sessionStorage.setItem(
                      "observertimes" + type,
                      JSON.stringify(observertimes)
                    );
                    const impGdpObj = {
                      XY_transaction_id: this.getSearchUUID(),
                      WT_et: "imp",
                      WT_envName: serverItem.title,
                      WT_event: serverItem.pCode,
                      WT_markId: serverItem._id,
                      XY_point_position: serverIndex + 1,
                      XY_first_class:
                        sessionStorage.pageEntrance == "6"
                          ? "权益"
                          : sessionStorage.pageEntrance == "8"
                          ? "商城"
                          : rightItem.parentCategoryName,
                      XY_second_class: rightItem.dispCategoryName,
                      WT_next_url: serverItem.linkAdress,
                      WT_plat: sessionStorage.pagePlat || "",
                      WT_es: sessionStorage.pageUrl || "",
                      WT_ti: "搜索结果页",
                      XY_pageEntry: sessionStorage.pageEntrance || "",
                      // 插码方案修改2025-1-16
                      WT_area_type_1: "楼层",
                      areaid: "", // 父物品id信息（无父物品传空）
                      WT_area_type_2: rightItem.dispCategoryName,
                      WT_area_name: rightItem.dispCategoryName, // 若没有二级分类，此名称则记录为一级分类名称
                      XY_env_type: "icon",
                      WT_event: "P00000050506", // 全部页传P00000050508 垂直页传P00000050506
                      XY_gd_source: "搜索平台",
                      XY_scene: this.getSearchContent() || "", // 搜索内容
                      WT_si_n: serverItem.title, // 物品对应的名称
                      WT_goods_id: serverItem.itemId, // 物品所对应的id信息
                      XY_visit_source: sessionStorage.pageEntrance || "", // 访问来源
                    };
                    console.log("垂直页JiangSuRights-子权益类数据曝光上报===>");
                    console.log(impGdpObj);
                    if (isApp()) {
                      gdp("track", "imp", impGdpObj);
                    }
                  }
                });
              }
            }
          });
        }
      },
      immediate: true,
    },
  },
  mounted() {
    this.offsetWidth = document.body.offsetWidth;
  },
  data() {
    return {
      borderHeight: "1px",
      offsetWidth: null,
    };
  },
  methods: {
    /**
     * wholeTemplateFieldList/verticalTemplateFieldList --字段是否展示
     * @param {*} field
     */
    isFieldToShow(field) {
      if (this.itemParentTemplateFieldList) {
        return this.itemParentTemplateFieldList.includes(field);
      }
    },

    /**
     * 分区展示控制
     * @param {*} type
     * 江苏权益区分 jsDataType 1：可领业务   2：优惠购买    3：包月优惠 99:为空
     */
    hasData(type) {
      // return [1, 2, 3].includes(type);
      if (type == "99") {
        return true; // 当 type 为 null 时返回 false
      } else {
        return this.moreArrDataList.some((item) => item.jsDataType === type);
      }
    },

    async handleClickTo(item, index, titleName) {
      this.$refs.loading.loadingShow();
      console.log(
        JSON.stringify(item),
        "-------------垂直页JiangSuRights-点击商品-点击事件传参----------------"
      );
      console.log("-----垂直页JiangSuRights-商品position-----" + (index + 1));

      /**
       * 埋点-插码-上报
       * 点击事件采集
       * 搜索结果页_tab标签下物品名称
       */
      const clickGdpObj = {
        XY_transaction_id: this.getSearchUUID(),
        WT_et: "clk",
        WT_envName: item.title,
        WT_event: item.pCode,
        WT_markId: item._id,
        XY_point_position: index + 1,
        XY_first_class:
          sessionStorage.pageEntrance == "6"
            ? "权益"
            : sessionStorage.pageEntrance == "8"
            ? "商城"
            : item.parentCategoryName,
        // XY_second_class:
        //   item.parentCategoryName == item.disCategoryName
        //     ? " "
        //     : item.disCategoryName,
        WT_next_url: item.linkAdress,
        WT_plat: sessionStorage.pagePlat || "",
        WT_es: sessionStorage.pageUrl || "",
        WT_ti: "搜索结果页",
        XY_pageEntry: sessionStorage.pageEntrance || "",
        // 插码方案修改2025-1-16
        XY_second_class:
          item.parentCategoryName == item.disCategoryName
            ? " "
            : item.disCategoryName,
        WT_area_type_1: "楼层",
        areaid: "", // 父物品id信息（无父物品传空）
        WT_area_type_2: item.parentCategoryName,
        WT_area_name: titleName, // 若没有二级分类，此名称则记录为一级分类名称
        XY_env_type: "icon",
        WT_event: "P00000050506", // 全部页传P00000050508 垂直页传P00000050506
        XY_gd_source: "搜索平台",
        XY_scene: this.getSearchContent() || "", // 搜索内容
        WT_si_n: item.title, // 物品对应的名称
        WT_goods_id: item.itemId, // 物品所对应的id信息
        XY_visit_source: sessionStorage.pageEntrance || "", // 访问来源
      };
      console.log("点击江苏权益数据上报===>");
      console.log(clickGdpObj);

      if (isApp()) {
        gdp("track", "clk", clickGdpObj);
      }
      await handleSaveClickInfo(item, this.searchContent).then((resolve) => {
        this.$refs.loading.loadingHide();
        if (resolve == "0") {
          // let jumpType = item.jumpType === '30' ? '5' : item.jumpType === '1' ? '4' : '1';
          // goPageUrl(item.jumpType, item.linkAdress);
          // window.location.href = item.linkAdress;
          if (isProtogenesisSkip(item)) {
            goProtogenesisPage(item.linkAdress1);
          } else {
            goPageUrl(item.jumpType, item.linkAdress);
          }
        }
      });
    },

    // 插码最新方案未更新-直接跳转
    async directGoPage(item, index, itemParentObj) {
      this.$refs.loading.loadingShow();
      console.log(
        JSON.stringify(item),
        "-------------江苏权益垂直页-点击子权益商品-点击事件传参----------------"
      );
      console.log(
        "-----江苏权益垂直页-点击子权益商品-点击事件传参position-----" + index
      );

      const clickGdpObj = {
        XY_transaction_id: this.getSearchUUID(),
        WT_et: "clk",
        WT_envName: item.title,
        WT_event: "P00000050506",
        WT_markId: item._id,
        XY_point_position: index + 1,
        XY_first_class:
          sessionStorage.pageEntrance == "6"
            ? "权益"
            : sessionStorage.pageEntrance == "8"
            ? "商城"
            : item.parentCategoryName,
        XY_second_class: itemParentObj.dispCategoryName,
        WT_next_url: item.linkAdress,
        WT_plat: sessionStorage.pagePlat || "",
        WT_es: sessionStorage.pageUrl || "",
        WT_ti: "搜索结果页",
        XY_pageEntry: sessionStorage.pageEntrance || "",
        // 插码方案修改2025-1-16
        WT_area_type_1: "楼层",
        areaid: "", // 父物品id信息（无父物品传空）
        WT_area_type_2: itemParentObj.dispCategoryName,
        WT_area_name: itemParentObj.dispCategoryName, // 若没有二级分类，此名称则记录为一级分类名称
        XY_env_type: "icon",
        WT_event: "P00000050506", // 全部页传P00000050508 垂直页传P00000050506
        XY_gd_source: "搜索平台",
        XY_scene: this.getSearchContent() || "", // 搜索内容
        WT_si_n: item.title, // 物品对应的名称
        WT_goods_id: item.itemId, // 物品所对应的id信息
        XY_visit_source: sessionStorage.pageEntrance || "", // 访问来源
      };
      console.log("点击垂直页-江苏权益子权益商品--数据上报===>");
      console.log(clickGdpObj);

      if (isApp()) {
        gdp("track", "clk", clickGdpObj);
      }
      await handleSaveClickInfo(item, this.searchContent).then((resolve) => {
        this.$refs.loading.loadingHide();
        if (resolve == "0") {
          console.log(item);
          if (isProtogenesisSkip(item)) {
            goProtogenesisPage(item.linkAdress1);
          } else {
            goPageUrl("2", item.linkAdress);
          }
        }
      });
    },
  },
};
</script>

<style scoped lang='scss'>
@import "./JiangSuRights.scss";
@import "../index.scss";

.van-img {
  text-align: center;
  ::v-deep .van-image__img {
    width: auto;
    height: auto;
    vertical-align: middle;
  }
  ::v-deep .van-image__error {
    background-color: initial !important;
  }
}
.img-1 {
  ::v-deep .van-image__img {
    max-width: 2rem;
    max-height: 2rem;
  }
}
.img-2 {
  ::v-deep .van-image__img {
    max-width: 1.333rem;
    max-height: 1.333rem;
  }
}
.img-3 {
  ::v-deep .van-image__img {
    max-width: 1.8666rem;
    max-height: 1.8666rem;
  }
}
.img-4 {
  ::v-deep .van-image__img {
    max-width: 2rem;
    max-height: 1.333rem;
  }
}
.img-5 {
  ::v-deep .van-image__img {
    max-width: 1.8666rem;
    max-height: 2.7143rem;
  }
}
.img-6 {
  ::v-deep .van-image__img {
    max-width: 2rem;
    max-height: 1.12rem;
  }
  ::v-deep .van-image__error {
    max-width: 2rem;
    max-height: 1.12rem;
  }
}
.img-7 {
  ::v-deep .van-image__img {
    max-width: 8.4rem;
    max-height: 4.72rem;
  }
  ::v-deep .van-image__error {
    max-width: 8.4rem;
    max-height: 4.72rem;
  }
}

.m-content-cloumn {
  .content-item {
    align-items: flex-start;
    flex-direction: column;
    padding: 30px 29px 30px 29px !important;
  }
}
.m-content {
  .content-item::before {
    content: " ";
    height: v-bind(borderHeight);
    width: calc(100% - 60px);
    position: absolute;
    top: 0;
    left: 30px;
    background-color: #e5e5e5;
  }

  @media (-webkit-min-device-pixel-ratio: 1.5) and (-webkit-max-device-pixel-ratio: 2.49) {
    .content-item::before {
      // height: 1.3px;
      -webkit-transform: scaleY(0.5);
      transform: scaleY(0.5);
    }
  }

  @media (-webkit-min-device-pixel-ratio: 2.5) {
    .content-item::before {
      // height: 1.3px;
      -webkit-transform: scaleY(0.33);
      transform: scaleY(0.33);
    }
  }
}
</style>