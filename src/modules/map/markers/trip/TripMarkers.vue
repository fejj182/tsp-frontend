<template>
  <div>
    <div v-for="(station, index) in trip" :key="Math.random() + index">
      <TripMarker :station="station" :map="map" :position="index + 1" />
    </div>
  </div>
</template>

<script>
import TripMarker from "@/modules/map/markers/trip/TripMarker";

export default {
  components: {
    TripMarker
  },
  props: {
    map: {
      type: Object
    }
  },
  computed: {
    trip() {
      return this.$store.state.trip.savedTrip;
    }
  }
};
</script>
