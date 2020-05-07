<template>
  <div></div>
</template>

<script>
export default {
  props: {
    marker: {
      type: Object
    }
  },
  destroyed() {
    this.marker.remove();
  }
};
</script>

<style lang="scss" scoped></style>
