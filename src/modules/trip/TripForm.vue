<template>
  <v-form ref="form">
    <v-alert
      data-test-id="alert"
      v-if="alert"
      v-model="alert"
      dismissible
      type="error"
    >
      Service down. Please try again later.
    </v-alert>
    <v-autocomplete
      label="Start from..."
      data-test-id="destination-1"
      :items="stations"
      filled
      rounded
      @change="onChangeStartingDestination"
      :value="activeStation"
    ></v-autocomplete>
    <v-autocomplete
      v-if="activeStation"
      label="Where next?"
      data-test-id="destination-2"
      :items="connections"
      filled
      rounded
      @change="onChangeConnection"
    ></v-autocomplete>
  </v-form>
</template>

<script>
import stationsApi from "@/api/stations";
import _ from "lodash";

export default {
  data() {
    return {
      alert: false,
      stations: []
    };
  },
  mounted() {
    this.getStations();
  },
  methods: {
    async getStations() {
      this.stations = [];
      try {
        const stations = await stationsApi.getStations();
        this.stations = this.stationFormMapper(stations);
      } catch (e) {
        this.alert = true;
      }
    },
    async onChangeStartingDestination(startingStation) {
      try {
        await this.$store.dispatch("addStationsToMap", startingStation);
      } catch (e) {
        this.alert = true;
      }
    },
    onChangeConnection(station) {
      this.$store.dispatch("openPopup", station);
    },
    stationFormMapper(stations) {
      return stations.map(station => {
        return this.mapStation(station);
      });
    },
    mapStation(station) {
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
      const station = this.$store.state.stations.activeStation;
      if (!_.isEmpty(station)) {
        return this.mapStation(station);
      } else {
        return null;
      }
    },
    connections() {
      return this.stationFormMapper(this.$store.state.stations.connections);
    }
  }
};
</script>

<style lang="scss" scoped></style>
