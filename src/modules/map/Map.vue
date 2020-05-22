<template>
  <div id="map">
    <div v-if="myMap">
      <Markers :map="myMap" />
      <Lines v-if="tripStarted" :map="myMap" />
    </div>
  </div>
</template>

<script>
import L from "leaflet";
import paneConfigs from "@/modules/map/panes/paneConfigs";
import { displayPanesInRange } from "@/modules/map/panes/paneUtils";
import Markers from "@/modules/map/markers/Markers.vue";
import Lines from "@/modules/map/lines/Lines.vue";

export default {
  components: {
    Markers,
    Lines
  },
  data() {
    return {
      centreCoords: [40.7067997, 0.5801695],
      zoomLevel: window.innerWidth > 600 ? 7 : 6,
      myMap: null,
      tileOptions: {
        attribution:
          'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        minZoom: 5,
        // TODO: minZoom 6 causes big performance issues
        maxZoom: 10,
        id: "mapbox.streets",
        accessToken: process.env.VUE_APP_OPEN_STREET_MAPS_KEY
      },
      panes: {}
    };
  },
  mounted() {
    const trip = this.completeTrip;
    if (trip.length > 0) {
      const centreStop = trip[Math.floor((trip.length - 1) / 2)];
      this.createMap([centreStop.lat, centreStop.lng], 6);
    } else {
      this.createMap(this.centreCoords, this.zoomLevel);
    }
    this.createPanes();
  },
  computed: {
    activeDurationRange() {
      return this.$store.state.filters.activeDurationRange;
    },
    completeTrip() {
      return this.$store.getters.completeTrip;
    },
    tripStarted() {
      return this.$store.state.trip.savedTrip.length > 0;
    }
  },
  methods: {
    createMap(centreCoords, zoomLevel) {
      this.myMap = L.map("map");
      this.myMap.setView(centreCoords, zoomLevel);

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
    }
  },
  watch: {
    activeDurationRange(range) {
      displayPanesInRange(this.panes, range);
    },
    completeTrip(trip) {
      if (trip.length > 0) {
        const stop = trip[trip.length - 1];
        const coords = [stop.lat, stop.lng];
        const durationSecs = trip.length == 1 ? 0.75 : 1.5;
        this.myMap.flyTo(coords, 6, {
          duration: durationSecs,
          easeLinearity: 0.1
        });
      } else {
        this.myMap.flyTo(this.centreCoords, 7, {
          duration: 1.5,
          easeLinearity: 0.1
        });
      }
    }
  }
};
</script>

<style scoped>
#map {
  width: 100%;
  height: calc(100vh - 64px - 8px);
}

@media only screen and (max-width: 600px) {
  #map {
    height: calc(100vh - 56px);
  }
}
</style>
