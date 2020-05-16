<template>
  <div v-if="marker" data-test-id="trip-marker">
    <DummyMarker :key="Math.random()" :marker="marker" :station="station" />
  </div>
</template>

<script>
import DummyMarker from "@/modules/map/markers/DummyMarker";
import { generatePositionMarker } from "@/plugins/leaflet";

export default {
  components: {
    DummyMarker
  },
  data() {
    return {
      marker: null
    };
  },
  props: {
    map: {
      type: Object
    },
    station: {
      type: Object
    },
    position: {
      type: Number
    }
  },
  mounted() {
    this.marker = generatePositionMarker(this.station, this.map, this.position);
  }
};
</script>

<style lang="scss" scoped></style>
