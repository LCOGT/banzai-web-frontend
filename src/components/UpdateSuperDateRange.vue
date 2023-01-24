<template>
  <v-container>
    <MarkCalibrations
      supers-only
      :calibration-table-headers="calibrationTableHeaders"
      @calibration-selected="onCalibrationSelected"
      ref="markCalibrations"
    ></MarkCalibrations>
    <v-row>
      <v-col>
        <v-card class="text-center" id="good-after-datepicker">
          <v-card-subtitle> Good After </v-card-subtitle
          >{{ goodAfter.format(this.dateFormat) }}</v-card
        >
      </v-col>
      <v-col>
        <v-card class="text-center" id="good-before-datepicker"
          ><v-card-subtitle> Good Until </v-card-subtitle
          >{{ goodUntil.format(this.dateFormat) }}</v-card
        >
      </v-col>
    </v-row>
    <v-row class="text-center">
      <v-col>
        <v-btn
          @click="updateDateRange"
          :loading="setRangeButtonBusy"
          color="success"
        >
          Update Date Range
        </v-btn>
      </v-col>
      <v-col>
        <v-btn
          @click="resetDateRange"
          :loading="setRangeButtonBusy"
          color="warning"
        >
          Reset Date Range</v-btn
        >
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import MarkCalibrations from '@/components/MarkCalibrations.vue'
import 'bootstrap-daterangepicker-v2'
import moment from 'moment'
import $ from 'jquery'
import { reportSuccess, reportError } from '@/util'
export default {
  name: 'UpdateSuperDateRange',
  components: {
    MarkCalibrations,
  },
  props: {
    items: {
      type: Array,
      optional: false,
    },
    label: { type: String, optional: false },
  },
  data() {
    return {
      calibrationTableHeaders: [
        { text: 'Name', value: 'filename' },
        { text: 'Observation Type', value: 'obstype' },
        { text: 'Is Bad', value: 'is_bad' },
        { text: 'Good After', value: 'good_after' },
        { text: 'Good Until', value: 'good_until' },
      ],
      goodAfter: moment.utc(),
      goodUntil: moment.utc(),
      selectedCalibrations: [],
      defaultGoodAfter: moment('1000-01-01 00:00:00Z', this.dateFormat).utc(),
      defaultgoodUntil: moment('3000-01-01 00:00:00Z', this.dateFormat).utc(),
      setRangeButtonBusy: false,
    }
  },
  mounted: function () {
    let datePickerOptions = {
      startDate: this.goodAfter,
      endDate: this.goodUntil,
      timePicker: true,
      singleDatePicker: true,
      locale: {
        format: this.dateFormat,
      },
      timePicker24Hour: true,
    }
    $('#good-after-datepicker').daterangepicker(datePickerOptions, (start) => {
      this.goodAfter = start
    })
    $('#good-before-datepicker').daterangepicker(datePickerOptions, (start) => {
      this.goodUntil = start
    })
  },
  computed: {
    dateFormat: function () {
      return 'yyyy-MM-DD HH:mm:ss'
    },
  },
  methods: {
    onCalibrationSelected(payload) {
      this.selectedCalibrations = payload
    },
    submit(selectedCalibrations, goodAfter, goodUntil) {
      this.setRangeButtonBusy = true
      let data = JSON.stringify({
        instrument: this.$store.state.selectedInstrument,
        good_after: goodAfter.format(this.dateFormat),
        good_until: goodUntil.format(this.dateFormat),
        frames: selectedCalibrations,
      })
      $.post({
        url:
          this.$store.state.urls.banzaiWebApiUrl +
          'api/update_super_date_range',
        data: data,
      })
        .done((response) => {
          // refresh child table to show updated dates
          this.$refs.markCalibrations.getCalibrationFrames()
          this.setRangeButtonBusy = false
        })
        .fail((response) => {
          reportError(
            `Error updating date range for selected super calibration(s)<br>
            Please contact a softie.`
          )
          this.setRangeButtonBusy = false
        })
    },
    updateDateRange() {
      this.submit(this.selectedCalibrations, this.goodAfter, this.goodUntil)
    },
    resetDateRange() {
      this.submit(
        this.selectedCalibrations,
        this.defaultGoodAfter,
        this.defaultgoodUntil
      )
    },
  },
}
</script>
