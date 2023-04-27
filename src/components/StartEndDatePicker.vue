<template>
  <v-row justify="center">
    <date-picker
      v-model="selectedTimeRange"
      range
      :clearable="false"
      :format="pickerFormat"
      @change="onDatePickerChange"
      :type="pickerType"
      class="my-4"
    >
      <template v-slot:input>
        <v-container>
          <v-row>
            <v-col md="6">
              <v-card class="text-center">
                <v-card-subtitle> Start Date/Time </v-card-subtitle
                >{{ formatDate(startDate) }}</v-card
              >
            </v-col>
            <v-spacer></v-spacer>
            <v-col md="6">
              <v-card class="text-center"
                ><v-card-subtitle> End Date/Time</v-card-subtitle
                >{{ formatDate(endDate) }}</v-card
              >
            </v-col>
          </v-row>
        </v-container>
      </template>
    </date-picker>
  </v-row>
</template>

<script>
import moment from 'moment'
import DateTimeMixin from '@/mixins/DateTimeMixin.js'
import DatePicker from 'vue2-datepicker'
import 'vue2-datepicker/index.css'

export default {
  name: 'StartEndDatePicker',
  components: { DatePicker },
  mixins: [DateTimeMixin],
  props: {
    enableTimePicker: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return { selectedTimeRange: [new Date(), new Date()] }
  },
  mounted: function () {
    // emit an initial signal to set the parent component's start/end date
    this.$emit('input', {
      startDate: this.formatDate(moment(this.selectedTimeRange[0])),
      endDate: this.formatDate(moment(this.selectedTimeRange[1])),
    })
  },
  computed: {
    startDate: function () {
      return moment(this.selectedTimeRange[0])
    },
    endDate: function () {
      return moment(this.selectedTimeRange[1])
    },
    pickerType: function () {
      return this.enableTimePicker ? 'datetime' : 'date'
    },
    pickerFormat: function () {
      return this.enableTimePicker ? this.dateTimeFormat : this.dateFormat
    },
  },
  methods: {
    onDatePickerChange: function () {
      this.$emit('input', {
        startDate: this.formatDate(moment(this.selectedTimeRange[0])),
        endDate: this.formatDate(moment(this.selectedTimeRange[1])),
      })
    },
    formatDate(date) {
      return this.enableTimePicker
        ? date.format(this.dateTimeFormat)
        : date.format(this.dateFormat)
    },
  },
}
</script>
<style>
.mx-icon-calendar {
  display: none;
}
</style>
