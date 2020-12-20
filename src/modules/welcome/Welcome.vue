<template>
  <div id="welcome" :style="{ backgroundImage: `url(${backgroundImage.src})` }">
    <v-row>
      <v-col :md="5" class="page">
        <h1 data-test-id="welcome-title">
          Where can you reach by train today?
        </h1>
        <h2>Tell us how much time you have and we'll do the rest.</h2>
        <h3>With <v-icon>mdi-heart</v-icon> for multi-journeys in Europe.</h3>

        <v-form
          ref="form"
          v-model="valid"
          @submit.prevent="onSubmit"
          id="welcome-form"
        >
          <StartingDestination v-on:change-station="onChangeStartingStation" />
          <MaxJourneyTime />
          <v-btn
            type="submit"
            color="secondary"
            rounded
            id="find-destinations-btn"
          >
            Find Routes
          </v-btn>
        </v-form>
        <span
          >Photo by
          <a :href="backgroundImage.photographerHref">{{
            backgroundImage.photographer
          }}</a>
          on
          <a :href="backgroundImage.unsplashHref">Unsplash</a>
        </span>
      </v-col>
    </v-row>
    <v-row>
      <v-col :md="5" :offset-md="7" class="page">
        <div id="mission">
          <h1>Our mission</h1>
          <p>
            We have spent years travelling to all corners of the world. At great
            speed, we can go from the heart of Asia to Eastern Europe in a
            matter of hours. However, this model is simply not sustainable
            considering the volume of CO2 generated during air travel.
          </p>
          <p>
            At Trainspotter, we want to travel another way. We can still cross
            borders, but want to be able to see them as we pass. We can still
            see incredible new places, but it just so happens they are a bit
            closer to home.
          </p>
          <p>
            Join us on our travel revolution, where we make your journey part of
            the trip.
          </p>
          <p>
            Enjoy the journey.
          </p>
          <p>
            Yours,
            <br />
            Trainspotter
          </p>
        </div>
      </v-col>
    </v-row>
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
    backgroundImage() {
      if (window.innerWidth < 992) {
        return {
          src: require("@/assets/onur-k-D5Plb33eKZc-unsplash.jpg"),
          photographerHref:
            "https://unsplash.com/@kodozani?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText",
          photographer: "Onur K",
          unsplashHref:
            "https://unsplash.com/s/photos/rail?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText"
        };
      } else {
        return {
          src: require("@/assets/charles-forerunner-gapYVvUg1M8-unsplash.jpg"),
          photographerHref:
            "https://unsplash.com/@charles_forerunner?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText",
          photographer: "Charles Forerunner",
          unsplashHref:
            "https://unsplash.com/s/photos/train?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText"
        };
      }
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
#welcome {
  max-width: 100%;
  width: calc(100% - 4px);
  height: calc(100vh - 72px);
  padding: 1rem;
  opacity: 0.9;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 50% 50%;
  overflow-y: scroll;

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

.page {
  height: calc(100vh - 72px - 1rem);
}

#mission {
  background: rgba(48, 63, 159, 0.8);
  h1 {
    text-decoration: underline;
  }
}

#welcome-form {
  display: flex;
  flex-direction: column;
  padding: 2rem 4rem;
}

h1,
h2,
h3,
p {
  color: white;
  padding: 0.25em;
}

h1,
h2,
h3 {
  text-align: center;
}

h1 {
  font-size: 32px;
}

h2 {
  font-size: 20px;
}

h3,
p {
  font-size: 18px;
}

p {
  padding: 0.75rem;
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

@media only screen and (max-width: $width-desktop) {
  #welcome {
    width: 100%;
    height: calc(100vh - 56px);
  }

  #welcome-form {
    padding: 0.5rem;
  }

  .page {
    height: calc(100vh - 56px - 1rem);
  }

  h1 {
    font-size: 28px;
  }

  h2 {
    font-size: 18px;
  }

  h3,
  p {
    font-size: 16px;
  }

  p {
    padding: 0rem 0.5rem;
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
