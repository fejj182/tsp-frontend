<template>
  <div class="blog-post-header" :style="blogPostHeaderStyle" v-editable="blok">
    <div class="blog-post-header__text">
      <h1>
        {{ blok.title }}
      </h1>

      <div class="blog-post-header__text__divisor" />

      <h2>
        {{ blok.summary }}
      </h2>

      <div
        class="blog-post-header__published"
        v-if="blok.author && blok.published"
      >
        <span class="blog-post-header__author published-item">
          <v-icon>mdi-account-circle</v-icon>
          <p>{{ blok.author }}</p>
        </span>

        <p class="published-item">{{ publishedDate }}</p>
      </div>
    </div>

    <img
      class="arrow-down-icon"
      src="../assets/arrow-down-icon.svg"
      alt="Icon of a arrow down"
    />
  </div>
</template>

<script>
import { getImageMetaData } from "../utils/image";

export default {
  name: "BlogHeader",
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
    },
    publishedDate() {
      return this.blok.published.substring(0, 10);
    }
  }
};
</script>

<style lang="scss">
.blog-post-header {
  position: relative;
  width: 100%;
  min-height: 70vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-origin: top;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  margin-bottom: 4rem;

  .blog-post-header__text {
    padding: 1rem;
    background: rgba(192, 192, 192, 0.625);
    color: #fff;
    text-align: center;
    h1 {
      font-size: 70px;
    }

    h2,
    i {
      font-size: 28px;
    }

    .published-item {
      margin: 0 1rem;
    }

    p {
      font-size: 18px;
      display: inline;
    }
    .v-icon {
      margin-right: 0.5rem;
      color: white;
    }

    .blog-post-header__published {
      display: flex;
      justify-content: center;
      padding: 0.5rem;
      padding-top: 1rem;
    }

    .blog-post-header__text__divisor {
      margin: 1.5rem auto;
      width: 40%;
      height: 2px;
      background-color: #fff;
    }
  }

  .arrow-down-icon {
    position: absolute;
    left: 50%;
    bottom: 0;
    transform: translate(-50%, 50%);
  }
}

@media screen and (max-width: 992px) {
  .blog-post-header {
    .blog-post-header__text {
      padding: 0.5rem;
      h1 {
        font-size: 28px;
      }
      h2,
      i {
        font-size: 22px;
      }
      p {
        font-size: 16px;
      }
    }
  }
}
</style>
