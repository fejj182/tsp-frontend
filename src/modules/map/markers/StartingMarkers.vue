<template>
  <div v-if="showMarkers">
    <div v-for="(marker, index) in markers" :key="random(index)">
      <DummyMarker
        :marker="marker.marker"
        :station="marker.station"
        :type="markerType"
      />
    </div>
  </div>
</template>

<script>
import L from "leaflet";
import { STARTING } from "./markerTypes";
import DummyMarker from "@/modules/map/markers/DummyMarker.vue";

export default {
  components: {
    DummyMarker
  },
  props: {
    map: {
      type: Object
    }
  },
  data() {
    return {
      markers: [],
      markerType: STARTING
    };
  },
  computed: {
    startingStations() {
      return this.$store.state.trip.savedTrip.length == 0
        ? this.$store.state.stations.startingStations
        : [];
    },
    showMarkers() {
      return (
        this.$store.state.stations.startingStations.length > 0 &&
        this.$store.state.stations.activeConnections.length == 0 &&
        this.$store.state.trip.savedTrip.length == 0
      );
    }
  },
  watch: {
    startingStations(stations) {
      this.markers = [];
      stations.forEach(station => {
        const marker = L.marker([station.lat, station.lng], {
          icon: this.generateIcon("purple")
        });
        marker.addTo(this.map);
        marker.on("click", () => {
          this.$store.dispatch("selectStartingInput", station);
        });
        this.markers.push({
          marker,
          station
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
.marker-purple {
  color: #6633ff;
  font-size: 18px;
}
</style>
