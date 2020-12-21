<template>
  <div id="home">
    <v-row no-gutters v-if="isMobile">
      <Map data-test-id="map" />
      <TripOverlay data-test-id="trip-overlay" />
    </v-row>

    <v-row no-gutters v-else>
      <v-col :md="4">
        <TripPanel />
      </v-col>
      <v-col :md="8">
        <Map />
      </v-col>
    </v-row>
  </div>
</template>

<script>
//TODO: No longer need for dynamic imports, rename component to Planner
const Map = () => import("@/modules/map/Map.vue");
const TripPanel = () => import("@/modules/trip-panel/TripPanel.vue");
const TripOverlay = () => import("@/modules/trip-panel/TripOverlay.vue");

export default {
  name: "home",
  components: {
    TripPanel,
    TripOverlay,
    Map
  },
  computed: {
    isMobile() {
      return window.innerWidth < 992;
    }
  },
  created() {
    if (this.$route.name === "alias") {
      this.$store.dispatch("fetchTrip", { alias: this.$route.params.alias });
    } else if (!this.$store.state.trip.startingStation) {
      this.$router.push("/");
    }
  }
};
</script>

<style lang="scss" scoped>
#home {
  padding: 0.25rem;
}
@media only screen and (max-width: $width-desktop) {
  #home {
    padding: 0;
  }
}
</style>
