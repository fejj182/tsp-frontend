<template>
  <div id="mobile-filters">
    <v-dialog
      v-model="dialog"
      :width="550"
      style="position: fixed; z-index: 2000;"
      data-test-id="v-dialog"
    >
      <template v-slot:activator="{ on }">
        <v-btn
          class="mx-2"
          fab
          small
          color="secondary"
          v-on="on"
          ref="filter"
          data-test-id="btn-filter"
        >
          <v-icon>mdi-filter-outline</v-icon>
        </v-btn>
      </template>
      <TripPanel />
    </v-dialog>
  </div>
</template>

<script>
import TripPanel from "@/modules/trip-panel/TripPanel";
import { createLegend } from "@/plugins/leaflet.js";
import { LEGEND_TOPRIGHT } from "@/modules/map/markers/types";
export default {
  components: {
    TripPanel
  },
  props: {
    map: {
      type: Object
    }
  },
  data() {
    return {
      dialog: false,
      legend: null
    };
  },
  mounted() {
    this.legend = createLegend(
      this.map,
      this.$refs.filter,
      LEGEND_TOPRIGHT,
      this.open
    );
  },
  methods: {
    open() {
      this.dialog = true;
    }
  },
  destroyed() {
    this.legend.remove();
  }
};
</script>

<style lang="scss" scoped>
i {
  opacity: 0.85;
}
</style>
