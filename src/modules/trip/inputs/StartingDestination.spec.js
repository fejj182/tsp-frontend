import { shallowMount } from "@vue/test-utils";
import Vue from "vue";
import Vuetify from "vuetify";
import flushPromises from "flush-promises";
import _ from "lodash";

import StartingDestination from "./StartingDestination.vue";
import stationsApi from "@/api/stations";
import { mapStation } from "@/mappers/stationFormMapper";
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
    stationsApi.getStations.mockResolvedValue(enabledStations);
    mockStore = {
      dispatch: jest.fn(),
      state: {
        trip: _.cloneDeep(trip)
      }
    };
  });
  describe("on component loading", () => {
    it("should get stations when component mounted", () => {
      shallowMount(StartingDestination, {
        mocks: {
          $store: mockStore
        }
      });
      expect(stationsApi.getStations).toHaveBeenCalledTimes(1);
    });

    it("should load stations from api into props", async () => {
      const wrapper = shallowMount(StartingDestination, {
        mocks: {
          $store: mockStore
        }
      });
      await flushPromises();
      const mappedStations = enabledStations.map(station =>
        mapStation(station)
      );
      expect(
        wrapper.find("[data-test-id=starting-destination]").props().items
      ).toEqual(mappedStations);
    });

    it("should have no stations if api call fails", async () => {
      stationsApi.getStations.mockRejectedValue("Failed");

      const wrapper = shallowMount(StartingDestination, {
        mocks: {
          $store: mockStore
        }
      });
      await flushPromises();
      expect(wrapper.vm.stations).toEqual([]);
    });

    it("should emit an alert if getStations fails", async () => {
      stationsApi.getStations.mockRejectedValue("Failed");

      const wrapper = shallowMount(StartingDestination, {
        mocks: {
          $store: mockStore
        }
      });
      await flushPromises();
      expect(wrapper.emitted().alert.length).toBe(1);
    });
  });

  describe("On change", () => {
    it("should dispatch startTrip on change", () => {
      const wrapper = shallowMount(StartingDestination, {
        mocks: {
          $store: mockStore
        }
      });
      wrapper
        .find("[data-test-id=starting-destination]")
        .vm.$emit("change", station);
      expect(mockStore.dispatch).toBeCalledWith("startTrip", station);
    });

    it("should emit an alert if dispatch fails", async () => {
      mockStore.dispatch.mockRejectedValueOnce();
      const wrapper = shallowMount(StartingDestination, {
        mocks: {
          $store: mockStore
        }
      });
      wrapper
        .find("[data-test-id=starting-destination]")
        .vm.$emit("change", station);
      await flushPromises();
      expect(wrapper.emitted().alert.length).toBe(1);
    });
  });
});
