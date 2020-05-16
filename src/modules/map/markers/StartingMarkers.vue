<template>
  <div v-if="showMarkers" data-test-id="starting-markers">
    <div v-for="(marker, index) in markers" :key="Math.random() + index">
      <DummyMarker :marker="marker.marker" :station="marker.station" />
    </div>
  </div>
</template>

<script>
import { generateMarker } from "@/plugins/leaflet";
import { PURPLE, VERY_SLOW, IMMEDIATE } from "./types";
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
      markers: []
    };
  },
  mounted() {
    this.generateMarkers(this.startingStations);
  },
  computed: {
    startingStations() {
      return this.$store.getters.completeTrip.length == 0
        ? this.$store.state.stations.startingStations
        : [];
    },
    showMarkers() {
      return (
        this.$store.state.stations.startingStations.length > 0 &&
        this.$store.state.stations.activeConnections.length == 0 &&
        this.$store.getters.completeTrip.length == 0
      );
    }
  },
  methods: {
    generateMarkers(stations) {
      this.markers = [];
      setTimeout(
        () => {
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
        },
        this.$store.state.trip.tripReset ? VERY_SLOW : IMMEDIATE
      );
    }
  },
  watch: {
    startingStations(stations) {
      this.generateMarkers(stations);
    }
  }
};
</script>
