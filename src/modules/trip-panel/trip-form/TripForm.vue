<template>
  <v-form ref="form" @submit.prevent="onSubmit" id="trip-form">
    <StartingDestination v-if="showStartingDestination" />
    <Stop
      v-for="(stop, index) in stops"
      :key="index"
      :stations="stop.stations"
      :read-only="stop.readOnly"
      :fixed-stop="stop.fixed"
      :stop-number="parseInt(index) + 1"
      v-on:scroll-form-to-bottom="$emit('scroll-form-to-bottom')"
    />
    <p id="total-duration" v-if="completeTrip.length > 2">
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
    <v-alert
      v-if="copySucceeded === true"
      dense
      text
      color="indigo"
      data-test-id="copy-success"
    >
      <v-icon color="indigo" left>mdi-share-variant</v-icon> Link copied to
      clipboard.
    </v-alert>
    <v-alert
      v-if="copySucceeded === false"
      dense
      type="error"
      data-test-id="copy-failure"
    >
      Agh the copy action failed, check your URL instead.
    </v-alert>
    <TripActions
      v-if="hasStops"
      v-on:reset-trip="resetTrip"
      v-on:save-trip="onSubmit"
      v-on:copy-success="onCopySuccess"
      v-on:copy-failure="onCopyFailure"
    />
  </v-form>
</template>

<script>
import StartingDestination from "@/modules/trip-panel/trip-form/inputs/StartingDestination.vue";
import Stop from "@/modules/trip-panel/trip-form/inputs/Stop.vue";
import TripActions from "@/modules/trip-panel/trip-form/TripActions";
import tripApi from "@/api/trip";
import { toHoursAndMinutes } from "@/mappers/durationMapper";

export default {
  components: {
    TripActions,
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
    resetTrip() {
      this.$refs.form.reset();
      this.$store.dispatch("resetTrip");
      this.$store.dispatch("resetFilters");
      this.$router.push("/");
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
          this.$nextTick(() => {
            this.$emit("scroll-form-to-bottom");
          });
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
        this.$nextTick(() => {
          this.$emit("scroll-form-to-bottom");
        });
        setTimeout(() => {
          this.updated = false;
        }, 3000);
      }
    },
    onCopySuccess() {
      this.copySucceeded = true;
      this.$nextTick(() => {
        this.$emit("scroll-form-to-bottom");
      });
      setTimeout(() => {
        this.copySucceeded = null;
      }, 2000);
    },
    onCopyFailure() {
      this.copySucceeded = false;
      this.$nextTick(() => {
        this.$emit("scroll-form-to-bottom");
      });
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
  p {
    margin-left: 0.5rem;
    color: rgba(0, 0, 0, 0.87);
    span {
      color: #303f9f;
    }
  }
}

@media only screen and (max-width: $width-desktop) {
  .v-form {
    padding: 1rem;
    padding-top: 0.25rem;
  }

  .v-alert {
    margin-top: 1rem;
  }

  #total-duration {
    margin-bottom: 0.25rem;
  }
}
</style>
