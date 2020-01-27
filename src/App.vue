<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <header>
          <span class="logo">
            <i class="fas fa-train"></i>
            Trainspotter
          </span>
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

.logo {
  font-family: "Helvetica Bold Italic";
  font-size: 34px;
}

.v-app-bar.v-app-bar--fixed {
  z-index: 2000;
}
</style>
