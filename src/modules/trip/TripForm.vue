<template>
  <v-form ref="form">
    <v-autocomplete
      label="Choose starting destination"
      :items="stations"
      filled
      rounded
      @change="setActiveStation"
      v-model="activeStation"
    ></v-autocomplete>
  </v-form>
</template>

<script>
import stationsApi from "@/api/stations";

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
      return {
        text: station.name,
        value: {
          name: station.name,
          lat: station.lat,
          lng: station.lng
        }
      };
    }
  }
};
</script>

<style lang="scss" scoped></style>
