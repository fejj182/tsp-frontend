import { shallowMount } from "@vue/test-utils";
import Connections from "./Connections.vue";
import L from "leaflet";
import faker from "faker";

jest.mock("leaflet", () => ({
  geoJSON: jest.fn(),
  marker: jest.fn()
}));

describe("Connections", () => {
  let geoJSON, mockStore;
  let mockMarker = {
    addTo: jest.fn()
  };
  beforeEach(() => {
    geoJSON = {
      addTo: jest.fn(),
      addData: jest.fn(),
      removeFrom: jest.fn()
    };
    L.geoJSON.mockReturnValue(geoJSON);
    L.marker.mockReturnValue(mockMarker);
    mockStore = {
      state: {
        stations: {
          connections: []
        }
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
      wrapper.vm.$store.state.stations.connections = [
        { coords: [fakeCoord(), fakeCoord()] }
      ];
      expect(wrapper.vm.geoJsonLayer).toBeTruthy();
    });

    it("should add geoJson layer to the map", () => {
      const mockMap = {};
      const wrapper = shallowMount(Connections, {
        mocks: {
          $store: mockStore
        },
        propsData: {
          map: mockMap
        }
      });
      wrapper.vm.$store.state.stations.connections = [
        { coords: [fakeCoord(), fakeCoord()] }
      ];
      expect(geoJSON.addTo).toHaveBeenCalledWith(mockMap);
    });

    it("should clear layer before adding new connections", () => {
      const mockMap = {};
      const wrapper = shallowMount(Connections, {
        mocks: {
          $store: mockStore
        },
        propsData: {
          map: mockMap
        }
      });

      wrapper.vm.geoJsonLayer = geoJSON;
      wrapper.vm.$store.state.stations.connections = [
        { coords: [fakeCoord(), fakeCoord()] }
      ];
      expect(geoJSON.removeFrom).toHaveBeenCalledWith(mockMap);
    });
  });

  describe("Active Connections", () => {
    describe("lines", () => {
      it("should add 1 line to geoJson layer if there are at least two points", () => {
        const wrapper = shallowMount(Connections, {
          mocks: {
            $store: mockStore
          }
        });

        wrapper.vm.$store.state.stations.connections = [
          { coords: [fakeCoord(), fakeCoord()] }
        ];
        expect(geoJSON.addData).toHaveBeenCalledTimes(1);
      });

      it("should add 4 lines to geoJson layer if has two connections with 3 points each", () => {
        const wrapper = shallowMount(Connections, {
          mocks: {
            $store: mockStore
          }
        });

        wrapper.vm.$store.state.stations.connections = [
          { coords: [fakeCoord(), fakeCoord(), fakeCoord()] },
          { coords: [fakeCoord(), fakeCoord(), fakeCoord()] }
        ];
        expect(geoJSON.addData).toHaveBeenCalledTimes(4);
      });

      it("should skip undefined coordsets", () => {
        const wrapper = shallowMount(Connections, {
          mocks: {
            $store: mockStore
          }
        });

        wrapper.vm.$store.state.stations.connections = [
          { coords: undefined },
          { coords: [fakeCoord(), fakeCoord(), fakeCoord()] }
        ];
        expect(geoJSON.addData).toHaveBeenCalledTimes(2);
      });

      it("should skip undefined coords", () => {
        const wrapper = shallowMount(Connections, {
          mocks: {
            $store: mockStore
          }
        });

        wrapper.vm.$store.state.stations.connections = [
          { coords: [undefined, fakeCoord()] },
          { coords: [fakeCoord(), fakeCoord(), fakeCoord()] }
        ];
        expect(geoJSON.addData).toHaveBeenCalledTimes(2);
      });

      it("should skip invalid coords", () => {
        const wrapper = shallowMount(Connections, {
          mocks: {
            $store: mockStore
          }
        });

        wrapper.vm.$store.state.stations.connections = [
          { coords: [[1], fakeCoord()] },
          { coords: [[1, 2, 3], fakeCoord(), fakeCoord()] }
        ];
        expect(geoJSON.addData).toHaveBeenCalledTimes(1);
      });

      it("should not add any lines to geoJson layer if connections are undefined", () => {
        const wrapper = shallowMount(Connections, {
          mocks: {
            $store: mockStore
          }
        });
        wrapper.vm.$store.state.stations.connections = undefined;
        expect(geoJSON.addData).not.toHaveBeenCalled();
      });
    });
  });

  function fakeCoord() {
    return [
      parseFloat(faker.address.longitude()),
      parseFloat(faker.address.latitude())
    ];
  }
});