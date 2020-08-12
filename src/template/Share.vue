<template>
    <div>
        <template v-if="!show">
            <div class="blank" ref="content"></div>
        </template>
        <template v-if="list.length === 0 && show">
            <p class="no-data">No Share Data</p>
        </template>
        <template v-if="list.length > 0 && show">
            <el-table :data="list" style="width: 100%" @row-dblclick="open">
                <el-table-column prop="num" label="#" width="50px" >
                </el-table-column>
                <el-table-column prop="name" label="Name">
                </el-table-column>
                <el-table-column prop="totalSize" label="Size" width="80px">
                </el-table-column>
                <el-table-column prop="expireTime" label="Expire" width="140px">
                </el-table-column>
            </el-table>
        </template>
    </div>
</template>

<script>
    import axios from "axios";
    import { Loading } from 'element-ui';

    export default {

        data() {
            return {
                list: [],
                show: false
            }
        },

        mounted: function() {
            const self = this;

            let load = Loading.service({
                target: this.$refs.content
            });
            axios.get(path + "/shares")
                .then(function (response) {
                    let data = response.data;
                    if (data.code === 0) {
                        self.buildList(data.list);
                    } else {
                        self.$notify({
                            message: data.msg + " : " + data.detail,
                            type: "warning"
                        });
                    }
                    load.close();
                    self.show = true;
                })
                .catch(function (error) {
                    self.$notify.error({
                        message: error.message,
                    });
                    load.close();
                    self.show = true;
                });
        },

        methods: {
            buildList: function(data) {
                if (data && data.length > 0) {
                    let list = [];
                    for (let i = 0; i < data.length; ++i) {
                        list.push(Object.assign({
                            num: i + 1
                        }, data[i]));
                    }
                    this.list = list;
                }
            },

            open: function(row, column, event) {
                this.$router.push(path + "/s/" + row.id);
                // window.location.href = "/s/" + row.id;
            }
        }
    }
</script>

<style>
    .blank {
        width: 100%;
        height: 50vh;
    }

    .no-data {
        font-size: large;
        margin: 20px;
        color: #303133;
    }
</style>