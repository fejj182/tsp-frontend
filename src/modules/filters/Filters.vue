<template>
  <div v-if="connectionsExist">
    <ConnectionFilters />
  </div>
</template>

<script>
import ConnectionFilters from "@/modules/filters/ConnectionFilters.vue";

export default {
  components: {
    ConnectionFilters
  },
  computed: {
    connectionsExist() {
      return this.$store.state.stations.activeConnections.length > 0;
    }
  }
};
</script>

<style lang="scss" scoped></style>
