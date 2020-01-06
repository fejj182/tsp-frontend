import Vue from "vue";
import Vuex from "vuex";
import * as stations from "@/store/modules/stations";
import * as popups from "@/store/modules/popups";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    stations,
    popups
  }
});
