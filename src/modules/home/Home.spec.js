import { shallowMount } from "@vue/test-utils";
import Home from "@/modules/home/Home.vue";
import Map from "@/modules/map/Map.vue";
import Markers from "@/modules/markers/Markers.vue";
import TripForm from "@/modules/trip/TripForm.vue";
import faker from "faker";
import Vue from "vue";
import Vuetify from "vuetify";

Vue.use(Vuetify);

describe("Home", () => {
  let wrapper;
  beforeEach(() => {
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
      const lat = faker.address.latitude();
      const lng = faker.address.longitude();
      wrapper.vm.onMapClick({
        latlng: { lat, lng }
      });
      expect(mockStore.dispatch).toHaveBeenCalledWith("getNearestStation", {
        lat,
        lng
      });
    });
  });
});
