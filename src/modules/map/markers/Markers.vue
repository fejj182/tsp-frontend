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
  methods: {
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
      this.$store.dispatch("selectStop", connection);
      this.popups
        .filter(point => {
          return point.station.id !== connection.id;
        })
        .map(point => {
          point.marker.once("click", () =>
            this.onConnectionMarkerClick(point.station)
          );
        });
    },
    addActiveMarker() {
      if (this.activeStation) {
        const marker = L.marker(
          [this.activeStation.lat, this.activeStation.lng],
          { icon: this.generateIcon("purple") }
        );
        marker.addTo(this.$store.state.map.map);
        this.popups.push({
          station: this.activeStation,
          marker
        });
      }
    }
  },
  watch: {
    connections: function() {
      this.resetMarkers();
      this.addActiveMarker();
      this.connections.forEach(connection => {
        const marker = L.marker([connection.lat, connection.lng], {
          icon: this.generateIcon("red")
        });
        marker.addTo(this.$store.state.map.map);
        marker.once("click", () => this.onConnectionMarkerClick(connection));
        this.popups.push({
          station: connection,
          marker,
          isConnection: true
        });
      });
    },
    startingStations: function() {
      this.startingStations.forEach(station => {
        const marker = L.marker([station.lat, station.lng], {
          icon: this.generateIcon("purple")
        });
        marker.addTo(this.$store.state.map.map);
        marker.on("click", () => this.onStartingMarkerClick(station));
        this.popups.push({
          station,
          marker
        });
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
