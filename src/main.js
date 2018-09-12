import Vue from 'vue'
import App from './App'

let Fly = require("flyio/dist/npm/wx")
let fly = new Fly;
// ...这里可以添加全局配置、拦截器等
// 将fly实例挂在vue原型上
Vue.prototype.$http = fly;

Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue(App)
app.$mount()
