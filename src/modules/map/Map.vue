<template>
  <div id="map">
    <div v-if="myMap && mapPanes">
      <Markers :map="myMap" />
      <Lines v-if="tripStarted" :map="myMap" :waitingTimeInSeconds="slowFly" />
      <Legend :map="myMap" />
      <FiltersDialog v-if="showFilters" :map="myMap" />
    </div>
  </div>
</template>

<script>
import { createMap, createPanes, flyTo } from "@/plugins/leaflet.js";
import { displayPanesInRange } from "@/modules/map/panes/paneUtils";
import Markers from "@/modules/map/markers/Markers.vue";
import Lines from "@/modules/map/lines/Lines.vue";
import Legend from "@/modules/map/legend/Legend.vue";
import FiltersDialog from "@/components/dialogs/FiltersDialog.vue";

export default {
  components: {
    Markers,
    Lines,
    Legend,
    FiltersDialog
  },
  data() {
    return {
      defaultCentre: [40.7067997, 0.5801695],
      myMap: null,
      mapPanes: null,
      lowZoom: 6,
      regularZoom: 7,
      slowFly: 1.5
    };
  },
  mounted() {
    this.myMap = createMap("map", this.mapCentre, this.mapZoom);
    this.mapPanes = createPanes(this.myMap);
    displayPanesInRange(this.mapPanes, this.activeDurationRange);
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
      if (this.isMobile) {
        return this.$route.name === "alias" ? this.lowZoom - 1 : this.lowZoom;
      } else {
        return this.$route.name === "alias" ? this.lowZoom : this.regularZoom;
      }
    },
    showFilters() {
      return this.connectionsExist && this.isMobile;
    },
    connectionsExist() {
      return this.$store.getters.completeTrip.length > 0;
    },
    isMobile() {
      return window.innerWidth < 992;
    }
  },
  methods: {
    flyCoords(trip) {
      if (trip.length > 0) {
        const stop = trip[trip.length - 1];
        return [stop.lat, stop.lng];
      } else {
        return this.defaultCentre;
      }
    }
  },
  watch: {
    activeDurationRange(range) {
      displayPanesInRange(this.mapPanes, range);
    },
    completeTrip(trip) {
      //TODO: should this happen only in certain conditions?
      flyTo(this.myMap, this.lowZoom, this.flyCoords(trip), this.slowFly);
    }
  }
};
</script>

<style scoped>
#map {
  width: 100%;
  height: calc(100vh - 64px - 8px);
}

@media only screen and (max-width: 992px) {
  #map {
    height: calc(100vh - 56px);
    height: calc(var(--vh, 1vh) * 100 - 56px);
  }
}
</style>
