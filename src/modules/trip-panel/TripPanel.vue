<template>
  <v-container id="trip-panel">
    <v-expansion-panels v-model="panel" multiple readonly>
      <v-expansion-panel v-if="showFilters" data-test-id="filter-panel">
        <v-expansion-panel-header>
          Filter
          <template v-slot:actions>
            <v-icon @click="$emit('close-dialog')" data-test-id="close-filters">
              {{ iconName }}
            </v-icon>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <FiltersSlider />
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel v-if="showForm" data-test-id="trip-form-panel">
        <v-expansion-panel-header>
          Trip Plan
          <template v-slot:actions>
            <v-icon @click="$emit('close-dialog')" data-test-id="close-trip">
              {{ iconName }}
            </v-icon>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <TripForm />
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>

<script>
import FiltersSlider from "@/modules/trip-panel/FiltersSlider.vue";
import TripForm from "@/modules/trip-panel/trip-form/TripForm.vue";

export default {
  components: {
    FiltersSlider,
    TripForm
  },
  data() {
    return {
      panel: [0, 1]
    };
  },
  computed: {
    iconName() {
      return this.$smallScreen() ? "mdi-close" : "";
    }
  },
  props: {
    showFilters: {
      type: Boolean,
      default: true
    },
    showForm: {
      type: Boolean,
      default: true
    }
  }
};
</script>

<style lang="scss" scoped>
.v-expansion-panel-header {
  min-height: 32px !important;
  background-color: whitesmoke;
  cursor: default;
}
</style>

<style lang="scss">
@media only screen and (max-width: $width-desktop) {
  #trip-panel {
    .v-expansion-panel-content__wrap {
      padding: 0 18px 16px;
    }
  }
}
</style>
