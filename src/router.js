import Vue from "vue";
import VueRouter from "vue-router";

import Home from "@/modules/Home.vue";
import Welcome from "@/modules/welcome/Welcome.vue";
import PrivacyPolicy from "@/components/PrivacyPolicy.vue";
import NotFound from "@/components/NotFound.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "welcome",
    component: Welcome
  },
  {
    path: "/trip-planner",
    name: "planner",
    component: Home
  },
  {
    path: "/trip/:alias",
    name: "alias",
    component: Home
  },
  {
    path: "/privacy-policy",
    name: "privacy",
    component: PrivacyPolicy
  },
  {
    path: "/*",
    component: NotFound
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
