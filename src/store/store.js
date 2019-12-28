import Vue from "vue";
import Vuex from "vuex";
import * as stations from "@/store/modules/stations";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    stations
  }
});
