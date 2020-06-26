import Vue from "vue";
import VueGtag from "vue-gtag";
import App from "./App.vue";
import router from "./router";
import config from "../config.js";
import store from "./store/store";
import vuetify from "./plugins/vuetify";
import VueClipboard from "vue-clipboard2";
import VueMeta from "vue-meta";

Vue.use(
  VueGtag,
  {
    config: { id: process.env.VUE_APP_GA_TRACKING_ID },
    enabled: localStorage.getItem("cookie:accepted") === "false" ? false : true
  },
  router
);
VueClipboard.config.autoSetContainer = true;
Vue.use(VueClipboard);
Vue.use(VueMeta);
Vue.use(config);
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
