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
          <v-checkbox
            v-model="allFramesSelected"
            :label="'All Frames'"
            reactive
          >
          </v-checkbox>
        </v-col>
        <v-col>
          <v-checkbox
            v-model="missingFramesSelected"
            :label="'Missing Frames'"
            :disabled="allFramesSelected"
            reactive
          >
          </v-checkbox>
        </v-col>
        <v-col>
          <v-checkbox
            v-model="badWcsSelected"
            :label="'Bad WCS'"
            :disabled="allFramesSelected"
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
          <v-btn color="warning" class="mr-4" @click="reset">
            Reprocess!
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
    <v-row>
      <v-col>
        <v-data-table> </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import $ from 'jquery'

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
      allFramesSelected: false,
      missingFramesSelected: false,
      badWcsSelected: false,
      // TODO: Add some validation to the form.
      valid: false,
      frameDataLoading: false,
      frameData: {},
    }
  },
  computed: {},
  mounted() {},
  methods: {
    submit() {
      // grab form data and send to backend
      let data = JSON.stringify({
        site: this.$store.state.selectedSite,
        instrument: this.$store.state.selectedInstrument,
        dayobs_start: this.startDate,
        dayobs_end: this.endDate,
        all_frames: this.allFramesSelected,
        missing_frames: this.missingFramesSelected,
        bad_wcs: this.badWcsSelected,
      })
      $.ajax({
        url: this.$store.state.urls.banzaiWebApiUrl + 'api/get_frame_list',
        method: 'POST',
        contentType: 'application/json',
        data: data,
        always: function () {
          this.frameDataLoading = true
        },
        success: function (response) {
          this.frameDataLoading = false
          this.frameData = response
        },
        error: function () {
          console.log('error!')
        },
      })
    },
    reset() {
      this.$refs.form.reset()
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style></style>
