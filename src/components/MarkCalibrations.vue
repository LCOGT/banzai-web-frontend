<template>
  <v-container>
    <StartEndDatePicker @input="onDateRangeChange"></StartEndDatePicker>
    <v-row>
      <v-col>
        <MultiSelect
          label="Calibration Type"
          :items="calibrationTypeOptions"
          @input="onCalibrationTypeInput"
        ></MultiSelect>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6">
        <v-btn
          :disabled="this.selectedCalibrationTypes.length === 0"
          color="success"
          class="mr-4"
          @click="getCalibrationFrames"
        >
          Submit
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title>
            Calibration Frames Found <v-spacer></v-spacer>
            <v-btn
              :disabled="selectedCalibrationFrames.length === 0"
              :loading="markAsButtonsBusy"
              color="warning"
              class="mr-4"
              @click="markFrame('bad')"
            >
              Mark as bad
            </v-btn>
            <v-btn
              :disabled="selectedCalibrationFrames.length === 0"
              :loading="markAsButtonsBusy"
              color="warning"
              class="mr-4"
              @click="markFrame('good')"
            >
              Mark as good
            </v-btn>
          </v-card-title>
          <v-data-table
            v-model="selectedCalibrationFrames"
            :headers="calibrationTableHeaders"
            :items="calibrationFrameData"
            :loading="calibrationFrameDataLoading"
            item-key="filename"
            @input="onCalibrationFrameSelected"
            show-select
            search
          >
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import $ from 'jquery'
import _ from 'lodash'
import MultiSelect from '@/components/MultiSelect.vue'
import StartEndDatePicker from '@/components/StartEndDatePicker.vue'
import { reportError } from '@/util'

export default {
  name: 'MarkCalibrations',
  components: {
    MultiSelect,
    StartEndDatePicker,
  },
  props: {
    calibrationTypeOptions: {
      type: Array,
      required: false,
      default() {
        return ['BIAS', 'DARK', 'SKYFLAT', 'LAMPFLAT', 'DOUBLE']
      },
    },
    calibrationTableHeaders: {
      type: Array,
      required: false,
      default() {
        return [
          { text: 'Name', value: 'filename' },
          { text: 'Observation Type', value: 'obstype' },
          { text: 'Is Bad', value: 'is_bad' },
        ]
      },
    },
    supersOnly: {
      type: Boolean,
    },
  },
  data() {
    return {
      selectedCalibrationTypes: [],
      selectedCalibrationFrames: [],
      calibrationFrameData: [],
      startDate: '',
      endDate: '',
      valid: false,
      calibrationFrameDataLoading: false,
      markAsButtonsBusy: false,
    }
  },
  computed: {},
  methods: {
    onCalibrationTypeInput(value) {
      this.selectedCalibrationTypes = value
    },
    onDateRangeChange(value) {
      this.startDate = value.startDate
      this.endDate = value.endDate
    },
    getCalibrationFrames() {
      this.calibrationFrameDataLoading = true
      // grab form data and send to backend
      let data = JSON.stringify({
        site: this.$store.state.selectedSite,
        instrument: this.$store.state.selectedInstrument,
        dayobs_start: this.startDate,
        dayobs_end: this.endDate,
        calibration_types: this.selectedCalibrationTypes,
        supers_only: this.supersOnly,
      })
      $.post({
        url:
          this.$store.state.urls.banzaiWebApiUrl + 'api/get_calibration_frames',
        data: data,
      })
        .done((response) => {
          this.calibrationFrameDataLoading = false
          this.calibrationFrameData = _.get(response, 'frames', [])
        })
        .fail((response) => {
          reportError(`Error retrieving calibration frames. Contact a softie.`)
          this.calibrationFrameDataLoading = false
        })
    },
    onCalibrationFrameSelected(payload) {
      this.$emit('calibration-selected', payload)
    },
    markFrame(markAs) {
      this.markAsButtonsBusy = true
      let data = JSON.stringify({
        frames: this.selectedCalibrationFrames,
        mark_as: markAs,
        instrument: this.$store.state.selectedInstrument,
      })
      $.post({
        url:
          this.$store.state.urls.banzaiWebApiUrl +
          'api/mark_calibration_frames',
        data: data,
      })
        .done((response) => {
          this.getCalibrationFrames()
          this.markAsButtonsBusy = false
          if (markAs === 'bad') {
            this.$emit('input', response.frames_marked)
          }
        })
        .fail((response) => {
          reportError(`Error marking selected frames. Please contact a softie.`)
          this.markAsButtonsBusy = false
        })
    },
  },
}
</script>
