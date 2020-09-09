<template>
  <v-app id="v-app">
    <Header />
    <v-content>
      <router-view />
    </v-content>
  </v-app>
</template>

<script>
import Header from "@blog/components/Header";
export default {
  components: {
    Header
  }
};
</script>

<style lang="scss">
#v-app * {
  font-family: "Raleway", sans-serif;
  font-weight: 600;
}
@media only screen and (max-width: 600px) {
  #v-app .v-application--wrap {
    min-height: calc(100vh);
    min-height: calc(var(--vh, 1vh) * 100);
  }
}
</style>
