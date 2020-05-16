<template>
  <div>
    <StartingMarkers :map="map" />
    <TripMarkers :map="map" />
    <ConnectionMarkers :map="map" />
  </div>
</template>

<script>
import StartingMarkers from "./StartingMarkers";
import ConnectionMarkers from "./ConnectionMarkers";
import TripMarkers from "./trip/TripMarkers";

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
