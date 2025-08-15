<template>
  <v-container>
    <v-row>
      <v-col :cols="2">
        <v-card>
          <v-card-title>
            <p class="text-h6 text--primary">
              Select a <br />site and <br />instrument
            </p></v-card-title
          >
          <v-card-text
            >Instruments are pulled directly from the BANZAI
            Database</v-card-text
          >
        </v-card>
      </v-col>
      <v-divider vertical></v-divider>
      <v-col>
        <InstrumentSelect></InstrumentSelect>
      </v-col>
    </v-row>
    <v-row>
      <v-col :cols="2">
        <v-card>
          <v-card-title>
            <p class="text-h6 text--primary">
              What would <br />you like to do?
            </p></v-card-title
          >
          <v-card-text>Select a workflow for more information!</v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col :cols="2">
        <v-card>
          <v-card-title>
            <p class="text-h6 text--primary">Find a request:</p>
          </v-card-title>
          <v-text-field v-model="reqnum" label="Request" class="mx-4">
          </v-text-field>
          <v-btn @click="loadRequest" variant="outlined">Request #</v-btn>
          <v-btn @click="loadGroup">Group #</v-btn>
        </v-card>
      </v-col>
      <v-divider vertical></v-divider>
      <v-col>
        <v-expansion-panels multiple>
          <v-expansion-panel>
            <v-expansion-panel-header>
              Reprocess Images
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <ReprocessPane></ReprocessPane>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-header>
              Reprocess Images from Bad Super-Calibration
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <BadSuperCalReprocessPane></BadSuperCalReprocessPane>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-header>
              Stack Calibrations
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <StackCalibrations></StackCalibrations>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-header>
              Update Super-Calibration Usable Date Range
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <UpdateSuperDateRange></UpdateSuperDateRange>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-header>
              View Skyflat Information
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <FlatAgeTable></FlatAgeTable>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-header>
              View Network-Wide Skyflat Table
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <NetworkFlatAgeTable></NetworkFlatAgeTable>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
    <AlertModal></AlertModal>
  </v-container>
</template>

<script>
import InstrumentSelect from '@/components/InstrumentSelect.vue'
import ReprocessPane from '@/components/ReprocessPane.vue'
import BadSuperCalReprocessPane from '@/components/BadSuperCalReprocessPane.vue'
import StackCalibrations from '@/components/StackCalibrations.vue'
import UpdateSuperDateRange from '@/components/UpdateSuperDateRange.vue'
import AlertModal from '@/components/AlertModal.vue'
import FlatAgeTable from '@/components/FlatAgeTable.vue'
import NetworkFlatAgeTable from '@/components/NetworkFlatAgeTable.vue'

export default {
  name: 'MainWindow',
  components: {
    InstrumentSelect,
    ReprocessPane,
    BadSuperCalReprocessPane,
    StackCalibrations,
    UpdateSuperDateRange,
    AlertModal,
    FlatAgeTable,
    NetworkFlatAgeTable,
  },
  data() {
    return {
      reqnum: '',
    }
  },
  computed: {
    noInstrumentSelected: function () {
      return (
        this.$store.state.selectedInstrument === undefined &&
        this.$store.state.selectedSite === undefined
      )
    },
  },
  mounted() {},
  methods: {
    loadRequest() {
      if (this.reqnum != '') {
        let requestURL = 'https://observe.lco.global/requests/' + this.reqnum
        window.open(requestURL, '_blank')
      }
    },
    loadGroup() {
      if (this.reqnum != '') {
        let requestURL =
          'https://observe.lco.global/requestgroups/' + this.reqnum
        window.open(requestURL, '_blank')
      }
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style></style>
