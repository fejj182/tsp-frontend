import { shallowMount } from "@vue/test-utils";
import Connections from "./Connections.vue";
import L from "leaflet";
import faker from "faker";

jest.mock("leaflet", () => ({
  geoJSON: jest.fn()
}));

describe("Connections", () => {
  let geoJSON, mockStore;
  beforeEach(() => {
    geoJSON = {
      addTo: jest.fn(),
      addData: jest.fn(),
      removeFrom: jest.fn()
    };
    L.geoJSON.mockReturnValue(geoJSON);
    mockStore = {
      state: {
        stations: {
          connections: []
        }
      },
      getters: {
        connectionCoordSets: []
      }
    };
  });
  describe("GeoJSON layer", () => {
    it("should initialize geoJson layer", () => {
      const wrapper = shallowMount(Connections, {
        mocks: {
          $store: mockStore
        }
      });
      expect(wrapper.vm.geoJsonLayer).toBeNull();
    });

    it("should initialize geoJson layer", () => {
      const wrapper = shallowMount(Connections, {
        mocks: {
          $store: mockStore
        }
      });
      wrapper.vm.$store.state.stations.connections = "valencia";
      expect(wrapper.vm.geoJsonLayer).toBeTruthy();
    });

    it("should add geoJson layer to the map", () => {
      const wrapper = shallowMount(Connections, {
        mocks: {
          $store: mockStore
        }
      });
      wrapper.vm.$store.state.stations.connections = "valencia";
      expect(geoJSON.addTo).toHaveBeenCalledWith(wrapper.props().map);
    });

    it("should clear layer before adding new connections", () => {
      const wrapper = shallowMount(Connections, {
        mocks: {
          $store: mockStore
        }
      });

      wrapper.vm.geoJsonLayer = geoJSON;
      wrapper.vm.$store.state.stations.connections = "valencia";
      expect(geoJSON.removeFrom).toHaveBeenCalledWith(wrapper.props().map);
    });
  });

  describe("Active Connections", () => {
    it("should add 1 connection to geoJson layer if have at least two points", () => {
      mockStore.getters.connectionCoordSets = [[fakeCoord(), fakeCoord()]];
      const wrapper = shallowMount(Connections, {
        mocks: {
          $store: mockStore
        }
      });

      wrapper.vm.$store.state.stations.connections = "valencia";
      expect(geoJSON.addData).toHaveBeenCalledTimes(1);
    });

    it("should add 4 connections to geoJson layer if has two connections with 3 points each", () => {
      mockStore.getters.connectionCoordSets = [
        [fakeCoord(), fakeCoord(), fakeCoord()],
        [fakeCoord(), fakeCoord(), fakeCoord()]
      ];
      const wrapper = shallowMount(Connections, {
        mocks: {
          $store: mockStore
        }
      });

      wrapper.vm.$store.state.stations.connections = "valencia";
      expect(geoJSON.addData).toHaveBeenCalledTimes(4);
    });

    it("should skip invalid coordsets", () => {
      mockStore.getters.connectionCoordSets = [
        undefined,
        [fakeCoord(), fakeCoord(), fakeCoord()]
      ];
      const wrapper = shallowMount(Connections, {
        mocks: {
          $store: mockStore
        }
      });

      wrapper.vm.$store.state.stations.connections = "valencia";
      expect(geoJSON.addData).toHaveBeenCalledTimes(2);
    });

    it("should skip undefined coordsets", () => {
      mockStore.getters.connectionCoordSets = [
        [undefined, fakeCoord()],
        [fakeCoord(), fakeCoord(), fakeCoord()]
      ];
      const wrapper = shallowMount(Connections, {
        mocks: {
          $store: mockStore
        }
      });

      wrapper.vm.$store.state.stations.connections = "valencia";
      expect(geoJSON.addData).toHaveBeenCalledTimes(2);
    });

    it("should skip invalid coordsets", () => {
      mockStore.getters.connectionCoordSets = [
        [[1], fakeCoord()],
        [[1, 2, 3], fakeCoord(), fakeCoord()]
      ];
      const wrapper = shallowMount(Connections, {
        mocks: {
          $store: mockStore
        }
      });

      wrapper.vm.$store.state.stations.connections = "valencia";
      expect(geoJSON.addData).toHaveBeenCalledTimes(1);
    });

    it("should not add undefined connections to geoJson layer", () => {
      const wrapper = shallowMount(Connections, {
        mocks: {
          $store: mockStore
        }
      });
      wrapper.vm.$store.state.stations.connections = undefined;
      expect(geoJSON.addData).not.toHaveBeenCalled();
    });
  });

  function fakeCoord() {
    return [
      parseFloat(faker.address.longitude()),
      parseFloat(faker.address.latitude())
    ];
  }
});
