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
  components: {
    Header
  },

  data: () => ({
    //
  })
};
</script>

<style lang="scss" scoped></style>
