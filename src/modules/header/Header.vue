<template>
  <div>
    <v-app-bar app color="primary" dark>
      <header>
        <a href="/">
          <img id="logo" src="@/assets/Logo-1.png" alt="trainspotter-logo" />
          <span> Click to return to home </span>
        </a>
      </header>

      <v-spacer></v-spacer>

      <v-dialog v-if="mobile" v-model="listDialog" width="500">
        <template v-slot:activator="{ on }">
          <v-btn class="mx-2" fab dark small color="secondary" v-on="on">
            <v-icon>mdi-clipboard-list</v-icon>
          </v-btn>
        </template>
        <TripPanel />
      </v-dialog>

      <v-dialog v-model="helpDialog" width="550">
        <template v-slot:activator="{ on }">
          <v-btn class="mx-2" icon small v-on="on">
            <v-icon>mdi-help-circle</v-icon>
          </v-btn>
        </template>
        <v-card>
          <v-card-title class="headline">Tips:</v-card-title>
          <v-card-text>
            Click on a
            <img
              :src="pinUrl('purple')"
              width="20"
              class="pin"
              alt="purple-pin"
            />
            to select a starting destination and
            <v-icon aria-label="play">mdi-play-circle</v-icon>
            to begin your trip.
          </v-card-text>
          <v-card-text>
            Click on a
            <img :src="pinUrl('red')" width="20" class="pin" alt="red-pin" /> to
            select a connected destination.
          </v-card-text>
          <v-card-text>
            Durations between destinations are for direct connections and may
            vary.
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
@font-face {
  font-family: "Helvetica Bold Italic";
  src: url("../../assets/Helvetica-bold-italic.ttf") format("truetype");
}

i {
  padding: 0.75rem;
}

span {
  display: none;
}

.v-app-bar.v-app-bar--fixed {
  z-index: 2000;
}

#logo {
  margin-top: 0.5rem;
  width: 80%;
}

.pin {
  margin: 2px 2px -6px 2px;
}

.v-icon {
  padding: 0;
}

#bar {
  display: flex;
  justify-content: space-between;
}
</style>

<style>
#header .v-toolbar__content {
  padding: 4px;
}
</style>
