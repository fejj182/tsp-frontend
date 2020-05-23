<template>
  <v-form ref="form" @submit.prevent="onSubmit" id="trip-form">
    <StartingDestination />
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
      type="success"
      dismissible
    >
      Trip {{ alias }} created! Bookmark your personal URL.
    </v-alert>
    <v-alert
      v-if="updated"
      data-test-id="success-updated"
      type="success"
      dismissible
    >
      Trip {{ alias }} updated!
    </v-alert>
    <div class="btn-row">
      <v-btn v-if="hasStops" @click="onAddStop" data-test-id="add-stop">
        <v-icon left>mdi-plus</v-icon>
        <span>{{ add }}</span>
      </v-btn>
      <v-btn v-if="hasStops" @click="resetTrip" data-test-id="reset-trip">
        {{ reset }}
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
        {{ save }}
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
      updated: false
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
    add() {
      return window.innerWidth < 600 ? "Add" : "Add stop";
    },
    reset() {
      return window.innerWidth < 600 ? "Reset" : "Reset trip";
    },
    save() {
      return window.innerWidth < 600 ? "Save" : "Save for later";
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
      if (this.$route.name !== "home") {
        this.$router.push("/");
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
          setTimeout(() => {
            this.alias = null;
          }, 7500);
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
        }, 7500);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.v-form {
  padding-top: 16px;
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
