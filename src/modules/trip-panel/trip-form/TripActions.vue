<template>
  <v-row>
    <v-col :cols="7" :sm="8">
      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="primary" v-bind="attrs" v-on="on" id="find-offers-btn">
            <v-icon class="btn-icon">
              mdi-auto-fix
            </v-icon>
            Find...
          </v-btn>
        </template>
        <v-list>
          <TripActionListItem
            name="Train tickets"
            href="https://omio.sjv.io/trainspotter"
            icon="mdi-ticket"
            target="_blank"
          />
          <TripActionListItem
            name="Eco Hotels"
            href="https://ecohotels.com/"
            icon="mdi-bed"
            target="_blank"
          />
          <TripActionListItem
            name="Coworking Spaces"
            href="https://www.coworker.com/"
            icon="mdi-laptop"
            target="_blank"
          />
          <TripActionListItem
            name="Yoga retreats"
            href="https://www.bookyogaretreats.com/?aid=6567"
            icon="mdi-meditation"
            target="_blank"
          />
          <TripActionListItem
            name="Bike rental"
            href="https://c57.travelpayouts.com/click?shmarker=302537&promo_id=1766&source_type=link&type=click&trs=4737"
            icon="mdi-bike"
            target="_blank"
          />
        </v-list>
      </v-menu>
    </v-col>
    <v-col :cols="5" :sm="4">
      <v-btn v-if="!tripSaved" type="submit" data-test-id="save-trip">
        <v-icon class="btn-icon" color="grey">mdi-bookmark</v-icon>
        Save
      </v-btn>
      <v-menu offset-y v-else>
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-bind="attrs" v-on="on" data-test-id="more-options">
            <v-icon class="btn-icon">
              mdi-dots-vertical
            </v-icon>
          </v-btn>
        </template>
        <v-list data-test-id="trip-actions-list">
          <v-list-item @click="$emit('reset-trip')" data-test-id="reset-trip">
            <v-list-item-title>
              <v-icon left>
                mdi-new-box
              </v-icon>
              New trip
            </v-list-item-title>
          </v-list-item>
          <v-list-item
            @click="$emit('save-trip')"
            data-test-id="save-for-later"
          >
            <v-list-item-title>
              <v-icon left>
                mdi-bookmark
              </v-icon>
              Save for later
            </v-list-item-title>
          </v-list-item>
          <v-list-item
            v-if="tripSaved"
            v-clipboard:copy="url"
            v-clipboard:success="clipboardSuccessHandler"
            v-clipboard:error="clipboardFailureHandler"
            data-test-id="copy-url"
          >
            <v-list-item-title>
              <v-icon left>
                mdi-content-copy
              </v-icon>
              Share link
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-col>
  </v-row>
</template>

<script>
import TripActionListItem from "@/modules/trip-panel/trip-form/TripActionListItem";

export default {
  components: {
    TripActionListItem
  },
  computed: {
    url() {
      return window.location.href;
    },
    tripSaved() {
      return this.$route.name === "alias";
    }
  },
  methods: {
    clipboardSuccessHandler({ value, event }) {
      this.$emit("copy-success");
    },
    clipboardFailureHandler({ value, event }) {
      this.$emit("copy-failure");
    }
  }
};
</script>

<style lang="scss" scoped>
.v-btn {
  width: 100%;
}

.v-list {
  padding: 0;
}

.btn-icon {
  padding-right: 0.5rem;
}

#find-offers-btn {
  flex: 1;
}

@media only screen and (min-width: 993px) {
  .v-menu__content {
    z-index: 500 !important;
  }
}
</style>
