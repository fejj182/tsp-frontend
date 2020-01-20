<template>
  <div>
    <v-autocomplete
      label="Start from..."
      data-test-id="destination-1"
      :items="stations"
      filled
      rounded
      @change="onChangeStartingDestination"
      :value="startingStation"
    ></v-autocomplete>
  </div>
</template>

<script>
import stationsApi from "@/api/stations";
import mapStation from "./stationFormMapper";

export default {
  data() {
    return {
      stations: []
    };
  },
  computed: {
    startingStation() {
      let station = this.$store.state.trip.startingStation;
      if (station) {
        station = mapStation(station);
      }
      return station;
    }
  },
  methods: {
    async getStations() {
      this.stations = [];
      try {
        const stations = await stationsApi.getStations();
        this.stations = stations.map(station => {
          return mapStation(station);
        });
      } catch (e) {
        this.$emit("alert");
      }
    },
    async onChangeStartingDestination(station) {
      this.$store.dispatch("resetTrip");
      try {
        await this.$store.dispatch("addStopToTrip", station);
      } catch (e) {
        this.$emit("alert");
      }
    }
  },
  mounted() {
    this.getStations();
  }
};
</script>

<style lang="scss" scoped></style>
