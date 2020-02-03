import { shallowMount } from "@vue/test-utils";
import Home from "@/modules/home/Home.vue";
import Map from "@/modules/map/Map.vue";
import Markers from "@/modules/map/markers/Markers.vue";
import Connections from "@/modules/map/connections/Connections.vue";
import TripForm from "@/modules/trip/TripForm.vue";
import Vue from "vue";
import Vuetify from "vuetify";

Vue.use(Vuetify);

describe("Home", () => {
  let wrapper;
  beforeEach(() => {
    jest.resetAllMocks();
    wrapper = shallowMount(Home);
  });

  it("should contain the map", () => {
    expect(wrapper.find(Map).exists()).toBe(true);
  });
  it("should contain the markers", () => {
    expect(wrapper.find(Markers).exists()).toBe(true);
  });
  it("should contain the trip builder form", () => {
    expect(wrapper.find(TripForm).exists()).toBe(true);
  });
  it("should contain the connections", () => {
    expect(wrapper.find(Connections).exists()).toBe(true);
  });
});
