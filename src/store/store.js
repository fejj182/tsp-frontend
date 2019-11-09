import Vue from "vue";
import Vuex from "vuex";
import * as markers from "@/store/modules/markers";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    markers
  }
});
