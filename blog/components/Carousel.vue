<template>
  <div id="blog-carousel">
    <v-carousel
      cycle
      height="25vh"
      hide-delimiter-background
      show-arrows-on-hover
    >
      <v-carousel-item v-for="(story, i) in stories" :key="i">
        <v-sheet color="rgb(63,81,181, 0.75)" height="100%">
          <v-row>
            <h2>
              {{ storyAuthor(story.name) }}
            </h2>
            <a :href="linkUrl(story.full_slug)">{{ storyTitle(story.name) }}</a>
          </v-row>
        </v-sheet>
      </v-carousel-item>
    </v-carousel>
  </div>
</template>

<script>
export default {
  props: ["blok", "stories"],
  methods: {
    linkUrl(slug) {
      return "/blog/" + slug;
    },
    storyAuthor(storyName) {
      return storyName.split(" - ")[0];
    },
    storyTitle(storyName) {
      return '"' + storyName.split(" - ")[1] + '"';
    }
  }
};
</script>

<style lang="scss" scoped>
#blog-carousel {
  padding: 4rem;
  width: 100%;
  max-width: 600px;
  margin: 1rem auto;
  .row {
    margin: 0 1rem;
    flex-direction: column;
  }
  h2 {
    display: block;
    margin-top: 1rem;
    font-size: 28px;
  }
  a {
    color: white;
    font-size: 20px;
  }
}

@media only screen and (max-width: 600px) {
  #blog-carousel {
    padding: 2rem;
    h2 {
      font-size: 24px;
    }
    a {
      font-size: 18px;
    }
  }
}
</style>
