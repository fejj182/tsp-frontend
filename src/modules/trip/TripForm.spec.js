import { shallowMount } from "@vue/test-utils";
import flushPromises from "flush-promises";
import TripForm from "./TripForm.vue";
import stationsApi from "@/api/stations";
import Vue from "vue";
import Vuetify from "vuetify";

jest.mock("@/api/stations");

Vue.use(Vuetify);

describe("TripForm", () => {
  let mockEnabledStations, mockStore, barcelona, valencia, madrid;

  beforeEach(() => {
    barcelona = {
      name: "Barcelona-Sants",
      lat: "41.379520",
      lng: "2.140624"
    };
    valencia = {
      name: "Valencia-Estacio del Nord",
      lat: "39.465064",
      lng: "-0.377433"
    };
    madrid = {
      name: "Madrid - Atocha Cercanias",
      lat: "40.406528",
      lng: "-3.689373"
    };
    mockEnabledStations = [barcelona, valencia, madrid];
    stationsApi.getStations.mockResolvedValue(mockEnabledStations);

    mockStore = {
      dispatch: jest.fn(),
      state: {
        nearestStation: {
          station: {}
        }
      }
    };
  });

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
      expect(mockStore.dispatch).toBeCalledWith("setActiveStation", barcelona);
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
  });
});
