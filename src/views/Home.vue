<template>
  <div id="home">
    <Map />
  </div>
</template>

<script>
import Map from "@/components/Map.vue";

export default {
  name: "home",
  components: {
    Map
  }
};
</script>

<style scoped>
#home {
  height: 100%;
}
</style>
