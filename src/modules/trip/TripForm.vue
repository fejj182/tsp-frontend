<template>
  <v-form ref="form" @submit.prevent="saveTrip">
    <v-alert
      data-test-id="alert"
      v-if="alert"
      v-model="alert"
      dismissible
      type="error"
    >
      Service down. Please try again later.
    </v-alert>
    <v-fade-transition>
      <v-alert
        color="teal"
        v-if="info"
        dark
        text
        dense
        icon="mdi-school"
        dismissible
      >
        Click map to find nearest station
      </v-alert>
    </v-fade-transition>
    <StartInput @alert="onAlert" />
    <div v-for="(stop, index) in stops" :key="index">
      <ConnectionInput
        class="connection"
        :connections="stop.connections"
        :read-only="stop.readOnly"
      />
    </div>
    <div class="btn-row">
      <v-btn
        v-if="hasStops"
        @click="onAddConnection"
        data-test-id="add-destination"
      >
        <v-icon left>mdi-plus</v-icon>
        <span>Add stop</span>
      </v-btn>
      <v-btn v-if="hasStops" @click="resetTrip" data-test-id="reset-trip">
        Reset Trip
      </v-btn>
    </div>
    <div class="btn-row">
      <v-btn
        type="submit"
        v-if="hasStops"
        data-test-id="save-trip"
        color="primary"
        block
      >
        Save Trip
      </v-btn>
    </div>
  </v-form>
</template>

<script>
import StartInput from "@/modules/trip/inputs/StartInput.vue";
import ConnectionInput from "@/modules/trip/inputs/ConnectionInput.vue";
import tripApi from "@/api/trip";

export default {
  components: {
    StartInput,
    ConnectionInput
  },
  data() {
    return {
      alert: false,
      trip: {},
      info: true
    };
  },
  mounted() {
    setTimeout(() => {
      this.info = false;
    }, 7500);
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
.v-form {
  padding: 16px;
}

.btn-row {
  display: flex;
  justify-content: space-between;
  margin: 0.75rem;
}

@media only screen and (max-width: 600px) {
  .v-form {
    padding: 4px;
  }
}
</style>
