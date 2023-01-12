<template>
  <v-form>
    <v-container>
      <v-row>
        <v-col>
          <v-autocomplete
            :items="availableSites"
            @change="updateAvailableInstruments"
            :loading="instrumentsLoading"
            :label="'Site Code'"
          >
          </v-autocomplete>
        </v-col>
        <v-col>
          <v-autocomplete
            :items="availableInstruments"
            :loading="instrumentsLoading"
            :label="'Instrument Code'"
            @change="onInstrumentChange"
          >
          </v-autocomplete>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
import _ from 'lodash'

export default {
  name: 'InstrumentSelect',
  props: {},
  data() {
    return {
      availableInstruments: [],
      instrumentsLoading: true,
    }
  },
  computed: {
    availableSites: function () {
      if (this.instrumentsLoading) {
        return []
      } else {
        return Object.keys(this.$store.state.instrumentData)
      }
    },
  },
  mounted() {
    this.$store
      .dispatch('getInstrumentData')
      .then(() => {
        this.instrumentsLoading = false
      })
      .catch(() => {
        console.log('Failed to retrieve instrument data')
      })
  },
  methods: {
    updateAvailableInstruments(value) {
      this.availableInstruments = _.get(this.$store.state.instrumentData, value)
      this.$store.commit('setSelectedSite', value)
    },
    onInstrumentChange(value) {
      this.$store.commit('setSelectedInstrument', value)
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style></style>
