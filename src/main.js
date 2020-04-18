import Vue from 'vue'
import App from './App'
import router from './router'
import './assets/styles/style.css'
import './assets/styles/global.scss'
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
