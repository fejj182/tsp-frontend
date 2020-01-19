import { shallowMount } from "@vue/test-utils";
import TripForm from "./TripForm.vue";
import stationsApi from "@/api/stations";
import Vue from "vue";
import Vuetify from "vuetify";
import StartInput from "./StartInput.vue";
import ConnectionInput from "./ConnectionInput.vue";
import { fakeStation } from "@/helpers/tests";
import { state as trip } from "@/store/modules/trip";
import { state as stations } from "@/store/modules/stations";
import _ from "lodash";

jest.mock("@/api/stations");

Vue.use(Vuetify);

describe("TripForm", () => {
  let mockStore, barcelona, valencia, madrid, mockConnections;

  beforeEach(() => {
    barcelona = fakeStation("barcelona");
    valencia = fakeStation("valencia");
    madrid = fakeStation("madrid");

    mockConnections = [valencia, madrid];

    stationsApi.getStations.mockResolvedValue([barcelona, valencia, madrid]);
    stationsApi.getConnections.mockResolvedValue(mockConnections);

    mockStore = {
      dispatch: jest.fn(),
      state: {
        stations: _.cloneDeep(stations),
        trip: _.cloneDeep(trip)
      }
    };
  });

  describe("StartInput", () => {
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
    it("should appear if there are stops in the store", () => {
      const wrapper = shallowMount(TripForm, {
        mocks: {
          $store: mockStore
        }
      });
      expect(wrapper.find(ConnectionInput).exists()).toBe(false);
      mockStore.state.trip.stops = { 1: barcelona };
      expect(wrapper.find(ConnectionInput).exists()).toBe(true);
    });

    it("should pass connections as items", async () => {
      mockStore.state.trip.stops = { 1: { connections: mockConnections } };
      const wrapper = shallowMount(TripForm, {
        mocks: {
          $store: mockStore
        }
      });

      expect(wrapper.find(ConnectionInput).props().connections).toEqual(
        mockConnections
      );
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
      mockStore.state.trip.connectionId = valencia.id;
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
