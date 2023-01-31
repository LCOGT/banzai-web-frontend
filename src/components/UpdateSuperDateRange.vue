<template>
  <v-container>
    <v-subheader>
      <h3>
        <i>
          Use this pane to update the "Good After" and "Good Until" parameters
          for any number of super calibrations in the BANZAI database. The "Good
          After" and "Good Until" define the time range for which a super
          calibration may be used. Any science frame whose DATE-OBS lies within
          this time range can be reduced using that master calibration.
        </i>
      </h3>
    </v-subheader>
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
          >{{ formatDateTime(goodAfter) }}</v-card
        >
      </v-col>
      <v-col>
        <v-card class="text-center" id="good-before-datepicker"
          ><v-card-subtitle> Good Until </v-card-subtitle
          >{{ formatDateTime(goodUntil) }}</v-card
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
          Reset Date Range Back to Default</v-btn
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
import { reportError } from '@/util'
import DateTimeMixin from '@/mixins/DateTimeMixin.js'

export default {
  name: 'UpdateSuperDateRange',
  mixins: [DateTimeMixin],
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
      selectedCalibrations: [],
      setRangeButtonBusy: false,
      goodAfter: moment.utc(),
      goodUntil: moment.utc(),
      defaultGoodAfter: moment.utc('1000-01-01 00:00:00', this.dateTimeFormat),
      defaultGoodUntil: moment.utc('3000-01-01 00:00:00', this.dateTimeFormat),
    }
  },
  mounted: function () {
    let datePickerOptions = {
      startDate: this.goodAfter,
      endDate: this.goodUntil,
      timePicker: true,
      singleDatePicker: true,
      locale: {
        format: this.dateTimeFormat,
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
  methods: {
    formatDateTime(date) {
      return date.format(this.dateTimeFormat)
    },
    onCalibrationSelected(payload) {
      this.selectedCalibrations = payload
    },
    submit(selectedCalibrations, goodAfter, goodUntil) {
      this.setRangeButtonBusy = true
      let data = JSON.stringify({
        instrument: this.$store.state.selectedInstrument,
        good_after: this.formatDateTime(goodAfter),
        good_until: this.formatDateTime(goodUntil),
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
        this.defaultGoodUntil
      )
    },
  },
}
</script>
