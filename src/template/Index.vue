<template>
    <el-container>
        <el-col :md="{span: 20, offset: 2}" :sm="24">
            <el-header>
                <el-menu mode="horizontal">
                    <el-menu-item index="1"><router-link class="menu-title" to="/filehub/">FileHub</router-link></el-menu-item>
                    <el-menu-item index="2"><router-link class="menu-item" to="/filehub/list">list</router-link></el-menu-item>
                    <el-menu-item index="3"><router-link class="menu-item" to="/filehub/share">share</router-link></el-menu-item>
                </el-menu>
            </el-header>
            <el-main>
                <el-col :md="{span: 20, offset: 2}" :sm="24">
                    <router-view></router-view>
                </el-col>
            </el-main>
        </el-col>
    </el-container>
</template>

<script>
    export default {
    }
</script>

<style lang="less">
    .el-menu-item {
        transition: none;
    }

    .el-menu--horizontal>.el-menu-item.is-active {
         border-bottom: none;
    }
</style>