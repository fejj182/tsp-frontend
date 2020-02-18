<template>
  <div>
    <div v-for="(point, index) in popups" :key="index">
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

export default {
  components: {
    Popup
  },
  data: function() {
    return {
      popups: []
    };
  },
  computed: {
    activeStation() {
      return this.$store.state.stations.activeStation;
    },
    connections() {
      return this.$store.state.stations.activeConnections;
    },
    startingStations() {
      return this.$store.state.stations.startingStations;
    }
  },
  watch: {
    connections: function() {
      this.resetMarkers();
      if (this.activeStation) {
        this.addActiveMarker(this.activeStation);
      }
      this.connections.forEach(connection => {
        this.addConnectionMarker(connection);
      });
    },
    startingStations: function() {
      this.startingStations.forEach(station => {
        const marker = this.addActiveMarker(station);
        marker.on("click", () => this.onStartingMarkerClick(station));
      });
    }
  },
  methods: {
    addActiveMarker(station) {
      const marker = L.marker([station.lat, station.lng], {
        icon: this.generateIcon("purple")
      });
      marker.addTo(this.$store.state.map.map);
      this.popups.push({
        station: station,
        marker
      });
      return marker;
    },
    addConnectionMarker(station) {
      const marker = L.marker([station.lat, station.lng], {
        icon: this.generateIcon("red")
      });
      marker.addTo(this.$store.state.map.map);
      this.popups.push({
        station,
        marker,
        isConnection: true
      });
      marker.on("click", () => this.onConnectionMarkerClick(station));
    },
    generateIcon(colour) {
      return L.divIcon({
        html: `<i class="fas fa-map-pin fa-map-pin-${colour} fa-3x"></i>`,
        iconSize: [20, 36],
        iconAnchor: [10, 40],
        className: `div-icon-${colour}`
      });
    },
    resetMarkers() {
      this.popups.forEach(station => {
        station.marker.remove();
      });
      this.popups = [];
    },
    onStartingMarkerClick(station) {
      if (this.$store.state.trip.startingStation !== station) {
        this.$store.dispatch("selectStartingInput", station);
      }
    },
    onConnectionMarkerClick(connection) {
      if (this.$store.state.trip.selectedStop !== connection) {
        this.$store.dispatch("selectStop", connection);
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
