<template>
  <div id="home">
    <Map />
    <Markers />
  </div>
</template>

<script>
import Map from "@/map/Map.vue";
import Markers from "@/markers/Markers.vue";

export default {
  name: "home",
  components: {
    Map,
    Markers
  }
};
</script>

<style scoped>
#home {
  height: 100%;
}
</style>
