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
      <cookie-law theme="blood-orange--rounded">
        <div slot="message">
          We use cookies to ensure that we give you the best experience on our
          website. If you continue to use this site we will assume that you are
          happy with it.
        </div>
      </cookie-law>
    </footer>
  </v-container>
</template>

<script>
import Map from "@/modules/map/Map.vue";
import Markers from "@/modules/map/markers/Markers.vue";
import Connections from "@/modules/map/connections/Connections.vue";
import TripPanel from "@/modules/trip-panel/TripPanel.vue";
import CookieLaw from "vue-cookie-law";

export default {
  name: "home",
  components: {
    TripPanel,
    Map,
    Markers,
    Connections,
    CookieLaw
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
<style>
.Cookie {
  padding: 1rem;
  justify-content: center;
}

.Cookie .Cookie__button {
  padding: 0.5em 1.75em;
}
</style>
