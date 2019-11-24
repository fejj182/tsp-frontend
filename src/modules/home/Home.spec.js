import { shallowMount } from "@vue/test-utils";
import Home from "./Home";
import Map from "@/modules/map/Map.vue";
import Markers from "@/modules/markers/Markers.vue";

describe("Home", () => {
  it("should contain the map", () => {
    const wrapper = shallowMount(Home);
    expect(wrapper.find(Map).exists()).toBe(true);
  });
  it("should contain the markers", () => {
    const wrapper = shallowMount(Home);
    expect(wrapper.find(Markers).exists()).toBe(true);
  });

  describe("Map", () => {
    it("should contain the listeners", () => {
      const wrapper = shallowMount(Home);
      expect(wrapper.find(Map).vm.$listeners.mapClick).toBeDefined();
      expect(wrapper.find(Map).vm.$listeners.mapCreated).toBeDefined();
    });
  });

  describe("onMapClick", () => {
    it("should dispatch getNearestStation event", () => {
      const mockStore = { dispatch: jest.fn() };
      const wrapper = shallowMount(Home, {
        mocks: {
          $store: mockStore
        }
      });
      wrapper.vm.onMapClick({ latlng: { lat: "123", lng: "456" } });
      expect(mockStore.dispatch).toHaveBeenCalledWith("getNearestStation", {
        lat: "123",
        lon: "456"
      });
    });
  });
});
