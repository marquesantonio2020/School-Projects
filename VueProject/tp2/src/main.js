import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import axios from 'axios'

require('@/store/authenticating')

Vue.config.productionTip = false
Vue.prototype.$axios = axios

store.dispatch('auth/reauthentication', localStorage.getItem('user'))

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
