<template>
  <div></div>
</template>

<script>
import L from "leaflet";

export default {
  data: function() {
    return {
      activeMarker: null
    };
  },
  props: {
    map: {
      type: Object
    }
  },
  computed: {
    nearestStation() {
      return this.$store.state.stations.station;
    }
  },
  watch: {
    nearestStation: function() {
      const marker = L.marker([
        this.$store.state.stations.station.lat,
        this.$store.state.stations.station.lng
      ]);
      if (this.activeMarker) {
        this.activeMarker.remove();
      }
      this.activeMarker = marker;
      marker.addTo(this.map);
    }
  }
};
</script>

<style lang="scss" scoped></style>
