<template>
  <v-form ref="form" class="pa-4" @submit.prevent="saveTrip">
    <v-alert
      data-test-id="alert"
      v-if="alert"
      v-model="alert"
      dismissible
      type="error"
    >
      Service down. Please try again later.
    </v-alert>
    <StartInput @alert="onAlert" />
    <div v-for="(stop, index) in stops" :key="index">
      <ConnectionInput
        class="connection"
        :connections="stop.connections"
        :read-only="stop.readOnly"
      />
    </div>
    <v-btn
      v-if="hasStops"
      @click="onAddConnection"
      data-test-id="add-destination"
    >
      <v-icon left>mdi-plus</v-icon>
      <span>Add destination</span>
    </v-btn>
    <v-btn v-if="hasStops" @click="resetTrip" data-test-id="reset-trip">
      Reset Trip
    </v-btn>
    <v-btn type="submit" v-if="hasStops" data-test-id="save-trip">
      Save Trip
    </v-btn>
  </v-form>
</template>

<script>
import StartInput from "./StartInput.vue";
import ConnectionInput from "./ConnectionInput.vue";
import tripApi from "@/api/trip";

export default {
  components: {
    StartInput,
    ConnectionInput
  },
  data() {
    return {
      alert: false,
      trip: {}
    };
  },
  computed: {
    stops() {
      return this.$store.state.trip.stops;
    },
    hasStops() {
      return this.stops.length > 0 && this.$store.state.trip.selectedConnection;
    }
  },
  methods: {
    onAddConnection() {
      this.$store.dispatch(
        "addStopToTrip",
        this.$store.state.trip.selectedConnection
      );
    },
    onAlert() {
      this.alert = true;
    },
    resetTrip() {
      this.$refs.form.reset();
      this.$store.dispatch("resetTripForm");
    },
    saveTrip() {
      tripApi.create(this.trip);
    }
  }
};
</script>

<style lang="scss" scoped>
button {
  margin: 0.25rem;
}
</style>
