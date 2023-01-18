<template>
  <v-container>
    <MarkCalibrations @input="getRelatedFrames"> </MarkCalibrations>
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
    <v-snackbar v-model="confirmationDialog" multi-line :timeout="10000">
      {{ confirmationText }}</v-snackbar
    >
  </v-container>
</template>

<script>
import $ from 'jquery'
import _ from 'lodash'
import MarkCalibrations from '@/components/MarkCalibrations.vue'

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
      confirmationText: '',
      confirmationDialog: false,
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
        frames: framesMarked,
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
