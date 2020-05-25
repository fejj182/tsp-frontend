<template>
  <v-app id="app">
    <Header />
    <v-content>
      <router-view />
    </v-content>
  </v-app>
</template>

<script>
import Header from "@/modules/header/Header";
export default {
  name: "App",
  metaInfo: {
    title: "Trainspotter",
    meta: [
      {
        name: "description",
        content: "Build, save and share your route across Europe by train."
      },
      {
        property: "og:title",
        content: "Trainspotter"
      },
      {
        property: "og:description",
        content: "Build, save and share your route across Europe by train."
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
    Header
  },

  data: () => ({
    //
  })
};
</script>

<style lang="scss" scoped></style>
