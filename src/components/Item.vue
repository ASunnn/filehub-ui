<template>
    <div class="item">
        <el-col class="head" :span="24">
            <h2 class="title">{{data.title}}</h2>
            <p class="size">{{data.size}}</p>
            <template v-if="!isShare">
                <div class="tool">
                    <a id="delete" @click="onDelete">Delete</a>
                </div>
                <div class="tool">
                    <a id="share" @click="onShare">Share</a>
                </div>
            </template>
        </el-col>
        <template v-if="data.time">
            <el-col class="item" :sm=12 :xs="24">
                <h4>Time</h4>
                <p>{{data.time}}</p>
            </el-col>
        </template>
        <el-col class="item" :sm=12 :xs="24">
            <h4>Expire</h4>
            <p>{{data.expire}}</p>
        </el-col>
        <el-table :data="data.list" style="width: 100%">
            <el-table-column prop="num" label="#" width="40px" >
            </el-table-column>
            <el-table-column prop="name" label="Name">
            </el-table-column>
            <el-table-column prop="size" label="Size" width="80px">
            </el-table-column>
            <el-table-column width="120px">
                <template slot="header" slot-scope="scope">
                    <a :href="base + downloadPath() + data.seq">Download All</a>
                </template>
                <template slot-scope="scope">
                    <a :href="base + downloadPath() + data.seq + '/' + scope.row.name" >download</a>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    export default {
        name: "Item",

        props: ["data", "isShare"],

        data() {
            return {
                base: path
            }
        },

        methods: {
            downloadPath: function () {
                return this.isShare ? "/share/download/" : "/files/download/";
            },

            onShare: function() {
                this.$emit("on-share", this.data);
            },

            onDelete: function() {
                this.$emit("on-delete", this.data);
            }
        }
    }
</script>

<style lang="less">
    .item {
        .head {
            padding: 0 10px;
        }
        .title {
            font-size: xx-large;
            float: left;
            width: fit-content;
            max-width: 60%;
            white-space: nowrap;
            overflow: hidden;
            margin: 10px 0 0 0;
        }
        .size {
            color: darkgrey;
            float: left;
            margin-top: 27px;
            margin-left: 20px;
        }
        .tool {
            float: right;
            margin: 30px 0 0 10px;
        }
        .tool a {
            cursor: pointer;
        }
        .item {
            color: #4f4f4f;
            padding: 10px 0 20px 10px;
            h4 {
                width: fit-content;
                float: left;
                margin: 0;
            }
            p {
                margin: 0 0 0 15px;
                float: left;
            }
        }

        .table-link {
            color: #337ab7
        }
    }
</style>