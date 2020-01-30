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
    ></v-autocomplete>
  </div>
</template>

<script>
import mapStation from "@/modules/trip/stationFormMapper";
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
    }
  },
  computed: {
    items() {
      return this.stations.map(station => {
        return mapStation(station);
      });
    },
    selectedStop() {
      return this.$store.state.trip.selectedStop;
    },
    selected() {
      if (this.readOnly && this.readOnlyValue) {
        return mapStation(this.readOnlyValue);
      } else if (!this.readOnly && this.selectedStop) {
        return mapStation(this.selectedStop);
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
    }
  }
};
</script>

<style lang="scss" scoped>
.v-autocomplete {
  z-index: 1500;
}
</style>
