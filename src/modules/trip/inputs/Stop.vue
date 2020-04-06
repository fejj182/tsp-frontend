<template>
  <div>
    <v-autocomplete
      label="Where next?"
      data-test-id="stop"
      :items="items"
      filled
      rounded
      :readonly="readOnly"
      @change="onChangeStation"
      :value="selected"
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
export default {
  data() {
    return {
      readOnlyValue: null
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
    stop: {
      type: Object
    }
  },
  computed: {
    items() {
      return mapStationsByDuration(this.stations);
    },
    selectedStop() {
      return this.$store.state.trip.selectedStop;
    },
    selected() {
      if (this.stop.selected) {
        return mapStationByDuration(this.stop.selected);
      }

      if (this.readOnly && this.readOnlyValue) {
        return mapStationByDuration(this.readOnlyValue);
      } else if (!this.readOnly && this.selectedStop) {
        return mapStationByDuration(this.selectedStop);
      } else {
        return null;
      }
    }
  },
  watch: {
    selectedStop() {
      if (!this.readOnly) {
        this.readOnlyValue = this.selectedStop;
      }
    }
  },
  methods: {
    onChangeStation(station) {
      this.$store.dispatch("selectStop", station);
      this.$store.dispatch("openPopup", station);
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
