<template>
  <div :id="stopId">
    <p
      v-if="selected && selected.value.durationHrsAndMins"
      data-test-id="duration"
    >
      <v-icon color="primary">mdi-clock-outline</v-icon>
      {{ selected.value.durationHrsAndMins }}
    </p>
    <v-select
      label="Where next?"
      :class="isLastStop ? 'last-stop' : ''"
      data-test-id="stop"
      :items="items"
      filled
      rounded
      hide-details
      :autofocus="isLastStop"
      :readonly="readOnly"
      @change="onChangeStation"
      :value="selected"
      :append-outer-icon="allowRemove ? 'mdi-close' : ''"
      @click:append-outer="removeStop"
    >
      <template v-slot:item="{ item }">
        {{ item.text }} -
        <span class="duration">
          <em>{{ item.value.durationHrsAndMins }}</em>
        </span>
      </template>
    </v-select>
    <v-btn
      v-if="showAddStop"
      @click="onAddStop"
      id="add-stop"
      data-test-id="add-stop"
      text
    >
      + Add destination
    </v-btn>
  </div>
</template>

<script>
import {
  mapStationByDuration,
  mapStationsByDuration
} from "@/mappers/stationFormMapper";
import { filterStationsOutOfRange } from "@/modules/map/panes/paneUtils";
import deburr from "lodash/deburr";

export default {
  data() {
    return {
      lastSelected: null
    };
  },
  props: {
    stations: {
      type: Array
    },
    readOnly: {
      type: Boolean,
      default: false
    },
    fixedStop: {
      type: Object
    },
    stopNumber: {
      type: Number
    }
  },
  computed: {
    stopId() {
      return `stop-${this.stopNumber}`;
    },
    isLastStop() {
      return this.stopNumber === this.$store.state.trip.stops.length;
    },
    allowRemove() {
      return this.stopNumber > 1 && this.isLastStop;
    },
    items() {
      if (this.isLastStop) {
        const stationsInRange = filterStationsOutOfRange(
          this.stations,
          this.$store.state.filters.activeDurationRange
        );
        return mapStationsByDuration(stationsInRange);
      }
      return mapStationsByDuration(this.stations);
    },
    activeSelectedStop() {
      return this.$store.state.trip.selectedStop;
    },
    selected() {
      const stop = this.$store.state.trip.savedTrip[this.stopNumber];
      return stop ? mapStationByDuration(stop) : null;
    },
    showAddStop() {
      return this.selected && this.isLastStop;
    }
  },
  watch: {
    activeSelectedStop() {
      if (!this.readOnly) {
        this.lastSelected = this.activeSelectedStop;
      }
    }
  },
  methods: {
    onAddStop() {
      this.$store
        .dispatch("fetchConnections", this.$store.state.trip.selectedStop)
        .then(() => {
          this.$emit("scroll-form-to-bottom");
        });
    },
    onChangeStation(station) {
      this.$store.dispatch("selectStop", station).then(() => {
        this.$emit("scroll-form-to-bottom");
      });
    },
    removeStop() {
      if (this.$store.state.trip.savedTrip.length > 2) {
        const tripStops = this.$store.state.trip.stops;
        if (tripStops[tripStops.length - 2].fixed) {
          this.$store.dispatch("removeStopAndFetchConnections");
        } else {
          this.$store.dispatch("removeStop");
        }
      } else {
        this.$store.dispatch("resetTrip");
        //TODO: should reset URL?
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.duration {
  font-size: 14px;
  padding-left: 0.25rem;
}
i {
  margin: 0 0.25rem;
}
p {
  margin: -0.625rem 0 0.875rem;
  color: #303f9f;
}

#add-stop {
  margin-bottom: 1rem;
  text-transform: none;
  text-decoration: underline;
}

.v-input {
  margin-bottom: 1.5rem;
}

.last-stop {
  margin-bottom: 0.5rem;
}

@media only screen and (max-width: $width-desktop) {
  #add-stop {
    margin-bottom: 0.5rem;
  }
}
</style>
