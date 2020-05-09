<template>
  <div v-show="false">
    <div class="add-to-trip" ref="content">
      <v-btn
        v-if="isConnection || tripNotBegun"
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
      <h1 id="station-name">{{ station.name }}</h1>
      <p id="duration" v-if="isConnection">{{ duration }}</p>
    </div>
  </div>
</template>

<script>
import { toHoursAndMinutes } from "@/mappers/durationMapper";
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
  mounted() {
    this.bindPopup(this.marker);

    const activeStation = this.$store.state.stations.activeStation;
    if (
      activeStation &&
      !this.isConnection &&
      this.station.name === activeStation.name
    ) {
      this.popup.openPopup();
    }
  },
  computed: {
    open() {
      return this.$store.state.popups.openStation;
    },
    tripNotBegun() {
      return this.$store.state.trip.stops.length === 0;
    },
    duration() {
      const duration = this.station.duration;
      return toHoursAndMinutes(duration);
    },
    selectedStop() {
      return this.$store.state.trip.selectedStop;
    }
  },
  methods: {
    bindPopup(marker) {
      this.popup = marker.bindPopup(this.$refs.content, {
        offset: [-3, -2]
      });
    },
    addToTrip() {
      //TODO: should handle api call error in store
      this.$store.dispatch("addToTrip", this.station);
    }
  },
  watch: {
    selectedStop(station) {
      if (station === null) {
        this.popup.closePopup();
      } else if (this.station.name == station.name) {
        this.popup.openPopup();
      }
    }
  },
  destroyed() {
    this.popup.remove();
  }
};
</script>

<style lang="scss" scoped>
.add-to-trip {
  display: flex;
  align-items: center;
}
#station-name {
  margin: 0 0.5rem;
}
label {
  display: none;
}
h1,
#duration {
  font-size: 16px;
}
#duration {
  margin: 0;
}
</style>
