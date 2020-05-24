<template>
  <v-dialog v-model="dialog" :width="550">
    <template v-slot:activator="{ on }">
      <v-btn class="mx-2" icon small v-on="on">
        <v-icon>mdi-help-circle</v-icon>
      </v-btn>
    </template>

    <v-card>
      <h1 id="title">
        <v-card-title>
          {{ title }}
        </v-card-title>
      </h1>
      <v-card-text>
        <v-icon class="icon-info">mdi-information-outline</v-icon>
        Click on a
        <img :src="pinUrl('purple')" width="20" class="pin" alt="purple-pin" />
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
        <v-icon v-if="mobile" data-test-id="icon-clipboard-list" color="primary"
          >mdi-clipboard-list</v-icon
        >
      </v-card-text>
      <v-card-text>
        <v-icon class="icon-info">mdi-information-outline</v-icon>
        The filter is active while selecting your next stop.
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data() {
    return {
      dialog: false,
      mobile: window.innerWidth < 600
    };
  },
  computed: {
    title() {
      return window.innerWidth < 600
        ? "Build, save and share your route across Europe by train."
        : "Tips:";
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
.pin {
  margin: 2px 2px -6px 2px;
}

.v-icon {
  padding: 0.125rem;
}

.icon-info {
  font-size: 22px;
}

@media only screen and (max-width: 600px) {
  .v-card__title {
    font-family: Courier;
    font-size: 16px;
    word-break: normal;
  }

  .v-dialog > .v-card > .v-card__text {
    padding: 0 18px 20px;
  }
}
</style>
