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
    activeStation() {
      return this.$store.state.stations.activeStation;
    }
  },
  watch: {
    activeStation: function() {
      const marker = L.marker([
        this.$store.state.stations.activeStation.lat,
        this.$store.state.stations.activeStation.lng
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
