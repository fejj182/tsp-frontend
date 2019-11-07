<template>
  <div id="map"></div>
</template>

<script>
export default {
  data() {
    return {
      centreCoords: [40.7067997, 0.5801695],
      zoomLevel: 8,
      myMap: null
    };
  },
  mounted() {
    this.myMap = L.map("map").setView(this.centreCoords, this.zoomLevel);
    this.addInitialTile();
  },
  methods: {
    addInitialTile() {
      L.tileLayer(
        "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}",
        {
          attribution:
            'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
          maxZoom: 18,
          id: "mapbox.streets",
          accessToken: process.env.VUE_APP_OPEN_STREET_MAPS_KEY
        }
      ).addTo(this.myMap);
    }
  }
};
</script>

<style scoped>
#map {
  width: 100%;
  height: 100%;
}
</style>
