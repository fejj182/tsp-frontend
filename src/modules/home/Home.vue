<template>
  <div id="home">
    <Map @mapClick="onMapClick" @mapCreated="onMapCreated" />
    <Markers :map="map" />
  </div>
</template>

<script>
import Map from "@/modules/map/Map.vue";
import Markers from "@/modules/markers/Markers.vue";

export default {
  name: "home",
  data: function() {
    return {
      map: null
    };
  },
  components: {
    Map,
    Markers
  },
  methods: {
    onMapClick(event) {
      const lat = event.latlng.lat;
      const lon = event.latlng.lng;
      this.$store.dispatch("getNearestStation", { lat, lon });
    },
    onMapCreated(map) {
      this.map = map;
    }
  }
};
</script>

<style scoped>
#home {
  height: 100%;
}
</style>
