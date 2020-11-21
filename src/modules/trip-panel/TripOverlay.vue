<template>
  <v-card class="trip-overlay">
    <v-card-title>
      <span>Trip Plan</span>
      <v-spacer></v-spacer>
      <v-btn icon @click="collapse = !collapse">
        <v-icon>{{ collapse ? "mdi-chevron-up" : "mdi-chevron-down" }}</v-icon>
      </v-btn>
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text :class="{ collapse: collapse }">
      <TripForm />
    </v-card-text>
  </v-card>
</template>

<script>
import TripForm from "@/modules/trip-panel/trip-form/TripForm";

export default {
  components: {
    TripForm
  },
  data() {
    return {
      sheet: true,
      collapse: false
    };
  }
};
</script>

<style lang="scss" scoped>
.trip-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  width: 90%;
  margin: 0 auto;
  z-index: 850;
}

.v-card__title {
  padding: 0.75rem 1rem;
}

.v-card__text.collapse {
  max-height: 0;
}

.v-card__text {
  padding: 0;
  max-height: 255px;
  overflow-y: auto;
  transition: max-height 0.25s;
  transition-timing-function: ease-in;
}
</style>
