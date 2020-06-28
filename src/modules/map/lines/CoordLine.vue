<template>
  <div></div>
</template>

<script>
import { createLine } from "@/plugins/leaflet.js";

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
    this.geoJsonLayer = createLine(this.map, this.coordSet);
  },
  destroyed() {
    this.geoJsonLayer.remove();
  }
};
</script>

<style></style>
