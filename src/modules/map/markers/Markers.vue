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
      stationPoint: null,
      connectionPoints: [],
      startingPoints: [],
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
    resetConnections() {
      if (this.connectionPoints.length > 0) {
        this.connectionPoints.forEach(connection => {
          connection.marker.remove();
        });
        this.connectionPoints = [];
      }
    },
    resetStartingConnections() {
      if (this.startingPoints.length > 0) {
        this.startingPoints.forEach(station => {
          station.marker.remove();
        });
        this.startingPoints = [];
      }
    },
    onMarkerClick(connection) {
      this.$store.dispatch("selectStop", connection);
      this.connectionPoints
        .filter(point => {
          return point.station.id !== connection.id;
        })
        .map(point => {
          point.marker.once("click", () => this.onMarkerClick(point.station));
        });
    }
  },
  watch: {
    activeStation: function() {
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
        this.$store.dispatch("openPopup", this.activeStation);
      }
    },
    connections: function() {
      this.resetConnections();
      this.connections.forEach(connection => {
        const marker = L.marker([connection.lat, connection.lng], {
          icon: this.generateIcon("red")
        });
        marker.addTo(this.$store.state.map.map);
        marker.once("click", () => this.onMarkerClick(connection));
        this.popups.push({
          station: connection,
          marker,
          isConnection: true
        });
      });
    },
    startingStations: function() {
      this.resetStartingConnections();
      this.startingStations.forEach(station => {
        const marker = L.marker([station.lat, station.lng], {
          icon: this.generateIcon("purple")
        });
        marker.addTo(this.$store.state.map.map);
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
