<template>
  <div></div>
</template>

<script>
import L from "leaflet";

export default {
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
    replaceActiveMarker(marker) {
      if (this.activeMarker) {
        this.activeMarker.remove();
      }
      this.activeMarker = marker;
    },
    resetConnections() {
      if (this.activeConnections.length > 0) {
        this.activeConnections.forEach(connection => {
          connection.remove();
        });
      }
      this.activeConnections = [];
    }
  },
  watch: {
    activeStation: function() {
      if (this.activeStation) {
        const marker = L.marker(
          [this.activeStation.lat, this.activeStation.lng],
          { icon: this.generateIcon("purple") }
        );
        this.replaceActiveMarker(marker);
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
          this.activeConnections.push(marker);
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
