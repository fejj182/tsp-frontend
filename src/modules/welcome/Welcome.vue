<template>
  <div id="welcome" :style="{ backgroundImage: `url(${image})` }">
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
export default {
  computed: {
    image() {
      return require("@/assets/onur-k-D5Plb33eKZc-unsplash.jpg");
    }
  }
};
</script>

<style lang="scss" scoped>
#welcome {
  max-width: 100%;
  height: 100%;
  margin-right: 4px;
  opacity: 0.9;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 50% 50%;
}

span {
  background-color: white;
  opacity: 0.6;
  position: absolute;
  bottom: 0;
  padding: 0.15rem;
  margin: 0.5rem 0.25rem;
  font-family: Raleway;
}
</style>
