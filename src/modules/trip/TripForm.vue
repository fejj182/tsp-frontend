<template>
  <v-form ref="form" @submit.prevent="onSubmit" id="trip-form">
    <StartingDestination v-if="showStartingDestination" />
    <div v-for="(stop, index) in stops" :key="index">
      <!-- TODO: Dependency here on properties existing in each stop -->
      <Stop
        class="stop"
        :stations="stop.stations"
        :read-only="stop.readOnly"
        :fixed-stop="stop.fixed"
        :stop-number="parseInt(index) + 1"
      />
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
    <v-alert
      v-if="alias"
      data-test-id="success-alias"
      dense
      text
      dismissible
      type="success"
    >
      Your trip has been created at your personal URL!
    </v-alert>
    <v-alert
      v-if="updated"
      data-test-id="success-updated"
      dense
      text
      type="success"
    >
      Trip {{ alias }} updated!
    </v-alert>
    <v-alert v-if="copySucceeded === true" dense text color="indigo">
      <v-icon color="indigo" left>mdi-share-variant</v-icon> Link copied to
      clipboard.
    </v-alert>
    <v-alert v-if="copySucceeded === false" dense type="error">
      Agh the copy action failed, check your URL instead.
    </v-alert>
    <div class="btn-row">
      <v-btn v-if="hasStops" @click="onAddStop" data-test-id="add-stop">
        <v-icon left>mdi-clipboard-plus-outline</v-icon>Add
      </v-btn>
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
        <v-icon left>mdi-bookmark</v-icon>{{ save }}
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
import StartingDestination from "@/modules/trip/inputs/StartingDestination.vue";
import Stop from "@/modules/trip/inputs/Stop.vue";
import tripApi from "@/api/trip";

export default {
  components: {
    StartingDestination,
    Stop
  },
  data() {
    return {
      invalid: false,
      alias: null,
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
    completeTrip() {
      return this.$store.getters.completeTrip;
    },
    save() {
      return this.$route.name != "alias" ? "Save" : "Update";
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
    }
  },
  methods: {
    onAddStop() {
      if (this.$store.state.trip.selectedStop) {
        this.$store.dispatch(
          "fetchConnections",
          this.$store.state.trip.selectedStop
        );
      } else {
        this.invalid = true;
      }
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
          this.alias = response.alias;
          this.$router.push("trip/" + response.alias);
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
        }, 2000);
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

@media only screen and (max-width: 600px) {
  .v-form {
    padding: 4px;
  }

  #trip-form .v-btn {
    min-width: 110px;
  }
}
</style>

<style lang="scss">
#trip-form {
  .v-input {
    margin-bottom: 2rem;
  }
}

@media only screen and (max-width: 600px) {
  #trip-form {
    .v-input {
      margin-bottom: 1.5rem;
    }
  }
}
</style>
