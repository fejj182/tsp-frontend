<template>
  <div data-test-id="popup" ref="popup" class="content">
    <v-btn
      v-if="!startingStationSelected || isConnection"
      data-test-id="add-to-station"
      @click="addToTrip"
      color="indigo"
      fab
      x-small
      outlined
    >
      <v-icon>mdi-plus</v-icon>
      <label>Add to station</label>
    </v-btn>
    <h1>{{ station.name }}</h1>
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
    },
    startingStationSelected() {
      return this.$store.state.trip.startingStation;
    }
  },
  methods: {
    bindPopup(marker) {
      this.popup = marker.bindPopup(this.$refs.popup, {
        offset: [0, -35]
      });
      if (this.open && this.station.name == this.open.name) {
        this.popup.openPopup();
      }
    },
    addToTrip() {
      if (this.isConnection) {
        this.$store.dispatch("confirmStop", this.station);
      } else {
        this.$store.dispatch("setStartingStation", this.station);
      }
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
.content {
  display: flex;
  align-items: center;
}
button {
  margin-right: 0.5rem;
}
label {
  display: none;
}
h1 {
  font-size: 16px;
}
</style>
