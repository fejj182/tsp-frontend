<template>
  <div :id="stopId">
    <v-autocomplete
      label="Where next?"
      data-test-id="stop"
      :items="items"
      :filter="autocompleteFilter"
      filled
      rounded
      hide-details
      :autofocus="isLastStop"
      :readonly="readOnly"
      @change="onChangeStation"
      :value="selected"
      :append-outer-icon="isLastStop ? 'mdi-close' : ''"
      @click:append-outer="removeStop"
    >
      <template v-slot:item="{ item }">
        {{ item.text }} -
        <span class="duration">
          <em>{{ item.value.duration }}</em>
        </span>
      </template>
    </v-autocomplete>
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
    onChangeStation(station) {
      this.$store.dispatch("selectStop", station);
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
        this.$router.push("/");
      }
    },
    autocompleteFilter(item, queryText, itemText) {
      // same as default but adding deburr
      return (
        deburr(itemText)
          .toLocaleLowerCase()
          .indexOf(queryText.toLocaleLowerCase()) > -1
      );
    }
  }
};
</script>

<style lang="scss" scoped>
.v-autocomplete {
  z-index: 1500;
}
.duration {
  font-size: 14px;
  padding-left: 0.25rem;
}
</style>
