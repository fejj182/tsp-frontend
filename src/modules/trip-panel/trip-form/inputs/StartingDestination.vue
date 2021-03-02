<template>
  <div id="starting-destination">
    <v-select
      label="Start from..."
      data-test-id="starting-destination"
      :items="filteredStations"
      background-color="grey lighten-4"
      :prepend-inner-icon="innerIcon"
      filled
      rounded
      hide-details
      @change="onChangeStation"
      :value="startingStation"
      :rules="validationRules"
      append-icon=""
      required
    >
      <template v-slot:prepend-item>
        <v-list-item
          ripple
          @click="toggleCountry"
          v-for="country in countries"
          :key="country"
          :id="`${country}`"
        >
          <v-list-item-action>
            <v-icon
              :color="selectedCountries.length > 0 ? 'indigo darken-4' : ''"
            >
              {{ icon }}
            </v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              {{ countryMap[country] }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-select>
  </div>
</template>

<script>
// TODO: Remove state from component
import { mapStation, mapStations } from "@/mappers/stationFormMapper";
import uniq from "lodash/uniq";
import xor from "lodash/xor";

export default {
  data() {
    return {
      validationRules: this.$route.name === "welcome" ? [value => !!value] : [],
      countryMap: { ES: "Spain", FR: "France", PT: "Portugal" },
      selectedCountries: []
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
    filteredStations() {
      if (this.selectedCountries.length == 0) {
        return this.stations;
      }
      console.log(
        this.selectedCountries,
        this.$store.state.stations.startingStations
      );
      return mapStations(
        this.$store.state.stations.startingStations.filter(
          station => this.selectedCountries.indexOf(station.country) != -1
        )
      );
    },
    countries() {
      return uniq(
        this.$store.state.stations.startingStations.map(
          station => station.country
        )
      );
    },
    innerIcon() {
      return this.$route.name === "welcome" ? "mdi-train" : "";
    },
    icon() {
      // if (this.likesAllFruit) return "mdi-close-box";
      // if (this.likesSomeFruit) return "mdi-minus-box";
      return "mdi-checkbox-blank-outline";
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
    toggleCountry(event) {
      this.selectedCountries = xor(this.selectedCountries, [
        event.target.closest(".v-list-item").id
      ]);
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
