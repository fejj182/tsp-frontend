<template>
  <div id="home">
    <Map :on-click="onMapClick" />
    <Markers />
  </div>
</template>

<script>
import Map from "@/modules/map/Map.vue";
import Markers from "@/modules/markers/Markers.vue";

export default {
  name: "home",
  components: {
    Map,
    Markers
  },
  methods: {
    onMapClick(event) {
      const lat = event.latlng.lat;
      const lon = event.latlng.lng;
      this.$store.dispatch("getNearestStation", { lat, lon });
    }
  }
};
</script>

<style scoped>
#home {
  height: 100%;
}
</style>
