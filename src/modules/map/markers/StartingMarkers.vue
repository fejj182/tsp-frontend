<template>
  <div v-if="showMarkers">
    <div v-for="(marker, index) in markers" :key="random(index)">
      <DummyMarker :marker="marker" />
    </div>
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
import DummyMarker from "@/modules/map/markers/DummyMarker.vue";

export default {
  components: {
    DummyMarker,
    Popup
  },
  props: {
    map: {
      type: Object
    }
  },
  data() {
    return {
      popups: [],
      markers: []
    };
  },
  computed: {
    startingStations() {
      if (this.$store.state.trip.savedTrip.length == 0) {
        return this.$store.state.stations.startingStations;
      } else {
        return [];
      }
    },
    showMarkers() {
      return this.$store.state.stations.activeConnections.length == 0;
    }
  },
  watch: {
    startingStations(stations) {
      if (stations.length > 0) {
        stations.forEach(station => {
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
        });
      }
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
