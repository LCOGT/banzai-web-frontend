<template>
  <v-container>
    <v-form ref="form" v-model="valid">
      <v-row>
        <v-col cols="12" sm="6" md="4">
          <v-menu
            ref="startMenu"
            v-model="startMenu"
            :return-value.sync="startDate"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="startDate"
                label="Start Date (Inclusive)"
                prepend-icon="mdi-calendar"
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="startDate"
              reactive
              no-title
              scrollable
              @change="$refs.startMenu.save(startDate)"
            >
            </v-date-picker>
          </v-menu>
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="12" sm="6" md="4">
          <v-menu
            ref="endMenu"
            v-model="endMenu"
            :return-value.sync="endDate"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="endDate"
                label="End Date (Inclusive)"
                prepend-icon="mdi-calendar"
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="endDate"
              reactive
              no-title
              scrollable
              @change="$refs.endMenu.save(endDate)"
            >
            </v-date-picker>
          </v-menu>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <MultiSelect
            label="Calibration Type"
            :items="calibrationChoices"
            @input="onCalibrationInput"
          ></MultiSelect>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
          <v-btn
            :disabled="!valid"
            color="success"
            class="mr-4"
            @click="getCalibrationFrames"
          >
            Submit
          </v-btn>
          <v-btn color="error" class="mr-4" @click="reset"> Reset Form </v-btn>
        </v-col>
      </v-row>
    </v-form>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title>
            Super Calibration Frames Found <v-spacer></v-spacer>
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

export default {
  name: 'MarkCalibrations.vue',
  components: {
    MultiSelect,
  },
  props: {
    calibrationChoices: {
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
      includeSupers: {
        type: Boolean,
        required: false,
        default: true,
      },
    },
  },
  data: () => ({
    startDate: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    endDate: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    startMenu: false,
    endMenu: false,
    observationTypes: [],
    selectedCalibrationFrames: [],
    calibrationFrameData: [],
    valid: false,
    calibrationFrameDataLoading: false,
    markAsButtonsBusy: false,
  }),
  computed: {},
  methods: {
    getCalibrationFrames() {
      this.calibrationFrameDataLoading = true
      // grab form data and send to backend
      let data = JSON.stringify({
        site: this.$store.state.selectedSite,
        instrument: this.$store.state.selectedInstrument,
        dayobs_start: this.startDate,
        dayobs_end: this.endDate,
        calibration_types: this.observationTypes,
        include_supers: this.includeSupers,
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
          // TODO: Add nice error message if this fails
          console.log('error!' + response.code)
          this.calibrationFrameDataLoading = false
        })
    },
    reset() {
      this.$refs.form.reset()
      this.calibrationFrameData = []
      this.selectedCalibrationFrames = []
    },
    markFrame(markAs) {
      this.markAsLoading = true
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
          this.markAsLoading = false
          if (markAs === 'bad') {
            this.$emit('input', response)
          }
        })
        .fail((response) => {
          // TODO: Add nice error message if this fails
          console.log('error!' + response.code)
          this.markAsLoading = false
        })
    },
    onCalibrationInput(value) {
      this.observationTypes = value
    },
  },
}
</script>
