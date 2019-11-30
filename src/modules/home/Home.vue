<template>
  <v-container fluid class="grey lighten-5 pa-1">
    <v-row no-gutters>
      <v-col cols="3">
        <v-container>
          <v-form ref="form" v-model="valid" :lazy-validation="lazy">
            <v-text-field
              v-model="name"
              :counter="10"
              :rules="nameRules"
              label="Name"
              required
            ></v-text-field>

            <v-text-field
              v-model="email"
              :rules="emailRules"
              label="E-mail"
              required
            ></v-text-field>

            <v-select
              v-model="select"
              :items="items"
              :rules="[v => !!v || 'Item is required']"
              label="Item"
              required
            ></v-select>

            <v-checkbox
              v-model="checkbox"
              :rules="[v => !!v || 'You must agree to continue!']"
              label="Do you agree?"
              required
            ></v-checkbox>

            <v-btn
              :disabled="!valid"
              color="success"
              class="mr-4"
              @click="validate"
            >
              Validate
            </v-btn>

            <v-btn color="error" class="mr-4" @click="reset">
              Reset Form
            </v-btn>

            <v-btn color="warning" @click="resetValidation">
              Reset Validation
            </v-btn>
          </v-form>
        </v-container>
      </v-col>
      <v-col cols="9">
        <Map @mapClick="onMapClick" @mapCreated="onMapCreated" id="map" />
        <Markers :map="map" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Map from "@/modules/map/Map.vue";
import Markers from "@/modules/markers/Markers.vue";

export default {
  name: "home",
  data: function() {
    return {
      map: null
    };
  },
  components: {
    Map,
    Markers
  },
  methods: {
    onMapClick(event) {
      const lat = event.latlng.lat;
      const lng = event.latlng.lng;
      this.$store.dispatch("getNearestStation", { lat, lng });
    },
    onMapCreated(map) {
      this.map = map;
    }
  }
};
</script>

<style scoped>
#map {
  height: 100vh;
}
</style>
