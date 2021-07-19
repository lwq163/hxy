import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import util from '_m/util'
import tabMenu from '_c/tab-menu'
import modalBtn from '_c/modalBtn/modalBtn'
import modalUpLoad from '_c/modalUpLoad/index'
import lookFile from '_c/lookFile/index'
import treeSelect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import tranFer from '_c/Transfer/Transfer'

//粒子背景
// import VueParticles from 'vue-particles'
//移动端调试器  需要使用 直接解开注释
// import Vconsole from 'vconsole'
// const vConsole = new Vconsole()
// Vue.use(vConsole)

import ViewUI from 'view-design'
import 'view-design/dist/styles/iview.css'

//移动端适配
import 'lib-flexible'

// import VueAwesomeSwiper from 'vue-awesome-swiper'
// import 'swiper/swiper-bundle.css'

// Vue.use(VueAwesomeSwiper)
Vue.use(ViewUI)

import permission from '@/directive/permission'
Vue.use(permission)

//阻止启动生产消息，常用作指令
Vue.config.productionTip = false
// 注册全局方法
Vue.prototype.filterDict = (data,type) => util.filterDict(data,type)
Vue.prototype.axiosPost = (url,params,fileName) => util.axiosPost(url,params,fileName)
Vue.prototype.formatDate = (date) => util.formatDate(date)
Vue.prototype.formatTime = (date) => util.formatTime(date)
Vue.prototype.validateRole = (name) => util.validateRole(name)
Vue.prototype.$util = util;

// 注册全局组件
Vue.component('treeSelect', treeSelect)
Vue.component('tabMenu', tabMenu)
Vue.component('modalBtn', modalBtn)
Vue.component('modalUpLoad', modalUpLoad)
Vue.component('tranFer', tranFer)
Vue.component('lookFile', lookFile)
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
