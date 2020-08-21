import { shallowMount } from "@vue/test-utils";
import cloneDeep from "lodash/cloneDeep";
import Vue from "vue";
import Vuetify from "vuetify";

import TripPanel from "./TripPanel";
import { state as stations } from "@/store/modules/stations";

Vue.use(Vuetify);

describe("Trip Panel", () => {
  let mockStore, mockRoute;
  beforeEach(() => {
    window.innerWidth = 1000;
    mockStore = {
      state: {
        stations: cloneDeep(stations),
        trip: {
          stops: [],
          savedTrip: []
        }
      }
    };
    mockRoute = {
      name: "home"
    };
  });

  describe("Expansion panels", () => {
    test("should contain filter panel", () => {
      const wrapper = shallowMount(TripPanel, {
        propsData: {
          showFilters: true
        },
        mocks: {
          $store: mockStore,
          $route: mockRoute
        }
      });
      expect(wrapper.find("[data-test-id=filter-panel]").exists()).toBe(true);
    });

    test("should contain form panel", () => {
      const wrapper = shallowMount(TripPanel, {
        propsData: {
          showForm: true
        },
        mocks: {
          $store: mockStore,
          $route: mockRoute
        }
      });
      expect(wrapper.find("[data-test-id=trip-form-panel]").exists()).toBe(
        true
      );
    });
  });
});
