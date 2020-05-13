import { shallowMount } from "@vue/test-utils";
import _ from "lodash";
import Vue from "vue";
import Vuetify from "vuetify";

import TripPanel from "./TripPanel";
import ConnectionFilters from "@/modules/filters/ConnectionFilters";
import TripForm from "@/modules/trip/TripForm";
import { state as stations } from "@/store/modules/stations";

Vue.use(Vuetify);

describe("Trip Panel", () => {
  let mockStore, mockRoute;
  beforeEach(() => {
    mockStore = {
      state: {
        stations: _.cloneDeep(stations),
        trip: {
          stops: []
        }
      },
      getters: {
        completeTrip: []
      }
    };
    mockRoute = {
      name: "home"
    };
  });

  describe("Expansion panels", () => {
    test("first panel and filters should not exist by default", () => {
      const wrapper = shallowMount(TripPanel, {
        mocks: {
          $store: mockStore,
          $route: mockRoute
        }
      });
      expect(wrapper.find("[data-test-id=filter-panel]").exists()).toBe(false);
      expect(wrapper.find(ConnectionFilters).exists()).toBe(false);
    });

    it("should contain first panel and filters when connections are in the store", () => {
      mockStore.getters.completeTrip = [{}];
      mockStore.state.trip.stops = [{}];
      const wrapper = shallowMount(TripPanel, {
        mocks: {
          $store: mockStore,
          $route: mockRoute
        },
        stubs: {
          vExpansionPanelContent: {
            name: "v-expansion-panel-content",
            template: "<span><slot></slot></span>"
          }
        }
      });
      expect(wrapper.find("[data-test-id=filter-panel]").exists()).toBe(true);
      expect(wrapper.find(ConnectionFilters).exists()).toBe(true);
    });

    it("should contain second panel and trip form", () => {
      const wrapper = shallowMount(TripPanel, {
        mocks: {
          $store: mockStore,
          $route: mockRoute
        },
        stubs: {
          vExpansionPanelContent: {
            name: "v-expansion-panel-content",
            template: "<span><slot></slot></span>"
          }
        }
      });
      expect(wrapper.find("[data-test-id=trip-form-panel]").exists()).toBe(
        true
      );
      expect(wrapper.find(TripForm).exists()).toBe(true);
    });
  });

  describe("Info alert", () => {
    it("should be present when component loads", async () => {
      const wrapper = shallowMount(TripPanel, {
        mocks: {
          $store: mockStore,
          $route: mockRoute
        },
        stubs: {
          VFadeTransition: {
            name: "v-fade-transition",
            template: "<span><slot></slot></span>"
          }
        }
      });
      await Vue.nextTick();
      expect(wrapper.find("[data-test-id=info]").exists()).toBe(true);
    });

    it("should not be present if alias route", () => {
      const wrapper = shallowMount(TripPanel, {
        mocks: {
          $store: mockStore,
          $route: {
            name: "alias",
            params: {
              alias: "some-alias"
            }
          }
        },
        stubs: {
          VFadeTransition: {
            name: "v-fade-transition",
            template: "<span><slot></slot></span>"
          }
        }
      });
      expect(wrapper.find("[data-test-id=info]").exists()).toBe(false);
    });
  });
});
