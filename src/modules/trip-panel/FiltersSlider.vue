<template>
  <div>
    <v-range-slider
      v-model="sliderRange"
      :step="stepInterval"
      @change="onSlide"
      :thumb-size="30"
      thumb-label="always"
      hint="Time between stops (hours)"
      persistent-hint
      data-test-id="journey-time-slider"
    >
      <template v-slot:thumb-label="{ value }">
        <span class="thumb-label">{{ thumbLabel(value) }}</span>
      </template>
    </v-range-slider>
  </div>
</template>

<script>
import paneConfigs from "@/modules/map/panes/paneConfigs";
export default {
  data() {
    return {
      sliderRange: null
    };
  },
  created() {
    this.sliderRange = this.$store.state.filters.activeDurationRange.map(
      range => range * this.stepInterval
    );
  },
  computed: {
    paneGroupRange() {
      return this.sliderRange.map(score => score / this.stepInterval);
    },
    storeSliderRange() {
      return this.$store.state.filters.activeDurationRange.map(
        range => range * this.stepInterval
      );
    },
    sliderSteps() {
      return paneConfigs.NUMBER_OF_PANES - 1;
    },
    stepInterval() {
      return 100 / this.sliderSteps;
    }
  },
  methods: {
    onSlide() {
      this.$store.dispatch("updateDurationRange", this.paneGroupRange);
    },
    thumbLabel(value) {
      const hours = value / this.stepInterval;
      return hours < this.sliderSteps ? hours : hours + "+";
    }
  }
};
</script>

<style lang="scss" scoped>
.v-input {
  margin-top: 18px;
}
</style>
