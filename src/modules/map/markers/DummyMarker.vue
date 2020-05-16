<template>
  <div v-if="loadPopup">
    <Popup :marker="marker" :station="station" />
  </div>
</template>

<script>
import Popup from "@/modules/map/popup/Popup.vue";

export default {
  components: {
    Popup
  },
  props: {
    marker: {
      type: Object
    },
    station: {
      type: Object
    }
  },
  computed: {
    loadPopup() {
      return this.station;
    }
  },
  destroyed() {
    this.marker.remove();
  }
};
</script>

<style lang="scss" scoped></style>
