<template>
  <div>
    <div v-for="(coordSet, index) in tripCoords" :key="Math.random() + index">
      <CoordLine :coordSet="coordSet" :map="map" />
    </div>
    <div v-for="(station, index) in pastStops" :key="Math.random() + index">
      <TripMarker :station="station" :map="map" :position="index + 1" />
    </div>
  </div>
</template>

<script>
import CoordLine from "@/modules/map/lines/CoordLine";
import TripMarker from "@/modules/map/markers/TripMarker";

export default {
  props: {
    map: {
      type: Object
    }
  },
  components: {
    CoordLine,
    TripMarker
  },
  computed: {
    trip() {
      return this.$store.state.trip.savedTrip;
    },
    pastStops() {
      return this.trip.slice(0, this.trip.length - 1);
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
