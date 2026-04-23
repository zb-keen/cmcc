<template>
  <div class="video-wrap">
    <!-- http://36.134.128.59:9999/api/fileManagerNew/getFile/1852254211250978818 -->
    <!-- <video ref="videoPlayer" class="video-js vjs-default-skin"></video> -->
    <!-- <video
      src="http://36.134.128.59:9999/api/fileManagerNew/getFile/1852254211250978818"
    ></video> -->
    <div @click="closeVideo" class="close-video">
      <img src="../assets/images/video-close.png" alt="" />
    </div>
    <video
      controls
      class="my-video"
      :src="videoSrc"
      playsinline="true"
      webkit-playsinline="true"
    >
      <!-- <source :src="videoSrc" type="video/mp4" /> -->
      Your browser does not support the video element.
    </video>
  </div>
</template>
 
<script>
// import videojs from "video.js";
// import "video.js/dist/video-js.css";

export default {
  name: "VideoPlayer",
  props: {
    videoSrc: {
      type: String,
    },
  },
  data() {
    return {
      player: null,
      options: {
        autoplay: true,
        controls: true,
        height: 300,
        width: 600,
        loop: false,
        muted: false,
        poster: "poster-image-url",
        preload: "auto",
        sources: [{ src: "video-url", type: "video/mp4" }],
        playbackRates: [0.5, 1, 1.25, 1.5],
        language: "zh-CN",
        // 其他video.js选项...
      },
    };
  },
  mounted() {
    this.options.src = this.videoSrc;
    console.log("视频组件配置===>");
    console.log(this.options);
    // this.player = videojs(
    //   this.$refs.videoPlayer,
    //   this.options,
    //   function onPlayerReady() {
    //     console.log("Player is ready");
    //   }
    // );
  },
  methods: {
    closeVideo() {
      console.log("关闭视频弹窗");
      this.$emit("closePlayer");
    },
  },
  beforeDestroy() {
    if (this.player) {
      this.player.dispose();
    }
  },
};
</script>

<style lang="scss" scoped>
.video-wrap {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #000;
  opacity: 0.9;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 101; // 为了覆盖掉tabs 左右可滑动隐藏的元素(灰白色--left-cover-right-cover)
}

.vjs-default-skin {
  margin: 0 auto;
}

.my-video {
  width: 90%;
  height: 40%;
  background: lightblue;
}

.close-video {
  position: absolute;
  top: 70px;
  right: 40px;

  img {
    width: 0.6rem;
    height: 0.6rem;
  }
}
</style>