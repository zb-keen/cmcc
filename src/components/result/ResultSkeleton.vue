<template>
  <div class="test-wrapper">
    <div class="test-nav">
      <ul>
        <!-- 菜单导航不需要加动效 -->
        <li class=""></li>
        <li class=""></li>
        <li class=""></li>
        <li class=""></li>
        <li class=""></li>
        <li class=""></li>
      </ul>
    </div>
    <ul class="test-list">
      <li>
        <div class="pic skt_con"></div>
        <div class="txt mt-27">
          <h2 class="skt_con"></h2>
          <h3 class="skt_con"></h3>
        </div>
      </li>
    </ul>
    <ul class="test-list pt-30">
      <div class="title skt_con"></div>
      <ul class="test-list-icon">
        <li>
          <div class="icon skt_con"></div>
          <div class="icon-title skt_con"></div>
        </li>
        <li>
          <div class="icon skt_con"></div>
          <div class="icon-title skt_con"></div>
        </li>
        <li>
          <div class="icon skt_con"></div>
          <div class="icon-title skt_con"></div>
        </li>
        <li>
          <div class="icon skt_con"></div>
          <div class="icon-title skt_con"></div>
        </li>
      </ul>
    </ul>
    <ul class="test-list pt-30">
      <div class="title skt_con"></div>
      <li>
        <div class="pic skt_con"></div>
        <div class="txt">
          <h2 class="skt_con"></h2>
          <h3 class="skt_con"></h3>
          <h4 class="skt_con"></h4>
        </div>
      </li>
      <li>
        <div class="pic skt_con"></div>
        <div class="txt">
          <h2 class="skt_con"></h2>
          <h3 class="skt_con"></h3>
          <h4 class="skt_con"></h4>
        </div>
      </li>
      <li>
        <div class="pic skt_con"></div>
        <div class="txt">
          <h2 class="skt_con"></h2>
          <h3 class="skt_con"></h3>
          <h4 class="skt_con"></h4>
        </div>
      </li>
      <li>
        <div class="pic skt_con"></div>
        <div class="txt">
          <h2 class="skt_con"></h2>
          <h3 class="skt_con"></h3>
          <h4 class="skt_con"></h4>
        </div>
      </li>
      <li>
        <div class="pic skt_con"></div>
        <div class="txt">
          <h2 class="skt_con"></h2>
          <h3 class="skt_con"></h3>
          <h4 class="skt_con"></h4>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
</script>

<style scoped lang='scss'>
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

.test-wrapper {
  width: 100%;
  background-color: #f5f5f5;
  overflow: hidden;
  display: inline-block;
  margin-top: -20px;
}

.test-nav {
  padding: 30px 0px;
}

.test-nav > ul {
  box-sizing: border-box;
  display: flex;
  margin: 0;
  padding: 0;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  gap: 30px;
}

.test-nav > ul > li {
  list-style: none;
  display: inline-block;
  background-color: #fff;
  border-radius: 12px;
  width: 100%;
  height: 60px;
  // margin-right: 20px;
  &:last-child {
    margin-right: 0px;
  }
}

.test-list {
  background-color: white;
  border-radius: 18px;
  margin: 30px 0px;
  margin-top: 0;
  padding: 0;
  padding-bottom: 30px;
}

.test-list > li {
  display: block;
  list-style: none;
  font-size: 0;
  height: 184px;
  padding: 44px;
}

.test-list .pic {
  width: 140px;
  height: 140px;
  background-color: #f8f8f9;
  border-radius: 12px;
  float: left;
}

.test-list .txt {
  font-size: 24px;
  float: left;
  margin-left: 24px;
}

.test-list .txt > h2,
.test-list .txt > h3,
.test-list .txt > h4 {
  margin: 0;
  padding: 0;
  background-color: #f8f8f9;
  border-radius: 12px;
}

.test-list .txt > h2 {
  width: 240px;
  height: 36px;
}

.test-list .txt > h3 {
  width: 360px;
  height: 30px;
  margin-top: 20px;
}

.test-list .txt > h4 {
  width: 150px;
  height: 30px;
  margin-top: 20px;
}

.test-list::after {
  content: "";
  clear: both;
  height: 0;
  display: table;
  overflow: hidden;
}

.test-list .title {
  width: 165px;
  height: 44px;
  background: #f8f8f9;
  border-radius: 12px;
  margin: 0px 0px 0px 24px;
}

.test-list .icon {
  width: 48px;
  height: 48px;
  background: #f8f8f9;
  border-radius: 50%;
  /* margin-left: 10px; */
}

.test-list .icon-title {
  width: 93px;
  height: 30px;
  background: #f8f8f9;
  border-radius: 6px;
  margin-top: 12px;
}

.test-list-icon {
  display: flex;
  padding: 30px 0px 0px 0px;
  justify-content: center;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
}

.test-list-icon > li {
  text-align: center;
  padding: 0;
  display: flex;
  width: 100%;
  align-items: center;
  flex-direction: column;
  justify-content: center;
}

.mt-27 {
  margin-top: 27px;
}

.pt-30 {
  padding-top: 30px;
}
</style>