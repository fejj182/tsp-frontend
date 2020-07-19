<template>
  <div v-if="!popup" ref="content">
    <div id="add-to-trip">
      <h1 id="station-name">{{ station.name }}</h1>
      <p id="duration" v-if="isConnection">{{ duration }}</p>
      <v-btn
        v-if="tripNotBegun || isConnection"
        :id="buttonId"
        data-test-id="btn-add"
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
import { bindPopupToMarker } from "@/plugins/leaflet";

export default {
  data: function() {
    return {
      popup: null,
      popupContent: null
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
    this.popupContent = this.$refs.content.innerHTML;
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
    },
    buttonId() {
      return `btn-add-${this.station.slug}`;
    }
  },
  methods: {
    bindPopup() {
      this.popup = bindPopupToMarker(
        this.marker,
        this.popupContent,
        this.addToTrip,
        this.buttonId
      );

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
  button {
    margin: 0 0.25rem;
  }
}

#station-name {
  margin: 0 0.25rem;
}

label {
  display: none;
}

h1,
#duration {
  font-size: 16px;
}

#duration {
  margin: 0 0.5rem 0 0.25rem;
}
</style>
