import Vue from "vue";
import App from "./App";
import StoryblokVue from "storyblok-vue";
import Page from "./components/Page";
import BlogHeader from "./components/BlogHeader";
import router from "./router";

Vue.component("page", Page);
Vue.component("BlogHeader", BlogHeader);

Vue.use(StoryblokVue);

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");