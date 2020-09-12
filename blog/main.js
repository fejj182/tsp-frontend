import Vue from "vue";
import App from "./App";
import StoryblokVue from "storyblok-vue";
import Page from "./components/Page";
import BlogHeader from "./components/BlogHeader";
import BlogContent from "./components/BlogContent";
import BlogExtract from "./components/BlogExtract";
import BlogHome from "./components/BlogHome";
import router from "./router";
import vuetify from "./plugins/vuetify";

Vue.component("page", Page);
Vue.component("BlogHeader", BlogHeader);
Vue.component("BlogContent", BlogContent);
Vue.component("BlogHome", BlogHome);
Vue.component("BlogExtract", BlogExtract);

Vue.use(StoryblokVue);

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount("#app");
