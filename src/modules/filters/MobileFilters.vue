<template>
  <div id="mobile-filters">
    <v-dialog
      v-model="dialog"
      :width="550"
      style="position: fixed; z-index: 2000;"
    >
      <template v-slot:activator="{ on }">
        <v-btn class="mx-2" fab small color="secondary" v-on="on" ref="filter">
          <v-icon>mdi-filter-outline</v-icon>
        </v-btn>
      </template>
      <TripPanel :showFilters="true" />
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
    //TODO: add tests and stop remounting between stops
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
