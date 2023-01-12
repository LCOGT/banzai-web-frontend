import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import store from './store';
import $ from 'jquery'

Vue.config.productionTip = false

$.ajax({
  method: 'GET',
  url: '/config/config.json'
}).done(function(data) {
  store.commit('setRuntimeConfig', {
    archiveApiToken: process.env.VUE_APP_ARCHIVE_API_TOKEN || data.archiveApiToken,
    archiveApiUrl: process.env.ARCHIVE_API_URL ||  data.archiveApiUrl,
    banzaiWebApiUrl: process.env.BANZAI_WEB_API_URL || data.banzaiWebApiUrl
  });
  new Vue({
    store,
    vuetify,
    render: h => h(App)
  }).$mount('#app')
})
