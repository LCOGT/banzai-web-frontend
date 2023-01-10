<template>
    <b-container fluid>
        <b-row>
            <b-col>
                <SimpleSelect></SimpleSelect>
            </b-col>
            <b-col>
                <SimpleSelect></SimpleSelect>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
import SimpleSelect from '@/components/SimpleSelect';

export default {
    name: 'InstrumentSelect',
    components: {
        SimpleSelect
    }
  }
</script>
