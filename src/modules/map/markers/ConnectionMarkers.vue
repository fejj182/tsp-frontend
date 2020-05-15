<template>
  <div v-if="showConnections" data-test-id="connection-markers">
    <div v-for="(marker, index) in markers" :key="Math.random() + index">
      <DummyMarker :marker="marker.marker" />
    </div>
  </div>
</template>

<script>
import { generateMarker } from "@/plugins/leaflet";
import { RED, SLOW } from "./types";
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
  data: function() {
    return {
      markers: []
    };
  },
  computed: {
    connections() {
      return this.$store.state.stations.activeConnections;
    },
    showConnections() {
      return this.$store.state.stations.activeConnections.length > 0;
    }
  },
  watch: {
    connections(stations) {
      this.markers = [];
      setTimeout(() => {
        stations.forEach(station => {
          const marker = generateMarker(
            station,
            this.map,
            () => this.$store.dispatch("selectStop", station),
            RED
          );
          this.markers.push({
            station: station,
            marker
          });
        });
      }, SLOW);
    }
  }
};
</script>
