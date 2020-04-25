import Vue from "vue";
import Vuex from "vuex";
import * as stations from "@/store/modules/stations";
import * as trip from "@/store/modules/trip";
import * as filters from "@/store/modules/filters";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    stations,
    trip,
    filters
  }
});
