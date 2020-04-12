<template>
  <v-container fluid class="grey lighten-5 pa-1">
    <v-row no-gutters>
      <v-col :md="3" cols="12">
        <TripPanel />
      </v-col>
      <v-col :md="9" cols="12">
        <Map />
        <Markers />
        <Connections />
      </v-col>
    </v-row>
    <footer>
      <CookieBanner />
    </footer>
  </v-container>
</template>

<script>
import Map from "@/modules/map/Map.vue";
import Markers from "@/modules/map/markers/Markers.vue";
import Connections from "@/modules/map/connections/Connections.vue";
import TripPanel from "@/modules/trip-panel/TripPanel.vue";
import CookieBanner from "@/modules/privacy/CookieBanner.vue";

export default {
  name: "home",
  components: {
    TripPanel,
    Map,
    Markers,
    Connections,
    CookieBanner
  },
  created() {
    if (this.$route.name === "alias") {
      this.$store.dispatch("fetchTrip", { alias: this.$route.params.alias });
    }
    if (this.$route.name === "home") {
      this.$store.dispatch("fetchStartingStations");
    }
  }
};
</script>

<style scoped>
.container,
.row {
  height: 100%;
}
</style>
