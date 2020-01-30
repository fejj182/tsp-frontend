<template>
  <div>
    <v-autocomplete
      label="Where next?"
      data-test-id="connection"
      :items="items"
      filled
      rounded
      :readonly="readOnly"
      @change="onChangeConnection"
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
    connections: {
      type: Array
    },
    readOnly: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    items() {
      return this.connections.map(station => {
        return mapStation(station);
      });
    },
    selectedConnection() {
      return this.$store.state.trip.selectedConnection;
    },
    selected() {
      if (this.readOnly && this.readOnlyValue) {
        return mapStation(this.readOnlyValue);
      } else if (!this.readOnly && this.selectedConnection) {
        return mapStation(this.selectedConnection);
      } else {
        return null;
      }
    }
  },
  watch: {
    selectedConnection() {
      if (!this.readOnly) {
        this.readOnlyValue = this.selectedConnection;
      }
    }
  },
  methods: {
    onChangeConnection(station) {
      this.$store.dispatch("selectConnection", station);
    }
  }
};
</script>

<style lang="scss" scoped>
.v-autocomplete {
  z-index: 1500;
}
</style>
