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
      v-if="activeStation"
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
      stations: []
    };
  },
  mounted() {
    this.getStations();
  },
  methods: {
    async getStations() {
      try {
        const stations = await stationsApi.getStations();
        this.stations = stations.map(station => {
          return this.stationFormMapper(station);
        });
      } catch (e) {
        this.stations = [];
      }
    },
    setActiveStation(station) {
      this.$store.dispatch("setActiveStation", station);
    },
    stationFormMapper(station) {
      return {
        text: station.name,
        value: {
          id: station.id,
          name: station.name,
          lat: station.lat,
          lng: station.lng
        }
      };
    }
  },
  computed: {
    activeStation() {
      const station = this.$store.state.nearestStation.station;
      if (!_.isEmpty(station)) {
        return this.stationFormMapper(station);
      } else {
        return null;
      }
    }
  }
};
</script>

<style lang="scss" scoped></style>
