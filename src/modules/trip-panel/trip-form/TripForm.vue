<template>
  <v-form ref="form" @submit.prevent="onSubmit" id="trip-form">
    <StartingDestination v-if="showStartingDestination" />
    <Stop
      v-for="(stop, index) in stops"
      :key="index"
      class="stop"
      :stations="stop.stations"
      :read-only="stop.readOnly"
      :fixed-stop="stop.fixed"
      :stop-number="parseInt(index) + 1"
    />
    <v-btn
      v-if="showAddDestination"
      @click="onAddStop"
      id="add-stop"
      data-test-id="add-stop"
      text
    >
      + Add destination
    </v-btn>
    <p data-test-id="total-duration" v-if="completeTrip.length > 2">
      Total travel time: <span>{{ this.totalDurationBetweenStops }}</span>
    </p>
    <v-alert
      v-if="success"
      data-test-id="success-alias"
      dense
      text
      dismissible
      type="success"
    >
      Trip created! Share or bookmark this page as you please.
    </v-alert>
    <v-alert
      v-if="updated"
      data-test-id="success-updated"
      dense
      text
      type="success"
    >
      Trip updated!
    </v-alert>
    <v-alert v-if="copySucceeded === true" dense text color="indigo">
      <v-icon color="indigo" left>mdi-share-variant</v-icon> Link copied to
      clipboard.
    </v-alert>
    <v-alert v-if="copySucceeded === false" dense type="error">
      Agh the copy action failed, check your URL instead.
    </v-alert>
    <div class="btn-row btn-row-first">
      <v-btn v-if="hasStops" @click="resetTrip" data-test-id="reset-trip">
        <v-icon left>mdi-restore</v-icon>Reset
      </v-btn>
    </div>
    <div class="btn-row">
      <v-btn
        v-if="hasStops"
        type="submit"
        color="primary"
        :block="!tripSaved"
        data-test-id="save-trip"
      >
        <v-icon left>
          mdi-bookmark
        </v-icon>
        Save
      </v-btn>

      <v-btn
        v-if="tripSaved"
        color="primary"
        v-clipboard:copy="url"
        v-clipboard:success="onCopySuccess"
        v-clipboard:error="onCopyFailure"
        data-test-id="copy-url"
      >
        <v-icon left>mdi-content-copy</v-icon> Share
      </v-btn>
    </div>
  </v-form>
</template>

<script>
import StartingDestination from "@/modules/trip-panel/trip-form/inputs/StartingDestination.vue";
import Stop from "@/modules/trip-panel/trip-form/inputs/Stop.vue";
import tripApi from "@/api/trip";
import { toHoursAndMinutes } from "@/mappers/durationMapper";

export default {
  components: {
    StartingDestination,
    Stop
  },
  data() {
    return {
      success: false,
      updated: false,
      copySucceeded: null
    };
  },
  computed: {
    stops() {
      return this.$store.state.trip.stops;
    },
    hasStops() {
      return this.$store.getters.hasStops;
    },
    showAddDestination() {
      return this.hasStops && this.$store.state.trip.selectedStop;
    },
    completeTrip() {
      return this.$store.getters.completeTrip;
    },
    tripSaved() {
      return this.$route.name === "alias" && this.hasStops;
    },
    url() {
      return window.location.href;
    },
    showStartingDestination() {
      return (
        this.$store.state.trip.startingStation ||
        this.$store.state.stations.startingStations.length > 0
      );
    },
    totalDurationBetweenStops() {
      const totalDuration = this.completeTrip
        .map(stop => stop.duration)
        .filter(duration => !!duration)
        .reduce((acc, curr) => acc + curr);
      return toHoursAndMinutes(totalDuration);
    }
  },
  methods: {
    onAddStop() {
      this.$store.dispatch(
        "fetchConnections",
        this.$store.state.trip.selectedStop
      );
    },
    resetTrip() {
      this.$refs.form.reset();
      this.$store.dispatch("resetTrip");
      if (this.$route.name === "alias") {
        this.$router.push("/planner");
      }
    },
    onSubmit() {
      if (this.$route.name === "alias") {
        this.updateTrip();
      } else {
        this.saveTrip();
      }
    },
    async saveTrip() {
      if (this.completeTrip.length >= 2) {
        const response = await tripApi.create(this.completeTrip);
        if (response && response.alias) {
          this.$router.push("trip/" + response.alias);
          this.success = true;
          setTimeout(() => {
            this.success = false;
          }, 10000);
        }
      }
    },
    async updateTrip() {
      const response = await tripApi.update(
        this.$route.params.alias,
        this.completeTrip
      );
      if (response) {
        this.updated = true;
        setTimeout(() => {
          this.updated = false;
        }, 3000);
      }
    },
    onCopySuccess() {
      this.copySucceeded = true;
      setTimeout(() => {
        this.copySucceeded = null;
      }, 2000);
    },
    onCopyFailure() {
      this.copySucceeded = false;
      setTimeout(() => {
        this.copySucceeded = null;
      }, 2000);
    }
  }
};
</script>

<style lang="scss" scoped>
.v-form {
  padding-top: 16px;
}

#trip-form .v-btn {
  min-width: 125px;
}

.btn-row {
  display: flex;
  justify-content: space-between;
  margin: 0.75rem;
}

.btn-row-first {
  margin-top: 2rem;
}

p {
  margin-left: 0.5rem;
}

span {
  color: #303f9f;
}

#add-stop {
  margin-top: -1rem;
  margin-bottom: 1rem;
  text-transform: none;
  text-decoration: underline;
}

@media only screen and (max-width: 600px) {
  .v-form {
    padding: 4px;
  }

  #trip-form .v-btn {
    min-width: 115px;
  }
}
</style>

<style lang="scss">
#trip-form {
  .v-input {
    margin-bottom: 1.5rem;
  }
}
</style>
