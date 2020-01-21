<template>
  <v-container fluid class="grey lighten-5 pa-1">
    <v-row no-gutters>
      <v-col cols="3">
        <v-container>
          <TripForm />
        </v-container>
      </v-col>
      <v-col cols="9">
        <Map @mapClick="onMapClick" @mapCreated="onMapCreated" />
        <Markers :map="map" />
        <Connections :map="map" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Map from "@/modules/map/Map.vue";
import Markers from "@/modules/markers/Markers.vue";
import TripForm from "@/modules/trip/TripForm.vue";
import Connections from "@/modules/connections/Connections.vue";

export default {
  name: "home",
  data: function() {
    return {
      map: null
    };
  },
  components: {
    TripForm,
    Map,
    Markers,
    Connections
  },
  methods: {
    onMapClick(event) {
      const lat = event.latlng.lat;
      const lng = event.latlng.lng;
      this.$store.dispatch("resetTripForm");
      this.$store.dispatch("getNearestStation", { lat, lng });
    },
    onMapCreated(map) {
      this.map = map;
    }
  }
};
</script>

<style scoped>
#map,
.container,
.row {
  height: 100%;
}
</style>
