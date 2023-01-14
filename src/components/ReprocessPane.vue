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
            @click="submit"
          >
            Submit
          </v-btn>
          <v-btn color="error" class="mr-4" @click="reset"> Reset Form </v-btn>
        </v-col>
        <v-col>
          <v-btn
            :disabled="selectedFrames.length === 0"
            :loading="reprocessLoading"
            color="warning"
            class="mr-4"
            @click="reprocess"
          >
            Reprocess!
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
    <v-row>
      <v-col>
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

export default {
  name: 'ReprocessPane',
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
      allFramesChecked: false,
      missingFramesChecked: false,
      badWcsChecked: false,
      selectedFrames: [],
      // TODO: Add some validation to the form.
      valid: false,
      frameDataLoading: false,
      reprocessLoading: false,
      confirmationText: '',
      confirmationDialog: false,
      frameData: [],
      tableHeaders: [
        { text: 'Name', value: 'basename' },
        { text: 'Observation Type', value: 'configuration_type' },
        { text: 'Filter', value: 'primary_optical_element' },
      ],
    }
  },
  computed: {},
  methods: {
    submit() {
      this.frameData = []
      this.frameDataLoading = true
      // grab form data and send to backend
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
          // TODO: Add nice error message if this fails
          console.log('error!' + response.code)
          this.frameDataLoading = false
        })
    },
    reset() {
      this.$refs.form.reset()
      this.reprocessLoading = false
      this.frameData = []
      this.selectedFrames = []
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
          this.generateConfirmationPopup(response)
        })
        .fail((response) => {
          // TODO: Add nice error message if this fails
          console.log('error!' + response.code)
          this.reprocessLoading = false
        })
    },
    generateConfirmationPopup(response) {
      let confirmationText = 'foo'
      this.confirmationDialog = true
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style></style>
