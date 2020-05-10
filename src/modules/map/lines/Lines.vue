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
      return this.$store.state.trip.savedTrip;
    },
    tripCoords() {
      if (this.trip.length > 1) {
        const destination = this.trip[this.trip.length - 1];
        const destinationCoord = [destination.lng, destination.lat];

        const start = this.trip[this.trip.length - 2];
        const startCoord = [start.lng, start.lat];

        return [[startCoord, destinationCoord]];
      } else {
        return [];
      }
    }
  }
};
</script>

<style lang="scss" scoped></style>
