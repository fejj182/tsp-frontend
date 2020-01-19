import { shallowMount, mount } from "@vue/test-utils";
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

  describe("Multi destinations", () => {
    it("should show 1 connection input when there is 1 stop in the store", async () => {
      mockStore.state.stations.activeStation = barcelona;
      mockStore.state.trip.stops = [{ connections: mockConnections }];
      const wrapper = shallowMount(TripForm, {
        mocks: {
          $store: mockStore
        }
      });
      expect(wrapper.findAll(".connection").length).toBe(1);
    });

    it("should show 3 connection inputs when there is 3 stops in the store", async () => {
      mockStore.state.stations.activeStation = barcelona;
      mockStore.state.trip.stops = [
        { connections: mockConnections },
        { connections: mockConnections },
        { connections: mockConnections }
      ];
      const wrapper = shallowMount(TripForm, {
        mocks: {
          $store: mockStore
        }
      });
      expect(wrapper.findAll(".connection").length).toBe(3);
    });
  });

  describe("Add destination button", () => {
    it("should not exist when component loads", () => {
      const wrapper = shallowMount(TripForm, {
        mocks: {
          $store: mockStore
        }
      });
      expect(wrapper.find("add-destination").exists()).toBe(false);
    });

    it("should exist only if at least 1 stop in store", () => {
      mockStore.state.stations.activeConnections = [valencia, madrid];
      mockStore.state.trip.stops = [barcelona];
      const wrapper = shallowMount(TripForm, {
        mocks: {
          $store: mockStore
        }
      });
      expect(wrapper.find("[data-test-id=add-destination]").exists()).toBe(
        true
      );
    });

    it("should dispatch addStopToTrip action onClick", () => {
      mockStore.state.stations.activeConnections = [valencia, madrid];
      mockStore.state.trip.stops = [barcelona];
      const wrapper = mount(TripForm, {
        mocks: {
          $store: mockStore
        },
        stubs: {
          StartInput: {
            name: "StartInput",
            template: "<span></span>"
          },
          ConnectionInput: {
            name: "ConnectionInput",
            template: "<span></span>"
          }
        }
      });
      wrapper.find("[data-test-id=add-destination]").trigger("click");
      expect(mockStore.dispatch).toBeCalledWith("addStopToTrip");
    });
  });
});
