<template>
  <div id="home">
    <Map :on-click="onMapClick" />
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
  },
  methods: {
    onMapClick: event => {
      console.log(event.latlng);
    }
  }
};
</script>

<style scoped>
#home {
  height: 100%;
}
</style>
