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
          Tips:
        </v-card-title>
      </h1>
      <v-card-text>
        <v-icon class="icon-info">mdi-information-outline</v-icon>
        Click on a
        <img :src="pinUrl()" width="20" class="pin" alt="red-pin" />
        and then <v-icon color="primary">mdi-clipboard-plus-outline</v-icon>
        to add a stop to your itinerary
        <v-icon
          v-if="isMobile"
          data-test-id="icon-clipboard-list"
          color="primary"
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
      dialog: false
    };
  },
  computed: {
    isMobile() {
      return window.innerWidth < 600;
    }
  },
  methods: {
    pinUrl() {
      return require("@/assets/pin-purple.png");
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
    font-size: 16px;
    word-break: normal;
  }

  .v-dialog > .v-card > .v-card__text {
    padding: 0 18px 20px;
  }
}
</style>
