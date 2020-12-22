import Vue from "vue";
import VueRouter from "vue-router";

import Planner from "@/pages/Planner.vue";
import Welcome from "@/pages/Welcome.vue";
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
    component: Planner
  },
  {
    path: "/trip/:alias",
    name: "alias",
    component: Planner
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
