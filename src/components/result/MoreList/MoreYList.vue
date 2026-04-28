<template>
  <div :class="radiusTabShowParent ? 'h100' : 'h100'">
    <traffic-peak-fallback v-if="trafficPeakFallback" />
    <template v-else>
    <result-skeleton v-show="false"></result-skeleton>
    <!-- 二级类目 -->
    <radius-tab ref="radiusTabRef" @getFormItem="getFormItem"></radius-tab>
    <!-- 二级类目 -->
    <traffic-peak-fallback v-if="trafficPeakFallback" />
    <no-data
      v-else-if="noDataShow && !searchZoneHasData"
      ref="noDataRef"
    ></no-data>
    <template v-else>
      <template v-if="moreArrList.length === 0">
        <!-- <HotSellingCardSet v-if="paramData.verticalTemplateId != 'CATEALL' && !isShow" :nowCategoryCode="paramData.categoryCode" :hotMobileNumData="hotMobileNumData" @refreshHotMobileNumRequest="refreshHotMobileNum"></HotSellingCardSet> -->
        <search-zone
          ref="searchZoneRef"
          v-if="
            !searchZoneSecondShow && paramData.verticalTemplateId != 'CATEALL'
          "
          :nowCategoryCode="paramData.categoryCode"
          :nowTemplateId="paramData.verticalTemplateId"
        ></search-zone>
        <search-zone-more
          ref="searchZoneRef"
          v-if="
            searchZoneSecondShow && paramData.verticalTemplateId != 'CATEALL'
          "
          :nowCategoryCode="paramData.categoryCode"
          :nowTemplateId="paramData.verticalTemplateId"
        ></search-zone-more>
        <!-- <van-sticky :offset-top="isApp ? 151 + 52 : 172">
          <div
            class="wrap-top module-wrap module-wrap1"
            v-for="(itemO, indexO) in moreArrList"
            :key="itemO._id"
            v-if="itemO.verticalTemplateId == CONSTANTS.TEMPLATEPAGE.PRODHW004"
          >
            <div class="filter-wrap">
              <div
                v-for="(itemF, indexF) in filterList"
                :key="indexF"
                :class="[{ active: activeTab === indexF }, [itemF.value]]"
                @click="handleFilter(itemF, indexF)"
              >
                {{ itemF.label }}
                <i
                  v-for="(itemIcon, indexIcon) in itemF.icon"
                  :key="indexIcon"
                  :class="itemIcon.value"
                ></i>
              </div>
            </div>
          </div>
        </van-sticky> -->
      </template>
      <template v-else>
        <div
          v-for="(item, index) in moreArrList"
          :key="item._id"
          :class="
            item.verticalTemplateId == CONSTANTS.TEMPLATEPAGE.PRODHW004 ||
            item.verticalTemplateId == CONSTANTS.TEMPLATEPAGE.PRODMS012
              ? 'wrap-bottom module-wrap wrap-fixed'
              : 'module-wrap wrap-fixed'
          "
          :id="'imp-more-content_' + item.categoryCode"
        >
          <div
            :class="
              item.verticalTemplateId == CONSTANTS.TEMPLATEPAGE.PRODHW004 ||
              item.verticalTemplateId == CONSTANTS.TEMPLATEPAGE.PRODMS012
                ? 'cover'
                : 'cover'
            "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 18 18"
              version="1.1"
            >
              <g
                id=""
                stroke="none"
                stroke-width="1"
                fill="none"
                fill-rule="evenodd"
              >
                <path
                  d="M0,0 L18,0 L17.6693348,0.0029762956 C7.88078333,0.179318477 -1.20390968e-15,8.16933145 0,18 L0,18 L0,0 Z"
                  fill="#F7F7F7"
                />
              </g>
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 18 18"
              version="1.1"
            >
              <g
                id=""
                stroke="none"
                stroke-width="1"
                fill="none"
                fill-rule="evenodd"
              >
                <path
                  d="M0,0 L18,0 L17.6693348,0.0029762956 C7.88078333,0.179318477 -1.20390968e-15,8.16933145 0,18 L0,18 L0,0 Z"
                  fill="#F7F7F7"
                  transform="translate(9.000000, 9.000000) scale(-1, 1) translate(-9.000000, -9.000000) "
                />
              </g>
            </svg>
          </div>

          <div class="m-content">
            <van-list
              v-model="loading"
              :finished="finished"
              finished-text="我是有底线的"
              @load="onLoad"
              :immediate-check="$isProvinceDistinct"
              :class="vanListHeight"
            >
              <!-- <HotSellingCardSet v-if="paramData.verticalTemplateId != 'CATEALL' && !isShow" :nowCategoryCode="paramData.categoryCode" :hotMobileNumData="hotMobileNumData" @refreshHotMobileNumRequest="refreshHotMobileNum"></HotSellingCardSet> -->
              <search-zone
                ref="searchZoneRef"
                v-if="
                  !searchZoneSecondShow &&
                  paramData.verticalTemplateId != 'CATEALL'
                "
                :nowCategoryCode="paramData.categoryCode"
                :nowTemplateId="paramData.verticalTemplateId"
              ></search-zone>
              <search-zone-more
                ref="searchZoneRef"
                v-if="
                  searchZoneSecondShow &&
                  paramData.verticalTemplateId != 'CATEALL'
                "
                :nowCategoryCode="paramData.categoryCode"
                :nowTemplateId="paramData.verticalTemplateId"
              ></search-zone-more>

              <!-- 商品-手机硬件-话费购 筛选 -->
              <div class="sticky-content">
                <template v-for="(itemO, indexO) in moreArrList">
                  <div
                    class="wrap-top module-wrap module-wrap1"
                    :key="itemO._id"
                    v-if="
                      itemO.verticalTemplateId ==
                        CONSTANTS.TEMPLATEPAGE.PRODHW004 ||
                      itemO.verticalTemplateId ==
                        CONSTANTS.TEMPLATEPAGE.PRODMS012
                    "
                  >
                    <div class="filter-wrap">
                      <div
                        v-for="(itemF, indexF) in getMap1(
                          filterList,
                          'label',
                          $isDistinct
                        )"
                        :key="indexF"
                        :class="[
                          { active: activeTab === indexF },
                          [itemF.value],
                        ]"
                        @click="handleFilter(itemF, indexF)"
                      >
                        {{ itemF.label }}
                        <i
                          v-for="(itemIcon, indexIcon) in itemF.icon"
                          :key="indexIcon"
                          :class="itemIcon.value"
                        ></i>
                      </div>
                    </div>
                  </div>
                </template>
              </div>
              <!-- 商品-手机硬件-话费购 筛选 -->
              <no-data
                v-if="(noDataShowFilter || (!moreArrDataList || !moreArrDataList.length)) && !searchZoneHasData"
                ref="noDataRef"
              ></no-data>
              <template v-if="moreArrDataList && moreArrDataList.length">
                <!-- {{ provinceCodeLocal }}{{ pageEntrance }} -->
                <!-- 新增江苏权益垂直页 -->
                <jiang-su-rights
                  v-if="
                    provinceCodeLocal == '250' &&
                    (item.verticalTemplateId ==
                      CONSTANTS.TEMPLATEPAGE.PRODMB0051 ||
                      item.verticalTemplateId ==
                        CONSTANTS.TEMPLATEPAGE.PRODMB0052)
                  "
                  :moreArrDataList="
                    jiangsuGetMap(
                      jsMoreArrDataList,
                      item.verticalTemplateFieldList,
                      $isDistinct
                    )
                  "
                  :itemParent="item"
                  :pageEntrance="pageEntrance"
                  :itemParentTemplateFieldList="item.verticalTemplateFieldList"
                  :itemParentTemplateId="item.verticalTemplateId"
                ></jiang-su-rights>
                <!-- 新增江苏权益垂直页 -->
                <!-- 服务模板 -->
                <div
                  v-else-if="
                    item.verticalTemplateId == CONSTANTS.TEMPLATEPAGE.SERV001
                  "
                  class="m-content-x"
                >
                  <div
                    class="content-item"
                    v-for="(itemD, indexD) in getMap(
                      moreArrDataList,
                      item.verticalTemplateFieldList,
                      $isDistinct
                    )"
                    :key="indexD"
                    @click="handleClickTo(itemD, indexD)"
                    imp-type="once"
                    imp-track="imp"
                    :imp-attrs="itemD.impAttrsList"
                    :data-value="JSON.stringify(itemD.impAttrsList)"
                  >
                    <div class="c-i-pic">
                      <!-- <img :src="itemD.iconUrl?itemD.iconUrl:item.verticalDefaultPic" draggable="false" alt=""/> -->
                      <van-image
                        :src="
                          itemD.iconUrl
                            ? itemD.iconUrl
                            : item.verticalDefaultPic
                        "
                        draggable="false"
                        :style="{
                          'max-width': (offsetWidth * 48) / 750 + 'px',
                        }"
                      >
                        <template v-slot:loading>
                          <van-loading type="spinner" size="20" />
                          <!-- <img :src="item.verticalDefaultPic" draggable="false" :style="{'max-width':((offsetWidth * 48) / 750) + 'px'}" alt=""/> -->
                        </template>
                        <template v-slot:error
                          ><img
                            :src="item.verticalDefaultPic"
                            draggable="false"
                            :style="{
                              'max-width': (offsetWidth * 48) / 750 + 'px',
                            }"
                            alt=""
                        /></template>
                      </van-image>
                    </div>
                    <div
                      class="c-i-title"
                      :data-value="itemD._id"
                      v-html="itemD.titleHL ? itemD.titleHL : itemD.title"
                    ></div>
                    <!-- <div class="c-i-title" :data-value="itemD._id" v-html="itemD.subTitleHL?itemD.subTitleHL:itemD.subTitle"></div> -->
                  </div>
                </div>
                <!-- 服务模板 -->
                <!-- 生活-惠民 -->
                <RightsMarket
                  v-else-if="
                    item.verticalTemplateId == CONSTANTS.TEMPLATEPAGE.PRODMB0060
                  "
                  :itemParentTemplateFieldList="item.verticalTemplateFieldList"
                  :arrRightsList="
                    getMap(
                      moreArrDataList,
                      item.verticalTemplateFieldList,
                      $isDistinct
                    )
                  "
                >
                </RightsMarket>
                <!-- 生活-惠民 -->
                <!-- 商品-会员权益 -->
                <div
                  class="m-content-three"
                  v-else-if="
                    item.verticalTemplateId == CONSTANTS.TEMPLATEPAGE.PRODMB005
                  "
                >
                  <div
                    class="content-item-three content-item"
                    v-for="(itemTre, indexTre) in getMap(
                      moreArrDataList,
                      item.verticalTemplateFieldList,
                      $isDistinct
                    )"
                    :key="indexTre"
                    @click="handleClickTo(itemTre, indexTre)"
                    :imp-position-id="indexTre + 1"
                    imp-type="once"
                    imp-track="imp"
                    :imp-attrs="itemTre.impAttrsList"
                    :data-value="JSON.stringify(itemTre.impAttrsList)"
                  >
                    <div class="c-i-pic">
                      <!-- <img v-bind:src="item.iconUrl" alt=""/> -->
                      <van-image
                        :src="
                          itemTre.iconUrl
                            ? itemTre.iconUrl
                            : item.verticalDefaultPic
                        "
                        draggable="false"
                        :style="{
                          'max-width': (offsetWidth * 100) / 750 + 'px',
                        }"
                      >
                        <template v-slot:loading>
                          <van-loading type="spinner" size="20" />
                          <!-- <img :src="item.verticalDefaultPic" draggable="false" :style="{'max-width':((offsetWidth * 100) / 750) + 'px'}" alt=""/> -->
                        </template>
                        <template v-slot:error
                          ><img
                            :src="item.verticalDefaultPic"
                            draggable="false"
                            :style="{
                              'max-width': (offsetWidth * 100) / 750 + 'px',
                            }"
                            alt=""
                        /></template>
                      </van-image>
                    </div>
                    <div
                      class="c-i-title"
                      :data-value="itemTre._id"
                      v-html="itemTre.titleHL ? itemTre.titleHL : itemTre.title"
                    ></div>
                    <div class="c-i-price" v-if="itemTre.currentPrice">
                      {{
                        itemTre.currentPricePrefix
                          ? itemTre.currentPricePrefix || ""
                          : itemTre.currentPriceUnit &&
                            itemTre.currentPriceUnit == "元"
                          ? "¥"
                          : "¥"
                      }}{{ Number(itemTre.currentPrice || 0).toFixed(2)
                      }}{{
                        itemTre.currentPriceUnit !== "元" &&
                        itemTre.currentPriceUnit
                          ? itemTre.currentPriceUnit
                          : itemTre.currentPricePrefix &&
                            itemTre.currentPriceUnit == "元"
                          ? "元"
                          : ""
                      }}
                    </div>
                  </div>
                </div>
                <!-- 商品-会员权益 -->
                <!-- 北京探索直播模板 -->
                <template
                  v-else-if="
                    item.verticalTemplateId == CONSTANTS.TEMPLATEPAGE.LIFELB013
                  "
                >
                  <div
                    v-for="(itemD, indexD) in getMap(
                      moreArrDataList,
                      item.verticalTemplateFieldList,
                      $isDistinct
                    )"
                    :key="indexD"
                    @click="handleClickTo(itemD, indexD)"
                    :imp-position-id="indexD + 1"
                    imp-type="once"
                    imp-track="imp"
                    class="live-broadcast-wrap"
                    :imp-attrs="itemD.impAttrsList"
                    :data-value="JSON.stringify(itemD.impAttrsList)"
                    :class="
                      moreArrDataList.length == indexD + 1 &&
                      item.verticalTemplateId !==
                        CONSTANTS.TEMPLATEPAGE.PRODHW004 &&
                      item.verticalTemplateId !==
                        CONSTANTS.TEMPLATEPAGE.PRODMS012
                        ? 'content-item content-item-radius'
                        : (item.verticalTemplateId ==
                            CONSTANTS.TEMPLATEPAGE.PRODHW004 ||
                            item.verticalTemplateId ==
                              CONSTANTS.TEMPLATEPAGE.PRODMS012) &&
                          moreArrDataList.length == indexD + 1
                        ? 'content-item-top-radius content-item content-item-radius content-item-sticky-top'
                        : (item.verticalTemplateId ==
                            CONSTANTS.TEMPLATEPAGE.PRODHW004 ||
                            item.verticalTemplateId ==
                              CONSTANTS.TEMPLATEPAGE.PRODMS012) &&
                          moreArrDataList.length !== indexD + 1
                        ? 'content-item-top-radius content-item content-item-sticky-top'
                        : 'content-item'
                    "
                  >
                    <div
                      class="c-i-left live-broadcast-wrap"
                      style="position: relative; width: 100%"
                    >
                      <van-image
                        :src="
                          itemD.iconUrl
                            ? itemD.iconUrl
                            : item.verticalDefaultPic
                        "
                        fit="contain"
                        draggable="false"
                        lazy-load
                        :loading-icon="item.verticalDefaultPic"
                        class="img-7 van-img"
                      >
                        <template v-slot:loading>
                          <van-loading type="spinner" size="20" />
                        </template>
                        <template v-slot:error>
                          <img
                            :src="item.verticalDefaultPic"
                            draggable="false"
                            alt=""
                            class="img-7 default-img"
                          />
                          <!-- <img :src="item.verticalDefaultPic" :style="{'max-width': item.verticalTemplateId == CONSTANTS.TEMPLATEPAGE.PRODHW004 ||  item.verticalTemplateId == CONSTANTS.TEMPLATEPAGE.PRODMS012 || item.verticalTemplateId == CONSTANTS.TEMPLATEPAGE.ACTI002 || item.verticalTemplateId == CONSTANTS.TEMPLATEPAGE.LIFEVD010 ? ((offsetWidth * 150) / 750) + 'px' : item.verticalTemplateId == CONSTANTS.TEMPLATEPAGE.BIZ003 ? ((offsetWidth * 100) / 750) + 'px': ((offsetWidth * 140) / 750) + 'px', 'width': 'auto','height': 'auto'}" draggable="false" 
                      alt=""/> -->
                        </template>
                      </van-image>
                      <div class="live-broadcast-icon">
                        <svg
                          t="1711006160947"
                          class="icon"
                          viewBox="0 0 1024 1024"
                          version="1.1"
                          xmlns="http://www.w3.org/2000/svg"
                          p-id="4657"
                          width="200"
                          height="200"
                        >
                          <path
                            d="M829.866667 603.733333L326.4 940.8c-51.2 34.133333-119.466667 21.333333-153.6-29.866667-12.8-19.2-19.2-40.533333-19.2-61.866666V174.933333C153.6 113.066667 202.666667 64 264.533333 64c21.333333 0 42.666667 6.4 61.866667 19.2l503.466667 337.066667c51.2 34.133333 64 102.4 29.866666 153.6-8.533333 12.8-19.2 21.333333-29.866666 29.866666z"
                            p-id="4658"
                            fill="#333333"
                          ></path>
                        </svg>
                      </div>
                      <div class="live-broadcast-title">
                        <div
                          class="title"
                          v-html="itemD.titleHL ? itemD.titleHL : itemD.title"
                        ></div>
                        <div
                          class="subTitle"
                          v-if="
                            isFieldToShow(
                              'subTitle',
                              item.verticalTemplateFieldList
                            ) &&
                            (itemD.subTitleHL || itemD.subTitle)
                          "
                          v-html="
                            itemD.subTitleHL ? itemD.subTitleHL : itemD.subTitle
                          "
                        ></div>
                      </div>
                    </div>
                  </div>
                </template>
                <!-- 其他模板的垂直页 -->
                <template v-else>
                  <div
                    v-for="(itemD, indexD) in item.verticalTemplateId ==
                    CONSTANTS.TEMPLATEPAGE.PRODMB0053
                      ? moreArrDataList
                      : getMap(
                          moreArrDataList,
                          item.verticalTemplateFieldList,
                          $isDistinct
                        )"
                    :key="indexD"
                    @click="handleClickTo(itemD, indexD)"
                    :imp-position-id="indexD + 1"
                    imp-type="once"
                    imp-track="imp"
                    :imp-attrs="itemD.impAttrsList"
                    :data-value="JSON.stringify(itemD.impAttrsList)"
                    :class="
                      moreArrDataList.length == indexD + 1 &&
                      item.verticalTemplateId !==
                        CONSTANTS.TEMPLATEPAGE.PRODHW004 &&
                      item.verticalTemplateId !==
                        CONSTANTS.TEMPLATEPAGE.PRODMS012
                        ? 'content-item content-item-radius'
                        : (item.verticalTemplateId ==
                            CONSTANTS.TEMPLATEPAGE.PRODHW004 ||
                            item.verticalTemplateId ==
                              CONSTANTS.TEMPLATEPAGE.PRODMS012) &&
                          moreArrDataList.length == indexD + 1
                        ? 'content-item-top-radius content-item content-item-radius content-item-sticky-top'
                        : (item.verticalTemplateId ==
                            CONSTANTS.TEMPLATEPAGE.PRODHW004 ||
                            item.verticalTemplateId ==
                              CONSTANTS.TEMPLATEPAGE.PRODMS012) &&
                          moreArrDataList.length !== indexD + 1
                        ? 'content-item-top-radius content-item content-item-sticky-top'
                        : 'content-item'
                    "
                  >
                    <!-- 政企产品、解决方案无左侧图片 -->
                    <template
                      v-if="
                        item.wholeTemplateId ==
                          CONSTANTS.TEMPLATEPAGE.SLSRC306 ||
                        item.wholeTemplateId == CONSTANTS.TEMPLATEPAGE.SLSRC307
                      "
                    >
                      <!-- 占位dom 保证点击时获取dataset.value -->
                      <div></div>
                      <div
                        class="zq-wrap"
                        :data-value="itemD._id"
                        :data-code="item.verticalTemplateId"
                      >
                        <div
                          class="zq-title"
                          v-html="itemD.titleHL ? itemD.titleHL : itemD.title"
                        ></div>
                        <div
                          v-if="
                            isFieldToShow(
                              'subTitle',
                              item.verticalTemplateFieldList
                            ) &&
                            (itemD.subTitleHL || itemD.subTitle)
                          "
                          class="zq-subtitle"
                          v-html="
                            itemD.subTitleHL ? itemD.subTitleHL : itemD.subTitle
                          "
                        ></div>
                      </div>
                    </template>
                    <!-- 普通左图右文区域 -->
                    <template v-else>
                      <div :class="'c-i-left'">
                        <!-- <img :src="itemD.iconUrl?itemD.iconUrl:item.verticalDefaultPic" draggable="false" alt=""/> -->
                        <van-image
                          :src="
                            itemD.iconUrl
                              ? itemD.iconUrl
                              : item.verticalDefaultPic
                          "
                          fit="contain"
                          draggable="false"
                          lazy-load
                          :loading-icon="item.verticalDefaultPic"
                          :class="
                            generateTempIconClass(item.verticalTemplateId)?.img
                          "
                          class="van-img"
                        >
                          <template v-slot:loading>
                            <van-loading type="spinner" size="20" />
                            <!-- <img :src="item.verticalDefaultPic" :style="{'max-width': item.verticalTemplateId == CONSTANTS.TEMPLATEPAGE.PRODHW004 || item.verticalTemplateId == CONSTANTS.TEMPLATEPAGE.ACTI002 || item.verticalTemplateId == CONSTANTS.TEMPLATEPAGE.LIFEVD010 ? ((offsetWidth * 150) / 750) + 'px' : item.verticalTemplateId == CONSTANTS.TEMPLATEPAGE.BIZ003 ? ((offsetWidth * 100) / 750) + 'px': ((offsetWidth * 140) / 750) + 'px', 'width': 'auto','height': 'auto'}" draggable="false" 
                        alt=""/> -->
                          </template>
                          <template v-slot:error>
                            <img
                              :src="item.verticalDefaultPic"
                              draggable="false"
                              alt=""
                              :class="
                                generateTempIconClass(item.wholeTemplateId)?.def
                              "
                              class="default-img"
                            />
                            <!-- <img :src="item.verticalDefaultPic" :style="{'max-width': item.verticalTemplateId == CONSTANTS.TEMPLATEPAGE.PRODHW004 ||  item.verticalTemplateId == CONSTANTS.TEMPLATEPAGE.PRODMS012 || item.verticalTemplateId == CONSTANTS.TEMPLATEPAGE.ACTI002 || item.verticalTemplateId == CONSTANTS.TEMPLATEPAGE.LIFEVD010 ? ((offsetWidth * 150) / 750) + 'px' : item.verticalTemplateId == CONSTANTS.TEMPLATEPAGE.BIZ003 ? ((offsetWidth * 100) / 750) + 'px': ((offsetWidth * 140) / 750) + 'px', 'width': 'auto','height': 'auto'}" draggable="false" 
                      alt=""/> -->
                          </template>
                        </van-image>
                        <!-- 政企视频的左图上要加一个播放标识 -->
                        <!-- 此处的判断不严谨 应该是政企视频且左图正常展示需要播放标识 vantimage的error事件未获知 -->
                        <template
                          v-if="
                            item.wholeTemplateId ==
                              CONSTANTS.TEMPLATEPAGE.SLSRC310 && itemD.iconUrl
                          "
                        >
                          <img
                            src="@/assets/images/video-flag.png"
                            draggable="false"
                            class="zq-video"
                            alt=""
                          />
                        </template>
                        <!-- {{ itemD.cornerMarkUrlArray }} -->
                        <img
                          class="l-tag"
                          :style="{
                            right:
                              item.verticalTemplateId ==
                              CONSTANTS.TEMPLATEPAGE.BIZ003
                                ? (offsetWidth * 10) / 750 + 'px'
                                : '-' + (offsetWidth * 10) / 750 + 'px',
                          }"
                          v-if="
                            isFieldToShow(
                              'cornerMark',
                              item.verticalTemplateFieldList
                            ) && itemD.cornerMarkUrl
                          "
                          :src="itemD.cornerMarkUrl"
                          draggable="false"
                          alt=""
                        />
                        <!-- src="../../../../public/images/2ab8a871d4930010.png" -->
                        <!-- <img class="l-tag" v-for="(itemA,indexA) in itemD.cornerMarkUrlArray" v-if="itemD.cornerMarkUrlArray"  :key="indexA+Math.random()"
                  :src="itemA" draggable="false" alt=""/> -->
                      </div>
                      <align-list
                        :itemData="itemD"
                        :itemParent="item"
                        :itemParentTemplateId="item.verticalTemplateId"
                        :itemParentTemplateFieldList="
                          item.verticalTemplateFieldList
                        "
                      >
                      </align-list>
                    </template>
                  </div>
                </template>
                <!-- <div v-if="finished" class="bottom-line">
                  <div class="cover1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      xmlns:xlink="http://www.w3.org/1999/xlink"
                      viewBox="0 0 18 18"
                      version="1.1"
                    >
                      <g
                        id=""
                        stroke="none"
                        stroke-width="1"
                        fill="none"
                        fill-rule="evenodd"
                      >
                        <path
                          d="M0,0 L18,0 L17.6693348,0.0029762956 C7.88078333,0.179318477 -1.20390968e-15,8.16933145 0,18 L0,18 L0,0 Z"
                          fill="#F7F7F7"
                        />
                      </g>
                    </svg>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      xmlns:xlink="http://www.w3.org/1999/xlink"
                      viewBox="0 0 18 18"
                      version="1.1"
                    >
                      <g
                        id=""
                        stroke="none"
                        stroke-width="1"
                        fill="none"
                        fill-rule="evenodd"
                      >
                        <path
                          d="M0,0 L18,0 L17.6693348,0.0029762956 C7.88078333,0.179318477 -1.20390968e-15,8.16933145 0,18 L0,18 L0,0 Z"
                          fill="#F7F7F7"
                          transform="translate(9.000000, 9.000000) scale(-1, 1) translate(-9.000000, -9.000000) "
                        />
                      </g>
                    </svg>
                  </div>
                  我是有底线的
                </div> -->
                <div class="bottom-line-height">
                  <div class="cover2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      xmlns:xlink="http://www.w3.org/1999/xlink"
                      viewBox="0 0 18 18"
                      version="1.1"
                    >
                      <g
                        id=""
                        stroke="none"
                        stroke-width="1"
                        fill="none"
                        fill-rule="evenodd"
                      >
                        <path
                          d="M0,0 L18,0 L17.6693348,0.0029762956 C7.88078333,0.179318477 -1.20390968e-15,8.16933145 0,18 L0,18 L0,0 Z"
                          fill="#F7F7F7"
                        />
                      </g>
                    </svg>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      xmlns:xlink="http://www.w3.org/1999/xlink"
                      viewBox="0 0 18 18"
                      version="1.1"
                    >
                      <g
                        id=""
                        stroke="none"
                        stroke-width="1"
                        fill="none"
                        fill-rule="evenodd"
                      >
                        <path
                          d="M0,0 L18,0 L17.6693348,0.0029762956 C7.88078333,0.179318477 -1.20390968e-15,8.16933145 0,18 L0,18 L0,0 Z"
                          fill="#F7F7F7"
                          transform="translate(9.000000, 9.000000) scale(-1, 1) translate(-9.000000, -9.000000) "
                        />
                      </g>
                    </svg>
                  </div>
                </div>
              </template>
            </van-list>
          </div>
        </div>
      </template>
    </template>
    </template>
    <!-- 加载中 -->
    <Loadding ref="loading" />
    <!-- 视频播放 -->
    <VideoPlayer
      v-if="showVideo"
      ref="xVideoRef"
      :videoSrc="videoUrl"
      @closePlayer="hideVideo"
    />
  </div>
</template>

<script>
import CommonApi from "@/api/index";
import AlignList from "../TemplatePage/AlignList.vue";
import JiangSuRights from "../TemplatePage/JiangSuRights.vue"; //江苏权益（首页-垂直页）+ 江苏权益（单栏目）
import RadiusTab from "../TemplatePage/RadiusTab.vue";
import Loadding from "../../Loadding.vue";
import NoData from "@/components/NoData.vue";
import TrafficPeakFallback from "@/components/TrafficPeakFallback.vue";
import {
  isQueryIndexTrafficPeak,
  isQueryIndexTrafficPeakByError,
} from "@/utils/queryIndexResponse";
import RightsMarket from "../TemplatePage/RightsMarket.vue"; // 惠民权益超市
import SearchZone from "../TemplatePage/SearchZone.vue"; //搜索专区轮播图
import SearchZoneMore from "../TemplatePage/SearchZoneMore.vue"; //搜索专区轮播图
import {
  getMap,
  getMap1,
  handleSaveClickInfo,
  handleGetUrlParam,
  goPageUrl,
  isApp,
  isHarmony,
  handleGdpImp,
  getConWidth,
  checkoutKeywordsToSession,
  generateTempIconClass,
  isProtogenesisSkip,
  goProtogenesisPage,
  normalizeLink,
  mergeSearchAndZoneData
} from "@/utils/tool";
import ResultSkeleton from "../ResultSkeleton.vue"; //骨架屏
import VideoPlayer from "../../VideoPlay.vue"; // 全部页横向惠民展示
import HotSellingCardSet from "../HotSellingCardSet.vue"; //热搜号卡

export default {
  name: "more-y-list",
  components: {
    AlignList, // 内容模板组件
    Loadding,
    RadiusTab,
    NoData,
    TrafficPeakFallback,
    JiangSuRights,
    SearchZoneMore,
    SearchZone,
    ResultSkeleton,
    RightsMarket,
    VideoPlayer,
    HotSellingCardSet
  },
  inject: ["getSearchContent", "getSearchUUID", "getWordType", "userLoginState", "updateRefresh"],
  computed: {
    searchContent() {
      return this.getSearchContent();
    },
    vanListHeight() {
      if (
        this.paramData.verticalTemplateId ==
          this.CONSTANTS.TEMPLATEPAGE.PRODHW004 ||
        this.paramData.verticalTemplateId ==
          this.CONSTANTS.TEMPLATEPAGE.PRODMS012
      ) {
        return "class110";
      } else if (
        this.CONSTANTS.TEMPLATEPAGE.PRODLIST004.indexOf(
          this.paramData.verticalTemplateId
        ) != -1 ||
        this.CONSTANTS.TEMPLATEPAGE.LIFELIST005.indexOf(
          this.paramData.verticalTemplateId
        ) != -1
      ) {
        return "class110";
      } else {
        return "class100";
      }
    }
  },
  watch: {
    categoryCode: {
      handler(newVal) {
        if (newVal) {
          let data = sessionStorage.searchZoneResultListSes;
          if (data && JSON.parse(data).length) {
            let index = JSON.parse(data).findIndex(
              (e) => e.categoryCode === newVal
            );
            console.log("页面切换X", index);
            this.searchZoneHasData = index !== -1;
          }
        }
      },
      immediate: true,
    },
    searchContent: {
      handler(newVal, oldVal) {
        // this.paramData.params.keyWord = newVal;
        if (newVal && newVal !== oldVal) {
          // this.getData();
        }
      },
      immediate: true,
    },
  },
  data() {
    return {
      borderHeight: "1px",
      radiusDataList: [],
      finishedText: " ",
      activeTab: 0,
      originActiveTab: 0, //前一个点击的tab
      noDataShow: false,
      noDataShowFilter: false,
      trafficPeakFallback: false,
      loading: false,
      finished: false,
      moreArrList: [],
      moreArrDataList: [],
      jsList1: [],
      jsList2: [],
      jsList3: [],
      jsMoreArrDataList: [],
      currentCode: "",
      totalPage: null,
      filterList: [
        {
          label: "综合",
          value: "com",
          key: "1",
          icon: [
            {
              value: "s-iconfont ic-xiajiantou1",
            },
          ],
        },
        {
          label: "价格",
          value: "currentPrice",
          key: "2",
          icon: [
            {
              value: "s-iconfont ic-shangjiantou1",
            },
            {
              value: "s-iconfont ic-xiajiantou1",
            },
          ],
        },
        {
          label: "销量",
          value: "saleQuantity",
          key: "3",
          icon: [
            {
              value: "s-iconfont ic-xiajiantou1",
            },
          ],
        },
        {
          label: "筛选",
          value: "filter",
          key: "4",
          icon: [
            {
              value: "s-iconfont ic-xiajiantou1",
            },
          ],
        },
      ],
      paramData: {},
      sortField: "",
      pagePage: 1,
      priceFlag: false,
      latitude: "",
      longtitude: "",
      configList: {},
      radiusTabShowParent: false,
      offsetWidth: null,
      isApp: isApp(),
      searchZoneSecondShow: false, //有二级类目的才出现，如商品/生活
      searchZoneHasData: false, //搜索专区有值
      provinceCodeLocal: "",
      pageEntrance: "",
      resultSkeletonShow: false, //骨架屏默认展示
      showVideo: false, // 视频播放组件
      videoUrl: "", // 视频地址
      getMap: getMap,
      getMap1: getMap1,
      generateTempIconClass: generateTempIconClass,
      isShow: isHarmony()
    };
  },
  mounted() {
    this.provinceCodeLocal =
      JSON.parse(localStorage.getItem("userInfo")).province || "";
    this.pageEntrance = sessionStorage.pageEntrance || "";
    this.offsetWidth = document.body.offsetWidth;
  },
  props: {
    categoryCode: {
      type: String,
      default: "",
    },
  },
  methods: {
    buildPagingDedupKey(item = {}) {
      const link = item.linkAdress || item.linkAddress || item.link || "";
      let key = "";

      if (link) {
        const isNativeCode = !/^https?:\/\//i.test(link);
        key = isNativeCode ? link.trim() : normalizeLink(link);
      }

      if (!key) {
        key = item._id ? `id:${item._id}` : JSON.stringify(item);
      }

      if (this.$isProvinceDistinct) {
        const province = item.provinceCode || item.province || item.dispProvince || "";
        key = province ? `${key}::${province}` : key;
      }

      return key;
    },

    mergePagedMoreArrDataList(historyList = [], currentList = []) {
      const history = Array.isArray(historyList) ? historyList : [];
      const current = Array.isArray(currentList) ? currentList : [];

      if (!this.$isProvinceDistinct) {
        return history.concat(current);
      }

      const seen = new Set();
      const merged = [];
      history.concat(current).forEach((item) => {
        const key = this.buildPagingDedupKey(item);
        if (!key || seen.has(key)) return;
        seen.add(key);
        merged.push(item);
      });
      return merged;
    },

    jiangsuGetMap(arr, tempList, isDistinct) {
      if (isDistinct) return arr;
      // 江苏可能是双层list嵌套
      if (Array.isArray(arr[0])) {
        let result = [];
        for (let item of arr) {
          result.push(getMap(item, tempList, isDistinct));
        }
        return result;
      } else {
        return getMap(arr, tempList, isDistinct);
      }
    },

    /**
     * wholeTemplateFieldList/verticalTemplateFieldList --字段是否展示
     * @param {*} field
     */
    isFieldToShow(field, itemParentTemplateFieldList) {
      if (itemParentTemplateFieldList) {
        return itemParentTemplateFieldList.includes(field);
      }
    },

    onLoad() {
      if (this.totalPage) {
        if (parseInt(this.pagePage, Math.ceil(this.paramData.size * 2)) >=
          this.totalPage) {
          this.finished = true;
        } else {
          this.pagePage++;
          this.handleQueryResult(
            this.paramData.categoryCode,
            this.paramData.parentCode,
            this.paramData.verticalTemplateId
          );
        }
      } else {
        this.loading = false;
      }
    },

    /**
     * 过滤
     * @param {*} categoryCodeIn
     */
    handleFilter(item, index) {
      let that = this;
      that.activeTab = index;
      // 分页初始化
      // that.pagePage = 1;
      // that.loading = false;
      // that.finished = false;
      if (that.activeTab !== 3) {
        //跳开筛选
        that.originActiveTab = that.activeTab;
      }
      if (document.getElementsByClassName("currentPrice").length > 0) {
        document.getElementsByClassName(
          "currentPrice"
        )[0].children[0].style.color = "#acacac";
        document.getElementsByClassName(
          "currentPrice"
        )[0].children[1].style.color = "#acacac";
      }
      switch (item.key) {
        case "1":
          that.sortField = "";
          that.moreArrDataList = [];
          that.jsListEmpty();
          that.$refs.radiusTabRef.handleReset();
          that.handleQueryResult(
            that.paramData.categoryCode,
            that.paramData.parentCode,
            that.paramData.verticalTemplateId
          );
          break;
        case "2":
          if (!that.priceFlag) {
            that.sortField = "currentPrice=asc"; //升序
            if (document.getElementsByClassName("currentPrice").length > 0) {
              document.getElementsByClassName(
                "currentPrice"
              )[0].children[0].style.color = "#2892FF";
              document.getElementsByClassName(
                "currentPrice"
              )[0].children[1].style.color = "#acacac";
            }
            that.priceFlag = true;
          } else {
            that.sortField = "currentPrice=desc";
            if (document.getElementsByClassName("currentPrice").length > 0) {
              document.getElementsByClassName(
                "currentPrice"
              )[0].children[0].style.color = "#acacac";
              document.getElementsByClassName(
                "currentPrice"
              )[0].children[1].style.color = "#2892FF";
            }
            that.priceFlag = false;
          }
          that.moreArrDataList = [];
          that.jsListEmpty();
          that.$refs.radiusTabRef.handleReset();
          that.handleQueryResult(
            that.paramData.categoryCode,
            that.paramData.parentCode,
            that.paramData.verticalTemplateId
          );
          break;
        case "3":
          that.sortField = "saleQuantity=desc";
          that.moreArrDataList = [];
          that.jsListEmpty();
          that.$refs.radiusTabRef.handleReset();
          that.handleQueryResult(
            that.paramData.categoryCode,
            that.paramData.parentCode,
            that.paramData.verticalTemplateId
          );
          break;
        case "4":
          that.$refs.radiusTabRef.handleReset(); //ui走查要求清空
          that.$refs.radiusTabRef.handleQueryGetConfigInit();
          that.$refs.radiusTabRef.popShow = true;
          break;
      }
    },
    /**
     * 筛选条件回传
     */
    getFormItem() {
      let that = this;
      // that.paramData.minPrice = that.$refs.radiusTabRef.formItem.minPrice;
      // that.paramData.maxPrice = that.$refs.radiusTabRef.formItem.maxPrice;

      that.moreArrDataList = [];
      that.jsListEmpty();
      that.handleQueryResult(
        that.paramData.categoryCode,
        that.paramData.parentCode,
        that.paramData.verticalTemplateId,
        "6"
      );
      console.log("子元素");
    },
    /**
     * 查询搜索结果
     * @param {*} categoryCodeIn
     * @param {*} parentCodeIn
     * @param {*} templateId
     * @param {*} type 1：从一级类目查询要清空筛选里的数据 5:只有专区有数据 6:筛选里的确认
     */
    handleQueryResult(categoryCodeIn, parentCodeIn, templateId, type) {
      let search_source_type = "2";
      console.log("搜索请求来源MoreYList", search_source_type);
      const that = this;
      that.trafficPeakFallback = false;
      const historyMoreArrDataList =
        that.pagePage > 1 && Array.isArray(that.moreArrDataList)
          ? [...that.moreArrDataList]
          : [];
      that.loading = true;
      // that.resultSkeletonShow = true;
      // console.log("that.totalPage"+that.totalPage);
      that.finished = false;
      that.pagePage == 1 && that.$refs.loading.loadingShow();
      that.paramData = handleGetUrlParam();
      that.paramData.sortField = that.sortField;
      that.paramData.page = that.pagePage;
      if (templateId == that.CONSTANTS.TEMPLATEPAGE.PRODMB005) {
        that.paramData.size = 20; //一次请求多点
      }

      that.latitude = sessionStorage.latitude || "";
      that.longtitude = sessionStorage.longtitude || "";
      that.paramData.location =
        that.latitude && that.longtitude
          ? `${that.latitude},${that.longtitude}`
          : "";
      if (type !== "1" || type == undefined || type == null) {
        that.paramData.minPrice = that.$refs.radiusTabRef.formItem.minPrice;
        that.paramData.maxPrice = that.$refs.radiusTabRef.formItem.maxPrice;
        that.paramData.networkStd = that.$refs.radiusTabRef.networkStd;
        that.paramData.buyWay = that.$refs.radiusTabRef.buyWay;
        this.paramData.shopCityCode = that.$refs.radiusTabRef.cityCode;
      } else {
        // this.item.subList = [];
        that.$refs.radiusTabRef.radiusDataList = [];
        that.$refs.radiusTabRef.handleReset();
      }
      that.paramData.categoryCode =
        categoryCodeIn == "CSRDC_ALL" ? "" : categoryCodeIn;
      that.paramData.parentCode = parentCodeIn;
      that.paramData.verticalTemplateId = templateId;
      that.paramData.params.keyWord = that.searchContent;
      let iopResultRes =
        checkoutKeywordsToSession(that.searchContent) != "999999"
          ? checkoutKeywordsToSession(that.searchContent)
          : null;
      that.paramData.iopResult = iopResultRes;
      that.configList = sessionStorage.configListSes
        ? JSON.parse(sessionStorage.configListSes)
        : {};
      const userInfo = localStorage.getItem("userInfo")
        ? JSON.parse(localStorage.getItem("userInfo"))
        : null;
      that.paramData.cityCode = userInfo?.city;
      // 去重暂行方案-start-查2倍页数
      let paramData = JSON.parse(JSON.stringify(that.paramData));
      paramData.size = Math.ceil(paramData.size * 2);
      // 去重暂行方案-end
      paramData.tranId = that.getSearchUUID();
      paramData.wordType = that.getWordType();
      paramData.searchSourceType = search_source_type;
      paramData.userState = that.userLoginState();
      paramData.birthday = userInfo?.birthday || "";
      console.log("垂直页moreYList--搜索结果传参搜索结果传参", paramData);

      CommonApi.queryResult(paramData)
        .then((res) => {
          if (isQueryIndexTrafficPeak(res)) {
            that.trafficPeakFallback = true;
            that.noDataShow = false;
            that.noDataShowFilter = false;
            that.loading = false;
            that.$refs.loading?.loadingHide();

            return;
          }
          that.trafficPeakFallback = false;
          this.$isDistinct = !res.data?.distinct;
          that.loading = false;
          that.$refs.loading?.loadingHide();
          // that.resultSkeletonShow = false;

          if (res.code == "000000") {
            if (res.data.result && res.data.result.length > 0) {
              sessionStorage.setItem(
                "transactionIdSes",
                res.data.transactionId
              );
              that.noDataShow = false;
              that.noDataShowFilter = false;

              // res.data.result.forEach((item) => {
              //   if (item.data) {
              //   }
              // });
              // that.CONSTANTS.TEMPLATEPAGE.PRODLIST004.indexOf(templateId) !=
              //   -1 ||
              //   that.CONSTANTS.TEMPLATEPAGE.LIFELIST005.indexOf(templateId) !=
              //     -1;

              // 判断垂直页二级类目标签和二级类目数据
              if (
                res.data.result[0].subList &&
                res.data.result[0].subList.length > 0
              ) {
                console.log("二级类目有数据");

                that.$refs.radiusTabRef.radiusTabShow = true;
                that.searchZoneSecondShow = true;
                that.radiusTabShowParent = true;

                if (sessionStorage.tabsListSes) {
                  let arrList = JSON.parse(sessionStorage.tabsListSes);
                  console.log("模板数据====>");
                  console.log(arrList);

                  console.log("开始配置垂直页tab和二级类目的曝光属性");
                  arrList.forEach((item, index) => {
                    if (parentCodeIn == item.categoryCode) {
                      item.subList.forEach((subItem, subIndex) => {
                        subItem.pCode = "P00000050507"; // 一级tab传P00000050500 二级tab传P00000050507
                        subItem.parentCategoryName = item.categoryName;

                        // subItem.verticalTemplateId = templateId;
                        // let templateListArrSub = sessionStorage.templateListSes
                        //   ? JSON.parse(sessionStorage.templateListSes)
                        //   : [];
                        // templateListArrSub.forEach((itemS, indexS) => {
                        //   if (itemS.verticalTemplateId == templateId) {
                        //     subItem.verticalTemplateFieldList =
                        //       itemS.verticalTemplateFieldList;
                        //     subItem.verticalDefaultPic =
                        //       itemS.verticalDefaultPic;
                        //   }
                        // });

                        // 组装二级类目触点曝光所需impAttrs参数
                        const impAttrs = {};
                        // impAttrs.position_id = subIndex+1;
                        // impAttrs.type = "once";
                        impAttrs.WT_et = "imp";
                        impAttrs.WT_event = subItem.pCode;
                        impAttrs.WT_envName = subItem.categoryName;
                        impAttrs.XY_point_position = subIndex + 1;
                        impAttrs.WT_markId = subItem.categoryCode;
                        impAttrs.XY_first_class =
                          sessionStorage.pageEntrance == "6"
                            ? "权益"
                            : sessionStorage.pageEntrance == "8"
                            ? "商城"
                            : subItem.parentCategoryName;
                        impAttrs.XY_pageEntry =
                          sessionStorage.pageEntrance || ""; // 新增页面入口
                        impAttrs.WT_plat = sessionStorage.pagePlat || "";
                        impAttrs.WT_es = sessionStorage.pageUrl || "";
                        impAttrs.WT_ti = "搜索结果页";
                        // 插码方案修改2025-1-16
                        impAttrs.XY_second_class = subItem.categoryName;
                        impAttrs.WT_area_type_1 = "楼层";
                        impAttrs.areaid = ""; // 父物品id信息（无父物品传空）
                        impAttrs.WT_area_type_2 = subItem.parentCategoryName;
                        impAttrs.WT_area_name = subItem.categoryName; // 若没有二级分类，此名称则记录为一级分类名称
                        impAttrs.XY_env_type = "icon";
                        impAttrs.XY_gd_source = "搜索平台";
                        impAttrs.XY_scene = this.getSearchContent() || ""; // 搜索内容
                        impAttrs.WT_si_n = subItem.categoryName; // 物品对应的名称
                        impAttrs.WT_goods_id = ""; // 物品所对应的id信息
                        impAttrs.XY_visit_source =
                          sessionStorage.pageEntrance || ""; // 访问来源
                        // impAttrs.XY_transaction_id = that.getSearchUUID(); // 这里没有设置XY_transaction_id 是在上报传参时统一设置了

                        subItem.impAttrsRadiusTab = impAttrs;

                        if (categoryCodeIn == subItem.categoryCode) {
                          // 二级类目组件的第一个和点击时传父级下级第一个关联上
                          that.$refs.radiusTabRef.activeTabRadius = subIndex;

                          // 这里开始处理二级类目数据的曝光
                          res.data.result[0].subList.forEach(
                            (itemW, indexW) => {
                              that.moreArrList = [];
                              that.moreArrList.push(subItem);

                              that.moreArrList.forEach((moreItem) => {
                                moreItem.data = itemW.data;

                                moreItem.data.forEach(
                                  (moreItemData, moreIndexData) => {
                                    moreItemData.pCode = "P00000050506";
                                    moreItemData.parentCategoryName =
                                      item.categoryName;

                                    // if(that.configList.UNIFY_SEARCH_CORNERMARK_URL){
                                    //   that.configList.UNIFY_SEARCH_CORNERMARK_URL.forEach((itemY,indexY) => {
                                    //     if(moreItemData.cornerMark && moreItemData.cornerMark == itemY.code){
                                    //       moreItemData.cornerMarkUrl = itemY.name
                                    //     }
                                    //   })
                                    // }

                                    if (
                                      that.configList
                                        .UNIFY_SEARCH_CORNERMARK_URL
                                    ) {
                                      let cornerMarkUrlArr = [];
                                      that.configList.UNIFY_SEARCH_CORNERMARK_URL.forEach(
                                        (itemY, indexY) => {
                                          let cornerMarkArr = [];
                                          if (moreItemData.cornerMark) {
                                            if (
                                              moreItemData.cornerMark instanceof
                                              Array
                                            ) {
                                              cornerMarkArr =
                                                moreItemData.cornerMark;
                                            } else {
                                              cornerMarkArr =
                                                moreItemData.cornerMark.split(
                                                  ","
                                                );
                                            }
                                          }
                                          if (
                                            cornerMarkArr &&
                                            cornerMarkArr.length > 0
                                          ) {
                                            cornerMarkArr.sort((a, b) => a - b);
                                            cornerMarkArr.forEach((itemO) => {
                                              if (itemO == itemY.code) {
                                                cornerMarkUrlArr.push(
                                                  itemY.name
                                                );
                                                moreItemData.cornerMarkUrlArray =
                                                  cornerMarkUrlArr;
                                              }
                                            });
                                          }
                                        }
                                      );
                                    }
                                    if (
                                      moreItemData.cornerMarkUrlArray &&
                                      moreItemData.cornerMarkUrlArray.length > 0
                                    ) {
                                      moreItemData.cornerMarkUrl =
                                        moreItemData.cornerMarkUrlArray[0];
                                    }
                                    if (that.configList.UNIFY_SEARCH_BUY_WAY) {
                                      that.configList.UNIFY_SEARCH_BUY_WAY.forEach(
                                        (itemN, indexN) => {
                                          if (
                                            moreItemData.buyType &&
                                            moreItemData.buyType == itemN.code
                                          ) {
                                            moreItemData.buyTypeUrl =
                                              itemN.name;
                                            moreItemData.buyTypeName =
                                              itemN.name;
                                            moreItemData.tagWidth = getConWidth(
                                              moreItemData.buyTypeName
                                            );
                                          }
                                        }
                                      );
                                    }
                                    //图片判断
                                    // if( moreItemData.iconUrl && moreItemData.iconUrl.replace(' ','').split(":")[0].indexOf("https") == -1 ){
                                    //   if(moreItemData.iconUrl && moreItemData.iconUrl.replace(' ','').split(":")[1]
                                    //   && moreItemData.iconUrl.replace(' ','').split(":")[1].indexOf("activity.cmcc-cs.cn") != -1){
                                    //     //
                                    //   }else{
                                    //     moreItemData.iconUrl = " ";
                                    //   }
                                    // }else{
                                    if (
                                      moreItemData.iconUrl &&
                                      moreItemData.iconUrl
                                        .replace(" ", "")
                                        .split(":")[1] &&
                                      moreItemData.iconUrl
                                        .replace(" ", "")
                                        .split(":")[1]
                                        .indexOf("10.4.160.6") != -1
                                    ) {
                                      moreItemData.iconUrl = " ";
                                    }
                                    // }
                                    that.moreArrDataList.push(moreItemData);

                                    that.moreArrDataList.forEach(
                                      (finalItem, finalIndex) => {
                                        // 组装二级类目的数据
                                        // 组装触点曝光所需impAttrs参数
                                        const impAttrs = {};
                                        let categoryNameFlg =
                                          sessionStorage.pageEntrance == "6"
                                            ? "权益"
                                            : sessionStorage.pageEntrance == "8"
                                            ? "商城"
                                            : finalItem.parentCategoryName;
                                        // impAttrs.position_id = finalIndex+1;
                                        // impAttrs.type = "once";
                                        impAttrs.WT_et = "imp";
                                        impAttrs.WT_event = finalItem.pCode;
                                        impAttrs.WT_envName = finalItem.title;
                                        impAttrs.XY_point_position =
                                          finalIndex + 1;
                                        impAttrs.WT_markId = finalItem._id;
                                        impAttrs.XY_first_class =
                                          categoryNameFlg;
                                        if (
                                          finalItem.parentCategoryName !==
                                          finalItem.dispCategoryName
                                        ) {
                                          impAttrs.XY_second_class =
                                            finalItem.dispCategoryName;
                                        }
                                        impAttrs.WT_next_url =
                                          finalItem.linkAdress;
                                        impAttrs.WT_plat =
                                          sessionStorage.pagePlat || "";
                                        impAttrs.WT_es =
                                          sessionStorage.pageUrl || "";
                                        impAttrs.WT_ti = "搜索结果页";
                                        impAttrs.XY_pageEntry =
                                          sessionStorage.pageEntrance || ""; //新增页面入口
                                        // 插码方案修改2025-1-16
                                        impAttrs.XY_second_class =
                                          finalItem.dispCategoryName;
                                        impAttrs.WT_area_type_1 = "楼层";
                                        impAttrs.areaid = ""; // 父物品id信息（无父物品传空）
                                        impAttrs.WT_area_type_2 =
                                          finalItem.parentCategoryName;
                                        impAttrs.WT_area_name =
                                          finalItem.dispCategoryName; // 若没有二级分类，此名称则记录为一级分类名称
                                        impAttrs.XY_env_type = "icon";
                                        impAttrs.XY_gd_source = "搜索平台";
                                        impAttrs.XY_scene =
                                          this.getSearchContent() || ""; // 搜索内容
                                        impAttrs.WT_si_n = finalItem.title; // 物品对应的名称
                                        impAttrs.WT_goods_id = finalItem.itemId; // 物品所对应的id信息
                                        impAttrs.XY_visit_source =
                                          sessionStorage.pageEntrance || ""; // 访问来源
                                        // impAttrs.XY_transaction_id = that.getSearchUUID(); // 这里没有设置XY_transaction_id 是在上报传参时统一设置了

                                        finalItem.impAttrsList = impAttrs;
                                      }
                                    );
                                  }
                                );
                              });
                            }
                          );
                        }
                      });
                      console.log("二级目录有数据===>");
                      console.log(that.moreArrList);
                      console.log(that.moreArrDataList, "最终的列表数据");
                      that.radiusDataList = item.subList;
                      that.$refs.radiusTabRef.radiusDataList = item.subList;
                    }
                  });
                  // that.$refs.radiusTabRef.radiusDataList  = JSON.parse(sessionStorage.allSearchResultSes);
                }
                // that.$refs.radiusTabRef.radiusDataList = res.data.result[0].subList;
              } else {
                // 此处是垂直页无二级类目的数据处理

                console.log("二级类目无数据");

                // 商品-手机硬件-话费购
                if (
                  templateId == that.CONSTANTS.TEMPLATEPAGE.PRODHW004 ||
                  templateId == that.CONSTANTS.TEMPLATEPAGE.PRODMS012
                ) {
                  that.$refs.radiusTabRef.radiusTabShow = true;
                  that.radiusTabShowParent = true;
                } else {
                  that.$refs.radiusTabRef.radiusTabShow = false;
                  that.radiusTabShowParent = false;
                }

                that.moreArrList = res.data.result;
                // let moreArrDataList = [];

                that.moreArrList.forEach((item) => {
                  item.templateId = templateId;
                  item.verticalTemplateId = templateId;
                  let templateListArr = sessionStorage.templateListSes
                    ? JSON.parse(sessionStorage.templateListSes)
                    : [];

                  templateListArr.forEach((itemT, indexT) => {
                    if (itemT.verticalTemplateId == templateId) {
                      item.verticalTemplateFieldList =
                        itemT.verticalTemplateFieldList;
                      item.verticalDefaultPic = itemT.verticalDefaultPic;
                    }
                  });

                  item.data.forEach((itemD, indexD) => {
                    itemD.pCode = "P00000050506";
                    itemD.parentCategoryName = item.categoryName;

                    // if (that.configList.UNIFY_SEARCH_CORNERMARK_URL) {
                    //   that.configList.UNIFY_SEARCH_CORNERMARK_URL.forEach(
                    //     (itemY, indexY) => {
                    //       if (
                    //         itemD.cornerMark &&
                    //         itemD.cornerMark == itemY.code
                    //       ) {
                    //         itemD.cornerMarkUrl = itemY.name;
                    //       }
                    //     }
                    //   );
                    // }

                    if (that.configList.UNIFY_SEARCH_CORNERMARK_URL) {
                      let cornerMarkUrlArr = [];
                      that.configList.UNIFY_SEARCH_CORNERMARK_URL.forEach(
                        (itemY, indexY) => {
                          let cornerMarkArr = [];
                          if (itemD.cornerMark) {
                            if (itemD.cornerMark instanceof Array) {
                              cornerMarkArr = itemD.cornerMark;
                            } else {
                              cornerMarkArr = itemD.cornerMark.split(",");
                            }
                          }
                          if (cornerMarkArr && cornerMarkArr.length > 0) {
                            cornerMarkArr.sort((a, b) => a - b);
                            cornerMarkArr.forEach((itemO) => {
                              if (itemO == itemY.code) {
                                cornerMarkUrlArr.push(itemY.name);
                                itemD.cornerMarkUrlArray = cornerMarkUrlArr;
                              }
                            });
                          }
                        }
                      );
                    }
                    if (
                      itemD.cornerMarkUrlArray &&
                      itemD.cornerMarkUrlArray.length > 0
                    ) {
                      itemD.cornerMarkUrl = itemD.cornerMarkUrlArray[0];
                    }
                    if (that.configList.UNIFY_SEARCH_BUY_WAY) {
                      that.configList.UNIFY_SEARCH_BUY_WAY.forEach(
                        (itemN, indexN) => {
                          if (itemD.buyType && itemD.buyType == itemN.code) {
                            itemD.buyTypeUrl = itemN.name;
                            itemD.buyTypeName = itemN.name;
                            itemD.tagWidth = getConWidth(itemD.buyTypeName);
                          }
                        }
                      );
                    }

                    // 图片判断
                    // if( itemD.iconUrl && itemD.iconUrl.replace(' ','').split(":")[0].indexOf("https") == -1 ){
                    //   if(itemD.iconUrl && itemD.iconUrl.replace(' ','').split(":")[1]
                    //   && itemD.iconUrl.replace(' ','').split(":")[1].indexOf("activity.cmcc-cs.cn") != -1){
                    //     //
                    //   }else{
                    //     itemD.iconUrl = " ";
                    //   }
                    // }else{
                    if (
                      itemD.iconUrl &&
                      itemD.iconUrl.replace(" ", "").split(":")[1] &&
                      itemD.iconUrl
                        .replace(" ", "")
                        .split(":")[1]
                        .indexOf("10.4.160.6") != -1
                    ) {
                      itemD.iconUrl = " ";
                    }
                    // }

                    that.moreArrDataList.push(itemD);

                    that.moreArrDataList.forEach((itemFi, indexFi) => {
                      // 组装垂直页无二级类目页面数据回显触点曝光所需impAttrs参数
                      const impAttrs = {};

                      let categoryNameFlg =
                        sessionStorage.pageEntrance == "6"
                          ? "权益"
                          : sessionStorage.pageEntrance == "8"
                          ? "商城"
                          : itemFi.parentCategoryName;
                      // impAttrs.position_id = indexFi+1;
                      // impAttrs.type = "once";
                      impAttrs.WT_et = "imp";
                      impAttrs.WT_event = itemFi.pCode;
                      impAttrs.WT_envName = itemFi.title;
                      impAttrs.XY_point_position = indexFi + 1;
                      impAttrs.WT_markId = itemFi._id;
                      impAttrs.XY_first_class = categoryNameFlg;
                      if (
                        itemFi.parentCategoryName !== itemFi.dispCategoryName
                      ) {
                        impAttrs.XY_second_class = itemFi.dispCategoryName;
                      }
                      // impAttrs.XY_second_class = itemFi.parentCategoryName == itemFi.dispCategoryName?" ":itemFi.dispCategoryName;
                      impAttrs.WT_next_url = itemFi.linkAdress;
                      impAttrs.WT_plat = sessionStorage.pagePlat || "";
                      impAttrs.WT_es = sessionStorage.pageUrl || "";
                      impAttrs.WT_ti = "搜索结果页";
                      impAttrs.XY_pageEntry = sessionStorage.pageEntrance || ""; //新增页面入口

                      // 插码方案修改2025-1-16
                      impAttrs.XY_second_class = itemFi.dispCategoryName;
                      impAttrs.WT_area_type_1 = "楼层";
                      impAttrs.areaid = ""; // 父物品id信息（无父物品传空）
                      impAttrs.WT_area_type_2 = itemFi.parentCategoryName;
                      impAttrs.WT_area_name = itemFi.dispCategoryName; // 若没有二级分类，此名称则记录为一级分类名称
                      impAttrs.XY_env_type = "icon";
                      impAttrs.XY_gd_source = "搜索平台";
                      impAttrs.XY_scene = this.getSearchContent() || ""; // 搜索内容
                      impAttrs.WT_si_n = itemFi.title; // 物品对应的名称
                      impAttrs.WT_goods_id = itemFi.itemId; // 物品所对应的id信息
                      impAttrs.XY_visit_source =
                        sessionStorage.pageEntrance || ""; // 访问来源
                      // impAttrs.XY_transaction_id = that.getSearchUUID(); // 这里没有设置XY_transaction_id 是在上报传参时统一设置了

                      itemFi.impAttrsList = impAttrs;
                    });
                    // that.$set(that.moreArrDataList,indexD,itemD);
                  });
                });

                console.log(that.moreArrList);
                console.log(that.moreArrDataList, "最终的列表数据");
              }
              
              if (this.$isProvinceDistinct) {
                // ========== 统一去重逻辑（无论是否有二级分类都执行）==========
                console.log('========== 垂直页去重开始 ==========');
                console.log('去重开关 $isProvinceDistinct:', this.$isProvinceDistinct);
                console.log('去重前 moreArrList:', JSON.parse(JSON.stringify(that.moreArrList)));
                
                that.moreArrList = mergeSearchAndZoneData(
                  that.moreArrList,
                  this.$isProvinceDistinct
                );
                
                console.log('去重后 moreArrList:', JSON.parse(JSON.stringify(that.moreArrList)));
                console.log('========== 垂直页去重结束 ==========');
              
                // 重新提取去重后的数据项
                that.moreArrDataList = [];
                that.moreArrList.forEach((item) => {
                  if (item.data && Array.isArray(item.data)) {
                    that.moreArrDataList.push(...item.data);
                  }
                });
                const currentPageDataList = [...that.moreArrDataList];
                const historyLength = historyMoreArrDataList.length;
                that.moreArrDataList = that.mergePagedMoreArrDataList(
                  historyMoreArrDataList,
                  currentPageDataList
                );
                
                console.log(that.moreArrDataList, "去重后的列表数据-最终");
                console.log(that.radiusDataList, "二级分类选项卡（不受去重影响）");
                // ========== 统一去重逻辑结束 ==========
                console.log(this.pagePage, '当前pagePage')
                if (this.pagePage > 2) {
                  this.finished = true;
                }
              }
              

              // 处理江苏权益
              const provinceCodeLocal =
                JSON.parse(localStorage.getItem("userInfo")).province || "";

              if (
                sessionStorage.pageEntrance == "6" &&
                provinceCodeLocal == "250"
              ) {
                // 初始化数据
                that.updateLists(that.moreArrDataList);
              } else {
                that.jsMoreArrDataList = that.moreArrDataList;
              }

              that.totalPage = res.data?.pageCount;
              if (
                parseInt(that.pagePage, Math.ceil(that.paramData.size * 2)) >=
                that.totalPage
              ) {
                that.finished = true;
              }

              //分页曝光-不重复曝光
              const arr = that.moreArrDataList;
              // 定义每页显示的数量
              let arrpageSize = 0;
              if (templateId == that.CONSTANTS.TEMPLATEPAGE.PRODMB005) {
                arrpageSize = 20;
              } else {
                arrpageSize = 10;
              }
              // 定义要显示的页数
              const pageNumber = that.pagePage;
              // 计算起始位置和结束位置
              const startIndex = (pageNumber - 1) * arrpageSize;
              const endIndex = pageNumber * arrpageSize;
              let impArrDataList = arr.slice(startIndex, endIndex);

              this.$nextTick(() => {
                /**
                 * 埋点-插码-上报
                 * 曝光事件采集
                 * 搜索结果页_tab标签下物品名称
                 */
                const elements = document.querySelectorAll(".content-item");
                // const impContent = document.querySelectorAll('#imp-more-content_'+parentCodeIn);
                elements.forEach((elementE, indexE) => {
                  const obj = JSON.parse(elementE.dataset.value);
                  impArrDataList.forEach((elementF, indexF) => {
                    // 判断当前元素是否是需要的元素
                    if (obj.WT_markId == elementF._id) {
                      // console.log(JSON.stringify(elementE.impAttrsList),'-------------moreY-商品-曝光事件传参----------------');
                      // if(isApp()){
                      elementF.impAttrsList.XY_transaction_id =
                        that.getSearchUUID();
                      handleGdpImp(
                        elementE,
                        elementF.impAttrsList,
                        "moreY",
                        elementF.impAttrsList.WT_markId,
                        "moreY_搜索结果页_tab标签下物品名称"
                      );
                      // }
                    }
                  });
                });
              });
            } else {
              // 无数据但是专区又有数据的时候，二级类目要单独处理
              if (that.searchZoneHasData) {
                if (
                  that.CONSTANTS.TEMPLATEPAGE.PRODLIST004.indexOf(templateId) !=
                    -1 ||
                  that.CONSTANTS.TEMPLATEPAGE.LIFELIST005.indexOf(templateId) !=
                    -1 ||
                  that.CONSTANTS.TEMPLATEPAGE.SLSRCLIST.indexOf(templateId) !=
                    -1
                ) {
                  that.$refs.radiusTabRef.radiusTabShow = true;
                  that.searchZoneSecondShow = true;
                  that.radiusTabShowParent = true;
                  if (sessionStorage.tabsListSes) {
                    let arrList = JSON.parse(sessionStorage.tabsListSes);
                    arrList.forEach((item, index) => {
                      if (parentCodeIn == item.categoryCode) {
                        item.subList.forEach((subItem, subIndex) => {
                          subItem.pCode = "P00000050507";
                          subItem.parentCategoryName = item.categoryName;

                          // 组装触点曝光所需impAttrs参数
                          const impAttrs = {};
                          // impAttrs.position_id = subIndex+1;
                          // impAttrs.type = "once";
                          impAttrs.WT_et = "imp";
                          impAttrs.WT_event = subItem.pCode;
                          impAttrs.WT_envName = subItem.categoryName;
                          impAttrs.XY_point_position = subIndex + 1;
                          impAttrs.WT_markId = subItem.categoryCode;
                          impAttrs.XY_first_class =
                            sessionStorage.pageEntrance == "6"
                              ? "权益"
                              : sessionStorage.pageEntrance == "8"
                              ? "商城"
                              : subItem.parentCategoryName;
                          impAttrs.XY_pageEntry =
                            sessionStorage.pageEntrance || ""; //新增页面入口
                          impAttrs.WT_plat = sessionStorage.pagePlat || "";
                          impAttrs.WT_es = sessionStorage.pageUrl || "";
                          impAttrs.WT_ti = "搜索结果页";

                          subItem.impAttrsRadiusTab = impAttrs;

                          if (categoryCodeIn == subItem.categoryCode) {
                            that.$refs.radiusTabRef.activeTabRadius = subIndex;
                          }

                          that.radiusDataList = item.subList;

                          that.$refs.radiusTabRef.radiusDataList = item.subList;
                        });
                      }
                    });
                  }
                }
              }
              that.finishedText = " ";
              if (type == "6") {
                that.noDataShowFilter = true;
              } else {
                that.noDataShow = true;
              }
              that.$nextTick(() => {
                //为您推荐专区查询
                setTimeout(() => {
                  if (that.$refs.noDataRef && that.$refs.noDataRef[0]) {
                    that.$refs.noDataRef[0]?.$refs.recommendRef?.handleQueryResult(
                      that.paramData.categoryCode,
                      that.paramData.parentCode,
                      that.paramData.templateId
                    );
                  }
                }, 500);
              });
              // that.currentCompList = [{ path: 'NoData', refD: 'NoDataRef' }];
            }
          } else {
            that.finishedText = " ";
            if (type == "6") {
              that.noDataShowFilter = true;
            } else {
              that.noDataShow = true;
            }
            that.$nextTick(() => {
              //为您推荐专区查询
              setTimeout(() => {
                if (that.$refs.noDataRef && that.$refs.noDataRef[0]) {
                  that.$refs.noDataRef[0]?.$refs.recommendRef?.handleQueryResult(
                    that.paramData.categoryCode,
                    that.paramData.parentCode,
                    that.paramData.templateId
                  );
                }
              }, 500);
            });
            that.loading = false;
            that.$refs.loading.loadingHide();
            // that.resultSkeletonShow = false;
            console.log("请求接口失败");
          }
        })
        .catch((err) => {
          if (isQueryIndexTrafficPeakByError(err)) {
            that.trafficPeakFallback = true;
            that.noDataShow = false;
            that.noDataShowFilter = false;
            that.loading = false;
            that.$refs.loading?.loadingHide();
            return;
          }
          that.trafficPeakFallback = false;
          that.finishedText = " ";
          if (type == "6") {
            that.noDataShowFilter = true;
          } else {
            that.noDataShow = true;
          }
          that.$nextTick(() => {
            // 为您推荐专区查询
            setTimeout(() => {
              if (that.$refs.noDataRef && that.$refs.noDataRef[0]) {
                that.$refs.noDataRef[0]?.$refs.recommendRef?.handleQueryResult(
                  that.paramData.categoryCode,
                  that.paramData.parentCode,
                  that.paramData.templateId
                );
              }
            }, 500);
          });
          that.loading = false;
          that.$refs.loading.loadingHide();
          // that.resultSkeletonShow = false;
          console.log("请求接口失败" + err);
        });
    },

    hideVideo() {
      this.videoUrl = "";
      this.showVideo = false;
    },

    async handleClickTo(item, index) {
      this.$refs.loading.loadingShow();
      console.log(
        JSON.stringify(item.impAttrsList),
        "-------------moreY-点击商品-点击事件传参----------------"
      );
      console.log("-----moreY-商品position-----" + (index + 1));
      /**
       * 埋点-插码-上报
       * 点击事件采集
       * 搜索结果页_tab标签下物品名称
       */
      if (isApp()) {
        // let obj = {};
        // if (item.parentCategoryName !== item.disCategoryName) {
        //   obj = {
        //     WT_et: "clk",
        //     WT_envName: item.title,
        //     WT_event: item.pCode,
        //     WT_markId: item._id,
        //     XY_point_position: index + 1,
        //     XY_first_class:
        //       sessionStorage.pageEntrance == "6"
        //         ? "权益"
        //         : sessionStorage.pageEntrance == "8"
        //         ? "商城"
        //         : item.parentCategoryName,
        //     XY_second_class:
        //       item.parentCategoryName == item.disCategoryName
        //         ? " "
        //         : item.disCategoryName,
        //     WT_next_url: item.linkAdress,
        //     WT_plat: sessionStorage.pagePlat || "",
        //     WT_es: sessionStorage.pageUrl || "",
        //     WT_ti: "搜索结果页",
        //     XY_pageEntry: sessionStorage.pageEntrance || "",
        //   };
        // } else {
        //   obj = {
        //     WT_et: "clk",
        //     WT_envName: item.title,
        //     WT_event: item.pCode,
        //     WT_markId: item._id,
        //     XY_point_position: index + 1,
        //     XY_first_class:
        //       sessionStorage.pageEntrance == "6"
        //         ? "权益"
        //         : sessionStorage.pageEntrance == "8"
        //         ? "商城"
        //         : item.parentCategoryName,
        //     WT_next_url: item.linkAdress,
        //     WT_plat: sessionStorage.pagePlat || "",
        //     WT_es: sessionStorage.pageUrl || "",
        //     WT_ti: "搜索结果页",
        //     XY_pageEntry: sessionStorage.pageEntrance || "",
        //   };
        // }
        // obj.XY_transaction_id = this.getSearchUUID();

        // 插码方案修改2025-1-16
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
              ? ""
              : item.disCategoryName,
          WT_area_type_1: "楼层",
          areaid: "", // 父物品id信息（无父物品传空）
          WT_area_type_2: item.parentCategoryName,
          WT_area_name: item.dispCategoryName, // 若没有二级分类，此名称则记录为一级分类名称
          XY_env_type: "icon",
          WT_event: "P00000050506", // 全部页传P00000050508 垂直页传P00000050506
          XY_gd_source: "搜索平台",
          XY_scene: this.getSearchContent() || "", // 搜索内容
          WT_si_n: item.title, // 物品对应的名称
          WT_goods_id: item.itemId, // 物品所对应的id信息
          XY_visit_source: sessionStorage.pageEntrance || "", // 访问来源
        };
        console.log("点击MoreYList数据上报===>");
        console.log(clickGdpObj);
        gdp("track", "clk", clickGdpObj);
      }
      await handleSaveClickInfo(item, this.searchContent).then((resolve) => {
        this.$refs.loading.loadingHide();
        if (resolve == "0") {
          // let jumpType = item.jumpType === '30' ? '5' : item.jumpType === '1' ? '4' : '1';
          // goPageUrl(item.jumpType, item.linkAdress);
          // window.location.href = item.linkAdress;

          // console.log(item);
          // 政企视频当前页打开播放弹窗 originalJumpType  jumpType
          if (item.jumpType === "40") {
            this.videoUrl = item.linkAdress;
            this.showVideo = true;
          } else {
            if (isProtogenesisSkip(item)) {
              goProtogenesisPage(item.linkAdress1);
            } else {
              goPageUrl(item.jumpType, item.linkAdress);
            }
          }
        }
      });
    },

    updateLists(newData) {
      const lists = [];
      for (const item of newData) {
        const index = lists.findIndex((list) =>
          list.some((i) => i.jsDataType == item.jsDataType)
        );
        if (index === -1) {
          lists.push([item]);
        } else {
          lists[index].push(item);
        }
      }
      // console.log(JSON.stringify(lists));
      this.jsMoreArrDataList = lists;
    },
    jsListEmpty() {
      this.jsList1 = [];
      this.jsList2 = [];
      this.jsList3 = [];
      this.jsMoreArrDataList = [];
    },

    refreshHotMobileNum() {
      console.log('垂直页靓号刷新')
      this.updateRefresh()
    }
  },
};
</script>

<style scoped lang='scss'>
@import "./More.scss";
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
.module-wrap {
  .m-content-x {
    .content-item {
      ::v-deep .van-image__img {
        max-width: 48px;
      }
      ::v-deep .van-image__error {
        position: relative;
        background-color: initial !important;
      }
      .c-i-title {
        width: 100%;
        font-size: 24px;
        color: #333333;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        ::v-deep span {
          color: #2892ff !important;
        }
      }
    }
  }
}
::v-deep .van-image__error {
  position: relative;
  background-color: initial !important;
}
.module-wrap {
  .m-content-three {
    .content-item-three {
      ::v-deep .van-image__img {
        max-width: 100px;
      }
      ::v-deep __error {
        position: relative;
      }

      .c-i-title {
        ::v-deep span {
          color: #2892ff !important;
        }
      }
    }
  }
  .m-content {
    .content-item {
      .c-i-left {
        ::v-deep .van-image__img {
          min-width: 100px;
        }
      }
    }
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
}
::v-deep.van-list {
  //
  // height: calc((100% - 58px));
  height: 100%;
  overflow-y: auto;
  scrollbar-width: none;
  // border-radius: 18px;
  // margin-top: 100px;
}

::v-deep.van-list::-webkit-scrollbar {
  display: none;
}
::v-deep.van-list::-moz-scrollbar {
  display: none;
}
::v-deep .van-sticky--fixed {
  width: calc(100% - 60px);
  left: 30px;
}
::v-deep .van-list__finished-text {
  font-size: 24px;
  font-weight: 400;
  color: #cccccc;
  line-height: 33px;
  text-align: center;
  margin: 36px 0px 94px 0px;
  width: 100%;
}

.zq-wrap {
  .zq-title {
    font-size: 28px;
    color: #333333;
    margin-bottom: 12px;
    font-weight: 700;
    font-family: PingFangSC-Medium, sans-serif;

    ::v-deep span {
      color: #2892ff !important;
    }
  }
  .zq-subtitle {
    font-size: 24px;
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
}
</style>
  