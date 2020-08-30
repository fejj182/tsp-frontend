import { shallowMount, mount } from "@vue/test-utils";
import Vue from "vue";
import Vuetify from "vuetify";
import cloneDeep from "lodash/cloneDeep";

import StartingDestination from "./StartingDestination.vue";
import { mapStation, mapStations } from "@/mappers/stationFormMapper";
import { fakeStation } from "@/helpers/tests";
import { state as trip } from "@/store/modules/trip";

jest.mock("@/api/stations");

Vue.use(Vuetify);

describe("StartingDestination", () => {
  let enabledStations, station, mockStore, mockRoute;
  beforeEach(() => {
    jest.resetAllMocks();
    station = fakeStation();
    enabledStations = [fakeStation(), fakeStation(), fakeStation()];
    mockStore = {
      dispatch: jest.fn(),
      state: {
        trip: cloneDeep(trip),
        stations: {
          startingStations: []
        }
      }
    };
    mockRoute = {
      name: "name"
    };
  });
  describe("Autocomplete items", () => {
    it("should load stations", async () => {
      mockStore.state.stations.startingStations = enabledStations;
      const wrapper = shallowMount(StartingDestination, {
        mocks: {
          $store: mockStore,
          $route: mockRoute
        }
      });
      const mappedStations = mapStations(enabledStations);
      expect(
        wrapper.find("[data-test-id=starting-destination]").props().items
      ).toEqual(mappedStations);
    });

    it("should load starting station first", async () => {
      mockStore.state.trip.startingStation = station;
      const wrapper = shallowMount(StartingDestination, {
        mocks: {
          $store: mockStore,
          $route: mockRoute
        }
      });
      expect(
        wrapper.find("[data-test-id=starting-destination]").props().items
      ).toEqual([mapStation(station)]);
    });

    it("should not load stations into props", async () => {
      const wrapper = shallowMount(StartingDestination, {
        mocks: {
          $store: mockStore,
          $route: mockRoute
        }
      });
      expect(
        wrapper.find("[data-test-id=starting-destination]").props().items.length
      ).toBe(0);
    });
  });

  describe("On change", () => {
    it("should emit change-station event if route name is welcome", async done => {
      mockRoute.name = "welcome";
      const wrapper = shallowMount(StartingDestination, {
        mocks: {
          $store: mockStore,
          $router: {
            push: jest.fn()
          },
          $route: mockRoute
        }
      });
      wrapper
        .find("[data-test-id=starting-destination]")
        .vm.$emit("change", station);

      Vue.nextTick(() => {
        expect(wrapper.emitted()["change-station"][0]).toEqual([station]);
        done();
      });
    });

    it("should dispatch startTrip on change if route is not welcome", () => {
      mockRoute.name = "notWelcome";
      const wrapper = shallowMount(StartingDestination, {
        mocks: {
          $store: mockStore,
          $router: {
            push: jest.fn()
          },
          $route: mockRoute
        }
      });
      wrapper
        .find("[data-test-id=starting-destination]")
        .vm.$emit("change", station);
      expect(mockStore.dispatch).toBeCalledWith("startTrip", station);
    });

    it("should not dispatch startTrip on change if route is not welcome and station is null", () => {
      mockRoute.name = "notWelcome";
      const wrapper = shallowMount(StartingDestination, {
        mocks: {
          $store: mockStore,
          $router: {
            push: jest.fn()
          },
          $route: mockRoute
        }
      });
      wrapper
        .find("[data-test-id=starting-destination]")
        .vm.$emit("change", null);
      expect(mockStore.dispatch).not.toBeCalledWith("startTrip", station);
    });
  });

  describe("inner icon", () => {
    it("should be present on welcome route", () => {
      mockRoute.name = "welcome";
      const wrapper = shallowMount(StartingDestination, {
        mocks: {
          $store: mockStore,
          $route: mockRoute
        }
      });
      expect(
        wrapper.find("[data-test-id=starting-destination").props()
          .prependInnerIcon
      ).toBe("mdi-train");
    });

    it("should not be present if not on welcome route", () => {
      mockRoute.name = "notwelcome";
      const wrapper = shallowMount(StartingDestination, {
        mocks: {
          $store: mockStore,
          $route: mockRoute
        }
      });
      expect(
        wrapper.find("[data-test-id=starting-destination").props()
          .prependInnerIcon
      ).toBe("");
    });
  });

  describe("validation rules", () => {
    it("should contain validation function if route is welcome", () => {
      mockRoute.name = "welcome";
      const wrapper = shallowMount(StartingDestination, {
        mocks: {
          $store: mockStore,
          $route: mockRoute
        }
      });
      const validationFunction = wrapper
        .find("[data-test-id=starting-destination]")
        .props().rules[0];
      expect(validationFunction(true)).toBe(true);
      expect(validationFunction(false)).toBe(false);
    });

    it("should contain empty array if route is not welcome", () => {
      mockRoute.name = "notwelcome";
      const wrapper = shallowMount(StartingDestination, {
        mocks: {
          $store: mockStore,
          $route: mockRoute
        }
      });
      expect(
        wrapper.find("[data-test-id=starting-destination]").props().rules.length
      ).toBe(0);
    });
  });
});
