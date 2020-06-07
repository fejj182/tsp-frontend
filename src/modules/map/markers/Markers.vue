<template>
  <div>
    <StartingMarkers data-test-id="starting-markers" :map="map" />
    <TripMarkers data-test-id="trip-markers" :map="map" />
    <ConnectionMarkers data-test-id="connection-markers" :map="map" />
  </div>
</template>

<script>
const StartingMarkers = () =>
  import("@/modules/map/markers/StartingMarkers.vue");
const ConnectionMarkers = () =>
  import("@/modules/map/markers/ConnectionMarkers.vue");
const TripMarkers = () => import("@/modules/map/markers/trip/TripMarkers.vue");

export default {
  components: {
    StartingMarkers,
    ConnectionMarkers,
    TripMarkers
  },
  props: {
    map: {
      type: Object
    }
  }
};
</script>

<style lang="scss"></style>
