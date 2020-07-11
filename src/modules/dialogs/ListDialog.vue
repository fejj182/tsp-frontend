<template>
  <v-dialog v-model="dialog" :width="550">
    <template v-slot:activator="{ on }">
      <v-btn class="mx-2" fab small color="secondary" v-on="on">
        <img
          :data-test-id="clipboardId"
          :src="clipboardUrl"
          alt="clipboard with number of stops"
        />
      </v-btn>
    </template>
    <TripPanel :showForm="true" />
  </v-dialog>
</template>

<script>
import TripPanel from "@/modules/trip-panel/TripPanel";
export default {
  components: {
    TripPanel
  },
  data() {
    return {
      dialog: false
    };
  },
  computed: {
    numberOfStops() {
      return this.$store.getters.completeTrip.length;
    },
    clipboardId() {
      return "clipboard-" + this.numberOfStops;
    },
    clipboardUrl() {
      return require("@/assets/clipboard-" + this.numberOfStops + ".png");
    }
  }
};
</script>

<style lang="scss" scoped>
img {
  width: 2.5em;
}
</style>
