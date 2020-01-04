<template>
  <div data-test-id="popup" ref="popup">
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
    },
    autoOpen: {
      type: Boolean
    }
  },
  methods: {
    bindPopup(marker) {
      const popup = marker.bindPopup(this.$refs.popup, {
        offset: [0, -35]
      });
      if (this.autoOpen) {
        popup.openPopup();
      }
    }
  },
  mounted() {
    this.bindPopup(this.marker);
  },
  watch: {
    marker: function(marker) {
      this.bindPopup(marker);
    }
  }
};
</script>

<style lang="scss" scoped>
h1 {
  font-size: 18px;
}
</style>
