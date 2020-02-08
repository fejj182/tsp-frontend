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
  describe("children", () => {
    let wrapper;
    beforeEach(() => {
      wrapper = shallowMount(Home, {
        mocks: {
          $route: {
            name: "home"
          }
        }
      });
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

  describe("Data fetching", () => {
    let mockStore;
    beforeEach(() => {
      mockStore = {
        dispatch: jest.fn()
      };
    });
    it("should not fetch data at '/'", () => {
      shallowMount(Home, {
        mocks: {
          $route: {
            name: "home"
          },
          $store: mockStore
        }
      });
      expect(mockStore.dispatch).not.toHaveBeenCalled();
    });

    it("should fetch trip if url matches", () => {
      shallowMount(Home, {
        mocks: {
          $route: {
            name: "alias",
            params: {
              alias: "some-alias"
            }
          },
          $store: mockStore
        }
      });
      expect(mockStore.dispatch).toHaveBeenCalledWith("fetchTrip", {
        alias: "some-alias"
      });
    });
  });
});
