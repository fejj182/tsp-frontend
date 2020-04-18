<template>
  <div>
    <v-autocomplete
      label="Start from..."
      data-test-id="first-stop"
      :items="stations"
      filled
      rounded
      @change="onChangeStation"
      :value="startingStation"
    ></v-autocomplete>
  </div>
</template>

<script>
import stationsApi from "@/api/stations";
import { mapStation, mapStations } from "@/mappers/stationFormMapper";

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
  created() {
    this.fetchStations();
  },
  methods: {
    async fetchStations() {
      this.stations = [];
      try {
        const stations = await stationsApi.getStations();
        this.stations = mapStations(stations);
      } catch (e) {
        this.$emit("alert");
      }
    },
    async onChangeStation(station) {
      this.$store.dispatch("startTrip", station);
      try {
        await this.$store.dispatch("confirmStop", station);
      } catch (e) {
        this.$emit("alert");
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.v-autocomplete {
  z-index: 1500;
}
</style>
