import Vue from "vue";
import Blog from "./Blog";
import StoryblokVue from "storyblok-vue";
import Page from "./components/Page";
import BlogHeader from "./components/BlogHeader";

Vue.component("page", Page);
Vue.component("BlogHeader", BlogHeader);

Vue.use(StoryblokVue);

new Vue({
  render: h => h(Blog)
}).$mount("#app");
