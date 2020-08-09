<template>
  <div id="welcome" :style="{ backgroundImage: `url(${image})` }">
    <h1>
      The interactive planner for your next train trip in Europe.
    </h1>
    <h2>
      Travel slow, efficient and sustainably.
    </h2>
    <h2>Built with <v-icon>mdi-heart</v-icon> for multi-journeys.</h2>

    <div id="start">
      <StartingDestination />
    </div>

    <span
      >Photo by
      <a
        href="https://unsplash.com/@kodozani?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText"
        >Onur K</a
      >
      on
      <a
        href="/s/photos/rail?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText"
        >Unsplash</a
      >
    </span>
  </div>
</template>

<script>
import StartingDestination from "@/modules/trip/inputs/StartingDestination";
export default {
  components: {
    StartingDestination
  },
  computed: {
    image() {
      return require("@/assets/onur-k-D5Plb33eKZc-unsplash.jpg");
    }
  }
};
</script>

<style lang="scss" scoped>
h1 {
  padding: 0.5em;
  font-size: 24px;
  text-align: center;
  color: white;
}

h2 {
  padding: 0.25em;
  font-size: 18px;
  text-align: center;
  color: white;
}

#welcome {
  max-width: 100%;
  height: 100%;
  margin-right: 4px;
  padding: 1rem;
  opacity: 0.9;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 50% 50%;
}

#start {
  padding: 1rem;
}

@media only screen and (max-width: 600px) {
  #welcome {
    margin-right: 0;
  }
}

span {
  background-color: white;
  opacity: 0.6;
  position: absolute;
  bottom: 0;
  padding: 0.15rem;
  margin: 0.5rem 0.25rem;
}
</style>
