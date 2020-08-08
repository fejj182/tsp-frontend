import { shallowMount } from "@vue/test-utils";
import Home from "@/modules/home/Home.vue";
import Map from "@/modules/map/Map.vue";
import TripPanel from "@/modules/trip-panel/TripPanel.vue";
import Welcome from "@/modules/welcome/Welcome.vue";
import CookieBanner from "@/modules/privacy/CookieBanner.vue";
import Vue from "vue";
import Vuetify from "vuetify";
import flushPromises from "flush-promises";

Vue.use(Vuetify);

describe("Home", () => {
  let mockStore, mockFeatures;

  beforeEach(() => {
    mockStore = {
      dispatch: jest.fn().mockResolvedValue({}),
      state: {
        stations: {
          activeConnections: [],
          startingStations: []
        }
      },
      getters: {
        completeTrip: []
      }
    };
    mockFeatures = jest.fn().mockImplementation(() => true);
  });

  describe("children", () => {
    it("should contain the map", async () => {
      const wrapper = shallowMountHome();
      await flushPromises();
      expect(wrapper.find(Map).exists()).toBe(true);
    });

    it("should contain the cookie banner", () => {
      const wrapper = shallowMountHome();
      expect(wrapper.find(CookieBanner).exists()).toBe(true);
    });
  });

  describe("Trip Panel", () => {
    beforeEach(() => {
      window.innerWidth = 1000;
    });

    it("should contain the trip panel if trip has started", () => {
      mockStore.getters.completeTrip = [{}];
      const wrapper = shallowMountHome();
      expect(wrapper.find(TripPanel).exists()).toBe(true);
    });

    it("should not contain the trip panel if trip has not started", () => {
      const wrapper = shallowMountHome();
      expect(wrapper.find(TripPanel).exists()).toBe(false);
    });

    it("should not contain the trip panel on mobile", () => {
      window.innerWidth = 500;
      mockStore.getters.completeTrip = [{}];
      const wrapper = shallowMountHome();
      expect(wrapper.find(TripPanel).exists()).toBe(false);
    });

    it("should show filters when trip started", () => {
      mockStore.getters.completeTrip = [{}];
      const wrapper = shallowMountHome();
      expect(wrapper.find(TripPanel).props().showFilters).toBe(true);
    });

    it("should show form", () => {
      mockStore.getters.completeTrip = [{}];
      const wrapper = shallowMountHome();
      expect(wrapper.find(TripPanel).props().showForm).toBe(true);
    });
  });

  describe("Welcome Panel", () => {
    it("should contain the welcome panel if trip has not started", () => {
      const wrapper = shallowMountHome();
      expect(wrapper.find(Welcome).exists()).toBe(true);
    });

    it("should not contain the welcome panel if trip has not started and FT is off", () => {
      mockFeatures = jest.fn().mockImplementation(() => false);
      const wrapper = shallowMountHome();
      expect(wrapper.find(Welcome).exists()).toBe(false);
    });

    it("should contain the welcome panel on mobile if trip not started", () => {
      window.innerWidth = 500;
      const wrapper = shallowMountHome();
      expect(wrapper.find(Welcome).exists()).toBe(true);
    });
  });

  describe("Data fetching", () => {
    it("should fetch starting stations", () => {
      shallowMountHome();
      expect(mockStore.dispatch).toHaveBeenCalledWith("fetchStartingStations");
    });

    it("should not fetch starting stations if starting stations exist", () => {
      mockStore.state.stations.startingStations = [{}];
      shallowMountHome();
      expect(mockStore.dispatch).not.toHaveBeenCalledWith(
        "fetchStartingStations"
      );
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
          $store: mockStore,
          $feature: jest.fn()
        }
      });
      expect(mockStore.dispatch).toHaveBeenCalledWith("fetchTrip", {
        alias: "some-alias"
      });
    });
  });

  const shallowMountHome = () => {
    return shallowMount(Home, {
      mocks: {
        $route: {
          name: "home"
        },
        $store: mockStore,
        $feature: mockFeatures
      }
    });
  };
});
