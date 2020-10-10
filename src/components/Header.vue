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
      <h1 v-if="showTitle">
        Multiple journey planner for train travel in Europe.
      </h1>
      <v-spacer></v-spacer>
      <HeaderMenu data-test-id="header-menu" v-if="showHeaderMenu" />
      <TripDialog data-test-id="list-dialog" v-if="showTripDialog" />
    </v-app-bar>
  </div>
</template>

<script>
const HeaderMenu = () => import("@/components/HeaderMenu");
const TripDialog = () => import("@/components/dialogs/TripDialog");

export default {
  components: {
    HeaderMenu,
    TripDialog
  },
  data() {
    return {
      logoLoaded: false
    };
  },
  computed: {
    isMobile() {
      return window.innerWidth < 600;
    },
    showTitle() {
      return !this.isMobile && this.$route.name !== "welcome";
    },
    showHeaderMenu() {
      return this.$route.name === "welcome";
    },
    showTripDialog() {
      return this.isMobile && this.$route.name !== "welcome";
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
  h1 {
    font-size: 20px;
    margin-left: -3em;
    display: inline;
  }
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
  margin-left: 0.5rem;
  min-width: 70%;
  width: 70%;
}

.col-8,
.col-4 {
  padding: 0;
}

.col-4 {
  justify-content: flex-end;
}

@media only screen and (max-width: 600px) {
  #logo {
    margin-left: 0;
    width: 95%;
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
