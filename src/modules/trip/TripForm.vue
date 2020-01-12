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
    <StartInput @alert="onAlert" />
    <div v-for="stop in stops" :key="stop.position">
      <ConnectionInput :connections="stop.connections" :value="connection" />
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
    activeConnections() {
      const connections = this.$store.state.stations.activeConnections;
      return connections.map(station => {
        return mapStation(station);
      });
    },
    connection() {
      const connectionId = this.$store.state.tripform.connectionId;
      const connection = this.activeConnections.find(connection => {
        return connection.value.id === connectionId;
      });
      return connectionId ? connection : null;
    },
    stops() {
      return this.$store.state.tripform.stops;
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
