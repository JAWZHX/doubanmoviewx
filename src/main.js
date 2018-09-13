import Vue from 'vue'
import App from './App'

let Fly = require("flyio/dist/npm/wx")
let fly = new Fly;
// ...这里可以添加全局配置、拦截器等
// 将fly实例挂在vue原型上
Vue.prototype.$http = fly;

// 请求拦截器
fly.interceptors.request.use((request) => {
    wx.showLoading({
        title: '加载中...',
        mask: true
    });
    return request;
});

// 响应拦截器
fly.interceptors.response.use(
    (response) => {
        wx.hideLoading();
        return response;
    },
    (err) => {
        wx.hideLoading();
        return err;
    }
);

Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue(App)
app.$mount()
