<template>
  <div>
    <StartingMarkers :map="map" />
    <TripMarkers :map="map" />
    <ConnectionMarkers :map="map" />
  </div>
</template>

<script>
import StartingMarkers from "@/modules/map/markers/StartingMarkers.vue";
import ConnectionMarkers from "@/modules/map/markers/ConnectionMarkers.vue";
import TripMarkers from "@/modules/map/markers/trip/TripMarkers.vue";

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
