<template>
  <cookie-law theme="blood-orange--rounded" :buttonDecline="true">
    <p slot="message">
      We use
      <a href="https://www.cookiesandyou.com" target="_blank">cookies</a> to
      improve the user experience on our website. Feel free to read our
      <router-link to="/privacy-policy" target="_blank"
        >Privacy Policy</router-link
      >.
    </p>
  </cookie-law>
</template>

<script>
import CookieLaw from "vue-cookie-law";
export default {
  components: {
    CookieLaw
  },
  mounted() {
    if (localStorage.getItem("cookie:accepted") == null) {
      document
        .getElementsByClassName("Cookie__button")[0]
        .parentNode.insertBefore(
          document.getElementsByClassName("Cookie__button")[0],
          document.getElementsByClassName("Cookie__button--decline")[0]
        );
    }
  }
};
</script>

<style>
.Cookie {
  padding: 1rem;
  justify-content: center;
}

.Cookie .Cookie__content a {
  color: white;
}

.Cookie .Cookie__button,
.Cookie .Cookie__button--decline {
  padding: 0.5em 1.75em;
  background: #e76a68;
  color: white;
  margin: 0 0.5rem;
}

.Cookie .Cookie__button--decline:hover {
  background: #e03f3c;
}

.Cookie .Cookie__content p {
  margin: 0 1rem;
}
</style>
