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
  let enabledStations;
  let mockStore;
  let station;
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
  });
  describe("Autocomplete items", () => {
    it("should load stations", async () => {
      mockStore.state.stations.startingStations = enabledStations;
      const wrapper = shallowMount(StartingDestination, {
        mocks: {
          $store: mockStore
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
          $store: mockStore
        }
      });
      expect(
        wrapper.find("[data-test-id=starting-destination]").props().items
      ).toEqual([mapStation(station)]);
    });

    it("should not load stations into props", async () => {
      const wrapper = shallowMount(StartingDestination, {
        mocks: {
          $store: mockStore
        }
      });
      expect(
        wrapper.find("[data-test-id=starting-destination]").props().items.length
      ).toBe(0);
    });
  });

  describe("On change", () => {
    it("should dispatch startTrip on change", () => {
      const wrapper = shallowMount(StartingDestination, {
        mocks: {
          $store: mockStore,
          $router: {
            push: jest.fn()
          },
          $route: {
            name: "welcome"
          }
        }
      });
      wrapper
        .find("[data-test-id=starting-destination]")
        .vm.$emit("change", station);
      expect(mockStore.dispatch).toBeCalledWith("startTrip", station);
    });
  });
});
