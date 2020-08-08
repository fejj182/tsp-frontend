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
      <ListDialog data-test-id="list-dialog" v-if="isMobile" />
      <HelpDialog data-test-id="help-dialog" />
    </v-app-bar>
  </div>
</template>

<script>
const ListDialog = () => import("@/modules/dialogs/ListDialog");
const HelpDialog = () => import("@/modules/dialogs/HelpDialog");

export default {
  components: {
    ListDialog,
    HelpDialog
  },
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
#header h1 {
  font-size: 20px;
  margin-left: -3em;
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
    width: 80%;
  }
}
</style>

<style>
@media only screen and (max-width: 600px) {
  #header .v-toolbar__content {
    padding: 4px;
  }

  .v-dialog .container {
    padding: 0;
  }
}
</style>
