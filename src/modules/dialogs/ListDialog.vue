<template>
  <v-dialog v-model="dialog" :width="550">
    <template v-slot:activator="{ on }">
      <v-btn class="mx-2" fab dark small color="secondary" v-on="on">
        <v-icon data-test-id="icon-itinerary">mdi-clipboard-list</v-icon>
      </v-btn>
    </template>
    <TripPanel />
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
  }
};
</script>

<style lang="scss" scoped></style>
