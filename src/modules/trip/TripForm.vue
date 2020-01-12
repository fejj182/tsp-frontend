<template>
  <v-form ref="form">
    <v-alert
      data-test-id="alert"
      v-if="alert"
      v-model="alert"
      dismissible
      type="error"
    >
      Service down. Please try again later.
    </v-alert>
    <StartInput @alert="onAlert" />
    <div v-for="stop in stops" :key="stop.position">
      <ConnectionInput :connections="stop.connections" />
    </div>
    <v-btn
      v-if="connectionSet"
      @click="onAddConnection"
      data-test-id="add-destination"
      color="indigo"
      rounded
      outlined
    >
      <v-icon left>mdi-plus</v-icon>
      <span>Add destination</span>
    </v-btn>
  </v-form>
</template>

<script>
import StartInput from "./StartInput.vue";
import ConnectionInput from "./ConnectionInput.vue";

export default {
  components: {
    StartInput,
    ConnectionInput
  },
  data() {
    return {
      alert: false
    };
  },
  computed: {
    connectionSet() {
      return this.$store.state.tripform.connectionId;
    },
    stops() {
      return this.$store.state.tripform.stops;
    }
  },
  methods: {
    onAddConnection() {},
    onAlert() {
      this.alert = true;
    }
  }
};
</script>

<style lang="scss" scoped></style>
