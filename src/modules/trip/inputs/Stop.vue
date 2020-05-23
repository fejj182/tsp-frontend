<template>
  <div :id="id">
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
import _ from "lodash";

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
    id: {
      type: String
    }
  },
  computed: {
    isLastStop() {
      return this.id === "stop-" + this.$store.state.trip.stops.length;
    },
    items() {
      const stationsInRange = filterStationsOutOfRange(
        this.stations,
        this.$store.state.filters.activeDurationRange
      );
      return mapStationsByDuration(stationsInRange);
    },
    activeSelectedStop() {
      return this.$store.state.trip.selectedStop;
    },
    selected() {
      let inputValue = null;

      if (this.fixedStop) {
        inputValue = mapStationByDuration(this.fixedStop);
      } else if (this.readOnly && this.lastSelected) {
        inputValue = mapStationByDuration(this.lastSelected);
      } else if (!this.readOnly && this.activeSelectedStop) {
        inputValue = mapStationByDuration(this.activeSelectedStop);
      }

      return inputValue;
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
      }
    },
    autocompleteFilter(item, queryText, itemText) {
      // same as default but adding _.deburr
      return (
        _.deburr(itemText)
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
