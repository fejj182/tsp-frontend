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
    <v-alert
      v-if="invalid"
      data-test-id="invalid"
      v-model="invalid"
      text
      dense
      dismissible
      type="info"
    >
      No stop selected
    </v-alert>
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
      info: true,
      invalid: false
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
      if (this.$store.state.trip.selectedStop) {
        this.$store.dispatch(
          "confirmStop",
          this.$store.state.trip.selectedStop
        );
      } else {
        this.invalid = true;
      }
    },
    onAlert() {
      this.alert = true;
    },
    resetTrip() {
      this.$refs.form.reset();
      this.$store.dispatch("resetTrip");
    },
    saveTrip() {
      tripApi.create(this.$store.getters.completeTrip);
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
