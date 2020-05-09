<template>
  <!-- TODO: do we need this to still pass e2e tests -->
  <div v-if="marker">
    <DummyMarker
      :key="Math.random()"
      :marker="marker.marker"
      :station="marker.station"
      :type="markerType"
    />
  </div>
</template>

<script>
import { generateMarker } from "@/plugins/leaflet";
import { ACTIVE, PURPLE } from "./types";
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
      marker: null,
      markerType: ACTIVE
    };
  },
  computed: {
    activeStation() {
      return this.$store.state.stations.activeStation;
    }
  },
  watch: {
    activeStation(station) {
      if (station) {
        const marker = generateMarker(
          station,
          this.map,
          () => this.$store.dispatch("selectStartingInput", station),
          PURPLE
        );
        this.marker = {
          station: station,
          marker
        };
      }
    }
  }
};
</script>
