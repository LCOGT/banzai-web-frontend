<template>
  <v-container>
    <v-subheader>
      <h3>
        <i>
          Use this pane to manually re-process images from a given site/camera
          and date range, based on some criteria.
        </i>
      </h3>
    </v-subheader>
    <StartEndDatePicker @input="onDateRangeChange"></StartEndDatePicker>
    <v-row>
      <v-col>
        <v-checkbox v-model="allFramesChecked" :label="'All Frames'" reactive>
        </v-checkbox>
      </v-col>
      <v-col>
        <v-checkbox
          v-model="missingFramesChecked"
          :label="'Missing Frames'"
          :disabled="allFramesChecked"
          reactive
        >
        </v-checkbox>
      </v-col>
      <v-col>
        <v-checkbox
          v-model="badWcsChecked"
          :label="'Bad WCS'"
          :disabled="allFramesChecked"
          reactive
        >
        </v-checkbox>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="8">
        <v-btn
          :disabled="!valid"
          color="success"
          class="mr-4"
          @click="getFrames"
        >
          Submit
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card :disabled="frameData.length === 0">
          <v-card-title>
            Frames Found
            <v-spacer> </v-spacer>
            <v-btn
              :disabled="selectedFrames.length === 0"
              :loading="reprocessLoading"
              color="warning"
              class="mr-4"
              @click="reprocess"
            >
              Reprocess!
            </v-btn>
          </v-card-title>
          <v-data-table
            v-model="selectedFrames"
            :headers="tableHeaders"
            :items="frameData"
            :loading="frameDataLoading"
            item-key="basename"
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
import StartEndDatePicker from '@/components/StartEndDatePicker.vue'
import {
  reportError,
  reportSuccess,
  generateReprocessConfirmationText,
} from '@/util'

export default {
  name: 'ReprocessPane',
  components: { StartEndDatePicker },
  data() {
    return {
      startDate: '',
      endDate: '',
      allFramesChecked: false,
      missingFramesChecked: false,
      badWcsChecked: false,
      selectedFrames: [],
      frameDataLoading: false,
      reprocessLoading: false,
      frameData: [],
      tableHeaders: [
        { text: 'Name', value: 'basename' },
        { text: 'Observation Type', value: 'configuration_type' },
        { text: 'Filter', value: 'primary_optical_element' },
      ],
    }
  },
  methods: {
    onDateRangeChange(value) {
      this.startDate = value.startDate
      this.endDate = value.endDate
    },
    getFrames() {
      this.frameData = []
      this.frameDataLoading = true
      let data = JSON.stringify({
        site: this.$store.state.selectedSite,
        instrument: this.$store.state.selectedInstrument,
        dayobs_start: this.startDate,
        dayobs_end: this.endDate,
        all_frames: this.allFramesChecked,
        missing_frames: this.missingFramesChecked,
        bad_wcs: this.badWcsChecked,
      })
      $.post({
        url: this.$store.state.urls.banzaiWebApiUrl + 'api/get_frame_list',
        data: data,
      })
        .done((response) => {
          this.frameDataLoading = false
          this.frameData = _.get(response, 'frames', [])
        })
        .fail((response) => {
          console.log(response.status)
          // TODO: Add nice error message if this fails
          reportError(`Got an error fetching frames. Contact a softie.`)
          this.frameDataLoading = false
        })
    },
    reprocess() {
      this.reprocessLoading = true
      let data = JSON.stringify({
        instrument: this.$store.state.selectedInstrument,
        frames: this.selectedFrames,
      })
      $.post({
        url:
          this.$store.state.urls.banzaiWebApiUrl + 'api/reprocess_frame_list',
        data: data,
      })
        .done((response) => {
          this.reprocessLoading = false
          this.selectedFrames = []
          reportSuccess(generateReprocessConfirmationText(response))
        })
        .fail((response) => {
          reportError(
            `Got an error adding frames to BANZAI reprocessing queue. Contact a softie.`
          )
          this.reprocessLoading = false
        })
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style></style>
