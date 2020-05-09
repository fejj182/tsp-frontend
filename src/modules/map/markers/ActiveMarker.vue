<template>
  <div v-if="active">
    <DummyMarker :marker="marker" />
    <Popup
      :marker="popup.marker"
      :station="popup.station"
      :is-connection="!!popup.isConnection"
    />
  </div>
</template>

<script>
import L from "leaflet";
import Popup from "@/modules/map/popup/Popup.vue";
import DummyMarker from "@/modules/map/markers/DummyMarker.vue";

export default {
  components: {
    DummyMarker,
    Popup
  },
  props: {
    map: {
      type: Object
    }
  },
  data() {
    return {
      popup: null,
      marker: null
    };
  },
  computed: {
    activeStation() {
      return this.$store.state.stations.activeStation;
    },
    active() {
      return this.activeStation && this.marker;
    }
  },
  watch: {
    activeStation(station) {
      if (station) {
        const marker = L.marker([station.lat, station.lng], {
          icon: this.generateIcon("purple")
        });
        marker.addTo(this.map);
        this.marker = marker;
        marker.on("click", () => {
          this.$store.dispatch("selectStartingInput", station);
        });
        this.popup = {
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
