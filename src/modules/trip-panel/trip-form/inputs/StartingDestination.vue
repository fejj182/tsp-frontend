<template>
  <div id="starting-destination">
    <v-autocomplete
      label="Start from..."
      data-test-id="starting-destination"
      :items="filteredStations"
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
      <template v-slot:item="{ item }">
        <span :id="'list-item-' + item.value.slug">{{ item.text }}</span>
      </template>
      <template v-slot:prepend-item>
        <v-list-group prepend-icon="mdi-filter">
          <template v-slot:activator>
            <v-list-item-title data-test-id="countries"
              >Countries</v-list-item-title
            >
          </template>
          <v-list-item
            ripple
            @click="toggleCountry"
            v-for="country in countries"
            :key="country"
            :id="`${country}`"
          >
            <v-list-item-action>
              <v-icon
                :color="
                  selectedCountries.length > 0 ? 'indigo darken-4' : 'indigo'
                "
              >
                {{ icon(country) }}
              </v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>
                {{ countryMap[country] }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
      </template>
    </v-autocomplete>
  </div>
</template>

<script>
// TODO: Remove state from component
import { mapStation, mapStations } from "@/mappers/stationFormMapper";
import deburr from "lodash/deburr";
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
    },
    toggleCountry(event) {
      this.selectedCountries = xor(this.selectedCountries, [
        event.target.closest(".v-list-item").id
      ]);
    },
    icon(country) {
      if (this.selectedCountries.indexOf(country) != -1) {
        return "mdi-checkbox-marked";
      } else {
        return "mdi-checkbox-blank-outline";
      }
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
.v-list-item__action {
  margin-right: 16px !important;
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

.v-list-group {
  .v-list-item__icon {
    margin-right: 16px !important;
    .v-icon {
      color: #303f9f;
    }
  }
}
</style>
