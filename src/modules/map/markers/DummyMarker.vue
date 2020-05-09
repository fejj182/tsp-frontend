<template>
  <div>
    <Popup :marker="marker" :station="station" :is-connection="isConnection" />
  </div>
</template>

<script>
import Popup from "@/modules/map/popup/Popup.vue";
import { CONNECTION } from "./markerTypes";

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
  computed: {
    isConnection() {
      return this.type == CONNECTION;
    }
  },
  destroyed() {
    this.marker.remove();
  }
};
</script>

<style lang="scss" scoped></style>
