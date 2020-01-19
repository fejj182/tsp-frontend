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
      :value="connection"
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
    mapper: {
      type: Function
    }
  },
  computed: {
    items() {
      return this.connections.map(station => {
        return mapStation(station);
      });
    },
    connection() {
      const connectionId = this.$store.state.trip.connectionId;
      const connection = this.items.find(connection => {
        return connection.value.id === connectionId;
      });
      return connectionId ? connection : null;
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
