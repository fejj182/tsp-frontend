<template>
  <div>
    <v-autocomplete
      label="Start from..."
      data-test-id="starting-destination"
      :items="stations"
      :filter="autocompleteFilter"
      filled
      rounded
      @change="onChangeStation"
      :value="startingStation"
    >
      <!-- use template to stop .v-list-item__mask class being used, which was causing items 
      with diacritics to be highlighted in full https://github.com/vuetifyjs/vuetify/pull/9618/files -->
      <template v-slot:item="{ item }">
        {{ item.text }}
      </template>
    </v-autocomplete>
  </div>
</template>

<script>
import { mapStation, mapStations } from "@/mappers/stationFormMapper";
import _ from "lodash";

export default {
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
      }
      return stations;
    }
  },
  methods: {
    async onChangeStation(station) {
      await this.$store.dispatch("startTrip", station);
    },
    autocompleteFilter(item, queryText, itemText) {
      // same as default but adding _.deburr
      return (
        _.deburr(itemText)
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
</style>
