import { shallowMount } from "@vue/test-utils";
import Planner from "@/pages/Planner.vue";
import Vue from "vue";
import Vuetify from "vuetify";
import flushPromises from "flush-promises";
import isMobile from "@/plugins/isMobile";

Vue.use(Vuetify);
Vue.use(isMobile);

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
      },
      TripPanel: {
        name: "TripPanel",
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
      expect(wrapper.find("[data-test-id=map-mobile]").exists()).toBe(true);
      expect(wrapper.find("[data-test-id=trip-overlay]").exists()).toBe(true);
      expect(wrapper.find("[data-test-id=map-desktop]").exists()).toBe(false);
      expect(wrapper.find("[data-test-id=trip-panel]").exists()).toBe(false);
    });

    it("should contain the map and trip panel on desktop", async () => {
      window.innerWidth = 1000;
      const wrapper = shallowMountPlanner();
      await flushPromises();
      expect(wrapper.find("[data-test-id=map-desktop]").exists()).toBe(true);
      expect(wrapper.find("[data-test-id=trip-panel]").exists()).toBe(true);
      expect(wrapper.find("[data-test-id=map-mobile]").exists()).toBe(false);
      expect(wrapper.find("[data-test-id=trip-overlay]").exists()).toBe(false);
    });
  });

  it("should load saved trip on alias page", async done => {
    mockRoute = {
      name: "alias",
      params: {
        alias: "some-alias"
      }
    };
    const wrapper = shallowMountPlanner();
    await flushPromises();
    expect(mockStore.dispatch).toHaveBeenCalledWith("fetchTrip", {
      alias: "some-alias"
    });
    Vue.nextTick(() => {
      expect(wrapper.find("[data-test-id=map-desktop]").exists()).toBe(true);
      done();
    });
  });

  it("should not fetch trip if not on alias page", () => {
    shallowMountPlanner();
    expect(mockStore.dispatch).not.toHaveBeenCalled();
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
