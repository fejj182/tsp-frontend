<template>
  <div v-if="!popup" ref="content">
    <div id="popup-station-info">
      <h1 id="station-name">{{ station.name }}</h1>
      <p id="duration" v-if="isConnection">{{ duration }}</p>
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
      return window.innerWidth < 992;
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
      this.popup = bindPopupToMarker(this.marker, this.popupContent);

      if (
        this.selectedStop &&
        this.activeConnections.length > 0 &&
        this.station.name == this.selectedStop.name
      ) {
        this.popup.openPopup();
      }
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
#popup-station-info {
  display: flex;
  align-items: center;
}

#station-name {
  margin: 0 0.25rem;
}

h1,
#duration {
  font-size: 16px;
}

#duration {
  margin: 0 0.5rem 0 0.25rem;
  color: #303f9f;
}
</style>
