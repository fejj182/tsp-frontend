<template>
  <div id="header-menu">
    <v-menu offset-y>
      <template v-slot:activator="{ on: menu, attrs }">
        <v-btn icon text v-bind="attrs" v-on="{ ...menu }">
          <v-icon>mdi-menu</v-icon>
        </v-btn>
      </template>
      <v-list id="header-menu__list">
        <a href="/blog">
          <v-list-item>
            <v-list-item-title>Latest posts</v-list-item-title>
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
