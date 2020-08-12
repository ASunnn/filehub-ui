<template>
    <div class="list">
        <template v-for="(d, index) in data">
            <template v-if="index > 0">
                <el-divider></el-divider>
            </template>
            <div class="list-item" :class="{link: d.linkable}" @click="onClick(d)">
                <template v-if="d.avatar">
                    <el-avatar class="avatar" shape="square" size="large" :icon="d.avatar.icon" :src="d.avatar.url">{{d.avatar.text}}</el-avatar>
                </template>
                <div class="title">{{d.title}}</div>
                <div>
                    <template v-if="d.left">
                        <span class="left">{{d.left}}</span>
                    </template>
                    <template v-if="d.right">
                        <span class="right">{{d.right}}</span>
                    </template>
                </div>
            </div>
        </template>
        <el-pagination layout="prev, next" :small="false" :page-size="size" :page-count="page"
                @prev-click="prePage" @next-click="nextPage">
        </el-pagination>
    </div>
</template>

<script>
    export default {
        name: "List",

        props: ["data", "size", "page"],

        methods: {
            onClick: function(data) {
                console.log("click");
                if (data.linkable)
                    this.$emit("on-item-click", data);
            },

            prePage: function(page) {
                console.log(page);
                this.$emit("pre-page", page - 1);
            },

            nextPage: function(page) {
                console.log(page);
                this.$emit("next-page", page - 1);
            },
        }
    }
</script>

<style>
    .list .list-item {
        padding: 10px;
        border-radius: 6px;
        transition: background 0.2s;
    }
    .list .list-item:hover {
        background: #EBEEF5;
    }
    .list .link {
        cursor: pointer;
    }
    .list .avatar {
        margin-right: 15px;
        float: left;
    }
    .list .title {
        color: #303133;
        font-size: medium;
    }
    .list .left {
        font-size: x-small;
        color: #606266;
    }
    .list .right {
        font-size: x-small;
        float: right;
        color: #606266;
    }
    .list .el-divider--horizontal {
        margin: 2px 0;
    }

    .list .el-pagination {
        margin-top: 20px;
    }
</style>