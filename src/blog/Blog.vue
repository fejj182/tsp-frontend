<template>
  <div>
    <component :blok="story.content" :is="story.content.component"></component>
  </div>
</template>

<script>
import StoryblokClient from "storyblok-js-client";

const token = process.env.VUE_APP_STORYBLOK_TOKEN;

let storyapi = new StoryblokClient({
  accessToken: token
});

export default {
  data() {
    return {
      story: {
        content: {
          component: null
        }
      }
    };
  },
  created() {
    window.storyblok.init({
      accessToken: token
    });
    window.storyblok.on("change", () => {
      this.getStory("home", "draft");
    });
    window.storyblok.pingEditor(() => {
      if (window.storyblok.isInEditor()) {
        this.getStory("home", "draft");
      } else {
        this.getStory("home", "published");
      }
    });
  },
  methods: {
    getStory(slug, version) {
      storyapi
        .get("cdn/stories/" + slug, {
          version: version
        })
        .then(response => {
          this.story = response.data.story;
        });
    }
  }
};
</script>

<style lang="scss" scoped></style>
