<template>
  <div v-if="showConnections">
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
import { CONNECTION, RED } from "./types";
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
      markers: [],
      markerType: CONNECTION
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
    }
  }
};
</script>
