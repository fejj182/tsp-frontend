import Vue from "vue";
import VueRouter from "vue-router";

const Home = () => import("@/modules/home/Home.vue");
const PrivacyPolicy = () => import("@/modules/privacy/PrivacyPolicy.vue");
const NotFound = () => import("@/components/NotFound.vue");

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "welcome",
    component: Home
  },
  {
    path: "/planner",
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
