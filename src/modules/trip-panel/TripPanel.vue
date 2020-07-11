<template>
  <v-container id="trip-panel">
    <v-expansion-panels focusable v-model="panel" multiple>
      <v-expansion-panel v-if="showFilters" data-test-id="filter-panel">
        <v-expansion-panel-header>
          Filter
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <ConnectionFilters />
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel v-if="showForm" data-test-id="trip-form-panel">
        <v-expansion-panel-header>
          Trip Plan
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <TripForm />
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>

<script>
import ConnectionFilters from "@/modules/filters/ConnectionFilters.vue";
import TripForm from "@/modules/trip/TripForm.vue";

export default {
  components: {
    ConnectionFilters,
    TripForm
  },
  data() {
    return {
      panel: [0, 1]
    };
  },
  props: {
    showFilters: {
      type: Boolean,
      default: false
    },
    showForm: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style lang="scss" scoped>
.v-expansion-panel-header {
  min-height: 32px !important;
}
</style>

<style lang="scss">
@media only screen and (max-width: 600px) {
  #trip-panel {
    .v-expansion-panel-content__wrap {
      padding: 0 18px 16px;
    }
  }
}
</style>
