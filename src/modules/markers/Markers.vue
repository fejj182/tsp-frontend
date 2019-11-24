<template>
  <div></div>
</template>

<script>
import L, { Map } from "leaflet";

export default {
  props: {
    map: {
      type: Map
    }
  },
  computed: {
    nearestStation() {
      return this.$store.state.nearestStation.station;
    }
  },
  watch: {
    nearestStation: function() {
      L.marker([
        this.$store.state.nearestStation.station.lat,
        this.$store.state.nearestStation.station.lon
      ]).addTo(this.map);
    }
  }
};
</script>

<style lang="scss" scoped></style>
