<template>
    <router-view></router-view>
</template>

<script>
    export default {
        name: 'App'
    }
</script>

<style>
    .el-notification__content {
        font-size: 14px;
        line-height: 27px;
        margin: 0;
        color: #606266;
        text-align: justify;
    }

    a {
        color: #337ab7;
        text-decoration: none;
    }
    a:hover {
        color: #23527c;
        text-decoration: underline;
    }
</style>
