<template>
  <div id="max-journey-time">
    <v-select
      :items="hours"
      @change="onChangeTime"
      label="Hours per stop"
      hide-details
      prepend-inner-icon="mdi-timer-sand"
      filled
      rounded
      single-line
      background-color="grey lighten-4"
      data-test-id="max-journey-time-input"
    ></v-select>
  </div>
</template>

<script>
export default {
  data: () => ({
    hours: [
      { text: "2 hours", value: 2 },
      { text: "3 hours", value: 3 },
      { text: "4 hours", value: 4 },
      { text: "5 hours", value: 5 },
      { text: "6+ hours", value: 6 }
    ]
  }),
  methods: {
    onChangeTime(time) {
      this.$store.dispatch("updateDurationRange", [0, time]);
    }
  }
};
</script>

<style lang="scss">
#max-journey-time {
  i {
    color: #303f9f;
    padding-bottom: 2px;
    padding-right: 5px;
  }
}
</style>
