import Vue from "vue";
import VueRouter from "vue-router";
import Blog from "./Blog";

Vue.use(VueRouter);

const routes = [
  {
    path: "/blog",
    name: "blog",
    component: Blog
  },
  {
    path: "/blog/:alias",
    name: "blog",
    component: Blog
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
