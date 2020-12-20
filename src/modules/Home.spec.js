import { shallowMount } from "@vue/test-utils";
import Home from "@/modules/Home.vue";
import Map from "@/modules/map/Map.vue";
import TripPanel from "@/modules/trip-panel/TripPanel.vue";
import TripOverlay from "@/modules/trip-panel/TripOverlay.vue";
import Welcome from "@/modules/welcome/Welcome.vue";
import CookieBanner from "@/modules/cookies/CookieBanner.vue";
import Vue from "vue";
import Vuetify from "vuetify";
import flushPromises from "flush-promises";

Vue.use(Vuetify);

describe("Home", () => {
  let mockStore, mockFeatures, mockRoute, mockStubs;

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
    mockRoute = {
      name: "home"
    };
    mockStubs = {
      Map: {
        name: "Map",
        template: "<span></span>"
      },
      TripOverlay: {
        name: "TripOverlay",
        template: "<span></span>"
      }
    };
    mockFeatures = jest.fn().mockImplementation(() => true);
    window.innerWidth = 1000;
  });

  describe("children", () => {
    it("should contain the map and tripoverlay on mobile", async () => {
      window.innerWidth = 500;
      const wrapper = shallowMountHome();
      await flushPromises();
      expect(wrapper.find("[data-test-id=map]").exists()).toBe(true);
      expect(wrapper.find("[data-test-id=trip-overlay]").exists()).toBe(true);
    });

    it("should not contain the map and tripoverlay on desktop", async () => {
      const wrapper = shallowMountHome();
      await flushPromises();
      expect(wrapper.find("[data-test-id=map]").exists()).toBe(false);
      expect(wrapper.find("[data-test-id=trip-overlay]").exists()).toBe(false);
    });

    it("should contain not the map on mobile if route is welcome", async () => {
      window.innerWidth = 500;
      mockRoute.name = "welcome";
      const wrapper = shallowMountHome();
      await flushPromises();
      expect(wrapper.find("[data-test-id=map]").exists()).toBe(false);
    });

    it("should contain the cookie banner", () => {
      const wrapper = shallowMountHome();
      expect(wrapper.find(CookieBanner).exists()).toBe(true);
    });
  });

  describe("Trip Panel", () => {
    it("should contain the trip panel if route name is not welcome", () => {
      mockRoute.name = "notwelcome";
      const wrapper = shallowMountHome();
      expect(wrapper.find(TripPanel).exists()).toBe(true);
    });

    it("should not contain the trip panel if route name is welcome", () => {
      mockRoute.name = "welcome";
      const wrapper = shallowMountHome();
      expect(wrapper.find(TripPanel).exists()).toBe(false);
    });
  });

  describe("Welcome Panel", () => {
    it("should contain the welcome panel if route name is welcome", () => {
      mockRoute.name = "welcome";
      const wrapper = shallowMountHome();
      expect(wrapper.find(Welcome).exists()).toBe(true);
    });

    it("should not contain the welcome panel if FT is off", () => {
      mockFeatures = jest.fn().mockImplementation(() => false);
      const wrapper = shallowMountHome();
      expect(wrapper.find(Welcome).exists()).toBe(false);
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

    it("should not fetch starting stations if route name is alias", () => {
      mockRoute = {
        name: "alias",
        params: {
          alias: "some-alias"
        }
      };
      shallowMountHome();
      expect(mockStore.dispatch).not.toHaveBeenCalledWith(
        "fetchStartingStations"
      );
    });

    it("should fetch trip if url matches", () => {
      mockRoute = {
        name: "alias",
        params: {
          alias: "some-alias"
        }
      };
      shallowMountHome();
      expect(mockStore.dispatch).toHaveBeenCalledWith("fetchTrip", {
        alias: "some-alias"
      });
    });
  });

  const shallowMountHome = () => {
    return shallowMount(Home, {
      mocks: {
        $route: mockRoute,
        $store: mockStore,
        $feature: mockFeatures
      },
      stubs: mockStubs
    });
  };
});
