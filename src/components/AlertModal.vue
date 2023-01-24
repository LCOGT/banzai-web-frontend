<template>
  <v-snackbar v-model="show" :color="modalColor" multi-line :timeout="timeout">
    <div v-html="modalMessage"></div>
    <template v-slot:action="{ attrs }">
      <v-btn color="blue" text v-bind="attrs" @click="show = false">
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>
<script>
import { bus } from '@/main.js'

export default {
  name: 'AlertModal',
  data: function () {
    return {
      show: false,
      modalColor: 'success',
      modalMessage: '',
      timeout: 10000,
    }
  },
  created: function () {
    bus.$on('report-error', this.handleError)
    bus.$on('report-success', this.handleSuccess)
  },
  computed: {},
  methods: {
    handleError(payload) {
      this.modalColor = 'error'
      this.modalMessage = payload.message
      this.show = true
    },
    handleSuccess(payload) {
      this.modalColor = 'success'
      this.modalMessage = payload.message
      this.show = true
    },
  },
}
</script>
