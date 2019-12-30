import Markers from "./Markers.vue";
import { mount } from "@vue/test-utils";
import faker from "faker";
import L from "leaflet";

jest.mock("leaflet", () => ({
  marker: jest.fn(),
  divIcon: jest.fn()
}));

describe("Markers", () => {
  let mockMarker = {
    addTo: jest.fn(),
    remove: jest.fn()
  };
  beforeEach(() => {
    jest.resetAllMocks();
    L.marker.mockReturnValue(mockMarker);
  });

  describe("Active marker", () => {
    let mockStore;
    beforeEach(() => {
      mockStore = {
        state: {
          stations: {
            activeStation: {}
          }
        }
      };
    });

    it("should be empty when component is mounted", () => {
      const wrapper = mount(Markers, {
        mocks: {
          $store: mockStore
        }
      });
      expect(wrapper.vm.activeMarker).toBeNull();
    });

    it("should add the active marker to the map when the store is updated", () => {
      const mockMap = {};
      const wrapper = mount(Markers, {
        mocks: {
          $store: mockStore
        },
        propsData: {
          map: mockMap
        }
      });

      changeActiveStationInStore(wrapper);

      expect(wrapper.vm.activeMarker).toEqual(mockMarker);
      expect(mockMarker.addTo).toHaveBeenCalledWith(mockMap);
    });

    it("should remove the old marker from the map if an active marker is already set", () => {
      const mockMap = {};
      const wrapper = mount(Markers, {
        mocks: {
          $store: mockStore
        },
        propsData: {
          map: mockMap
        }
      });

      const prevActiveMarker = { remove: jest.fn() };
      wrapper.vm.activeMarker = prevActiveMarker;

      changeActiveStationInStore(wrapper);

      expect(prevActiveMarker.remove).toBeCalledTimes(1);
      expect(wrapper.vm.activeMarker).toEqual(mockMarker);
      expect(mockMarker.addTo).toHaveBeenCalledWith(mockMap);
    });
  });

  describe("Connections", () => {
    let mockStore;
    beforeEach(() => {
      mockStore = {
        state: {
          stations: {
            connections: []
          }
        }
      };
    });

    it("should add the connections to the map when the store is updated", () => {
      const mockMap = {};
      const wrapper = mount(Markers, {
        mocks: {
          $store: mockStore
        },
        propsData: {
          map: mockMap
        }
      });

      changeConnectionsInStore(wrapper);

      expect(wrapper.vm.activeConnections).toEqual([mockMarker, mockMarker]);
      expect(mockMarker.addTo).toHaveBeenCalledWith(mockMap);
    });

    it("should remove the old connection markers when the store is updated", () => {
      const mockMap = {};
      const wrapper = mount(Markers, {
        mocks: {
          $store: mockStore
        },
        propsData: {
          map: mockMap
        }
      });

      const prevConnectionMarkers = [
        { remove: jest.fn() },
        { remove: jest.fn() }
      ];
      wrapper.vm.activeConnections.push(
        prevConnectionMarkers[0],
        prevConnectionMarkers[1]
      );

      changeConnectionsInStore(wrapper);

      prevConnectionMarkers.forEach(marker => {
        expect(marker.remove).toBeCalledTimes(1);
        expect(mockMarker.addTo).toHaveBeenCalledWith(mockMap);
      });
      expect(wrapper.vm.activeConnections).toEqual([mockMarker, mockMarker]);
    });
  });

  describe("Icons", () => {
    let mockStore;
    beforeEach(() => {
      mockStore = {
        state: {
          stations: {
            activeStation: {},
            connections: []
          }
        }
      };
    });
    it("should be generated when a marker is generated", () => {
      const wrapper = mount(Markers, {
        mocks: {
          $store: mockStore
        }
      });

      changeActiveStationInStore(wrapper);
      changeConnectionsInStore(wrapper);

      expect(L.divIcon).toBeCalledTimes(3);
    });
  });

  function changeActiveStationInStore(wrapper) {
    const lat = parseFloat(faker.address.latitude());
    const lng = parseFloat(faker.address.longitude());
    wrapper.vm.$store.state.stations.activeStation = { lat, lng };
  }

  function changeConnectionsInStore(wrapper) {
    wrapper.vm.$store.state.stations.connections = [{}, {}];
  }
});
