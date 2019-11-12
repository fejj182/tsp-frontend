import Vue from "vue";
import Vuex from "vuex";
import * as nearestStation from "@/store/modules/nearestStation/getNearestStation";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    nearestStation
  }
});
