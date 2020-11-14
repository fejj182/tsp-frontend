<template>
  <div v-if="!legend">
    <v-card id="legend" outlined ref="legend">
      <v-card-text>
        <h2 class="overline">Legend</h2>
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
              <tr>
                <td>
                  <v-icon>mdi-clipboard-plus-outline</v-icon>
                </td>
                <td>Add to trip</td>
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
import { LEGEND_BOTTOMRIGHT } from "@/modules/map/markers/types";
export default {
  props: {
    map: {
      type: Object
    }
  },
  data() {
    return {
      legend: null
    };
  },
  computed: {
    isMobile() {
      return window.innerWidth < 992;
    }
  },
  mounted() {
    this.legend = createLegend(this.map, this.$refs.legend, LEGEND_BOTTOMRIGHT);
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

  h2 {
    color: rgba(0, 0, 0, 0.87);
    font-size: 0.75rem !important;
    line-height: 1.5rem;
    padding: 0 0.25rem;
    font-family: Raleway !important;
  }

  .v-card__text {
    padding: 0;
  }

  td {
    font-size: 14px;
    padding: 0 0.5rem;
  }

  img {
    margin-top: 0.25rem;
    margin-left: 0.2rem;
  }

  .v-data-table td {
    height: 32px;
  }

  i {
    color: #3f51b5;
  }
}
</style>
