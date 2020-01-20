import { shallowMount } from "@vue/test-utils";
import StartInput from "./StartInput.vue";
import stationsApi from "@/api/stations";
import Vue from "vue";
import Vuetify from "vuetify";
import flushPromises from "flush-promises";
import mapStation from "./stationFormMapper";
import { fakeStation } from "@/helpers/tests";
import { state as stations } from "@/store/modules/stations";
import _ from "lodash";

jest.mock("@/api/stations");

Vue.use(Vuetify);

describe("StartInput", () => {
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
        stations: _.cloneDeep(stations)
      }
    };
  });
  describe("on component loading", () => {
    it("should get stations when component mounted", () => {
      shallowMount(StartInput, {
        mocks: {
          $store: mockStore
        }
      });
      expect(stationsApi.getStations).toHaveBeenCalledTimes(1);
    });

    it("should load stations from api into props", async () => {
      const wrapper = shallowMount(StartInput, {
        mocks: {
          $store: mockStore
        }
      });
      await flushPromises();
      const mappedStations = enabledStations.map(station =>
        mapStation(station)
      );
      expect(
        wrapper.find("[data-test-id=destination-1]").props().items
      ).toEqual(mappedStations);
    });

    it("should have no stations if api call fails", async () => {
      stationsApi.getStations.mockRejectedValue("Failed");

      const wrapper = shallowMount(StartInput, {
        mocks: {
          $store: mockStore
        }
      });
      await flushPromises();
      expect(wrapper.vm.stations).toEqual([]);
    });

    it("should emit an alert if fails", async () => {
      stationsApi.getStations.mockRejectedValue("Failed");

      const wrapper = shallowMount(StartInput, {
        mocks: {
          $store: mockStore
        }
      });
      await flushPromises();
      expect(wrapper.emitted().alert.length).toBe(1);
    });
  });

  describe("On change", () => {
    it("should call store dispatch on change", () => {
      const wrapper = shallowMount(StartInput, {
        mocks: {
          $store: mockStore
        }
      });
      wrapper.find("[data-test-id=destination-1]").vm.$emit("change", station);
      expect(mockStore.dispatch).toBeCalledWith("addStationsToMap", station);
    });

    it("should emit an alert if fails", async () => {
      mockStore.dispatch.mockRejectedValue("fail");
      const wrapper = shallowMount(StartInput, {
        mocks: {
          $store: mockStore
        }
      });
      wrapper.find("[data-test-id=destination-1]").vm.$emit("change", station);
      await flushPromises();
      expect(wrapper.emitted().alert.length).toBe(1);
    });
  });
});
