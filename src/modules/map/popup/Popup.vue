<template>
  <div v-show="false">
    <div id="add-to-trip" ref="content">
      <h1 id="station-name">{{ station.name }}</h1>
      <p id="duration" v-if="isConnection">{{ duration }}</p>
      <v-btn
        v-if="tripNotBegun"
        data-test-id="btn-begin-trip"
        @click="addToTrip"
        color="indigo"
        fab
        x-small
      >
        <v-icon>mdi-play</v-icon>
        <label>Add to trip</label>
      </v-btn>
      <v-btn
        v-if="isConnection"
        class="btn-add"
        @click="addToTrip"
        color="indigo"
        fab
        x-small
      >
        <v-icon>mdi-clipboard-plus-outline</v-icon>
        <label>Add to trip</label>
      </v-btn>
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
    }
  },
  mounted() {
    this.bindPopup();
  },
  computed: {
    isConnection() {
      const savedTrip = this.$store.state.trip.savedTrip;
      return this.station == savedTrip[savedTrip.length - 1];
    },
    tripNotBegun() {
      return this.$store.state.trip.savedTrip.length === 0;
    },
    mobile() {
      return window.innerWidth < 600;
    },
    duration() {
      const duration = this.station.duration;
      return toHoursAndMinutes(duration);
    },
    selectedStop() {
      return this.$store.state.trip.selectedStop;
    },
    activeConnections() {
      return this.$store.state.stations.activeConnections;
    },
    activeStation() {
      return this.$store.state.stations.activeStation;
    }
  },
  methods: {
    bindPopup() {
      this.popup = this.marker.bindPopup(this.$refs.content, {
        offset: [-3, -2]
      });
      if (
        this.selectedStop &&
        this.activeConnections.length > 0 &&
        this.station.name == this.selectedStop.name
      ) {
        this.popup.openPopup();
      }
    },
    addToTrip() {
      this.$store.dispatch("addToTrip", this.station);
    }
  },
  watch: {
    activeStation(station) {
      if (station) {
        this.bindPopup();
      } else {
        this.popup.remove();
      }
    }
  },
  destroyed() {
    this.popup.remove();
  }
};
</script>

<style lang="scss" scoped>
#add-to-trip {
  display: flex;
  align-items: center;
  i {
    color: white;
  }
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

button {
  margin: 0 2px;
}

.btn-add {
  margin-left: 0.75rem;
}
</style>
