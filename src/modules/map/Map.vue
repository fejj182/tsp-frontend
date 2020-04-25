<template>
  <div id="map">
    <Markers :map="myMap" />
    <Connections :map="myMap" />
  </div>
</template>

<script>
import L from "leaflet";
import paneConfigs from "@/modules/map/panes/paneConfigs";
import Markers from "@/modules/map/markers/Markers.vue";
import Connections from "@/modules/map/connections/Connections.vue";

export default {
  components: {
    Markers,
    Connections
  },
  data() {
    return {
      centreCoords: [40.7067997, 0.5801695],
      zoomLevel: 7,
      myMap: null,
      tileOptions: {
        attribution:
          'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: "mapbox.streets",
        accessToken: process.env.VUE_APP_OPEN_STREET_MAPS_KEY
      },
      panes: {}
    };
  },
  mounted() {
    this.createMap();
    this.createPanes();
  },
  methods: {
    createMap() {
      this.myMap = L.map("map");
      this.myMap.setView(this.centreCoords, this.zoomLevel);

      L.tileLayer(
        "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}",
        this.tileOptions
      ).addTo(this.myMap);
    },
    createPanes() {
      for (let i = 0; i < paneConfigs.NUMBER_OF_PANES; i++) {
        const paneName = `p${i}`;
        const pane = this.myMap.createPane(paneName);
        // https://leafletjs.com/reference-1.6.0.html#map-pane - set z index in between 600 and 700
        if (pane) {
          pane.style.zIndex = 650;
        }
        this.panes[paneName] = pane;
      }

      this.$store.dispatch("addPanes", this.panes);
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
