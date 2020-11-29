<template>
  <v-list-item>
    <v-icon left>{{ icon }}</v-icon>
    <v-btn left text :href="href" :target="target" class="btn-action-list-item">
      {{ name }}
    </v-btn>
  </v-list-item>
</template>

<script>
export default {
  props: {
    name: {
      type: String
    },
    href: {
      type: String
    },
    icon: {
      type: String
    },
    target: {
      type: String
    }
  }
};
</script>

<style lang="scss" scoped>
.btn-action-list-item {
  flex: 1;
  justify-content: left;
}
</style>
