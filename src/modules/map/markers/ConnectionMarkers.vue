<template>
  <div v-if="showConnections">
    <div v-for="(marker, index) in markers" :key="random(index)">
      <DummyMarker
        :marker="marker.marker"
        :station="marker.station"
        :is-connection="true"
      />
    </div>
  </div>
</template>

<script>
import L from "leaflet";
import DummyMarker from "@/modules/map/markers/DummyMarker.vue";
import { getPaneNameFromDuration } from "@/modules/map/panes/paneUtils";

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
      stations.forEach(station => {
        const marker = L.marker([station.lat, station.lng], {
          pane: getPaneNameFromDuration(station.duration),
          icon: this.generateIcon("red")
        });
        marker.addTo(this.map);
        marker.on("click", () => this.$store.dispatch("selectStop", station));
        this.markers.push({
          station: station,
          marker
        });
      });
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
