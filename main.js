import App from './App'
import store from './store/index.js'
import ElementUI from 'element-ui'
import './static/css/normalize.css'
import './common.scss'
import 'element-ui/lib/theme-chalk/reset.css'
import 'element-ui/lib/theme-chalk/index.css'
import 'element-ui/lib/theme-chalk/base.css';
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition';
Vue.component(CollapseTransition.name, CollapseTransition)
import 'element-ui/lib/theme-chalk/display.css' // elment
import 'font-awesome/css/font-awesome.min.css' // font
// 全局自动注册应用组件
import './global.js'
import './static/css/iconfont.css'

// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
Vue.prototype.$store = store
import { Loading } from 'element-ui';
Vue.prototype.Loading = Loading
Vue.use(ElementUI)






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
Api.VM=app // 将实例化挂载到api上
Vue.prototype.Api = Api
import drag from './common/drag';
Vue.use(drag)
import Web_api from './common/web_api.js'
Vue.prototype.Web_api = Web_api
const $BusEvent=new Vue()
Vue.prototype.$BusEvent=$BusEvent
// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif