import { shallowMount } from "@vue/test-utils";
import Home from "./Home";
import Map from "@/map/Map.vue";
import Markers from "@/markers/Markers.vue";

describe("Home", () => {
  it("should contain the map", () => {
    const wrapper = shallowMount(Home);
    expect(wrapper.find(Map).exists()).toBe(true);
  });

  it("should contain the markers", () => {
    const wrapper = shallowMount(Home);
    expect(wrapper.find(Markers).exists()).toBe(true);
  });
});
