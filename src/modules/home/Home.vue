<template>
  <v-container fluid class="grey lighten-5" id="home">
    <v-row no-gutters>
      <v-col v-if="!isMobile" :md="3" cols="12">
        <Welcome v-if="shouldWelcome" />
        <TripPanel v-else :showForm="true" :showFilters="connectionsExist" />
      </v-col>
      <v-col :md="9" cols="12">
        <Welcome v-if="isMobile && shouldWelcome" />
        <Map v-else />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Map from "@/modules/map/Map.vue";
import TripPanel from "@/modules/trip-panel/TripPanel.vue";
import Welcome from "@/modules/welcome/Welcome.vue";
// import CookieBanner from "@/modules/privacy/CookieBanner.vue";

export default {
  name: "home",
  components: {
    TripPanel,
    Welcome,
    Map
    // CookieBanner
  },
  data() {
    return {
      dataLoaded: false
    };
  },
  computed: {
    shouldWelcome() {
      //TODO: tripStarted no longer exists
      return (
        !this.$store.state.trip.tripStarted && this.$feature("welcomePanel")
      );
    },
    connectionsExist() {
      return this.$store.state.stations.activeConnections.length > 0;
    },
    isMobile() {
      return window.innerWidth < 600;
    }
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
#home {
  padding: 4px;
}

@media only screen and (max-width: 600px) {
  #home {
    padding: 0;
  }
}
</style>
