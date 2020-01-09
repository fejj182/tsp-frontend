<template>
  <div data-test-id="popup" ref="popup">
    <h1>{{ station.name }}</h1>
    <div v-if="isConnection">
      <v-btn
        data-test-id="add-to-station"
        color="indigo"
        @click="addToTrip"
        rounded
        outlined
      >
        <v-icon left>mdi-plus</v-icon>
        <span>Add to trip</span>
      </v-btn>
    </div>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      popup: null
    };
  },
  props: {
    marker: {
      type: Object
    },
    station: {
      type: Object
    },
    isConnection: {
      type: Boolean
    }
  },
  computed: {
    open() {
      return this.$store.state.popups.openStation;
    }
  },
  methods: {
    bindPopup(marker) {
      this.popup = marker.bindPopup(this.$refs.popup, {
        offset: [0, -35]
      });
      if (this.station.name == this.open.name) {
        this.popup.openPopup();
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
    marker(marker) {
      // TODO: can remove this component guaranteed to mount every time
      this.bindPopup(marker);
    },
    open(station) {
      if (this.station.name == station.name) {
        this.popup.openPopup();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
h1 {
  font-size: 18px;
}
span {
  margin-left: -0.25rem;
}

button {
  margin-top: 1rem;
}
</style>
