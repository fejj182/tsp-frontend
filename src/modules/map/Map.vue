<template>
  <div id="map">
    <div v-if="myMap">
      <Markers :map="myMap" />
      <Lines v-if="tripStarted" :map="myMap" />
    </div>
  </div>
</template>

<script>
import { createMap, createPanes, flyTo } from "@/plugins/leaflet.js";
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
      defaultCentre: [40.7067997, 0.5801695],
      myMap: null,
      mapPanes: {}
    };
  },
  mounted() {
    this.myMap = createMap(this.mapCentre, this.mapZoom);
    this.mapPanes = createPanes(this.myMap);
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
    },
    mapCentre() {
      if (this.completeTrip.length > 0) {
        const middleStop = this.completeTrip[
          Math.floor((this.completeTrip.length - 1) / 2)
        ];
        return [middleStop.lat, middleStop.lng];
      } else {
        return this.defaultCentre;
      }
    },
    mapZoom() {
      if (this.completeTrip.length > 0) {
        return 6;
      } else {
        return window.innerWidth > 600 ? 7 : 6;
      }
    }
  },
  watch: {
    activeDurationRange(range) {
      displayPanesInRange(this.mapPanes, range);
    },
    completeTrip(trip) {
      if (trip.length > 0) {
        const stop = trip[trip.length - 1];
        const coords = [stop.lat, stop.lng];
        const durationSecs = trip.length == 1 ? 0.75 : 1.5;
        flyTo(this.myMap, 6, coords, durationSecs);
      } else {
        flyTo(this.myMap, 7, this.defaultCentre, 1.5);
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
