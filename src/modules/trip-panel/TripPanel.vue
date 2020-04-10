<template>
  <v-container>
    <v-fade-transition>
      <v-alert
        data-test-id="info"
        color="teal"
        v-if="info"
        dark
        text
        dense
        icon="mdi-school"
        dismissible
      >
        Click on a station to get started.
      </v-alert>
    </v-fade-transition>
    <v-expansion-panels focusable v-model="panel" multiple>
      <v-expansion-panel v-if="connectionsExist" data-test-id="filter-panel">
        <v-expansion-panel-header>
          Max Journey Time (hours)
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <ConnectionFilters />
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel data-test-id="trip-form-panel">
        <v-expansion-panel-header>
          Plan Your Trip
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
    }
  }
};
</script>

<style lang="scss" scoped>
.v-expansion-panel-header {
  min-height: 32px !important;
}
</style>
