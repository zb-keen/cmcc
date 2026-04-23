<template>
  <div class="skeleton-wrapper">
    <div class="default-word-con">
      <ul>
        <!-- 菜单导航不需要加动效 -->
        <li class="skt_con" :style="{'width': ((offsetWidth * item) / 750) + 'px'}" v-for="(item,index) in defaultWords" :key="index"></li>
      </ul>
    </div>
    <div class="con discovery-con">
      <div class="title skt_con"></div>
      <ul>
        <li v-for="(item,index) in discoveryData" :key="index">
          <p class="skt_con" :style="{'width': ((offsetWidth * sub) / 750) + 'px'}" v-for="(sub,ind) in item.data" :key="ind"></p>
        </li>
      </ul>
    </div>
    <div class="con hot-search-con">
      <div class="title skt_con"></div>
      <ul>
        <li v-for="(item,index) in hotSearchData" :key="index">
          <span></span>
          <span class="skt_con" :style="{'width': ((offsetWidth * item) / 750) + 'px'}"></span>
          <span class="skt_con"></span>
        </li>
      </ul>
    </div>
    <div class="con guess-like-con">
      <div class="title skt_con"></div>
      <ul>
        <li v-for="(item,index) in guesslikeData" :key="index">
          <div class="image skt_con"></div>
          <p></p>
        </li>
      </ul>
      <div class="swiper-con skt_con"></div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'default-skeleton',
  data(){
    return {
      offsetWidth: null,
      defaultWords: [100,130,170],
      discoveryData: [
        {
          index: 1,
          data: [100,130,170,150]
        },
        {
          index: 2,
          data: [130,150,100,130]
        }


      ],
      hotSearchData: [360,360,280,280,280,280,280,280],
      guesslikeData: [1,2,3,4]
    }
  },
  mounted(){
    this.offsetWidth = document.body.offsetWidth;
  }

}
</script>
<style lang="scss" scoped>
.skt_con {
  overflow: hidden;
  position: relative;
  display: block;
  transform: translate3D(0, 0, 0);
}

.skt_con:empty::after {
  /*内容区域空状态时追加骨架屏样式 */
  content: "";
  display: block;
  position: absolute;
  left: 0;
  width: 150%;
  height: 100%;
  transform: translateX(-100%);
  background: -webkit-linear-gradient(
    90deg,
    #f8f8f9 1%,
    #ededed 30%,
    #ededed 70%,
    #f8f8f9 99%
  );
  background: -moz-linear-gradient(
    90deg,
    #f8f8f9 1%,
    #ededed 30%,
    #ededed 70%,
    #f8f8f9 99%
  );
  background: -o-linear-gradient(
    90deg,
    #f8f8f9 1%,
    #ededed 30%,
    #ededed 70%,
    #f8f8f9 99%
  );
  background: -ms-linear-gradient(
    90deg,
    #f8f8f9 1%,
    #ededed 30%,
    #ededed 70%,
    #f8f8f9 99%
  );
  background: linear-gradient(
    90deg,
    #f8f8f9 1%,
    #ededed 30%,
    #ededed 70%,
    #f8f8f9 99%
  );
  animation: skeleton 4s infinite;
}

@keyframes skeleton {
  /* 骨架屏的动画 */
  100% {
    transform: translateX(70%);
  }
}

.skeleton-wrapper {
  width: 100%;
  background-color: #fff;
  overflow: hidden;
  display: inline-block;
  margin-top: -46px;
}

.default-word-con {
  margin-top: 45px;
}

.default-word-con > ul {
  box-sizing: border-box;
  display: flex;
}
.default-word-con > ul > li {
  list-style: none;
  display: inline-block;
  background-color: #f8f8f9;
  border-radius: 12px;
  height: 36px;
  margin-right: 30px;
}
.con {
  display: flex;
  flex-direction: column;
  .title {
    width: 165px;
    height: 44px;
    background: #f8f8f9;
    border-radius: 12px;
    margin-bottom: 52px;
  }
  ul {
    display: flex;
    flex-direction: column;
    li {
      p {
        display: inline-block;
        height: 36px;
        background: #f8f8f9;
        border-radius: 12px;
      }
    }
  }
}
.discovery-con {
  margin-top: 38px;
  li {
    display: flex;
    margin-bottom: 30px;
    justify-content: space-between;
    gap: 30px;
  }
}
.hot-search-con {
  margin-top: 15px;
  width: 690px;
  background: #ffffff;
  border-radius: 18px;
  border: 2px solid #f2f2f2;
  padding: 34px 41px;
  li {
    width: 100%;
    margin-bottom: 29px;
    span:nth-of-type(1) {
      width: 30px;
      height: 30px;
      background: #f8f8f9;
      border-radius: 12px;
      margin-right: 18px;
      float: left;
    }
    span:nth-of-type(2) {
      width: 280px;
      height: 30px;
      background: #f8f8f9;
      border-radius: 12px;
      float: left;
    }
    span:nth-of-type(3) {
      float: right;
      width: 96px;
      height: 30px;
      background: #f8f8f9;
      border-radius: 12px;
    }
  }
}
.guess-like-con {
  margin-top: 48px;
  margin-bottom: 58px;
  ul {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    li {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .image {
        width: 48px;
        height: 48px;
        background: #f8f8f9;
        border-radius: 50%;
      }
      p {
        width: 93px;
        height: 30px;
        background: #f8f8f9;
        border-radius: 6px;
        margin-top: 12px;
      }
    }
  }
}
.swiper-con {
  width: 100%;
  height: 150px;
  background: #f8f8f9;
  border-radius: 18px;
  margin-top: 48px;
  margin-bottom: 37px;
}
</style>
