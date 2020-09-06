<template>
  <div v-show="logoLoaded">
    <v-app-bar app color="primary" dark id="header">
      <a href="/">
        <img
          id="logo"
          src="@/assets/Logo-1.png"
          alt="trainspotter-logo"
          @load="onLogoLoad"
        />
        <span> Click to return to home </span>
      </a>
      <v-spacer></v-spacer>
    </v-app-bar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      logoLoaded: false
    };
  },
  computed: {
    isMobile() {
      return window.innerWidth < 600;
    }
  },
  methods: {
    onLogoLoad() {
      this.logoLoaded = true;
    }
  }
};
</script>

<style lang="scss" scoped>
#header {
  a {
    display: inline-block;
    max-width: 66.67%;
  }
}

span {
  display: none;
}

.v-app-bar.v-app-bar--fixed {
  z-index: 2000;
}

#logo {
  margin-top: 0.5rem;
  min-width: 70%;
  width: 70%;
}

@media only screen and (max-width: 600px) {
  #logo {
    width: 90%;
  }
}
</style>

<style>
@media only screen and (max-width: 600px) {
  #header .v-toolbar__content {
    padding: 4px;
  }
}
</style>
