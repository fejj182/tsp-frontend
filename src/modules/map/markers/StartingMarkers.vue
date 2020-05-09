<template>
  <div v-if="showMarkers">
    <div v-for="(marker, index) in markers" :key="Math.random() + index">
      <DummyMarker
        :marker="marker.marker"
        :station="marker.station"
        :type="markerType"
      />
    </div>
  </div>
</template>

<script>
import { generateMarker } from "@/plugins/leaflet";
import { STARTING, PURPLE } from "./types";
import DummyMarker from "@/modules/map/markers/DummyMarker.vue";

export default {
  components: {
    DummyMarker
  },
  props: {
    map: {
      type: Object
    }
  },
  data() {
    return {
      markers: [],
      markerType: STARTING
    };
  },
  computed: {
    startingStations() {
      return this.$store.state.trip.savedTrip.length == 0
        ? this.$store.state.stations.startingStations
        : [];
    },
    showMarkers() {
      return (
        this.$store.state.stations.startingStations.length > 0 &&
        this.$store.state.stations.activeConnections.length == 0 &&
        this.$store.state.trip.savedTrip.length == 0
      );
    }
  },
  watch: {
    startingStations(stations) {
      this.markers = [];
      stations.forEach(station => {
        const marker = generateMarker(
          station,
          this.map,
          () => this.$store.dispatch("selectStartingInput", station),
          PURPLE
        );
        this.markers.push({
          marker,
          station
        });
      });
    }
  }
};
</script>
