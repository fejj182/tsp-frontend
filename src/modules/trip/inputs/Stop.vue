<template>
  <div :id="id">
    <v-autocomplete
      label="Where next?"
      data-test-id="stop"
      :items="items"
      filled
      rounded
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
      this.$store.dispatch("removeStop");
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
