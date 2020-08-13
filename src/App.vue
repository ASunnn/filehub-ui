<template>
    <router-view></router-view>
</template>

<script>
    export default {
        name: 'App'
    }
</script>

<style lang="less">
    @import "css/style.less";

    .el-notification__content {
        font-size: 14px;
        line-height: 27px;
        margin: 0;
        color: #606266;
        text-align: justify;
    }
</style>
