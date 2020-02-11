<template>
  <v-container fluid class="grey lighten-5 pa-1">
    <v-row no-gutters>
      <v-col :md="3" cols="12">
        <v-container>
          <TripForm />
        </v-container>
      </v-col>
      <v-col :md="9" cols="12">
        <Map />
        <Markers />
        <Connections />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Map from "@/modules/map/Map.vue";
import Markers from "@/modules/map/markers/Markers.vue";
import Connections from "@/modules/map/connections/Connections.vue";
import TripForm from "@/modules/trip/TripForm.vue";

export default {
  name: "home",
  components: {
    TripForm,
    Map,
    Markers,
    Connections
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
