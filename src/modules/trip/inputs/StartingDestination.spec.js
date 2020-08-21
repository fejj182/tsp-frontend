import { shallowMount } from "@vue/test-utils";
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
    it("should dispatch startTrip on change", async () => {
      mockRoute.name = "welcome";
      const wrapper = shallowMount(StartingDestination, {
        mocks: {
          $store: mockStore,
          $router: {
            push: jest.fn()
          },
          $route: mockRoute,
          $emit: jest.fn()
        }
      });
      const autocompleteInput = wrapper.find(
        "[data-test-id=starting-destination]"
      );
      autocompleteInput.vm.$emit("change", station);
      await Vue.nextTick();
      //TODO: assert event is emitted & inner icon is set correctly
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
});
