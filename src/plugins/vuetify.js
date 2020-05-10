import Vue from "vue";
import Vuetify from "vuetify/lib";

import colors from "vuetify/lib/util/colors";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: colors.indigo.darken2,
        secondary: colors.indigo.lighten1,
        accent: colors.indigo.lighten4
      }
    }
  }
});

// purple-pin: #6633ff
// red-pin: #ff2400
