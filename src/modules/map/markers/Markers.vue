<template>
  <div>
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
import { getPaneNameFromDuration } from "@/modules/map/panes/paneUtils";

export default {
  components: {
    Popup
  },
  data: function() {
    return {
      popups: [],
      markers: []
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
    startingStations() {
      return this.$store.state.stations.startingStations;
    },
    savedTrip() {
      return this.$store.state.trip.savedTrip;
    }
  },
  watch: {
    connections: function(connections) {
      this.resetMarkers();
      if (this.activeStation) {
        this.addStartingMarker(this.activeStation);
      }
      if (connections.length > 0) {
        this.addConnectionMarkers(connections);
      }
    },
    startingStations: function(stations) {
      if (stations.length > 0 && this.savedTrip.length === 0) {
        this.addStartingMarkers();
      }
    },
    savedTrip: function(trip) {
      if (trip.length === 0) {
        this.addStartingMarkers();
      }
    }
  },
  methods: {
    random(index) {
      return Math.random() * (index + 1);
    },
    resetMarkers() {
      this.markers.forEach(marker => {
        marker.remove();
      });
      this.markers = [];
      this.popups = [];
    },
    addStartingMarkers() {
      this.resetMarkers();
      setTimeout(() => {
        this.startingStations.forEach(station => {
          this.addStartingMarker(station);
        });
      }, 0);
    },
    addStartingMarker(station) {
      const marker = L.marker([station.lat, station.lng], {
        icon: this.generateIcon("purple")
      });
      marker.addTo(this.map);
      this.markers.push(marker);
      marker.on("click", () => {
        this.$store.dispatch("selectStartingInput", station);
      });
      this.popups.push({
        station: station,
        marker
      });
    },
    addConnectionMarkers(connections) {
      setTimeout(() => {
        connections.forEach(connection => {
          this.addConnectionMarker(connection);
        });
      }, 0);
    },
    addConnectionMarker(station) {
      const marker = L.marker([station.lat, station.lng], {
        pane: getPaneNameFromDuration(station.duration),
        icon: this.generateIcon("red")
      });
      marker.addTo(this.map);
      this.markers.push(marker);

      marker.on("click", () => this.$store.dispatch("selectStop", station));
      this.popups.push({
        station,
        marker,
        isConnection: true
      });
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
.marker-purple {
  color: #6633ff;
  font-size: 18px;
}
.marker-red {
  color: #ff0066;
  font-size: 18px;
}
</style>
