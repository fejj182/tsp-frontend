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
    const MapStub = {
      name: "Map",
      template: "<span><slot></slot></span>",
      props: ["on-click"]
    };
    it("should contain an onClick prop", () => {
      const wrapper = shallowMount(Home, {
        stubs: {
          Map: MapStub
        }
      });
      expect(wrapper.find(MapStub).props().onClick).toBeTruthy();
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
