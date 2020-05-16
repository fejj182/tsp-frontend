<template>
  <div>
    <div v-for="(coordSet, index) in tripCoords" :key="Math.random() + index">
      <CoordLine :coordSet="coordSet" :map="map" />
    </div>
  </div>
</template>

<script>
import CoordLine from "@/modules/map/lines/CoordLine";

export default {
  props: {
    map: {
      type: Object
    }
  },
  components: {
    CoordLine
  },
  computed: {
    trip() {
      return this.$store.getters.completeTrip;
    },
    tripCoords() {
      if (this.trip.length > 1) {
        const coords = [];
        for (let i = 0; i < this.trip.length - 1; i++) {
          const start = this.trip[i];
          const startCoord = [start.lng, start.lat];

          const destination = this.trip[i + 1];
          const destinationCoord = [destination.lng, destination.lat];

          coords.push([startCoord, destinationCoord]);
        }
        return coords;
      } else {
        return [];
      }
    }
  }
};
</script>

<style lang="scss" scoped></style>
