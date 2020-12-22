import { shallowMount } from "@vue/test-utils";
import Planner from "@/pages/Planner.vue";
import TripPanel from "@/modules/trip-panel/TripPanel.vue";
import Vue from "vue";
import Vuetify from "vuetify";
import flushPromises from "flush-promises";

Vue.use(Vuetify);

describe("Planner", () => {
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
      name: "route"
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
      const wrapper = shallowMountPlanner();
      await flushPromises();
      expect(wrapper.find("[data-test-id=map]").exists()).toBe(true);
      expect(wrapper.find("[data-test-id=trip-overlay]").exists()).toBe(true);
    });

    it("should not contain the map and tripoverlay on desktop", async () => {
      window.innerWidth = 1000;
      const wrapper = shallowMountPlanner();
      await flushPromises();
      expect(wrapper.find("[data-test-id=map]").exists()).toBe(false);
      expect(wrapper.find("[data-test-id=trip-overlay]").exists()).toBe(false);
    });
  });

  describe("Trip Panel", () => {
    it("should contain the trip panel on desktop", () => {
      window.innerWidth = 1000;
      const wrapper = shallowMountPlanner();
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
      shallowMountPlanner();
      expect(mockStore.dispatch).toHaveBeenCalledWith("fetchTrip", {
        alias: "some-alias"
      });
    });

    it("should not fetch trip if not on alias page", () => {
      shallowMountPlanner();
      expect(mockStore.dispatch).not.toHaveBeenCalled();
    });
  });

  const shallowMountPlanner = () => {
    return shallowMount(Planner, {
      mocks: {
        $route: mockRoute,
        $store: mockStore,
        $feature: mockFeatures
      },
      stubs: mockStubs
    });
  };
});
