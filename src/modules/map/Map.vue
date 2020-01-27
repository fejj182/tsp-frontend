<template>
  <div id="map"></div>
</template>

<script>
import L from "leaflet";

export default {
  data() {
    return {
      centreCoords: [40.7067997, 0.5801695],
      zoomLevel: screen.width > 600 ? 7 : 6,
      myMap: null,
      tileOptions: {
        attribution:
          'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: "mapbox.streets",
        accessToken: process.env.VUE_APP_OPEN_STREET_MAPS_KEY
      }
    };
  },
  mounted() {
    this.createMap();
    this.$emit("mapCreated", this.myMap);
  },
  methods: {
    createMap() {
      this.myMap = L.map("map");
      this.myMap.setView(this.centreCoords, this.zoomLevel);

      L.tileLayer(
        "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}",
        this.tileOptions
      ).addTo(this.myMap);

      this.myMap.on("click", this.onMapClick);
    },
    onMapClick(event) {
      this.$emit("mapClick", event);
    }
  }
};
</script>

<style scoped>
#map {
  width: 100%;
  height: 100%;
}

@media only screen and (max-width: 600px) {
  #map {
    height: 70vh;
  }
}
</style>
