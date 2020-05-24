<template>
  <div>
    <v-app-bar app color="primary" dark id="header">
      <!-- <header> -->
      <a href="/">
        <img id="logo" src="@/assets/Logo-1.png" alt="trainspotter-logo" />
        <span> Click to return to home </span>
      </a>
      <!-- </header> -->

      <h1 v-if="!mobile">
        Build, save and share your route across Europe by train.
      </h1>

      <v-spacer></v-spacer>

      <v-dialog v-if="mobile" v-model="listDialog" :width="dialogWidth">
        <template v-slot:activator="{ on }">
          <v-btn class="mx-2" fab dark small color="secondary" v-on="on">
            <v-icon>mdi-clipboard-list</v-icon>
          </v-btn>
        </template>
        <TripPanel />
      </v-dialog>

      <v-dialog v-model="helpDialog" :width="dialogWidth">
        <template v-slot:activator="{ on }">
          <v-btn class="mx-2" icon small v-on="on">
            <v-icon>mdi-help-circle</v-icon>
          </v-btn>
        </template>
        <v-card>
          <v-card-title class="headline">Tips:</v-card-title>
          <v-card-text>
            <v-icon class="icon-info">mdi-information-outline</v-icon>
            Click on a
            <img
              :src="pinUrl('purple')"
              width="20"
              class="pin"
              alt="purple-pin"
            />
            and then
            <v-icon aria-label="play" color="primary">mdi-play-circle</v-icon>
            to begin your trip.
          </v-card-text>
          <v-card-text>
            <v-icon class="icon-info">mdi-information-outline</v-icon>
            Click on a
            <img :src="pinUrl('red')" width="20" class="pin" alt="red-pin" />
            and then <v-icon color="primary">mdi-clipboard-plus-outline</v-icon>
            to add a stop to your itinerary
            <v-icon v-if="mobile" color="primary">mdi-clipboard-list</v-icon>
          </v-card-text>
          <v-card-text>
            <v-icon class="icon-info">mdi-information-outline</v-icon>
            The filter is active while selecting your next stop.
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-app-bar>
  </div>
</template>

<script>
import TripPanel from "@/modules/trip-panel/TripPanel";
export default {
  components: {
    TripPanel
  },
  data() {
    return {
      mobile: window.innerWidth < 600,
      listDialog: false,
      helpDialog: false
    };
  },
  computed: {
    tripLength() {
      return this.$store.getters.completeTrip.length > 0
        ? this.$store.getters.completeTrip.length
        : "";
    },
    dialogWidth() {
      return 550;
    }
  },
  methods: {
    pinUrl(colour) {
      return require("@/assets/pin-" + colour + ".png");
    }
  }
};
</script>

<style lang="scss" scoped>
h1 {
  font-family: Courier;
  font-size: 20px;
  margin-left: -3em;
}

@font-face {
  font-family: "Helvetica Bold Italic";
  src: url("../../assets/Helvetica-bold-italic.ttf") format("truetype");
}

span {
  display: none;
}

.v-app-bar.v-app-bar--fixed {
  z-index: 2000;
}

#logo {
  margin-top: 0.5rem;
  width: 70%;
}

.pin {
  margin: 2px 2px -6px 2px;
}

.v-icon {
  padding: 0.125rem;
}

#bar {
  display: flex;
  justify-content: space-between;
}

.icon-info {
  font-size: 20px;
}

@media only screen and (max-width: 600px) {
  #logo {
    width: 90%;
  }
}
</style>

<style>
@media only screen and (max-width: 600px) {
  #header .v-toolbar__content {
    padding: 4px;
  }

  .v-dialog .container {
    padding: 0;
  }
}
</style>
