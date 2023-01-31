<template>
  <v-container>
    <v-subheader>
      <h3>
        <i>
          Use this pane to manually mark individual super calibrations as bad.
          Once you have marked them, a list of affected frames will be
          presented, which can be queued up for re-processing.
        </i>
      </h3>
    </v-subheader>
    <MarkCalibrations @input="getRelatedFrames" supers-only> </MarkCalibrations>
    <v-row>
      <v-col>
        <v-card :disabled="relatedFrameData.length === 0">
          <v-card-title>
            Related Frames
            <v-spacer></v-spacer>
            <v-btn
              :disabled="selectedRelatedFrames.length === 0"
              :loading="reprocessLoading"
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
  </v-container>
</template>

<script>
import $ from 'jquery'
import _ from 'lodash'
import MarkCalibrations from '@/components/MarkCalibrations.vue'
import {
  reportError,
  reportSuccess,
  generateReprocessConfirmationText,
} from '@/util'

export default {
  name: 'BadSuperCalReprocessPane',
  components: {
    MarkCalibrations,
  },
  data() {
    return {
      selectedRelatedFrames: [],
      relatedFrameDataLoading: false,
      reprocessLoading: false,
      relatedFrameData: [],
      relatedFrameTableHeaders: [
        { text: 'Name', value: 'basename' },
        { text: 'Observation Type', value: 'configuration_type' },
        { text: 'Filter', value: 'primary_optical_element' },
      ],
    }
  },
  computed: {},
  methods: {
    getRelatedFrames(framesMarked) {
      this.relatedFrameDataLoading = true
      let data = JSON.stringify({
        frames_marked: framesMarked,
      })
      $.post({
        url: this.$store.state.urls.banzaiWebApiUrl + 'api/get_related_frames',
        data: data,
      })
        .done((response) => {
          this.relatedFrameDataLoading = false
          this.relatedFrameData = response.frames
        })
        .fail((response) => {
          reportError(`Error loading related frames. Please contact a softie.`)
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
