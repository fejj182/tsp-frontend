<template>
  <div id="welcome" :style="{ backgroundImage: `url(${image})` }">
    <h1 data-test-id="welcome-title">
      Where can you reach by train today?
    </h1>
    <h2>
      Tell us how much time you have and we'll do the rest.
    </h2>
    <h3>With <v-icon>mdi-heart</v-icon> for multi-journeys in Europe.</h3>

    <v-form
      ref="form"
      v-model="valid"
      @submit.prevent="onSubmit"
      id="welcome-form"
    >
      <StartingDestination v-on:change-station="onChangeStartingStation" />
      <MaxJourneyTime />
      <v-btn type="submit" color="secondary" rounded id="find-destinations-btn">
        Find Routes
      </v-btn>
    </v-form>

    <span
      >Photo by
      <a
        href="https://unsplash.com/@kodozani?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText"
        >Onur K</a
      >
      on
      <a
        href="/s/photos/rail?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText"
        >Unsplash</a
      >
    </span>
  </div>
</template>

<script>
import StartingDestination from "@/modules/trip-panel/trip-form/inputs/StartingDestination";
import MaxJourneyTime from "@/modules/trip-panel/trip-form/inputs/MaxJourneyTime";
export default {
  data() {
    return {
      startingStation: null,
      maxJourneyTime: null,
      valid: true
    };
  },
  components: {
    StartingDestination,
    MaxJourneyTime
  },
  computed: {
    image() {
      return require("@/assets/onur-k-D5Plb33eKZc-unsplash.jpg");
    }
  },
  methods: {
    onChangeStartingStation(station) {
      this.startingStation = station;
    },
    onSubmit() {
      const storeStartingStation = this.$store.state.trip.startingStation;
      const startingStation = storeStartingStation
        ? storeStartingStation
        : this.startingStation;
      this.$refs.form.validate();
      if (startingStation) {
        this.$store.dispatch("startTrip", startingStation);
        this.$router.push("/planner");
      }
    }
  }
};
</script>

<style lang="scss" scoped>
h1 {
  padding: 0.25em;
  font-size: 32px;
  text-align: center;
  color: white;
}

h2,
h3 {
  color: white;
  padding: 0.25em;
  text-align: center;
}

h2 {
  font-size: 20px;
}

h3 {
  font-size: 18px;
}

#welcome {
  max-width: 100%;
  width: calc(100% - 4px);
  height: 100%;
  padding: 1rem;
  opacity: 0.9;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 50% 50%;

  i {
    color: #303f9f;
  }

  #find-destinations-btn {
    margin-top: 1rem;
    i {
      color: white;
    }
  }
}

#welcome-form {
  display: flex;
  flex-direction: column;
  padding: 2rem;
}

span {
  color: white;
  opacity: 0.8;
  position: absolute;
  bottom: 0;
  padding: 0.15rem;
  margin: 0.5rem 0.25rem;
  a {
    color: white;
  }
}

@media only screen and (max-width: 600px) {
  #welcome-form {
    padding: 0.5rem;
  }

  h1 {
    font-size: 28px;
  }

  h2 {
    font-size: 18px;
  }

  h3 {
    font-size: 16px;
  }
}

@media only screen and (max-width: 992px) {
  #welcome {
    width: 100%;
  }
}
</style>

<style lang="scss">
#welcome {
  .v-input {
    margin: 0.25rem 0;
  }
}
</style>
