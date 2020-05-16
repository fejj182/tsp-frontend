<template>
  <div></div>
</template>

<script>
import L from "leaflet";

export default {
  props: {
    map: {
      type: Object
    },
    coordSet: {
      type: Array
    }
  },
  mounted() {
    this.geoJsonLayer = L.geoJSON({
      type: "LineString",
      coordinates: [this.coordSet[0], this.coordSet[1]]
    }).addTo(this.map);
  },
  destroyed() {
    this.geoJsonLayer.remove();
  }
};
</script>

<style></style>
