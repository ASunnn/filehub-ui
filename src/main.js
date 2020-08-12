import Vue from 'vue';
import VueRouter from "vue-router";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue';
import Error from "./template/Error";
import Login from "./template/Login.vue";
import Index from "./template/Index.vue";
import Home from "./template/Home.vue";
import List from "./template/List.vue";
import Share from "./template/Share.vue";
import S from "./template/S.vue";

Vue.use(VueRouter);
Vue.use(ElementUI, { size: 'small'});

window.path = "/filehub";

const router = new VueRouter({
    mode: 'history',
    routes: [{
        path: path + "/login",
        name: "login",
        component: Login
    }, {
        path: path + "/index",
        name: "index",
        redirect: '/home',
        component: Index
    }, {
        path: path + "/",
        redirect: path + "/home",
        component: Index,
        children: [{
            path: path + "/home",
            name: "home",
            component: Home
        }, {
            path: path + "/list",
            name: "list",
            component: List
        }, {
            path: path + "/copy",
            name: "share",
            component: Share
        }]
    }, {
        path: path + "/s/:id",
        name: "s",
        component: S
    }, {
        path: "*",
        name: "error",
        component: Error
    }]
});

new Vue({
    router,
    render: h => h(App)
}).$mount('#app');