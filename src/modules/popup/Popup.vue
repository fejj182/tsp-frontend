<template>
  <div ref="popup">
    <h1>{{ station.name }}</h1>
  </div>
</template>

<script>
export default {
  props: {
    marker: {
      type: Object
    },
    station: {
      type: Object
    }
  },
  mounted() {
    this.marker.bindPopup(this.$refs.popup);
  }
};
</script>

<style lang="scss" scoped>
h1 {
  font-size: 18px;
}
</style>
