<template>
  <div>
    <div v-show="false" v-for="point in popups" :key="point.station.id">
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
import Popup from "@/modules/popup/Popup.vue";

export default {
  components: {
    Popup
  },
  data: function() {
    return {
      stationPoint: null,
      connectionPoints: []
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
      return this.$store.state.stations.activeConnections;
    },
    popups() {
      const popups = {};
      // TODO: why does popup of active station not re-mount?
      if (this.stationPoint) {
        popups[this.stationPoint.station.id] = this.stationPoint;
      }
      if (this.connectionPoints.length > 0) {
        this.connectionPoints.forEach(connection => {
          popups[connection.station.id] = connection;
        });
      }
      return popups;
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
    onMarkerClick(connection) {
      this.$store.dispatch("selectConnection", connection);
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
      if (this.stationPoint) {
        this.stationPoint.marker.remove();
        this.stationPoint = null;
      }
      if (this.activeStation) {
        const marker = L.marker(
          [this.activeStation.lat, this.activeStation.lng],
          { icon: this.generateIcon("purple") }
        );
        marker.addTo(this.map);
        this.stationPoint = {
          station: this.activeStation,
          marker
        };
        this.$store.dispatch("openPopup", this.activeStation);
      }
    },
    connections: function() {
      this.resetConnections();
      this.connections.forEach(connection => {
        const marker = L.marker([connection.lat, connection.lng], {
          icon: this.generateIcon("red")
        });
        marker.addTo(this.map);
        marker.once("click", () => this.onMarkerClick(connection));
        this.connectionPoints.push({
          station: connection,
          marker,
          isConnection: true
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
