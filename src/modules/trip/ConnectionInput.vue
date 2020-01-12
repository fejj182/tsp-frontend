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
import mapStation from "./stationFormMapper";
export default {
  props: {
    connections: {
      type: Array
    },
    value: {
      type: Object
    },
    mapper: {
      type: Function
    }
  },
  computed: {
    items() {
      return this.connections.map(station => {
        return mapStation(station);
      });
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
