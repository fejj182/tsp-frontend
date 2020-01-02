import Markers from "./Markers.vue";
import { shallowMount } from "@vue/test-utils";
import faker from "faker";
import L from "leaflet";
import Popup from "@/modules/popup/Popup.vue";

jest.mock("leaflet", () => ({
  marker: jest.fn(),
  divIcon: jest.fn()
}));

describe("Markers", () => {
  let mockStore, wrapper;
  const mockMarker = {
    addTo: jest.fn(),
    remove: jest.fn()
  };
  const mockMap = {};

  beforeEach(() => {
    jest.resetAllMocks();
    L.marker.mockReturnValue(mockMarker);
    mockStore = {
      state: {
        stations: {
          activeStation: null,
          connections: []
        }
      }
    };
    wrapper = shallowMount(Markers, {
      mocks: {
        $store: mockStore
      },
      propsData: {
        map: mockMap
      }
    });
  });

  describe("Active marker", () => {
    it("should be empty when component is mounted", () => {
      expect(wrapper.vm.activeMarker).toBeNull();
    });

    it("should add the active marker to the map when the store is updated", () => {
      changeActiveStationInStore(wrapper);

      expect(wrapper.vm.activeMarker).toEqual({
        station: wrapper.vm.$store.state.stations.activeStation,
        marker: mockMarker
      });
      expect(mockMarker.addTo).toHaveBeenCalledWith(mockMap);
    });

    it("should remove the old marker from the map if an active marker is already set", () => {
      const prevActiveMarker = { station: {}, marker: { remove: jest.fn() } };
      wrapper.vm.activeMarker = prevActiveMarker;

      changeActiveStationInStore(wrapper);

      expect(prevActiveMarker.marker.remove).toBeCalledTimes(1);
      expect(wrapper.vm.activeMarker).toEqual({
        station: wrapper.vm.$store.state.stations.activeStation,
        marker: mockMarker
      });
      expect(mockMarker.addTo).toHaveBeenCalledWith(mockMap);
    });

    it("should not add marker to map if active marker is reset in store", () => {
      const prevActiveMarker = { station: {}, marker: {} };
      wrapper.vm.activeMarker = prevActiveMarker;

      wrapper.vm.$store.state.stations.activeStation = null;

      expect(wrapper.vm.activeMarker).toEqual(prevActiveMarker);
      expect(mockMarker.addTo).not.toHaveBeenCalledWith(mockMap);
    });
  });

  describe("Connections", () => {
    it("should add the connections to the map when the store is updated", () => {
      changeConnectionsInStore(wrapper);

      expect(wrapper.vm.activeConnections).toEqual([
        {
          station: wrapper.vm.$store.state.stations.connections[0],
          marker: mockMarker
        },
        {
          station: wrapper.vm.$store.state.stations.connections[1],
          marker: mockMarker
        }
      ]);
      expect(mockMarker.addTo).toHaveBeenCalledWith(mockMap);
    });

    it("should remove the old connection markers when the store is updated", () => {
      const prevConnectionMarkers = [
        { marker: { remove: jest.fn() } },
        { marker: { remove: jest.fn() } }
      ];
      wrapper.vm.activeConnections.push(
        prevConnectionMarkers[0],
        prevConnectionMarkers[1]
      );

      changeConnectionsInStore(wrapper);

      prevConnectionMarkers.forEach(marker => {
        expect(marker.marker.remove).toBeCalledTimes(1);
        expect(mockMarker.addTo).toHaveBeenCalledWith(mockMap);
      });
      expect(wrapper.vm.activeConnections).toEqual([
        {
          station: wrapper.vm.$store.state.stations.connections[0],
          marker: mockMarker
        },
        {
          station: wrapper.vm.$store.state.stations.connections[1],
          marker: mockMarker
        }
      ]);
    });
  });

  describe("Icons", () => {
    it("should be generated when a marker is generated", () => {
      changeActiveStationInStore(wrapper);
      changeConnectionsInStore(wrapper);

      expect(L.divIcon).toBeCalledTimes(3);
    });
  });

  describe("Popups", () => {
    it("should not create Popups if there are no markers", () => {
      expect(wrapper.find(Popup).exists()).toBe(false);
    });

    it("should create Popups if there are markers", () => {
      changeActiveStationInStore(wrapper);
      expect(wrapper.findAll(Popup).length).toBe(1);
      changeConnectionsInStore(wrapper);
      expect(wrapper.findAll(Popup).length).toBe(3);
    });
  });

  function changeActiveStationInStore(wrapper) {
    wrapper.vm.$store.state.stations.activeStation = getStation();
  }

  function changeConnectionsInStore(wrapper) {
    wrapper.vm.$store.state.stations.connections = [getStation(), getStation()];
  }

  function getStation() {
    const lat = parseFloat(faker.address.latitude());
    const lng = parseFloat(faker.address.longitude());
    return { lat, lng };
  }
});
