import { shallowMount } from "@vue/test-utils";
import Home from "@/modules/home/Home.vue";
import Map from "@/modules/map/Map.vue";
import Markers from "@/modules/map/markers/Markers.vue";
import Connections from "@/modules/map/connections/Connections.vue";
import TripForm from "@/modules/trip/TripForm.vue";
import faker from "faker";
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

  describe("Map", () => {
    it("should contain the listeners", () => {
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
      const lat = parseFloat(faker.address.latitude());
      const lng = parseFloat(faker.address.longitude());
      wrapper.vm.onMapClick({
        latlng: { lat, lng }
      });
      expect(mockStore.dispatch).toHaveBeenCalledWith("getNearestStation", {
        lat,
        lng
      });
    });

    it("should dispatch resetTrip event", () => {
      const mockStore = { dispatch: jest.fn() };
      const wrapper = shallowMount(Home, {
        mocks: {
          $store: mockStore
        }
      });
      const lat = parseFloat(faker.address.latitude());
      const lng = parseFloat(faker.address.longitude());
      wrapper.vm.onMapClick({
        latlng: { lat, lng }
      });
      expect(mockStore.dispatch).toHaveBeenCalledWith("resetTrip");
    });
  });

  describe("onMapCreated", () => {
    it("should set the map", () => {
      const wrapper = shallowMount(Home);
      const mockMap = {};
      wrapper.vm.onMapCreated(mockMap);
      expect(wrapper.vm.map).toBe(mockMap);
      expect(wrapper.find(Markers).props().map).toBe(mockMap);
    });
  });
});
