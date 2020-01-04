<template>
  <div v-if="stationMarker">
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
      stationMarker: null,
      connectionMarkers: []
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
      return [this.stationMarker, ...this.connectionMarkers];
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
      if (this.connectionMarkers.length > 0) {
        this.connectionMarkers.forEach(connection => {
          connection.marker.remove();
        });
      }
      this.connectionMarkers = [];
    }
  },
  watch: {
    activeStation: function() {
      if (this.stationMarker) {
        this.stationMarker.marker.remove();
        this.stationMarker = null;
      }
      if (this.activeStation) {
        const marker = L.marker(
          [this.activeStation.lat, this.activeStation.lng],
          { icon: this.generateIcon("purple") }
        );
        this.stationMarker = {
          station: this.activeStation,
          marker,
          autoOpen: true
        };
        marker.addTo(this.map);
      }
    },
    connections: function() {
      this.resetConnections();
      this.connections.forEach(connection => {
        const marker = L.marker([connection.lat, connection.lng], {
          icon: this.generateIcon("red")
        });
        this.connectionMarkers.push({
          station: connection,
          marker
        });
        marker.addTo(this.map);
      });
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
