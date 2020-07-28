import Vue from "vue";
import VueRouter from "vue-router";
import Blog from "./Blog";

Vue.use(VueRouter);

const routes = [
  {
    path: "/blog",
    name: "blogHome",
    component: Blog
  },
  {
    path: "/blog/:alias",
    name: "blogPage",
    component: Blog
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
