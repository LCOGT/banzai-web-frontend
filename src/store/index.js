import Vue from 'vue'
import Vuex from 'vuex'
import $ from 'jquery'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    urls: {},
  },
  mutations: {
    setRuntimeConfig(state, payload) {
      state.urls = payload
    },
    setInstrumentData(state, payload) {
      state.instrumentData = payload
    },
    setSelectedSite(state, payload) {
      state.selectedSite = payload
    },
    setSelectedInstrument(state, payload) {
      state.selectedInstrument = payload
    },
  },
  actions: {
    getInstrumentData(context) {
      return new Promise((resolve, reject) => {
        $.ajax({
          url: context.state.urls.banzaiWebApiUrl + 'api/instruments',
          crossDomain: true,
          success: function (response) {
            context.commit('setInstrumentData', response)
            resolve(response)
          },
          error: function (response) {
            reject(response)
          },
        })
      })
    },
  },
  modules: {},
})
