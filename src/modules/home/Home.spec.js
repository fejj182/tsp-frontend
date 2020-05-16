import { shallowMount } from "@vue/test-utils";
import Home from "@/modules/home/Home.vue";
import Map from "@/modules/map/Map.vue";
import TripPanel from "@/modules/trip-panel/TripPanel.vue";
import CookieBanner from "@/modules/privacy/CookieBanner.vue";
import Vue from "vue";
import Vuetify from "vuetify";

Vue.use(Vuetify);

describe("Home", () => {
  describe("children", () => {
    let wrapper;
    beforeEach(() => {
      let mockStore = {
        dispatch: jest.fn().mockResolvedValue({})
      };
      wrapper = shallowMount(Home, {
        mocks: {
          $store: mockStore,
          $route: {
            name: "home"
          }
        }
      });
    });

    it("should contain the map", async () => {
      expect(wrapper.find(Map).exists()).toBe(true);
    });
    it("should contain the trip panel", () => {
      expect(wrapper.find(TripPanel).exists()).toBe(true);
    });
    it("should contain the cookie banner", () => {
      expect(wrapper.find(CookieBanner).exists()).toBe(true);
    });
  });

  describe("Data fetching", () => {
    let mockStore;
    beforeEach(() => {
      mockStore = {
        dispatch: jest.fn().mockResolvedValue({})
      };
    });
    it("should fetch starting stations '/'", () => {
      shallowMount(Home, {
        mocks: {
          $route: {
            name: "home"
          },
          $store: mockStore
        }
      });
      expect(mockStore.dispatch).toHaveBeenCalledWith("fetchStartingStations");
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
