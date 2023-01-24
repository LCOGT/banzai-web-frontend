<template>
  <v-container :id="pickerElementId" class="text-center">
    <v-row>
      <v-col>
        <v-card>
          <v-card-subtitle> Start Date/Time </v-card-subtitle
          >{{ startDate.format(this.dateFormat) }}</v-card
        >
      </v-col>
      <v-spacer></v-spacer>
      <v-col>
        <v-card
          ><v-card-subtitle> End Date/Time</v-card-subtitle
          >{{ endDate.format(this.dateFormat) }}</v-card
        >
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import 'bootstrap-daterangepicker-v2'
import moment from 'moment'
import $ from 'jquery'

export default {
  name: 'StartEndDatePicker',
  props: {
    enableTimePicker: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return { startDate: moment.utc(), endDate: moment.utc() }
  },
  mounted: function () {
    let pickerElementId = `#${this.pickerElementId}`
    $(pickerElementId).daterangepicker(
      {
        timePicker: this.enableTimePicker,
        startDate: this.startDate,
        endDate: this.endDate,
        timePicker24Hour: true,
        opens: 'auto',
        locale: {
          format: this.dateFormat,
        },
      },
      (start, end) => {
        this.startDate = start
        this.endDate = end
        this.$emit('input', {
          startDate: start.format(this.dateFormat),
          endDate: end.format(this.dateFormat),
        })
      }
    )
  },
  computed: {
    dateFormat: function () {
      return this.enableTimePicker ? 'yyyy-MM-DD HH:mm:ss' : 'yyyy-MM-DD'
    },
    pickerElementId: function () {
      return 'date-range-picker-' + this._uid
    },
    pickerStyle: function () {
      return 'display: inline-flex; text-align: right;'
    },
  },
  methods: {},
}
</script>
<!-- <style>
.daterangepicker .clearfix {
  display: inline-flex;
}

.daterangepicker .apply-cancel-buttons {
  text-align: right;
}
</style> -->
