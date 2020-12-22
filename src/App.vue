<template>
  <v-app id="v-app">
    <Header />
    <v-content>
      <router-view />
    </v-content>
    <CookieBanner />
  </v-app>
</template>

<script>
import Header from "@/components/Header.vue";
import CookieBanner from "@/modules/cookies/CookieBanner.vue";

export default {
  name: "App",
  metaInfo: {
    title: "Trainspotter",
    meta: [
      {
        name: "description",
        content: "Plan your next trip by train."
      },
      {
        property: "og:title",
        content: "Trainspotter"
      },
      {
        property: "og:description",
        content: "Plan your next trip by train."
      },
      {
        property: "og:image",
        content:
          "https://res.cloudinary.com/dzuct4iof/image/upload/v1590425461/Logo-2-graphic_brrrt1.png"
      },
      { property: "og:url", content: "https://trainspotter.co" }
    ]
  },
  components: {
    Header,
    CookieBanner
  },
  mounted() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  },
  data: () => ({
    //
  })
};
</script>

<style lang="scss">
#v-app * {
  font-family: "Raleway", sans-serif;
  font-weight: 600;
}

@media only screen and (max-width: $width-desktop) {
  #v-app .v-application--wrap {
    min-height: calc(100vh);
    min-height: calc(var(--vh, 1vh) * 100);
  }
}
</style>
