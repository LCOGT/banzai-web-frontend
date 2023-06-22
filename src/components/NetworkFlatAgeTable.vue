<template>
  <v-container>
    <v-subheader>
      <h3>
        <i>
          Use this pane to view an on-demand network flat age table. Please be
          patient while the data loads, it may take a couple of minutes. Bear in
          mind once fetched, data is cached for 15 minutes.
        </i>
      </h3>
    </v-subheader>
    <v-row>
      <v-col>
        <v-btn :loading="dataLoading" @click="getFlatData" color="warning"
          >Fetch Flat Data
        </v-btn>
      </v-col>
    </v-row>
    <v-spacer></v-spacer>
    <div id="primary"></div>
    <div id="secondary"></div>
    <div id="muscat-primary"></div>
    <div id="muscat-secondary"></div>
  </v-container>
</template>

<script>
import $ from 'jquery'
import _ from 'lodash'
import Plotly, { layoutAttrOverrides } from 'plotly.js-dist'

export default {
  name: 'NetworkFlatAgeTable',
  data: function () {
    return {
      dataLoading: false,
    }
  },
  computed: {},
  mounted: function () {},
  methods: {
    getFlatData() {
      this.dataLoading = true
      $.get({
        url: this.$store.state.urls.banzaiWebApiUrl + 'api/all_flat_ages',
      })
        .done((response) => {
          this.dataLoading = false
          let primaryHeatmapData = this.getHeatmapData(response.primary_flats)
          let secondaryHeatmapData = this.getHeatmapData(
            response.secondary_flats
          )
          let primaryMuscatData = this.getHeatmapData(response.muscat_primary)
          let secondaryMuscatData = this.getHeatmapData(response.muscat_primary)

          Plotly.newPlot(
            document.getElementById('primary'),
            primaryHeatmapData,
            this.getLayoutData('Primary Readout Mode', primaryHeatmapData)
          )
          Plotly.newPlot(
            document.getElementById('secondary'),
            secondaryHeatmapData,
            this.getLayoutData('Secondary Readout Mode', secondaryHeatmapData)
          )
          Plotly.newPlot(
            document.getElementById('muscat-primary'),
            primaryMuscatData,
            this.getLayoutData('MuSCAT Primary', primaryMuscatData, true)
          )
          Plotly.newPlot(
            document.getElementById('muscat-secondary'),
            secondaryMuscatData,
            this.getLayoutData('MuSCAT Secondary', secondaryMuscatData, true)
          )
        })
        .fail((response) => {
          reportError(
            `Got an error retrieving flat data. Please try again. If problem persists, contact a softie.`
          )
          this.dataLoading = false
        })
    },
    getLayoutData(title, heatmapData, isMuscat) {
      var tickvals = [
        'SII',
        'air',
        'clear',
        'solar',
        'D51',
        'Skymapper-VS',
        'Astrodon-Exo',
        'H-Beta',
        'H-Alpha',
        'OIII',
        'w',
        'zs',
        'ip',
        'rp',
        'gp',
        'up',
        'I',
        'R',
        'V',
        'B',
        'U',
      ]
      var layout = {
        title: {
          text: title,
          yref: 'container',
          automargin: true,
        },
        annotations: [],
        xaxis: {
          side: 'top',
          showgrid: true,
        },
        yaxis: {
          autosize: true,
          showgrid: true,
          autotick: false,
          automargin: 'left',
        },
      }
      if (!isMuscat) {
        layout.yaxis.categoryarray = tickvals
        layout.yaxis.categoryorder = 'array'
      }

      heatmapData[0].x.forEach(function (value, i) {
        let result = {
          x: value,
          y: heatmapData[0].y[i],
          text: heatmapData[0].z[i],
          showarrow: false,
          font: {
            family: 'Arial',
            size: 12,
            color: 'rgb(0, 0, 0)',
          },
        }
        layout.annotations.push(result)
      })
      return layout
    },
    getHeatmapData(flatData) {
      let xLabels = []
      let yLabels = []
      let zData = []

      for (let record of flatData) {
        xLabels.push(`${record.x}-${record.record.configuration_mode}`)
        yLabels.push(record.y)
        zData.push(record.record.age)
      }
      return [
        {
          x: xLabels,
          y: yLabels,
          z: zData,
          zmin: 0,
          zmax: 1500, // we use 1500 as our zmax color space scale as it's a sufficiently high number to scale our colors correctly
          type: 'heatmap',
          hoverongaps: true,
          showscale: false,
          colorscale: [
            [0, 'rgb(147,196,125)'],
            [7 / _.max([_.max(zData), 1500]), 'rgb(255,217,102)'], // colors 7 and above should go yellow
            [14 / _.max([_.max(zData), 1500]), 'rgb(224, 102, 102)'], // colors 14 and above should go red
            [1, 'rgb(224, 102, 102)'],
          ],
        },
      ]
    },
  },
}
</script>
<style></style>
