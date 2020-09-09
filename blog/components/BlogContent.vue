<template>
  <div class="blog-post-content" v-editable="blok">
    <div class="blog-post-header__text">
      <h3 v-if="blok.title">
        {{ blok.title }}
      </h3>

      <p v-for="(paragraph, index) in paragraphs" :key="index">
        {{ paragraph }}
      </p>

      <v-card v-if="blok.graphic">
        <v-img :src="blok.graphic" contain></v-img>
      </v-card>
    </div>
  </div>
</template>

<script>
import { getImageMetaData } from "../utils/image";

export default {
  name: "BlogContent",
  props: ["blok"],
  data() {
    return {
      paragraphs: []
    };
  },
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
  created() {
    this.paragraphs = this.blok.content
      .split("\n")
      .filter(paragraph => paragraph !== "");
  }
};
</script>

<style lang="scss">
.blog-post-content {
  padding: 1rem 4rem;
  h3 {
    margin-bottom: 2rem;
  }
  .v-card {
    width: 50%;
    margin: 4rem auto 2rem;
  }
}

@media screen and (max-width: 992px) {
  .blog-post-content {
    padding: 1rem 2rem;
    .v-card {
      width: 75%;
      margin: 2rem auto 0;
    }
  }
}

@media screen and (max-width: 600px) {
  .blog-post-content {
    .v-card {
      width: 95%;
      margin: 2rem auto 0;
    }
  }
}
</style>
