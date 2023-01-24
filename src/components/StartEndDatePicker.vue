<template>
  <v-container :id="pickerElementId" class="text-center">
    <v-row>
      <v-col>
        <v-card>
          <v-card-subtitle> Start Date/Time </v-card-subtitle
          >{{ formatDate(startDate) }}</v-card
        >
      </v-col>
      <v-spacer></v-spacer>
      <v-col>
        <v-card
          ><v-card-subtitle> End Date/Time</v-card-subtitle
          >{{ formatDate(endDate) }}</v-card
        >
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import 'bootstrap-daterangepicker-v2'
import moment from 'moment'
import $ from 'jquery'
import DateTimeMixin from '@/mixins/DateTimeMixin.js'

export default {
  name: 'StartEndDatePicker',
  mixins: [DateTimeMixin],
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
        // emit a signal to update the parent component's start/end date
        this.$emit('input', {
          startDate: this.formatDate(start),
          endDate: this.formatDate(end),
        })
      }
    )
    // emit an initial signal to set the parent component's start/end date
    this.$emit('input', {
      startDate: this.formatDate(this.startDate),
      endDate: this.formatDate(this.endDate),
    })
  },
  computed: {
    pickerElementId: function () {
      // generate a unique ID for each datepicker element
      return 'date-range-picker-' + this._uid
    },
    pickerStyle: function () {
      return 'display: inline-flex; text-align: right;'
    },
  },
  methods: {
    formatDate(date) {
      return this.enableTimePicker
        ? date.format(this.dateTimeFormat)
        : date.format(this.dateFormat)
    },
  },
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
