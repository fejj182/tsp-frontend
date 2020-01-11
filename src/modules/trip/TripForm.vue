<template>
  <v-form ref="form">
    <v-alert
      data-test-id="alert"
      v-if="alert"
      v-model="alert"
      dismissible
      type="error"
    >
      Service down. Please try again later.
    </v-alert>
    <StartInput @alert="onAlert" :value="activeStation" />
    <div v-if="activeStation">
      <ConnectionInput :items="connections" :value="connection" />
    </div>
    <v-btn
      v-if="connection"
      @click="onAddConnection"
      data-test-id="add-destination"
      color="indigo"
      rounded
      outlined
    >
      <v-icon left>mdi-plus</v-icon>
      <span>Add destination</span>
    </v-btn>
  </v-form>
</template>

<script>
import StartInput from "./StartInput.vue";
import ConnectionInput from "./ConnectionInput.vue";
import mapStation from "./stationFormMapper";

export default {
  components: {
    StartInput,
    ConnectionInput
  },
  data() {
    return {
      alert: false
    };
  },
  computed: {
    activeStation() {
      let station = this.$store.state.stations.activeStation;
      if (station) {
        station = mapStation(station);
      }
      return station;
    },
    connections() {
      const connections = this.$store.state.stations.connections;
      return connections.map(station => {
        return mapStation(station);
      });
    },
    connection() {
      const connectionId = this.$store.state.tripform.connectionId;
      const connection = this.connections.find(connection => {
        return connection.value.id === connectionId;
      });
      return connectionId ? connection : null;
    }
  },
  methods: {
    onAddConnection() {},
    onAlert() {
      this.alert = true;
    }
  }
};
</script>

<style lang="scss" scoped></style>
