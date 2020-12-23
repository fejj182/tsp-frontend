<template>
  <div id="planner" v-if="!loading">
    <v-row no-gutters v-if="$smallScreen()">
      <Map data-test-id="map-mobile" />
      <TripOverlay data-test-id="trip-overlay" />
    </v-row>

    <v-row no-gutters v-else>
      <v-col :md="4">
        <TripPanel data-test-id="trip-panel" />
      </v-col>
      <v-col :md="8">
        <Map data-test-id="map-desktop" />
      </v-col>
    </v-row>
  </div>
</template>

<script>
const Map = () => import("@/modules/map/Map.vue");
const TripPanel = () => import("@/modules/trip-panel/TripPanel.vue");
const TripOverlay = () => import("@/modules/trip-panel/TripOverlay.vue");

export default {
  name: "planner",
  components: {
    TripPanel,
    TripOverlay,
    Map
  },
  data() {
    return {
      loading: false
    };
  },
  created() {
    if (this.$route.name === "alias") {
      this.loading = true;
      this.$store
        .dispatch("fetchTrip", { alias: this.$route.params.alias })
        .then(() => {
          this.loading = false;
        });
    } else if (!this.$store.state.trip.startingStation) {
      this.$router.push("/");
    }
  }
};
</script>

<style lang="scss" scoped>
#planner {
  padding: 0.25rem;
}
@media only screen and (max-width: $width-desktop) {
  #planner {
    padding: 0;
  }
}
</style>
