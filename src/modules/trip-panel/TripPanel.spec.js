import { shallowMount, mount } from "@vue/test-utils";
import cloneDeep from "lodash/cloneDeep";
import Vue from "vue";
import Vuetify from "vuetify";
import isMobile from "@/plugins/isMobile";

import TripPanel from "./TripPanel";
import TripForm from "@/modules/trip-panel/trip-form/TripForm";
import { state as stations } from "@/store/modules/stations";

Vue.use(Vuetify);
Vue.use(isMobile);

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
      name: "route"
    };
  });

  describe("Expansion panels", () => {
    test("should contain panels by default", () => {
      const wrapper = shallowMount(TripPanel, {
        mocks: {
          $store: mockStore,
          $route: mockRoute
        }
      });
      expect(wrapper.find("[data-test-id=filter-panel]").exists()).toBe(true);
      expect(wrapper.find("[data-test-id=trip-form-panel]").exists()).toBe(
        true
      );
    });

    test("should not contain panels if props passed as false", () => {
      const wrapper = shallowMount(TripPanel, {
        propsData: {
          showFilters: false,
          showForm: false
        },
        mocks: {
          $store: mockStore,
          $route: mockRoute
        }
      });
      expect(wrapper.find("[data-test-id=filter-panel]").exists()).toBe(false);
      expect(wrapper.find("[data-test-id=trip-form-panel]").exists()).toBe(
        false
      );
    });

    describe("TripForm", () => {
      it("should scroll to bottom when event emitted", () => {
        document.getElementById = jest.fn();
        document.getElementById.mockReturnValue({ scrollHeight: 100 });

        const wrapper = shallowMount(TripPanel, {
          mocks: {
            $store: mockStore,
            $route: mockRoute
          }
        });
        wrapper.find(TripForm).vm.$emit("scroll-form-to-bottom");
        expect(document.getElementById("panel-trip-form").scrollTop).toBe(100);
      });
    });

    describe("close button", () => {
      let mockStubs;
      beforeEach(() => {
        mockStubs = {
          FiltersSlider: {
            name: "FiltersSlider",
            template: "<span></span>"
          },
          TripForm: {
            name: "TripForm",
            template: "<span></span>"
          }
        };
      });
      it("should close filters", () => {
        const wrapper = mount(TripPanel, {
          mocks: {
            $store: mockStore,
            $route: mockRoute
          },
          stubs: mockStubs
        });
        wrapper.find("[data-test-id=close-filters]").trigger("click");
        expect(wrapper.emitted()["close-dialog"]).toBeTruthy();
      });

      it("should close trip form", () => {
        const wrapper = mount(TripPanel, {
          mocks: {
            $store: mockStore,
            $route: mockRoute
          },
          stubs: mockStubs
        });
        wrapper.find("[data-test-id=close-trip]").trigger("click");
        expect(wrapper.emitted()["close-dialog"]).toBeTruthy();
      });
    });
  });
});
