<template>
  <v-app id="v-app">
    <Header />
    <v-content>
      <router-view />
    </v-content>
  </v-app>
</template>

<script>
const Header = () => import("@/modules/header/Header.vue");

export default {
  name: "App",
  metaInfo: {
    title: "Trainspotter",
    meta: [
      {
        name: "description",
        content: "Multiple journey planner for train travel in Europe."
      },
      {
        property: "og:title",
        content: "Trainspotter"
      },
      {
        property: "og:description",
        content: "Multiple journey planner for train travel in Europe."
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

<style lang="scss">
@media only screen and (max-width: 600px) {
  // "--vh" property is set in Map component
  #v-app .v-application--wrap {
    min-height: calc(100vh - 56px);
    min-height: calc(var(--vh, 1vh) * 100 - 56px);
  }
}
</style>
