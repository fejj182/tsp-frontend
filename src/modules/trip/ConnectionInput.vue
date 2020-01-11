<template>
  <div>
    <v-autocomplete
      label="Where next?"
      class="connection"
      data-test-id="destination-2"
      :items="items"
      filled
      rounded
      @change="onChangeConnection"
      :value="value"
    ></v-autocomplete>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array
    },
    value: {
      type: Object
    },
    mapper: {
      type: Function
    }
  },
  methods: {
    onChangeConnection(station) {
      this.$store.dispatch("selectConnection", station);
    }
  }
};
</script>

<style lang="scss" scoped></style>
