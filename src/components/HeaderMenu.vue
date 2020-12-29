<template>
  <div id="header-menu">
    <v-menu
      offset-y
      attach="#header-menu"
      left
      eager
      :open-on-hover="!$smallScreen()"
    >
      <template v-slot:activator="{ on: menu, attrs }">
        <v-btn :icon="$smallScreen()" text v-bind="attrs" v-on="{ ...menu }">
          <v-icon>mdi-menu</v-icon>
          <span class="sr-only">Alternative Menu</span>
        </v-btn>
      </template>
      <v-list id="header-menu__list">
        <a href="#how-it-works">
          <v-list-item link>
            <v-list-item-title>How It Works</v-list-item-title>
          </v-list-item>
        </a>
        <a href="#our-mission">
          <v-list-item link>
            <v-list-item-title>Our Mission</v-list-item-title>
          </v-list-item>
        </a>
        <a href="/blog">
          <v-list-item link>
            <v-list-item-title>Sustainability Blog</v-list-item-title>
          </v-list-item>
        </a>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss">
#header-menu {
  button {
    margin-right: 0;
  }
}

#header-menu__list {
  padding: 0;
  a {
    text-decoration: none;
  }
}
</style>
