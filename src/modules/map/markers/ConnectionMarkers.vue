<template>
  <div v-if="showConnections">
    <div v-for="(marker, index) in markers" :key="random(index)">
      <DummyMarker :marker="marker" />
    </div>
    <div v-for="(point, index) in popups" :key="random(index)">
      <Popup
        :marker="point.marker"
        :station="point.station"
        :is-connection="!!point.isConnection"
      />
    </div>
  </div>
</template>

<script>
import L from "leaflet";
import Popup from "@/modules/map/popup/Popup.vue";
import DummyMarker from "@/modules/map/markers/DummyMarker.vue";
import { getPaneNameFromDuration } from "@/modules/map/panes/paneUtils";

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
  data: function() {
    return {
      popups: [],
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
      if (stations.length > 0) {
        stations.forEach(station => {
          const marker = L.marker([station.lat, station.lng], {
            pane: getPaneNameFromDuration(station.duration),
            icon: this.generateIcon("red")
          });
          marker.addTo(this.map);
          this.markers.push(marker);
          marker.on("click", () => this.$store.dispatch("selectStop", station));
          this.popups.push({
            station: station,
            marker,
            isConnection: true
          });
        });
      }
    }
  },
  methods: {
    random(index) {
      return Math.random() * (index + 1);
    },
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
.marker-red {
  color: #ff0066;
  font-size: 18px;
}
</style>
