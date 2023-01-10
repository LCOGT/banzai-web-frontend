<template>
    <div>
        <InstrumentSelect></InstrumentSelect>
        <b-card no-body>
        <b-tabs pills card vertical>
            <b-tab title="Reprocess" active>
            
            </b-tab>
            <b-tab title="Reprocess from Bad Super-Calibration">

            </b-tab>
            <b-tab title="Stack Calibrations">

            </b-tab>
            <b-tab title="Update Super Calibration Date Range">

            </b-tab>
        </b-tabs>
        </b-card>
    </div>
</template>

<script>
import InstrumentSelect from '@/components/InstrumentSelect';

export default {
    name: 'MainWindow',
    components: {
        InstrumentSelect
    }
  }
</script>
