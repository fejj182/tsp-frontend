<template>
  <div id="starting-destination">
    <!-- TODO: Once the UX of choosing a starting destination is improved, get rid of autocomplete -->
    <!-- too buggy on mobile with focus/context menu problems -->
    <v-autocomplete
      label="Start from..."
      data-test-id="starting-destination"
      :items="stations"
      :filter="autocompleteFilter"
      background-color="grey lighten-4"
      :prepend-inner-icon="innerIcon"
      filled
      rounded
      hide-details
      @change="onChangeStation"
      :value="startingStation"
      :rules="validationRules"
      required
    >
      <!-- use template to stop .v-list-item__mask class being used, which was causing items 
      with diacritics to be highlighted in full https://github.com/vuetifyjs/vuetify/pull/9618/files -->
      <template v-slot:item="{ item }">
        <span :id="'list-item-' + item.value.slug">{{ item.text }}</span>
      </template>
    </v-autocomplete>
  </div>
</template>

<script>
// TODO: Remove state from component
import { mapStation, mapStations } from "@/mappers/stationFormMapper";
import deburr from "lodash/deburr";

export default {
  data() {
    return {
      validationRules: this.$route.name === "welcome" ? [value => !!value] : []
    };
  },
  computed: {
    startingStation() {
      let station = this.$store.state.trip.startingStation;
      if (station) {
        station = mapStation(station);
      }
      return station;
    },
    stations() {
      let stations = this.$store.state.stations.startingStations;
      if (stations.length > 0) {
        stations = mapStations(stations);
      } else if (this.startingStation) {
        stations = [this.startingStation];
      }
      return stations;
    },
    innerIcon() {
      return this.$route.name === "welcome" ? "mdi-train" : "";
    }
  },
  methods: {
    onChangeStation(station) {
      if (this.$route.name === "welcome") {
        this.$emit("change-station", station);
      } else {
        if (station) {
          //TODO: can this be done without triggering a reset?
          this.$store.dispatch("startTrip", station);
        }
      }
    },
    autocompleteFilter(item, queryText, itemText) {
      // same as default but adding _.deburr
      return (
        deburr(itemText)
          .toLocaleLowerCase()
          .indexOf(queryText.toLocaleLowerCase()) > -1
      );
    }
  }
};
</script>

<style lang="scss" scoped>
.v-autocomplete {
  z-index: 1500;
}
.v-input {
  margin-bottom: 1.5rem;
}

@media only screen and (max-width: $width-desktop) {
  .v-input {
    margin-top: 1rem;
  }
}
</style>

<style lang="scss">
#starting-destination {
  i {
    color: #303f9f;
    padding-bottom: 2px;
    padding-right: 0.5rem;
  }
}
</style>
