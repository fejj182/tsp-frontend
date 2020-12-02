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
      <FeedbackDialog />
      <HeaderMenu data-test-id="header-menu" v-if="showHeaderMenu" />
    </v-app-bar>
  </div>
</template>

<script>
import HeaderMenu from "@/components/HeaderMenu";
import FeedbackDialog from "@/components/dialogs/FeedbackDialog";

export default {
  components: {
    HeaderMenu,
    FeedbackDialog
  },
  data() {
    return {
      logoLoaded: false
    };
  },
  computed: {
    showTitle() {
      return !this.$smallScreen() && this.$route.name !== "welcome";
    },
    showHeaderMenu() {
      return this.$route.name === "welcome";
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
    margin-left: 3em;
  }
  a {
    display: block;
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
  width: auto;
  max-height: 64px;
}

.col-8,
.col-4 {
  padding: 0;
}

.col-4 {
  justify-content: flex-end;
}

@media only screen and (max-width: $width-desktop) {
  #logo {
    max-height: 56px;
  }
}
</style>

<style lang="scss">
@media only screen and (max-width: $width-desktop) {
  .v-dialog .container {
    padding: 0;
  }
}
</style>
