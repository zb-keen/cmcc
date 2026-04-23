<template>
  <div class="more-text">
    <span>更多</span>
    <span v-if="finalCount" class="moreCount">{{finalCount}}</span>
    <i class="s-iconfont ic-youjiantou"></i>
    <!-- 加载中 -->
    <Loadding ref="loading" />
  </div>
</template>

<script>
import Loadding from "../../Loadding.vue";

export default {
  name: "MoreText",
  components: {
    Loadding,
  },
  data() {
    return {
    };
  },
  computed: {
    finalCount() {
      return this.getCount();
    },
  },
  props: {
    count: {
      type: Number,
    },
  },
  methods: {
    getCount(){
      let count = this.count
      if (count > 0 && count < 10) return count;
      if (count >= 10 && count <= 100) return count % 10 === 0 ? count : Math.floor(count / 10) * 10 + '+';
      if (count > 100) return '100+';
      return ''    
    }
  },
};
</script>

<style scoped lang='scss'>
  .more-text{
    display: flex;
    align-items: center;
    justify-content: center;
    height: 32px;
    .moreCount{
      height: 32px;
      line-height: 32px;
      display: inline-block;
      background: #E3EFFF;
      border-radius: 16px;
      font-size: 22px;
      color: #007EFF;
      padding: 0 10px;
      font-weight: 500;
      margin-left: 4px;
    }      
  }
</style>
