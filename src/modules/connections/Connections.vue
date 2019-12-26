<template>
  <div></div>
</template>

<script>
import L from "leaflet";

export default {
  data() {
    return {
      geoJsonLayer: null,
      activeConnections: []
    };
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
      const connections = this.$store.state.nearestStation.connections;
      const geoData = [];

      if (connections && connections.length > 0) {
        // TODO: add tests for this?
        connections.forEach(connection => {
          let i = 0;
          const coords = connection.coords;
          coords.forEach(point => {
            if (i < coords.length - 1) {
              geoData.push({
                type: "LineString",
                coordinates: [coords[i], coords[i + 1]]
              });
            }
            i++;
          });
          this.geoJsonLayer.addData(geoData);
        });

        this.activeConnections = this.$store.state.nearestStation.connections; //TODO: is this needed?
      }
    }
  }
};
</script>

<style></style>
