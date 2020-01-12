import { shallowMount } from "@vue/test-utils";
import TripForm from "./TripForm.vue";
import stationsApi from "@/api/stations";
import Vue from "vue";
import Vuetify from "vuetify";
import StartInput from "./StartInput.vue";
import ConnectionInput from "./ConnectionInput.vue";
import { fakeStation } from "@/helpers/tests";

jest.mock("@/api/stations");

Vue.use(Vuetify);

describe("TripForm", () => {
  let mockStore, barcelona, valencia, madrid;

  beforeEach(() => {
    barcelona = fakeStation("barcelona");
    valencia = fakeStation("valencia");
    madrid = fakeStation("madrid");

    stationsApi.getStations.mockResolvedValue([barcelona, valencia, madrid]);
    stationsApi.getConnections.mockResolvedValue([valencia]);

    mockStore = {
      dispatch: jest.fn(),
      state: {
        stations: {
          activeStation: null,
          activeConnections: []
        },
        tripform: {
          connectionId: null
        }
      }
    };
  });

  describe("StartInput", () => {
    it("should have pass mapped activeStation to StartInput", () => {
      mockStore.state.stations.activeStation = barcelona;
      const wrapper = shallowMount(TripForm, {
        mocks: {
          $store: mockStore
        }
      });
      expect(wrapper.find(StartInput).props().value).toEqual({
        text: barcelona.name,
        value: barcelona
      });
    });

    it("should have no stations if api call fails", async () => {
      const wrapper = shallowMount(TripForm, {
        mocks: {
          $store: mockStore
        }
      });
      expect(wrapper.find("[data-test-id=alert]").exists()).toBe(false);
      wrapper.find(StartInput).vm.$emit("alert");
      expect(wrapper.find("[data-test-id=alert]").exists()).toBe(true);
    });
  });
  describe("Connections", () => {
    it("should appear after the first is selected", () => {
      const wrapper = shallowMount(TripForm, {
        mocks: {
          $store: mockStore
        }
      });
      expect(wrapper.find(ConnectionInput).exists()).toBe(false);
      mockStore.state.stations.activeStation = barcelona;
      expect(wrapper.find(ConnectionInput).exists()).toBe(true);
    });

    it("should pass connections as items", async () => {
      mockStore.state.stations.activeStation = barcelona;
      mockStore.state.stations.activeConnections = [valencia];
      const wrapper = shallowMount(TripForm, {
        mocks: {
          $store: mockStore
        }
      });

      expect(wrapper.find(ConnectionInput).props().items).toEqual([
        { text: valencia.name, value: valencia }
      ]);
    });

    it("should have the value set from of store if present", () => {
      mockStore.state.stations.activeStation = barcelona;
      mockStore.state.stations.activeConnections = [valencia, madrid];
      mockStore.state.tripform.connectionId = madrid.id;

      const wrapper = shallowMount(TripForm, {
        mocks: {
          $store: mockStore
        }
      });
      expect(wrapper.find(ConnectionInput).props().value).toEqual({
        text: madrid.name,
        value: madrid
      });
    });
  });

  describe("Add destination button", () => {
    it("should exist only if connection selected", () => {
      const wrapper = shallowMount(TripForm, {
        mocks: {
          $store: mockStore
        }
      });
      expect(wrapper.find("add-destination").exists()).toBe(false);
    });

    it("should exist only if connection selected", () => {
      mockStore.state.stations.activeConnections = [valencia, madrid];
      mockStore.state.tripform.connectionId = valencia.id;
      const wrapper = shallowMount(TripForm, {
        mocks: {
          $store: mockStore
        }
      });
      expect(wrapper.find("[data-test-id=add-destination]").exists()).toBe(
        true
      );
    });
  });
});
