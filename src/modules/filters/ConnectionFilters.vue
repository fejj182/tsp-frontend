<template>
  <div>
    <v-range-slider
      v-model="sliderRange"
      :step="sliderSteps"
      @change="onSlide"
    ></v-range-slider>
  </div>
</template>

<script>
import { displayPanesInRange } from "@/modules/map/panes/paneUtils";

export default {
  data() {
    return {
      sliderRange: [0, 50],
      sliderSteps: 10
    };
  },
  mounted() {
    const panes = this.$store.state.map.panes;
    displayPanesInRange(panes, this.paneGroupRange);
  },
  computed: {
    paneGroupRange() {
      return this.sliderRange.map(score => score / this.sliderSteps);
    }
  },
  methods: {
    onSlide() {
      const panes = this.$store.state.map.panes;
      displayPanesInRange(panes, this.paneGroupRange);
    }
  }
};
</script>

<style lang="scss" scoped></style>
