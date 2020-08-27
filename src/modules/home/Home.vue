<template>
  <v-container fluid class="grey lighten-5" id="home">
    <v-row no-gutters>
      <v-col v-if="!isMobile" :md="4" cols="12">
        <Welcome v-if="shouldWelcome" />
        <TripPanel v-else />
      </v-col>
      <v-col :md="8" cols="12">
        <Welcome v-if="isMobile && shouldWelcome" />
        <Map v-else />
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
import { resetMapSize } from "@/plugins/leaflet.js";

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
    shouldFetchStartingStations() {
      return this.$store.state.stations.startingStations.length === 0;
    },
    connectionsExist() {
      return this.$store.getters.completeTrip.length > 0;
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
    if (this.shouldFetchStartingStations) {
      this.$store
        .dispatch("fetchStartingStations")
        .then(() => (this.dataLoaded = true));
    }
  },
  mounted() {
    if (!this.shouldWelcome) {
      resetMapSize();
    }
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
