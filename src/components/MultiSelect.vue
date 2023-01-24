<template>
  <v-select
    v-model="value"
    :items="items"
    :label="label"
    attach
    chips
    deletable-chips
    multiple
    @change="onChange"
  ></v-select>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      optional: false,
    },
    label: { type: String, optional: false },
  },
  data() {
    return {
      value: [],
    }
  },
  methods: {
    onChange(value) {
      this.$emit('input', value)
    },
  },
}
</script>
