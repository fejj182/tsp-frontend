<template>
  <div></div>
</template>

<script>
import L from "leaflet";

export default {
  data() {
    return {
      geoJsonLayer: null
    };
  },
  methods: {
    buildLinesFromCoords(coordSet) {
      for (let i = 0; i < coordSet.length - 1; i++) {
        this.geoJsonLayer.addData({
          type: "LineString",
          coordinates: [coordSet[i], coordSet[i + 1]]
        });
      }
    }
  },
  beforeMount() {
    this.geoJsonLayer = L.geoJSON();
    this.geoJsonLayer.addTo(this.map);
  },
  props: {
    map: {
      type: Object
    }
  },
  computed: {
    connections() {
      return this.$store.state.nearestStation.connections;
    }
  },
  watch: {
    connections: function() {
      const coordSet = this.$store.getters.connectionCoordSets;
      coordSet.forEach(set => {
        this.buildLinesFromCoords(set);
      });
    }
  }
};
</script>

<style></style>
