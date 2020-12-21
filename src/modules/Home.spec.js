import { shallowMount } from "@vue/test-utils";
import Home from "@/modules/Home.vue";
import TripPanel from "@/modules/trip-panel/TripPanel.vue";
import Welcome from "@/modules/welcome/Welcome.vue";
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
        trip: {
          startingStation: {}
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
      window.innerWidth = 1000;
      const wrapper = shallowMountHome();
      await flushPromises();
      expect(wrapper.find("[data-test-id=map]").exists()).toBe(false);
      expect(wrapper.find("[data-test-id=trip-overlay]").exists()).toBe(false);
    });
  });

  describe("Trip Panel", () => {
    it("should contain the trip panel on desktop", () => {
      window.innerWidth = 1000;
      const wrapper = shallowMountHome();
      expect(wrapper.find(TripPanel).exists()).toBe(true);
    });
  });

  describe("Data fetching", () => {
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

    it("should not fetch trip if not on alias page", () => {
      shallowMountHome();
      expect(mockStore.dispatch).not.toHaveBeenCalled();
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
