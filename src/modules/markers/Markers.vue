<template>
  <div v-if="activeMarker">
    <div v-for="marker in allMarkers" :key="marker.station.id">
      <Popup
        :marker="marker.marker"
        :station="marker.station"
        :auto-open="!!marker.autoOpen"
      />
    </div>
  </div>
</template>

<script>
import L from "leaflet";
import Popup from "@/modules/popup/Popup.vue";

export default {
  components: {
    Popup
  },
  data: function() {
    return {
      activeMarker: null,
      activeConnections: []
    };
  },
  props: {
    map: {
      type: Object
    }
  },
  computed: {
    activeStation() {
      return this.$store.state.stations.activeStation;
    },
    connections() {
      return this.$store.state.stations.connections;
    },
    allMarkers() {
      return [this.activeMarker, ...this.activeConnections];
    }
  },
  methods: {
    generateIcon(colour) {
      return L.divIcon({
        html: `<i class="fas fa-map-pin fa-map-pin-${colour} fa-3x"></i>`,
        iconSize: [20, 36],
        iconAnchor: [10, 40],
        className: `div-icon-${colour}`
      });
    },
    resetConnections() {
      if (this.activeConnections.length > 0) {
        this.activeConnections.forEach(connection => {
          connection.marker.remove();
        });
      }
      this.activeConnections = [];
    }
  },
  watch: {
    activeStation: function() {
      if (this.activeMarker) {
        this.activeMarker.marker.remove();
        this.activeMarker = null;
      }
      if (this.activeStation) {
        const marker = L.marker(
          [this.activeStation.lat, this.activeStation.lng],
          { icon: this.generateIcon("purple") }
        );
        this.activeMarker = {
          station: this.activeStation,
          marker,
          autoOpen: true
        };
        marker.addTo(this.map);
      }
    },
    connections: function() {
      if (this.connections) {
        this.resetConnections();
        this.connections.forEach(connection => {
          const marker = L.marker([connection.lat, connection.lng], {
            icon: this.generateIcon("red")
          });
          this.activeConnections.push({
            station: connection,
            marker
          });
          marker.addTo(this.map);
        });
      }
    }
  }
};
</script>

<style lang="scss">
.fa-map-pin-purple {
  color: #6633ff;
}
.fa-map-pin-red {
  color: #ff0066;
}
</style>
