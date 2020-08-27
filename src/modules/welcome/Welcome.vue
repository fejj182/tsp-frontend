<template>
  <div id="welcome" :style="{ backgroundImage: `url(${image})` }">
    <h1 data-test-id="welcome-title">
      The interactive route planner for your next train trip in Europe.
    </h1>
    <h2>
      Travel slow, efficient and sustainably.
    </h2>
    <h2>Built with <v-icon>mdi-heart</v-icon> for multi-journeys.</h2>

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
import StartingDestination from "@/modules/trip/inputs/StartingDestination";
import MaxJourneyTime from "@/modules/trip/inputs/MaxJourneyTime";
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
  padding: 0.5em;
  font-size: 24px;
  text-align: center;
  color: white;
}

h2 {
  padding: 0.25em;
  font-size: 18px;
  text-align: center;
  color: white;
}

#welcome {
  max-width: 100%;
  height: 100%;
  margin-right: 4px;
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

@media only screen and (max-width: 600px) {
  #welcome-form {
    padding: 1rem;
  }
}

@media only screen and (max-width: 600px) {
  #welcome {
    margin-right: 0;
  }
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
</style>

<style lang="scss">
#welcome {
  .v-input {
    margin: 0.25rem 0;
  }
}
</style>
