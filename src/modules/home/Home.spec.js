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
  let mockStore;

  beforeEach(() => {
    mockStore = {
      dispatch: jest.fn().mockResolvedValue({}),
      state: {
        trip: {
          tripStarted: null
        }
      }
    };
  });

  describe("children", () => {
    let wrapper;
    beforeEach(() => {
      window.innerWidth = 1000;
      process.env = { VUE_APP_FT_WELCOME_PANEL_ACTIVE: true };
    });

    it("should contain the map", async () => {
      wrapper = shallowMountHome();
      await flushPromises();
      expect(wrapper.find(Map).exists()).toBe(true);
    });

    it("should contain the trip panel if trip has started", () => {
      wrapper = shallowMountHome();
      mockStore.state.trip.tripStarted = true;
      expect(wrapper.find(TripPanel).exists()).toBe(true);
    });

    it("should not contain the trip panel if trip has not started", () => {
      wrapper = shallowMountHome();
      mockStore.state.trip.tripStarted = false;
      expect(wrapper.find(TripPanel).exists()).toBe(false);
    });

    it("should not contain the welcome panel if trip has not started and FT is off", () => {
      mockStore.state.trip.tripStarted = false;
      process.env = { VUE_APP_FT_WELCOME_PANEL_ACTIVE: false };
      wrapper = shallowMountHome();
      expect(wrapper.find(Welcome).exists()).toBe(false);
    });

    it("should not contain the trip panel on mobile", () => {
      window.innerWidth = 500;
      wrapper = shallowMountHome();
      expect(wrapper.find(TripPanel).exists()).toBe(false);
    });
    it("should contain the cookie banner", () => {
      expect(wrapper.find(CookieBanner).exists()).toBe(true);
    });
  });

  describe("Data fetching", () => {
    it("should fetch starting stations '/'", () => {
      shallowMountHome();
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

  const shallowMountHome = () => {
    return shallowMount(Home, {
      mocks: {
        $route: {
          name: "home"
        },
        $store: mockStore
      }
    });
  };
});
