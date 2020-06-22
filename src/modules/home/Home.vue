<template>
  <v-container fluid class="grey lighten-5" id="home">
    <v-row no-gutters>
      <v-col v-if="!mobile" :md="3" cols="12">
        <Welcome v-if="shouldWelcome" />
        <TripPanel v-else />
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
import Welcome from "@/modules/welcome/Welcome.vue";
import CookieBanner from "@/modules/privacy/CookieBanner.vue";

export default {
  name: "home",
  components: {
    TripPanel,
    Welcome,
    Map,
    CookieBanner
  },
  data() {
    return {
      dataLoaded: false,
      mobile: window.innerWidth < 600
    };
  },
  computed: {
    shouldWelcome() {
      return (
        !this.$store.state.trip.tripStarted &&
        process.env.VUE_APP_FT_WELCOME_PANEL_ACTIVE
      );
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
.container,
.row {
  height: 100%;
}

#home {
  padding: 4px;
}

@media only screen and (max-width: 600px) {
  #home {
    padding: 0;
  }
}
</style>
