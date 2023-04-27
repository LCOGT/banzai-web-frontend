<template>
  <v-container>
    <v-row>
      <v-col>
        <v-btn :loading="dataLoading" @click="getFlatData" color="warning"
          >Fetch Flat Data</v-btn
        >
      </v-col>
    </v-row>
    <v-spacer></v-spacer>
    <v-row>
      <v-col>
        <v-data-table
          :items="filteredFlatData"
          :search="search"
          :loading="dataLoading"
          :headers="headers"
          group-by="configuration_mode"
          :footer-props="{ disablePagination: true, itemsPerPageOptions: [-1] }"
        >
          <template v-slot:item.latest_image_archive_url="{ item }">
            <v-btn
              :href="item.latest_image_archive_url"
              target="_blank"
              width="auto"
              height="auto"
              color="#0b3053"
              class="archive-button my-2 mx-2"
              dark
            >
              <v-container>
                <v-row>
                  <v-img
                    max-height="150"
                    max-width="150"
                    src="../assets/lco_dqi_logo.png"
                  />
                </v-row>
              </v-container>
            </v-btn>
          </template>
          <template v-slot:item.age="{ item }">
            <v-chip :color="getAgeColor(item.age)" dark>
              {{ item.age }}
            </v-chip>
          </template>
          <template v-slot:item.ds9_uri="{ item }">
            <v-btn color="blue" density="compact" dark :href="item.ds9_uri">
              Open constituent images
              <v-container>
                <v-row>
                  <v-col>
                    <v-img
                      max-height="30"
                      max-width="30"
                      src="../assets/ds9_logo.png"
                    />
                  </v-col>
                </v-row>
              </v-container>
            </v-btn>
          </template>
          <template v-slot:top>
            <v-row>
              <v-col md="9">
                <v-text-field
                  v-model="search"
                  label="Search"
                  class="mx-4"
                ></v-text-field>
              </v-col>
              <v-col>
                <v-checkbox
                  v-model="oldFlatsHidden"
                  label="Hide flats older than 100 days"
                >
                </v-checkbox>
              </v-col>
            </v-row>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import $ from 'jquery'

export default {
  name: 'FlatAgeTable',
  data: function () {
    return {
      dataLoading: false,
      flatAgeData: [],
      oldFlatsHidden: true,
      search: '',
      headers: [
        { text: 'Filter', value: 'filter' },
        {
          text: 'Configuration Mode',
          value: 'configuration_mode',
          sortable: false,
        },
        { text: 'Age (days)', value: 'age' },
        { text: 'Observation Date', value: 'observation_date' },
        { text: 'Open in DS9', value: 'ds9_uri', sortable: false },
        {
          text: 'Link to latest images',
          value: 'latest_image_archive_url',
          sortable: false,
        },
      ],
    }
  },
  computed: {
    filteredFlatData: function () {
      return this.flatAgeData.filter((item) => {
        return item.age > 100 && this.oldFlatsHidden ? false : true
      })
    },
  },
  methods: {
    getFlatData() {
      this.dataLoading = true
      let data = JSON.stringify({
        instrument: this.$store.state.selectedInstrument,
      })
      $.post({
        url: this.$store.state.urls.banzaiWebApiUrl + 'api/flat_ages',
        data: data,
      })
        .done((response) => {
          this.dataLoading = false
          this.flatAgeData = response.flats
        })
        .fail((response) => {
          reportError(
            `Got an error retrieving flat data. Please try again. If problem persists, contact a softie.`
          )
          this.dataLoading = false
        })
    },
    getAgeColor(age) {
      if (age < 7) {
        return 'green'
      } else if (age < 14) {
        return 'yellow'
      } else {
        return 'red'
      }
    },
  },
}
</script>
