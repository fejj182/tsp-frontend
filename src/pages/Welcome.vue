<template>
  <div id="welcome" :style="{ backgroundImage: `url(${backgroundImage.src})` }">
    <v-col :md="5" class="page">
      <h1 data-test-id="welcome-title">
        Forget flying.
      </h1>
      <h2>Let us help you plan your next trip by train.</h2>
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
      <span id="photo-credit"
        >Photo by
        <a :href="backgroundImage.photographerHref">{{
          backgroundImage.photographer
        }}</a>
        on
        <a :href="backgroundImage.unsplashHref">Unsplash</a>
      </span>
    </v-col>
    <v-col :md="5" :offset-md="7" class="page">
      <div class="section" id="how-it-works">
        <h1><span>How it works</span> 🤔</h1>
        <p>
          Tell us where you want to start from and how long you prefer to travel
          for.
        </p>
        <p>
          We will show you some suggested connections. You can then build your
          ideal adventure stop by stop.
        </p>
        <p>
          Once it's all planned out, you can book your tickets and whatever else
          you need from our selected partners.
        </p>
      </div>
    </v-col>
    <v-col :md="5" class="page">
      <div class="section">
        <h1><span>Our mission</span> 🌍</h1>
        <p>
          We have spent years travelling to all corners of the world. We can go
          from the heart of Asia to Eastern Europe in a matter of hours.
        </p>
        <p>
          However, this model is simply not sustainable with the volume CO2
          generated during air travel.
        </p>
        <p>
          At Trainspotter, we believe it's still possible to cross borders and
          see incredible new places while having less environmental impact.
        </p>
        <p>
          So join us on our travel revolution, where we make your journey part
          of the trip.
        </p>
        <p>
          Yours,
          <br />
          Trainspotter
        </p>
      </div>
    </v-col>
    <span v-show="false">Awin</span>
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
  created() {
    this.$store.dispatch("fetchStartingStations");
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
        this.$router.push("/trip-planner");
      }
    }
  }
};
</script>

<style lang="scss" scoped>
#welcome {
  max-width: 100%;
  width: calc(100%);
  height: calc(100vh - 64px);
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

.section {
  background: rgba(48, 63, 159, 0.8);
  h1 {
    span {
      text-decoration: underline;
    }
  }
}

#how-it-works {
  h1,
  p {
    margin-bottom: 1.5rem;
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

#photo-credit {
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
