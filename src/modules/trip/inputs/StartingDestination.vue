<template>
  <div id="starting-destination">
    <v-autocomplete
      label="Start from..."
      data-test-id="starting-destination"
      :items="stations"
      :filter="autocompleteFilter"
      background-color="grey lighten-4"
      filled
      rounded
      hide-details
      @change="onChangeStation"
      :value="startingStation"
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
import { mapStation, mapStations } from "@/mappers/stationFormMapper";
import deburr from "lodash/deburr";

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
      if (this.$route.name === "welcome") {
        this.$router.push("/planner");
      }
      await this.$store.dispatch("startTrip", station);
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
</style>

<style lang="scss">
@media only screen and (max-width: 600px) {
  #starting-destination {
    .v-input {
      margin-top: 1rem;
    }
  }
}
</style>
