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
            :items="availableCalibrationTypes"
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
            @click="submit"
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
              :loading="markAsLoading"
              color="warning"
              class="mr-4"
              @click="markFrame('bad')"
            >
              Mark as bad
            </v-btn>
            <v-btn
              :disabled="selectedCalibrationFrames.length === 0"
              :loading="markAsLoading"
              color="warning"
              class="mr-4"
              @click="markFrame('good')"
            >
              Mark as good
            </v-btn>
          </v-card-title>
          <v-data-table
            v-model="selectedCalibrationFrames"
            :headers="calibrationFrameTableHeaders"
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
    <v-row>
      <v-col>
        <v-card :disabled="relatedFrameData.length === 0">
          <v-card-title>
            Related Frames
            <v-spacer></v-spacer>
            <v-btn
              :disabled="selectedRelatedFrames.length === 0"
              :loading="markAsLoading"
              color="warning"
              class="mr-4"
              @click="reprocess"
            >
              Reprocess!
            </v-btn>
          </v-card-title>
          <v-card-subtitle>
            Once you have marked a frame as bad, any images reduced with that
            frame are shown here.
          </v-card-subtitle>
          <v-data-table
            v-model="selectedRelatedFrames"
            :headers="relatedFrameTableHeaders"
            :items="relatedFrameData"
            :loading="relatedFrameDataLoading"
            item-key="filename"
            show-select
            search
          >
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
    <v-snackbar v-model="confirmationDialog" multi-line :timeout="10000">
      {{ confirmationText }}</v-snackbar
    >
  </v-container>
</template>

<script>
import $ from 'jquery'
import _ from 'lodash'
import MultiSelect from '@/components/MultiSelect.vue'

export default {
  name: 'BadSuperCalReprocessPane',
  components: {
    MultiSelect,
  },
  props: {},
  data() {
    return {
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
      selectedRelatedFrames: [],
      // TODO: Add some validation to the form.
      valid: false,
      calibrationFrameDataLoading: false,
      relatedFrameDataLoading: false,
      markAsLoading: false,
      confirmationText: '',
      confirmationDialog: false,
      calibrationFrameData: [],
      relatedFrameData: [],
      calibrationFrameTableHeaders: [
        { text: 'Name', value: 'filename' },
        { text: 'Observation Type', value: 'obstype' },
        { text: 'Is Bad', value: 'is_bad' },
      ],
      relatedFrameTableHeaders: [
        { text: 'Name', value: 'basename' },
        { text: 'Observation Type', value: 'configuration_type' },
        { text: 'Filter', value: 'primary_optical_element' },
      ],
      availableCalibrationTypes: [
        'BIAS',
        'DARK',
        'SKYFLAT',
        'LAMPFLAT',
        'DOUBLE',
      ],
    }
  },
  computed: {},
  methods: {
    onCalibrationInput(value) {
      this.observationTypes = value
    },
    submit() {
      this.calibrationFrameDataLoading = true
      // grab form data and send to backend
      let data = JSON.stringify({
        site: this.$store.state.selectedSite,
        instrument: this.$store.state.selectedInstrument,
        dayobs_start: this.startDate,
        dayobs_end: this.endDate,
        calibration_types: this.observationTypes,
        include_supers: true,
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
      this.reprocessLoading = false
      this.calibrationFrameData = []
      this.relatedFrameData = []
      this.selectedCalibrationFrames = []
      this.selectedRelatedFrames = []
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
          this.submit()
          this.markAsLoading = false
          if (markAs === 'bad') {
            let context = this
            this.getRelatedFrames(response.frames_marked, context)
          }
        })
        .fail((response) => {
          // TODO: Add nice error message if this fails
          console.log('error!' + response.code)
          this.markAsLoading = false
        })
    },
    getRelatedFrames(framesMarked) {
      this.relatedFrameDataLoading = true
      let data = JSON.stringify({
        frames: framesMarked,
      })
      $.post({
        url: this.$store.state.urls.banzaiWebApiUrl + 'api/get_related_frames',
        data: data,
      })
        .done((response) => {
          console.log(response.frames)
          this.relatedFrameDataLoading = false
          this.relatedFrameData = response.frames
        })
        .fail((response) => {
          // TODO: Add nice error message if this fails
          console.log('error!' + response.code)
          this.relatedFrameDataLoading = false
        })
    },
    reprocess() {
      this.reprocessLoading = true
      let data = JSON.stringify({
        instrument: this.$store.state.selectedInstrument,
        frames: this.selectedRelatedFrames,
      })
      $.post({
        url:
          this.$store.state.urls.banzaiWebApiUrl + 'api/reprocess_frame_list',
        data: data,
      })
        .done((response) => {
          this.reprocessLoading = false
          this.generateConfirmationPopup(response)
        })
        .fail((response) => {
          // TODO: Add nice error message if this fails
          console.log('error!' + response.code)
          this.reprocessLoading = false
        })
    },
    generateConfirmationPopup(response) {
      this.confirmationText = response.kibana_url
      this.confirmationDialog = true
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style></style>
