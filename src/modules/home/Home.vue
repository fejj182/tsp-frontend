<template>
  <v-container fluid class="grey lighten-5 pa-1">
    <v-row no-gutters>
      <v-col :md="3" cols="12">
        <v-container>
          <TripForm />
        </v-container>
      </v-col>
      <v-col :md="9" cols="12">
        <Map @mapClick="onMapClick" @mapCreated="onMapCreated" />
        <Markers :map="map" />
        <Connections :map="map" />
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
      this.$store.dispatch("resetTrip");
      this.$store.dispatch("getNearestStation", { lat, lng });
    },
    onMapCreated(map) {
      this.map = map;
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
