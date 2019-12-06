<template>
  <v-form ref="form">
    <v-autocomplete
      label="Start from..."
      data-test-id="destination-1"
      :items="stations"
      filled
      rounded
      @change="setActiveStation"
      :value="activeStation"
    ></v-autocomplete>
    <v-autocomplete
      v-if="hasActiveStation"
      label="Where next?"
      data-test-id="destination-2"
      :items="stations"
      filled
      rounded
    ></v-autocomplete>
  </v-form>
</template>

<script>
import stationsApi from "@/api/stations";
import _ from "lodash";

export default {
  data() {
    return {
      stations: null
    };
  },
  async mounted() {
    const stations = await stationsApi.getStations();
    this.stations = stations.map(station => {
      return {
        text: station.name,
        value: station
      };
    });
  },
  methods: {
    setActiveStation(station) {
      this.$store.dispatch("setActiveStation", station);
    }
  },
  computed: {
    activeStation() {
      const station = this.$store.state.nearestStation.station;
      if (!_.isEmpty(station)) {
        return {
          text: station.name,
          value: {
            name: station.name,
            lat: station.lat,
            lng: station.lng
          }
        };
      } else {
        return {};
      }
    },
    hasActiveStation() {
      return !_.isEmpty(this.activeStation);
    }
  }
};
</script>

<style lang="scss" scoped></style>
