<template>
  <div>
    <Popup :marker="marker" :station="station" :is-connection="isConnection" />
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
    isConnection: {
      type: Boolean
    }
  },
  destroyed() {
    this.marker.remove();
  }
};
</script>

<style lang="scss" scoped></style>
