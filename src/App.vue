<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <header>
          <a href="/">
            <img src="@/assets/Logo-1.png" alt="trainspotter-logo" />
            <span> Click to return to home </span>
          </a>
        </header>
      </div>

      <v-spacer></v-spacer>
    </v-app-bar>

    <v-content>
      <router-view />
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: "App",

  data: () => ({
    //
  })
};
</script>

<style lang="scss" scoped>
@font-face {
  font-family: "Helvetica Bold Italic";
  src: url("assets/Helvetica-bold-italic.ttf") format("truetype");
}

i {
  padding: 0.75rem;
}

span {
  display: none;
}

.logo {
  font-family: "Helvetica Bold Italic";
  font-size: 34px;
}

.v-app-bar.v-app-bar--fixed {
  z-index: 2000;
}

img {
  margin-top: 0.5rem;
  width: 80%;
}
</style>
