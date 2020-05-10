<template>
  <div></div>
</template>

<script>
import L from "leaflet";

export default {
  data() {
    return {
      geoJsonLayer: null
    };
  },
  props: {
    map: {
      type: Object
    }
  },
  computed: {
    trip() {
      return this.$store.state.trip.savedTrip;
    }
  },
  mounted() {
    this.geoJsonLayer = L.geoJSON();
    this.geoJsonLayer.addTo(this.map);
  },
  watch: {
    trip(trip) {
      const destination = trip[trip.length - 1];
      const destinationCoord = [destination.lng, destination.lat];

      const start = trip[trip.length - 2];
      const startCoord = [start.lng, start.lat];

      this.geoJsonLayer.addData({
        type: "LineString",
        coordinates: [startCoord, destinationCoord]
      });
    }
  },
  destroyed() {
    this.geoJsonLayer.remove();
  }
};
</script>

<style></style>
