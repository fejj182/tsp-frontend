import { shallowMount } from "@vue/test-utils";
import flushPromises from "flush-promises";
import TripForm from "./TripForm.vue";
import stationsApi from "@/api/stations";
import Vue from "vue";
import Vuetify from "vuetify";
import _ from "lodash";

jest.mock("@/api/stations");

Vue.use(Vuetify);

describe("TripForm", () => {
  let mockEnabledStations, mockStore, barcelona, valencia, madrid;

  beforeEach(() => {
    barcelona = {
      id: 1,
      name: "Barcelona-Sants",
      lat: "41.379520",
      lng: "2.140624"
    };
    valencia = {
      id: 2,
      name: "Valencia-Estacio del Nord",
      lat: "39.465064",
      lng: "-0.377433"
    };
    madrid = {
      id: 3,
      name: "Madrid - Atocha Cercanias",
      lat: "40.406528",
      lng: "-3.689373"
    };
    mockEnabledStations = [barcelona, valencia, madrid];
    stationsApi.getStations.mockResolvedValue(mockEnabledStations);
    stationsApi.getConnections.mockResolvedValue([valencia]);

    mockStore = {
      dispatch: jest.fn(),
      state: {
        nearestStation: {
          station: {},
          connections: []
        }
      }
    };
  });

  describe("getStations", () => {
    it("should get stations when component mounted", () => {
      shallowMount(TripForm, {
        mocks: {
          $store: mockStore
        }
      });
      expect(stationsApi.getStations).toHaveBeenCalledTimes(1);
    });

    it("should load stations into starting destination input", async () => {
      const wrapper = shallowMount(TripForm, {
        mocks: {
          $store: mockStore
        }
      });
      await flushPromises();

      const mockFormValues = mockEnabledStations.map(station => {
        return {
          text: station.name,
          value: station
        };
      });
      expect(wrapper.vm.stations).toEqual(mockFormValues);
    });

    it("should have no stations if api call fails", async () => {
      stationsApi.getStations.mockRejectedValue("Failed");

      const wrapper = shallowMount(TripForm, {
        mocks: {
          $store: mockStore
        }
      });
      expect(wrapper.find("[data-test-id=alert]").exists()).toBe(false);

      await flushPromises();
      expect(wrapper.vm.stations).toEqual([]);
      expect(wrapper.find("[data-test-id=alert]").exists()).toBe(true);
    });
  });
  describe("first destination", () => {
    it("should have stations in props", async () => {
      const wrapper = shallowMount(TripForm, {
        mocks: {
          $store: mockStore
        }
      });
      await flushPromises();
      expect(
        wrapper.find("[data-test-id=destination-1]").props().items
      ).toEqual([
        {
          text: "Barcelona-Sants",
          value: barcelona
        },
        {
          text: "Valencia-Estacio del Nord",
          value: valencia
        },
        {
          text: "Madrid - Atocha Cercanias",
          value: madrid
        }
      ]);
    });
    it("should call store dispatch on change", () => {
      const wrapper = shallowMount(TripForm, {
        mocks: {
          $store: mockStore
        }
      });
      wrapper
        .find("[data-test-id=destination-1]")
        .vm.$emit("change", barcelona);
      expect(mockStore.dispatch).toBeCalledWith(
        "changeTripFormStartingStation",
        barcelona
      );
    });

    it("should store connections on change", async () => {
      mockStore.state.nearestStation.connections = [valencia];
      const wrapper = shallowMount(TripForm, {
        mocks: {
          $store: mockStore
        }
      });

      wrapper
        .find("[data-test-id=destination-1]")
        .vm.$emit("change", barcelona);
      await flushPromises();
      expect(wrapper.vm.connections).toEqual([
        { text: valencia.name, value: valencia }
      ]);
    });

    it("should clear connections on change", async () => {
      mockStore.state.nearestStation.connections = [valencia];
      const wrapper = shallowMount(TripForm, {
        mocks: {
          $store: mockStore
        }
      });

      wrapper
        .find("[data-test-id=destination-1]")
        .vm.$emit("change", barcelona);
      await flushPromises();
      mockStore.state.nearestStation.connections = [];
      wrapper
        .find("[data-test-id=destination-1]")
        .vm.$emit("change", barcelona);
      expect(wrapper.vm.connections).toEqual([]);
    });

    it("should have v-model = activeStation", () => {
      mockStore.state.nearestStation.station = barcelona;
      const wrapper = shallowMount(TripForm, {
        mocks: {
          $store: mockStore
        }
      });
      expect(
        wrapper.find("[data-test-id=destination-1]").props().value
      ).toEqual({
        text: barcelona.name,
        value: barcelona
      });
    });

    xit("should show error if api call fails", async () => {
      stationsApi.getConnections.mockRejectedValue("Failed");
      const wrapper = shallowMount(TripForm, {
        mocks: {
          $store: mockStore
        }
      });
      wrapper
        .find("[data-test-id=destination-1]")
        .vm.$emit("change", barcelona);
      await flushPromises();
      expect(wrapper.find("[data-test-id=alert]").exists()).toBe(true);
    });
  });
  describe("second destination", () => {
    it("should appear after the first is selected", () => {
      const wrapper = shallowMount(TripForm, {
        mocks: {
          $store: mockStore
        }
      });
      expect(wrapper.find("[data-test-id=destination-2]").exists()).toBe(false);
      mockStore.state.nearestStation.station = barcelona;
      expect(wrapper.find("[data-test-id=destination-2]").exists()).toBe(true);
    });

    it("should have stations in props", async () => {
      mockStore.state.nearestStation.station = barcelona;
      mockStore.state.nearestStation.connections = [valencia];
      const wrapper = shallowMount(TripForm, {
        mocks: {
          $store: mockStore
        }
      });

      wrapper
        .find("[data-test-id=destination-1]")
        .vm.$emit("change", barcelona);
      await flushPromises();

      expect(
        wrapper.find("[data-test-id=destination-2]").props().items
      ).toEqual([
        {
          text: valencia.name,
          value: valencia
        }
      ]);
    });
  });
  describe("stationMapper", () => {
    it("should be used for all stations", async () => {
      stationsApi.getStations.mockResolvedValue([barcelona]);
      mockStore.state.nearestStation.station = {
        ...barcelona,
        cat: 456
      };
      const wrapper = shallowMount(TripForm, {
        mocks: {
          $store: mockStore
        }
      });
      await flushPromises();

      expect(
        _.find(wrapper.vm.stations, wrapper.vm.activeStation)
      ).toBeTruthy();
    });
  });
});
