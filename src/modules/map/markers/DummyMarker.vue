<template>
  <div>
    <Popup :marker="marker" :station="station" :type="type" />
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
    },
    type: {
      type: String
    }
  },
  destroyed() {
    this.marker.remove();
  }
};
</script>

<style lang="scss" scoped></style>
