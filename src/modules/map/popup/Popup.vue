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
    },
    map: {
      type: Object
    }
  },
  mounted() {
    this.bindPopup(this.marker);
    if (this.open && this.station.name == this.open.name) {
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
    }
  },
  methods: {
    bindPopup(marker) {
      this.popup = marker.bindPopup(this.$refs.content, {
        offset: [-3, -2]
      });
    },
    addToTrip() {
      if (this.isConnection) {
        this.$store.dispatch("confirmStop", this.station);
      } else {
        this.popup.closePopup();
        this.$store.dispatch("setStartingStation", this.station);
        this.map.setZoom(6);
      }
    }
  },
  watch: {
    marker(marker) {
      // TODO: can remove this component if guaranteed to mount every time
      this.bindPopup(marker);
      if (this.open && this.station.name == this.open.name) {
        this.popup.openPopup();
      }
    },
    open(station) {
      if (station === null) {
        this.popup.closePopup();
      } else if (this.station.name == station.name) {
        this.popup.openPopup();
      }
    }
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
