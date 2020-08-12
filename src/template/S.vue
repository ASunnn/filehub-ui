<template>
    <el-container>
        <el-col :md="{span: 20, offset: 2}" :sm="24">
            <el-header>
                <el-menu mode="horizontal">
                    <el-menu-item index="1">FileHub</el-menu-item>
                </el-menu>
            </el-header>
            <el-main>
                <el-col :md="{span: 20, offset: 2}" :sm="24">
                    <template v-if="show">
                        <item :data="data" :tool="false"></item>
                    </template>
                    <template v-else>
                        <div class="blank" ref="content"></div>
                    </template>
                </el-col>
            </el-main>
        </el-col>
    </el-container>
</template>

<script>
    import Item from "../components/Item";
    import axios from "axios";
    import { Loading } from 'element-ui';

    export default {
        components: {Item},

        data() {
            return {
                id: this.$route.params.id,
                show: false,
                loading: null,

                data: null
            }
        },

        mounted: function() {
            const self = this;
            this.loading = Loading.service({
                target: this.$refs.content
            });
            axios.get(path + "/share/check?id=" + this.id)
                .then(function (response) {
                    let data = response.data;

                    if (data.code === 0) {
                        if (data.encrypt) {
                            self.$prompt("Key：", {
                                showClose: false,
                                showCancelButton: false
                            }).then(({ value }) => {
                                self.getShare(value);
                            }).catch(() => {});
                        } else {
                            self.getShare("");
                        }
                    } else {
                        self.$notify({
                            message: data.msg + " : " + data.detail,
                            type: "warning"
                        });
                        self.loading.close();
                    }
                })
                .catch(function (error) {
                    self.$notify.error({
                        message: error.message,
                    });
                    self.loading.close();
                });
        },

        methods: {
            getShare: function(key) {
                const self = this;

                let formData = new FormData();
                formData.append("key", key);

                axios.post(path + "/share/" + this.id, formData, {
                    headers:{'Content-Type':'application/x-www-form-urlencoded'}
                }).then(function (response) {
                    let data = response.data;
                    if (data.code === 0) {
                        self.bindData(data);
                        self.show = true;
                    } else {
                        self.$notify({
                            message: data.msg + " : " + data.detail,
                            type: "warning"
                        });
                    }
                    self.loading.close();
                }).catch(function(error) {
                    self.$notify.error({
                        message: error.message,
                    });
                    self.loading.close();
                });
            },

            bindData: function(data) {
                let list = [];
                for (let i = 0; i < data.files.length; ++i) {
                    list.push(Object.assign({
                        num: i + 1
                    }, data.files[i]));
                }

                this.data = {
                    seq: this.id,
                    title: data.name,
                    size: data.totalSize,
                    expire: data.expireTime,
                    list: list
                };
            }
        }
    }
</script>

<style>
    .blank {
        width: 100%;
        height: 50vh;
    }

    .el-menu-item {
        font-size: large;
         cursor: default;
    }

    .el-menu--horizontal>.el-menu-item.is-active {
         border-bottom: none;
        color: #303133;
    }
</style>