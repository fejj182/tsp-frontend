<template>
  <div>
    <div
      class="blog-post-header__content"
      :style="blogPostHeaderStyle"
      v-editable="blok"
    >
      <h1>
        {{ blok.title }}
      </h1>

      <Carousel :stories="stories" />
    </div>
  </div>
</template>

<script>
import StoryblokClient from "storyblok-js-client";
import Carousel from "./Carousel";

const token = process.env.VUE_APP_STORYBLOK_TOKEN;

let storyapi = new StoryblokClient({
  accessToken: token
});

import { getImageMetaData } from "../utils/image";
export default {
  components: {
    Carousel
  },
  data() {
    return {
      stories: []
    };
  },
  props: ["blok"],
  computed: {
    blogPostHeaderStyle() {
      if (this.blok.image) {
        const { url } = getImageMetaData(this.blok.image);

        return {
          "background-image": `url(https:${url})`
        };
      }

      return {};
    }
  },
  methods: {
    getStory(slug) {
      storyapi
        .get("cdn/stories/" + slug, {
          version: "published"
        })
        .then(response => {
          this.stories.push(response.data.story);
        });
    }
  },
  created() {
    const stories = this.blok.stories.split("\n").filter(story => story !== "");
    stories.forEach(slug => {
      this.getStory(slug);
    });
  }
};
</script>

<style lang="scss" scoped>
.blog-post-header__content {
  position: relative;
  width: 100%;
  height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-origin: top;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  h1 {
    color: white;
    text-align: center;
    padding-top: 2rem;
    font-size: 52px;
  }
}

@media only screen and (max-width: 600px) {
  .blog-post-header__content {
    height: calc(100vh - 56px);
    height: calc(var(--vh, 1vh) * 100 - 56px);

    h1 {
      font-size: 40px;
    }
  }
}
</style>
