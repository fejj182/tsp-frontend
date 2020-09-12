<template>
  <div class="blog-post-extract" v-editable="blok">
    <div v-for="(paragraph, index) in paragraphs" :key="index">
      <p>
        {{ paragraph }}
      </p>
      <br />
    </div>
  </div>
</template>

<script>
export default {
  props: ["blok"],
  data() {
    return {
      paragraphs: []
    };
  },
  computed: {},
  created() {
    this.paragraphs = this.blok.content
      .split("\n")
      .filter(paragraph => paragraph !== "");
  }
};
</script>

<style lang="scss" scoped>
.blog-post-extract {
  padding: 1rem 4rem;
  position: absolute;
  top: 2rem;
  p {
    background: rgb(63, 81, 181, 0.9);
    color: white;
    display: inline-block;
    margin-bottom: 0.5rem;
  }
}

@media screen and (max-width: 1200px) {
  .blog-post-extract {
    padding: 0rem 4rem;
    margin-bottom: 2rem;
    position: relative;
    top: 0;
    p {
      background: rgb(63, 81, 181, 0.75);
    }
  }
}

@media screen and (max-width: 992px) {
  .blog-post-extract {
    padding: 0rem 2rem;
  }
}
</style>
