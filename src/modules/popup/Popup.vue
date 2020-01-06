<template>
  <div data-test-id="popup" ref="popup">
    <h1>{{ station.name }}</h1>
    <div v-if="isConnection">
      <v-btn data-test-id="add-to-station" @click="addToTrip" text icon>
        <v-icon left color="indigo">mdi-plus-circle-outline</v-icon>
        <span>Add to trip</span>
      </v-btn>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    marker: {
      type: Object
    },
    station: {
      type: Object
    },
    isActive: {
      type: Boolean
    },
    isConnection: {
      type: Boolean
    }
  },
  methods: {
    bindPopup(marker) {
      const popup = marker.bindPopup(this.$refs.popup, {
        offset: [0, -35]
      });
      if (this.isActive) {
        popup.openPopup();
      }
    },
    addToTrip() {
      this.$store.dispatch("addStationToTrip", this.station);
    }
  },
  mounted() {
    this.bindPopup(this.marker);
  },
  watch: {
    marker: function(marker) {
      this.bindPopup(marker);
    }
  }
};
</script>

<style lang="scss" scoped>
h1 {
  font-size: 18px;
}
span {
  color: #3f51b5;
  margin-left: -2px;
}
</style>
