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
    <FirstStop @alert="onAlert" />
    <div v-for="(stop, index) in stops" :key="index">
      <!-- TODO: Dependency here on properties existing in each stop -->
      <Stop class="stop" :stations="stop.stations" :read-only="stop.readOnly" />
    </div>
    <div class="btn-row">
      <v-btn v-if="hasStops" @click="onAddStop" data-test-id="add-stop">
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
import FirstStop from "@/modules/trip/inputs/FirstStop.vue";
import Stop from "@/modules/trip/inputs/Stop.vue";
import tripApi from "@/api/trip";

export default {
  components: {
    FirstStop,
    Stop
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
      return this.$store.getters.hasStops;
    }
  },
  methods: {
    onAddStop() {
      this.$store.dispatch("confirmStop", this.$store.state.trip.selectedStop);
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
