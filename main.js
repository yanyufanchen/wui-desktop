import App from './App'

// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
    ...App
})
app.$mount()
// #endif

import Uni from'./common/uni.js'
Vue.prototype.Uni=Uni
import Utils from './common/utils'
Vue.prototype.Utils = Utils
import Time from './common/time' // 时间转换工具
Vue.prototype.Time = Time
import Api from './common/api' // 请求云函数
Vue.prototype.Api = Api

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif