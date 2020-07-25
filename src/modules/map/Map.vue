<template>
  <div id="map">
    <div v-if="myMap && mapPanes">
      <Markers :map="myMap" />
      <Lines v-if="tripStarted" :map="myMap" :waitingTimeInSeconds="slowFly" />
      <Legend :map="myMap" />
      <MobileFilters v-if="showFilters" :map="myMap" />
    </div>
  </div>
</template>

<script>
import { createMap, createPanes, flyTo } from "@/plugins/leaflet.js";
import { displayPanesInRange } from "@/modules/map/panes/paneUtils";
import Markers from "@/modules/map/markers/Markers.vue";
import Lines from "@/modules/map/lines/Lines.vue";
import Legend from "@/modules/map/legend/Legend.vue";
import MobileFilters from "@/modules/filters/MobileFilters.vue";

export default {
  components: {
    Markers,
    Lines,
    Legend,
    MobileFilters
  },
  data() {
    return {
      defaultCentre: [40.7067997, 0.5801695],
      myMap: null,
      mapPanes: null,
      lowZoom: 6,
      regularZoom: 7,
      fastFly: 0.75,
      slowFly: 1.5
    };
  },
  mounted() {
    this.myMap = createMap("map", this.mapCentre, this.mapZoom);
    this.mapPanes = createPanes(this.myMap);
    this.setMobileMapHeight();
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
        return this.lowZoom;
      } else {
        return window.innerWidth > 600 ? this.regularZoom : this.lowZoom;
      }
    },
    showFilters() {
      return this.connectionsExist && this.isMobile;
    },
    connectionsExist() {
      return this.$store.state.stations.activeConnections.length > 0;
    },
    isMobile() {
      return window.innerWidth < 600;
    }
  },
  methods: {
    flySpeed(trip) {
      return trip.length == 1 ? this.fastFly : this.slowFly;
    },
    flyCoords(trip) {
      if (trip.length > 0) {
        const stop = trip[trip.length - 1];
        return [stop.lat, stop.lng];
      } else {
        return this.defaultCentre;
      }
    },
    setMobileMapHeight() {
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    }
  },
  watch: {
    activeDurationRange(range) {
      displayPanesInRange(this.mapPanes, range);
    },
    completeTrip(trip) {
      flyTo(
        this.myMap,
        this.mapZoom,
        this.flyCoords(trip),
        this.flySpeed(trip)
      );
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
    height: calc(var(--vh, 1vh) * 100 - 56px);
  }
}
</style>
