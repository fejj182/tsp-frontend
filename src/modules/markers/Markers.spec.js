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
      expect(wrapper.vm.stationMarker).toBeNull();
    });

    it("should add the active marker to the map when the store is updated", () => {
      changeActiveStationInStore(wrapper);

      expect(wrapper.vm.stationMarker).toEqual({
        station: wrapper.vm.$store.state.stations.activeStation,
        marker: mockMarker,
        autoOpen: true
      });
      expect(mockMarker.addTo).toHaveBeenCalledWith(mockMap);
    });

    it("should remove the old marker from the map if an active marker is already set", () => {
      const prevstationMarker = { station: {}, marker: { remove: jest.fn() } };
      wrapper.vm.stationMarker = prevstationMarker;

      changeActiveStationInStore(wrapper);

      expect(prevstationMarker.marker.remove).toBeCalledTimes(1);
      expect(wrapper.vm.stationMarker).toEqual({
        station: wrapper.vm.$store.state.stations.activeStation,
        marker: mockMarker,
        autoOpen: true
      });
      expect(mockMarker.addTo).toHaveBeenCalledWith(mockMap);
    });

    it("should not add marker to map if active marker is reset in store", () => {
      const prevstationMarker = { station: {}, marker: {} };
      wrapper.vm.stationMarker = prevstationMarker;

      wrapper.vm.$store.state.stations.activeStation = null;

      expect(wrapper.vm.stationMarker).toEqual(prevstationMarker);
      expect(mockMarker.addTo).not.toHaveBeenCalledWith(mockMap);
    });
  });

  describe("Connections", () => {
    it("should add the connections to the map when the store is updated", () => {
      changeConnectionsInStore(wrapper);

      expect(wrapper.vm.connectionMarkers).toEqual([
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
      wrapper.vm.connectionMarkers.push(
        prevConnectionMarkers[0],
        prevConnectionMarkers[1]
      );

      changeConnectionsInStore(wrapper);

      prevConnectionMarkers.forEach(marker => {
        expect(marker.marker.remove).toBeCalledTimes(1);
        expect(mockMarker.addTo).toHaveBeenCalledWith(mockMap);
      });
      expect(wrapper.vm.connectionMarkers).toEqual([
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

    it("should remove all popups if there is no active station", () => {
      changeActiveStationInStore(wrapper);
      changeConnectionsInStore(wrapper);
      wrapper.vm.$store.state.stations.activeStation = null;
      expect(wrapper.findAll(Popup).length).toBe(0);
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
