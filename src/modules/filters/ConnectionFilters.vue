<template>
  <div>
    <v-range-slider
      v-model="sliderRange"
      :step="sliderSteps"
      @change="onSlide"
      :thumb-size="24"
      thumb-label="always"
      hint="Journey time (hours)"
      persistent-hint
    >
      <template v-slot:thumb-label="{ value }">
        {{ thumbLabel(value) }}
      </template>
    </v-range-slider>
  </div>
</template>

<script>
export default {
  data() {
    return {
      sliderRange: [0, 50],
      sliderSteps: 10
    };
  },
  mounted() {
    this.$store.dispatch("updateDurationRange", this.paneGroupRange);
  },
  computed: {
    paneGroupRange() {
      return this.sliderRange.map(score => score / this.sliderSteps);
    }
  },
  methods: {
    onSlide() {
      this.$store.dispatch("updateDurationRange", this.paneGroupRange);
    },
    thumbLabel(value) {
      const hours = value / this.sliderSteps;
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
