<template>
  <v-container fluid class="grey lighten-5 pa-1">
    <v-row no-gutters>
      <v-col :md="3" cols="12">
        <TripPanel />
      </v-col>
      <v-col :md="9" cols="12">
        <Map v-if="dataLoaded" />
      </v-col>
    </v-row>
    <footer>
      <CookieBanner />
    </footer>
  </v-container>
</template>

<script>
import Map from "@/modules/map/Map.vue";
import TripPanel from "@/modules/trip-panel/TripPanel.vue";
import CookieBanner from "@/modules/privacy/CookieBanner.vue";

export default {
  name: "home",
  components: {
    TripPanel,
    Map,
    CookieBanner
  },
  data() {
    return {
      dataLoaded: false
    };
  },
  created() {
    if (this.$route.name === "alias") {
      this.$store
        .dispatch("fetchTrip", { alias: this.$route.params.alias })
        .then(() => (this.dataLoaded = true));
    }
    if (this.$route.name === "home") {
      this.$store
        .dispatch("fetchStartingStations")
        .then(() => (this.dataLoaded = true));
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
