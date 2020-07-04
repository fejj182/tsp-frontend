<template>
  <div>
    <v-card id="legend" max-width="375" outlined ref="legend">
      <v-card-text>
        <div class="overline mb-1">Legend</div>
        <v-simple-table fixed-header>
          <template v-slot:default>
            <tbody>
              <tr>
                <td>
                  <img :src="pinUrl()" width="20" alt="purple-pin" />
                </td>
                <td>Available stations</td>
              </tr>
              <tr>
                <td>
                  <img
                    :src="badgeUrl()"
                    width="18"
                    class="badge"
                    alt="red-badge"
                  />
                </td>
                <td>Stop number</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { createLegend } from "@/plugins/leaflet.js";
export default {
  props: {
    map: {
      type: Object
    }
  },
  mounted() {
    createLegend(this.map, this.$refs.legend);
  },
  methods: {
    pinUrl() {
      return require("@/assets/pin-purple.png");
    },
    badgeUrl() {
      return require("@/assets/badge-1.png");
    }
  }
};
</script>

<style lang="scss">
#legend {
  opacity: 0.9;

  .v-card__text {
    padding: 0.25rem;
  }

  td {
    font-size: 14px;
    padding: 0 0.5rem;
  }

  img {
    margin-top: 0.25rem;
  }

  .v-data-table td {
    height: 32px;
  }
}

.v-application .overline {
  font-weight: bold;
}
</style>
