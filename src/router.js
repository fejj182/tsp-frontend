import Vue from "vue";
import VueRouter from "vue-router";
import Home from "@/modules/home/Home.vue";
import HelloWorld from "@/components/HelloWorld";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: Home
  },
  {
    path: "/vuetify",
    name: "vuetify",
    component: HelloWorld
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
