<template>
    <div>
        <el-col class="login" :sm="{span: 8, offset: 8}" :xs="{span: 16, offset: 4}">
            <el-input type="password" v-model="passCode" @keyup.enter.native="login" :disabled="disable">
                <el-button slot="append" icon="el-icon-arrow-right" @click="login"></el-button>
            </el-input>
        </el-col>
    </div>
</template>

<script>
    import axios from "axios";
    import qs from "querystring";

    export default {
        data() {
            return {
                disable: true,
                passCode: ""
            }
        },

        mounted: function() {
            const self = this;

            axios.get(path + "/try")
                .then(function (response) {
                    let data = response.data;
                    if (data.code === 0)
                        self.$router.push(path + "/home");
                    else {
                        self.disable = false;
                    }
                });
        },

        methods: {
             login: function() {
                 const self = this;

                 let data = {code: this.passCode};
                 axios.post(path + "/verify", qs.stringify(data), {headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
                     .then(function (response) {
                         let data = response.data;
                         if (data.code === 0)
                             self.$router.push(path + "/home");
                         else {
                             self.$notify({
                                 message: "Error Passcode",
                                 type: "warning"
                             });
                         }
                     });
            }
        }
    }
</script>

<style>
</style>