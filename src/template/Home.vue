<template>
    <div>
        <el-form ref="form" :model="form" label-position="top" label-width="12.5%">
            <el-form-item label="Name">
                <el-input v-model="form.name" placeholder="name"></el-input>
            </el-form-item>
            <el-form-item label="Key">
                <el-input v-model="form.key" placeholder="key" :disabled="!encrypt"></el-input>
            </el-form-item>
            <el-form-item label="保留时限">
                <el-input style="width: 40%" v-model="form.expire" type="number" placeholder="单位：d"></el-input>
            </el-form-item>
            <el-form-item>
                <el-checkbox v-model="encrypt">加密</el-checkbox>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="upload">Submit</el-button>
            </el-form-item>
        </el-form>
        <el-col :span="24">
            <el-upload :auto-upload="false" :on-change="refreshFiles" action="/index" drag multiple>
                <div class="upload-tip">将文件拖到此处，或点击上传</div>
            </el-upload>
        </el-col>

        <el-dialog
                :visible.sync="uploading"
                width="30%"
                top="10vh"
                :show-close="false"
                :close-on-press-escape="false">
            <el-progress :text-inside="true" :stroke-width="20" :percentage="progress" color="#909399"></el-progress>
            <el-divider class="dialog_divider"></el-divider>
            <span slot="footer" class="dialog-footer">
                <el-button class="dialog_button" v-show="!isComplete" @click="cancelUpload">Cancel</el-button>
                <el-button class="dialog_button" v-show="isComplete" type="primary" @click="completeUpload">OK</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import axios from "axios";

    export default {
        data() {
            return {
                form: {
                    name: "",
                    key: "",
                    expire: ""
                },
                encrypt: false,
                files: [],
                // 上传相关
                config: null,
                uploading: false,
                progress: 0,
                isComplete: false,
                cancel: null
            }
        },

        beforeMount: function() {
            const self = this;
        },

        methods: {
            refreshFiles: function(file, fileList) {
                this.files = fileList;
            },

            upload: function() {
                const self = this;

                const CancelToken = axios.CancelToken;
                this.cancel = CancelToken.source();
                this.config = {
                    headers:{'Content-Type':'multipart/form-data'},
                    cancelToken: this.cancel.token,
                    onUploadProgress: function(e) {
                        if (e.lengthComputable) {
                            self.progress = parseInt(((e.loaded / e.total) * 100).toFixed());
                        } else {
                            self.progress = 100;
                        }
                    }
                };

                axios.post(path + "/upload", this.getUploadData(), this.config)
                    .then(function(response) {
                        let data = response.data;

                        if (data.code === 0) {
                            self.progress = 100;
                            self.isComplete = true;
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
                    }).catch(function(error) {
                        if (axios.isCancel(error)) {
                            // console.log("冇事发生");
                            return;
                        }
                        self.$notify.error({
                            message: error.message
                        });
                        self.progress = 100;
                    });

                this.uploading = true;
            },

            getUploadData: function() {
                let formData = new FormData();
                this.files.forEach(function(val, key) {
                    formData.append("file", val.raw);
                });
                formData.append("name", this.form.name);
                formData.append("key", this.form.key);
                formData.append("expire", this.form.expire === "" ? "0" : this.form.expire);

                return formData;
            },

            cancelUpload: function() {
                this.cancel.cancel();
                this.uploading = false;
            },

            completeUpload: function() {
                window.location.reload();
            }
        }
    }
</script>

<style>
    .el-upload {
        width: 100%;
    }

    .el-upload-dragger {
        width: 100%;
        height: 100px;
    }

    .upload-tip {
        font-size: 20px;
        margin-top: 10px;
        color: #777;
    }

    .v-modal {
        opacity: 0.3;
    }
    .el-dialog__header {
         padding: 0;
    }
    .el-dialog__body {
        padding: 15px 15px 0 15px;
    }
    .el-dialog__body .dialog_divider {
        margin: 15px 0 0 0;
    }
    .el-dialog__footer {
        padding: 5px 0;
    }
    .el-dialog__footer .dialog_button {
        margin: 4px 12px 4px 0;
        padding: 6px 12px;
    }
</style>