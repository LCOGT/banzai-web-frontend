<template>
  <v-container>
    <v-subheader>
      <h3>
        <i>
          Use this pane to manually mark individual calibrations as good or bad,
          and stack calibrations by type and date range.
        </i>
      </h3>
    </v-subheader>
    <v-expansion-panels multiple>
      <v-expansion-panel>
        <v-expansion-panel-header> Mark Calibrations </v-expansion-panel-header>
        <v-expansion-panel-content>
          <MarkCalibrations
            :calibration-type-options="calibrationTypeOptions"
          ></MarkCalibrations>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header>
          Stack Calibrations
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-row>
            <v-col>
              <MultiSelect
                :items="calibrationTypeOptions"
                @input="onCalibrationTypeInput"
                label="Calibration Types to Stack"
              >
              </MultiSelect>
            </v-col>
          </v-row>
          <v-row>
            <StartEndDatePicker
              @input="onDateRangeChange"
              enable-time-picker
            ></StartEndDatePicker>
          </v-row>
          <v-row class="justify-center">
            <v-btn
              color="warning"
              class="ma-4"
              @click="stackCalibrations"
              :disabled="selectedCalibrationTypes.length === 0"
              :loading="stackButtonBusy"
            >
              Stack Calibrations!
            </v-btn>
          </v-row>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>

<script>
import MarkCalibrations from '@/components/MarkCalibrations.vue'
import MultiSelect from '@/components/MultiSelect.vue'
import StartEndDatePicker from '@/components/StartEndDatePicker.vue'
import $ from 'jquery'
import { reportSuccess, reportError } from '@/util'

export default {
  name: 'StackCalibrations',
  components: {
    MarkCalibrations,
    MultiSelect,
    StartEndDatePicker,
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
      calibrationTypeOptions: [
        'BIAS',
        'DARK',
        'SKYFLAT',
        'LAMPFLAT',
        'DOUBLE',
        'BPM',
        'READNOISE',
      ],
      selectedCalibrationTypes: [],
      stackingStartDate: '',
      stackingEndDate: '',
      stackButtonBusy: false,
    }
  },
  methods: {
    onDateRangeChange(value) {
      this.stackingStartDate = value.startDate
      this.stackingEndDate = value.endDate
    },
    onCalibrationTypeInput(value) {
      this.selectedCalibrationTypes = value
    },
    stackCalibrations() {
      this.stackButtonBusy = true
      // grab form data and send to backend
      let data = JSON.stringify({
        site: this.$store.state.selectedSite,
        instrument: this.$store.state.selectedInstrument,
        start_date: this.stackingStartDate,
        end_date: this.stackingEndDate,
        calibration_types: this.selectedCalibrationTypes,
      })
      $.post({
        url: this.$store.state.urls.banzaiWebApiUrl + 'api/stack_frames',
        data: data,
      })
        .done((response) => {
          this.stackButtonBusy = false
          // TODO: Provide a link to most recent stacking tasks from backend
          reportSuccess(
            `Added ${
              _.get(response, 'tasks').length
            } stacking tasks to the BANZAI task queue`
          )
        })
        .fail((response) => {
          reportError(
            'Failed to add stacking tasks to BANZAI task queue. Please try again. If problem persists, contact a softie.'
          )
          this.stackButtonBusy = false
        })
    },
  },
}
</script>
