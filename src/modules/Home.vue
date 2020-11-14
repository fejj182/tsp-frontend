<template>
  <v-container fluid class="grey lighten-5" id="home">
    <v-row no-gutters v-if="splitScreen">
      <Welcome v-if="shouldWelcome" />
      <Map v-else-if="dataLoaded" />
    </v-row>

    <v-row no-gutters v-else>
      <v-col :md="4">
        <Welcome v-if="shouldWelcome" />
        <TripPanel v-else />
      </v-col>
      <v-col :md="8">
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
import CookieBanner from "@/modules/cookies/CookieBanner.vue";

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
      dataLoaded: false
    };
  },
  computed: {
    shouldWelcome() {
      return this.$route.name === "welcome" && this.$feature("welcomePanel");
    },
    connectionsExist() {
      return this.$store.getters.completeTrip.length > 0;
    },
    splitScreen() {
      return window.innerWidth < 992;
    }
  },
  created() {
    if (this.$route.name === "alias") {
      this.$store
        .dispatch("fetchTrip", { alias: this.$route.params.alias })
        .then(() => (this.dataLoaded = true));
    }
    if (
      this.$store.state.stations.startingStations.length === 0 &&
      this.$route.name !== "alias"
    ) {
      this.$store
        .dispatch("fetchStartingStations")
        .then(() => (this.dataLoaded = true));
    }
  },
  mounted() {
    this.setMobileViewportHeight();
  },
  methods: {
    setMobileViewportHeight() {
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    }
  }
};
</script>

<style scoped lang="scss">
.container,
.row {
  height: 100%;
}

#home {
  padding: 4px;
}

@media only screen and (max-width: $width-desktop) {
  #home {
    padding: 0;
  }
}
</style>
