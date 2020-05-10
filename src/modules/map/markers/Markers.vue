<template>
  <div>
    <StartingMarkers :map="map" />
    <ActiveMarker :map="map" />
    <ConnectionMarkers :map="map" />
  </div>
</template>

<script>
import StartingMarkers from "./StartingMarkers";
import ConnectionMarkers from "./ConnectionMarkers";
import ActiveMarker from "./ActiveMarker";

export default {
  components: {
    StartingMarkers,
    ConnectionMarkers,
    ActiveMarker
  },
  props: {
    map: {
      type: Object
    }
  }
};
</script>

<style lang="scss"></style>
