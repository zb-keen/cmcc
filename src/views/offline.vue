<template>
    <div class="offline">
        <span class="notice">当前网络不可用，请检查网络设置</span>
    </div>
</template>
<script></script>
<style scoped lang="scss">
.offline {
    position: absolute;
    top: 51%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10;
    width: 474px;
    height: 84px;
    background: rgba(0,0,0,0.8);
    border-radius: 18px;
    display: flex;
    justify-content: center;
    align-items: center;
    .notice {
       font-family: PingFangSC, PingFang SC;
        font-weight: 500;
        font-size: 26px;
        color: #FFFFFF;
        line-height: 36px;
        text-align: center;
    }
}
</style>