<template>
  <v-container>
    <v-row>
      <v-col :cols="2">
        <h2>Select a site/instrument</h2>
      </v-col>
      <v-col>
        <InstrumentSelect></InstrumentSelect>
      </v-col>
    </v-row>
    <v-row>
      <v-col :cols="2">
        <h2>What would you like to do?</h2>
      </v-col>
      <v-col>
        <v-expansion-panels>
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

export default {
  name: 'MainWindow',
  components: {
    InstrumentSelect,
    ReprocessPane,
    BadSuperCalReprocessPane,
    StackCalibrations,
    UpdateSuperDateRange,
    AlertModal,
  },
  data() {
    return {}
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
  methods: {},
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style></style>
