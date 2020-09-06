<template>
  <div class="blog-post-header" :style="blogPostHeaderStyle" v-editable="blok">
    <div class="blog-post-header__text">
      <h1 class="blog-post-header__text__title">
        {{ blok.title }}
      </h1>

      <div class="blog-post-header__text__divisor" />

      <h2 class="blog-post-header__text__summary">
        {{ blok.summary }}
      </h2>
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
}

.blog-post-header__text__title {
  font-size: 70px;
}

.blog-post-header__text {
  padding: 1.5rem;
  font-size: 24px;
  background: rgba(192, 192, 192, 0.75);
  color: #fff;
  text-align: center;
}

.blog-post-header__text__divisor {
  margin: 1.5rem auto;
  width: 40%;
  height: 2px;
  background-color: #fff;
}

.blog-post-header .arrow-down-icon {
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translate(-50%, 50%);
}

@media screen and (max-width: 992px) {
  .blog-post-header__text__title {
    font-size: 35px;
  }

  .blog-post-header__text {
    padding: 0.5rem;
    font-size: 18px;
  }
}
</style>
