<template>
    <div>
        <el-col :sm="18" :xs="24">
            <list class="list" :data="data" :size="30" :page="count"
                    @on-item-click="openItem" @pre-page="onPageClick" @next-page="onPageClick"></list>
        </el-col>
        <el-col :span="6" class="hidden-xs-only">
            <el-form ref="form" class="filter-form" :model="filter" label-position="top" label-width="16.67%">
                <el-form-item label="Name">
                    <el-input v-model="filter.name" placeholder="name"></el-input>
                </el-form-item>
            </el-form>
            <el-form ref="form" class="filter-form" :model="filter" label-position="top" label-width="16.67%">
                <el-form-item label="From">
                    <el-date-picker v-model="filter.from"></el-date-picker>
                </el-form-item>
                <el-form-item label="To">
                    <el-date-picker v-model="filter.to"></el-date-picker>
                </el-form-item>
            </el-form>
            <el-form ref="form" class="filter-form" :model="filter" label-position="top" label-width="16.67%">
                <el-tag class="tag" :class="{'tag-img': typeFilter.img}" @click="onFilterChange('img')">图片</el-tag>
                <el-tag class="tag" :class="{'tag-mov': typeFilter.mov}" @click="onFilterChange('mov')">视频</el-tag>
                <el-tag class="tag" :class="{'tag-audio': typeFilter.audio}" @click="onFilterChange('audio')">音频</el-tag>
                <el-tag class="tag" :class="{'tag-pdf': typeFilter.pdf}" @click="onFilterChange('pdf')">PDF</el-tag>
                <el-tag class="tag" :class="{'tag-doc': typeFilter.doc}" @click="onFilterChange('doc')">文档</el-tag>
                <el-tag class="tag" :class="{'tag-zip': typeFilter.zip}" @click="onFilterChange('zip')">压缩文件</el-tag>
                <el-tag class="tag" :class="{'tag-other': typeFilter.other}" @click="onFilterChange('other')">其他</el-tag>
            </el-form>
            <el-button class="search-button" @click="inFilter">Search</el-button>
        </el-col>
        <el-dialog
                class="dialog"
                :visible.sync="show"
                top="10vh"
                :show-close="false"
                :close-on-press-escape="false"
                ref="dialog">
            <item :data="commit" :tool="true" @on-share="onShare" @on-delete="onDelete"></item>
            <el-divider class="dialog_divider"></el-divider>
            <span slot="footer" class="dialog-footer">
                <el-button class="dialog_button" @click="show = false">Close</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import Item from "../components/Item";
    import List from "../components/List.vue";
    import axios from "axios";
    // hidden-xs-only需要用到
    import 'element-ui/lib/theme-chalk/display.css';
    import { Loading } from 'element-ui';

    export default {
        components: {Item, List},

        data() {
            return {
                data: [],
                count: 0,
                filter: {
                    name: "",
                    from: "",
                    to: ""
                },
                typeFilter: {
                    other: false,
                    img: false,
                    mov: false,
                    audio: false,
                    pdf: false,
                    doc: false,
                    zip: false
                },
                commit: {
                    seq: "",
                    title: "",
                    size: "",
                    time: "",
                    expire: "",
                    list: []
                },
                show: false
            }
        },

        mounted: function() {
            this.getCommitList(path + "/commits?p=0");
        },

        methods: {
            getCommitList: function(url) {
                const self = this;

                axios.get(url)
                    .then(function (response) {
                        let data = response.data;

                        if (data.code === 0) {
                            self.buildCommitList(data);
                        } else {
                            self.$notify({
                                message: data.msg + " : " + data.detail,
                                type: "warning"
                            });
                        }
                    })
                    .catch(function (error) {
                        self.$notify.error({
                            message: error.message,
                        });
                    });
            },

            buildCommitList: function(data) {
                if (data.list == null) {
                    return;
                }

                let list = [];
                data.list.forEach(function (item) {
                    let d = {
                        sequence: item.sequence,
                        title: item.name,
                        left: item.totalSize,
                        right: item.uploadTime,
                        encrypt: item.encrypt,
                        linkable: true
                    };
                    list.push(d);
                });
                this.data = list;
                this.count = data.count;
            },

            onFilterChange: function(type) {
                this.typeFilter[type] = !this.typeFilter[type];
                // this.$set(this.typeFilter, type, !this.typeFilter[type]);
            },

            onPageClick: function(page) {
                this.getCommitList(path + "/commits?p=" + page);
            },

            inFilter: function() {
                let type = "";
                for (let t in this.typeFilter) {
                    if (this.typeFilter[t])
                        type = type + "1";
                    else
                        type = type + "0";
                }

                let filter = "&n=" + this.filter.name
                    + "&s=" + this.filter.from
                    + "&e=" + this.filter.to
                    + "&f=" + type;
                this.getCommitList(path + "/commits?p=0" + filter, 0);
            },

            openItem: function(data) {
                if (data.encrypt) {
                    this.$prompt("Key：", {
                        showClose: false,
                        showCancelButton: false
                    }).then(({ value }) => {
                        this.doOpen(data.sequence, value);
                    }).catch(() => {});
                } else {
                    this.doOpen(data.sequence, "");
                }
            },

            doOpen: function(seq, key) {
                const self = this;

                let load = Loading.service({
                    target: this.$refs.dialog.$el.children[0]
                });
                this.show = true;

                let formData = new FormData();
                formData.append("key", key);

                axios.post(path + "/files/" + seq, formData, {
                    headers:{'Content-Type':'application/x-www-form-urlencoded'}
                }).then(function (response) {
                    let data = response.data;
                    if (data.code === 0) {
                        self.bindData(data);
                    } else {
                        self.$notify({
                            message: data.msg + " : " + data.detail,
                            type: "warning"
                        });
                        self.show = false;
                    }
                    load.close();
                }).catch(function(error) {
                    self.$notify.error({
                        message: error.message,
                    });
                    load.close();
                    self.show = false;
                });
            },

            bindData: function(data) {
                let list = [];
                for (let i = 0; i < data.files.length; ++i) {
                    list.push(Object.assign({
                        num: i + 1
                    }, data.files[i]));
                }

                this.commit = {
                    seq: data.sequence,
                    title: data.name,
                    size: data.totalSize,
                    time: data.uploadTime,
                    expire: data.expire === -1 ? "∞" : data.expire + "d",
                    list: list
                };
            },

            onShare: function(data) {
                const self = this;

                this.$prompt("有效期(1h-168h) :", {
                    showClose: false,
                    showCancelButton: true
                }).then(({ value }) => {
                    if (value >= 1 && value <= 168) {
                        this.$confirm('是否加密？', {
                            showClose: false,
                            type: 'info'
                        }).then(() => {
                            self.doShare(data.seq, value, true);
                        }).catch(() => {
                            self.doShare(data.seq, value, false);
                        });
                    } else {
                        self.$notify({
                            message: "¿",
                            type: "warning"
                        });
                    }
                }).catch(() => {});
            },

            doShare: function(seq, expire, encrypt) {
                const self = this;
                let data = {
                    expire: expire,
                    encrypt: encrypt
                };
                axios.post(path + "/files/share/" + seq, data)
                    .then(function (response) {
                        let data = response.data;

                        if (data.code === 0) {
                            if (data.key === "") {
                                self.$alert(data.url, {showClose: false});
                            } else {
                                self.$alert("链接 : " + data.url + "    Key : " + data.key, {showClose: false});
                            }
                        } else {
                            self.$notify({
                                message: data.msg + " : " + data.detail,
                                type: "warning"
                            });
                        }
                    })
                    .catch(function(error) {
                        self.$notify.error({
                            message: error.message,
                        });
                    });
            },

            onDelete: function(data) {
                const self = this;
                axios.post(path + "/files/delete/" + data.seq)
                    .then(function (response) {
                        let data = response.data;

                        if (data.code === 0) {
                            self.$notify({
                                message: data.msg,
                                type: 'success'
                            });
                        } else {
                            self.$notify({
                                message: data.msg + " : " + data.detail,
                                type: "warning"
                            });
                        }
                    })
                    .catch(function(error) {
                        self.$notify.error({
                            message: error.message,
                        });
                    });
            }
        }
    }
</script>

<style>
    .list {
        margin: 0 30px;
    }
    .filter-form {
        margin-bottom: 20px;
    }
    .el-form-item__label {
        font-size: small;
    }
    .el-form--label-top .el-form-item__label {
        padding: 0;
    }
    .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item {
        margin-bottom: 5px;
    }
    .el-date-editor.el-input {
        width: 100%;
    }

    .search-button {
        color: #303133;
        background: #ffffff;
        margin: 6px 12px 6px 0;
    }
    .search-button:hover {
        color: #303133;
        background: #ffffff;
        margin: 6px 12px 6px 0;
    }
    .search-button:focus {
        color: #303133;
        background: #ffffff;
        margin: 6px 12px 6px 0;
    }

    .tag {
        margin: 6px 12px 6px 0;
        background-color: white;
        border-color: #DCDFE6;
        color: #303133;
        height: 28px;
        line-height: 25px;
    }
    .tag:hover {
        cursor: pointer;
    }
    .tag-img {
        background-color: #f0ad4e;
        color: white;
    }
    .tag-mov {
        background-color: #d9534f;
        color: white;
    }
    .tag-audio {
        background-color: #b257d9;
        color: white;
    }
    .tag-pdf {
        background-color: #e1692a;
        color: white;
    }
    .tag-doc {
        background-color: #337ab7;
        color: white;
    }
    .tag-zip {
        background-color: #5cb85c;
        color: white;
    }
    .tag-other {
        background-color: #d2d2d2;
        color: white;
    }

    @media(max-width: 768px) {
        .dialog .el-dialog {
            width: 90%;
        }
    }

    .el-dialog {
        width: 75%;
    }

    .el-message-box__header {
        padding: 0;
    }

    .el-message-box__content {
        padding: 12px 15px 10px;
        color: #606266;
        font-size: 14px;
    }
    .el-message-box__errormsg {
        min-height: 0;
        margin-top: 0;
    }
    .el-message-box__btns {
        padding: 0 15px 0;
    }
</style>