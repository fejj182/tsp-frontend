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
    initGeoJSONLayer() {
      if (this.geoJsonLayer) {
        this.geoJsonLayer.removeFrom(this.map);
      }
      this.geoJsonLayer = L.geoJSON();
      this.geoJsonLayer.addTo(this.map);
    },
    buildLinesFromCoords(coordSet) {
      for (let i = 0; i < coordSet.length - 1; i++) {
        if (this.coordSetValid(coordSet[i], coordSet[i + 1]))
          this.geoJsonLayer.addData({
            type: "LineString",
            coordinates: [coordSet[i], coordSet[i + 1]]
          });
      }
    },
    coordSetValid(coord1, coord2) {
      return coord1 && coord2 && coord1.length == 2 && coord2.length == 2;
    }
  },
  props: {
    map: {
      type: Object
    }
  },
  computed: {
    connections() {
      return this.$store.state.stations.connections;
    }
  },
  watch: {
    connections() {
      if (this.connections) {
        this.initGeoJSONLayer();
        this.connections.forEach(connection => {
          const coordSet = connection.coords;
          if (coordSet) {
            this.buildLinesFromCoords(coordSet);
          }
        });
      }
    }
  }
};
</script>

<style></style>
