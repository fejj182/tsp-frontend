<template>
  <!-- TODO: do we need this to still pass e2e tests -->
  <div v-if="marker">
    <DummyMarker
      :marker="marker.marker"
      :station="marker.station"
      :type="markerType"
    />
  </div>
</template>

<script>
import L from "leaflet";
import { ACTIVE } from "./markerTypes";
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
        this.marker = null;
        const marker = L.marker([station.lat, station.lng], {
          icon: this.generateIcon("purple")
        });
        marker.addTo(this.map);
        marker.on("click", () => {
          this.$store.dispatch("selectStartingInput", station);
        });
        this.marker = {
          station: station,
          marker
        };
      }
    }
  },
  methods: {
    generateIcon(colour) {
      return L.divIcon({
        html: `<i class="fas fa-map-marker-alt marker-${colour}"></i>`,
        iconAnchor: [6.75, 18],
        iconSize: [13.5, 18],
        className: `div-icon-${colour}`
      });
    }
  }
};
</script>

<style lang="scss">
.marker-purple {
  color: #6633ff;
  font-size: 18px;
}
</style>
