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
    },
    waitingTimeBeforeCreation: {
      type: Number,
      default: 0
    }
  },
  mounted() {
    setTimeout(() => {
      this.geoJsonLayer = createLine(this.map, this.coordSet);
    }, this.waitingTimeBeforeCreation);
  },
  destroyed() {
    setTimeout(
      () => this.geoJsonLayer.remove(),
      this.geoJsonLayer ? 0 : this.waitingTimeBeforeCreation
    );
  }
};
</script>

<style></style>
