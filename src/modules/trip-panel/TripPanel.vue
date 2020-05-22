<template>
  <v-container>
    <v-expansion-panels focusable v-model="panel" multiple>
      <v-expansion-panel v-if="tripStarted" data-test-id="filter-panel">
        <v-expansion-panel-header>
          Filter
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <ConnectionFilters />
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel data-test-id="trip-form-panel">
        <v-expansion-panel-header>
          Trip Plan
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <TripForm />
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>

<script>
import ConnectionFilters from "@/modules/filters/ConnectionFilters.vue";
import TripForm from "@/modules/trip/TripForm.vue";

export default {
  components: {
    ConnectionFilters,
    TripForm
  },
  data() {
    return {
      panel: [0, 1],
      info: false
    };
  },
  mounted() {
    if (this.$route.name === "home") {
      this.info = true;
      setTimeout(() => {
        this.info = false;
      }, 7500);
    }
  },
  computed: {
    connectionsExist() {
      return this.$store.state.stations.activeConnections.length > 0;
    },
    tripStarted() {
      return this.$store.state.trip.savedTrip.length > 0;
    }
  }
};
</script>

<style lang="scss" scoped>
.v-expansion-panel-header {
  min-height: 32px !important;
}
</style>
