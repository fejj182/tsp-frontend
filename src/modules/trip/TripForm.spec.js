import { mount, shallowMount, createLocalVue } from "@vue/test-utils";
import flushPromises from "flush-promises";
import TripForm from "./TripForm.vue";
import stationsApi from "@/api/stations";
import Vue from "vue";
import Vuetify from "vuetify";

jest.mock("@/api/stations");

Vue.use(Vuetify);

const localVue = createLocalVue();

describe("TripForm", () => {
  let mockEnabledStations, vuetify, barcelona, valencia, madrid;

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

    vuetify = new Vuetify();
  });

  it("should get stations when component mounted", () => {
    shallowMount(TripForm);
    expect(stationsApi.getStations).toHaveBeenCalledTimes(1);
  });

  it("should load stations into starting destination input", async () => {
    const wrapper = shallowMount(TripForm);
    await flushPromises();

    const mockFormValues = mockEnabledStations.map(station => {
      return {
        text: station.name,
        value: station
      };
    });
    expect(wrapper.vm.stations).toEqual(mockFormValues);
  });

  describe("v-autocomplete", () => {
    it("should have stations in props", async () => {
      const wrapper = mount(TripForm, {
        localVue,
        vuetify
      });
      await flushPromises();
      expect(wrapper.find(".v-autocomplete").props().items).toEqual([
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
      const mockStore = { dispatch: jest.fn() };
      const wrapper = mount(TripForm, {
        localVue,
        vuetify,
        mocks: {
          $store: mockStore
        }
      });
      wrapper.find(".v-autocomplete").vm.$emit("change", barcelona);
      expect(mockStore.dispatch).toBeCalledWith("setActiveStation", barcelona);
    });
  });
});
