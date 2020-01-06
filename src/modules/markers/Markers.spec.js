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
      dispatch: jest.fn(),
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
      expect(mockMarker.addTo).toHaveBeenCalledWith(mockMap);
    });

    it("should remove the old marker from the map if an active marker is already set", () => {
      const prevstationMarker = { station: {}, marker: { remove: jest.fn() } };
      wrapper.vm.stationMarker = prevstationMarker;

      changeActiveStationInStore(wrapper);

      expect(prevstationMarker.marker.remove).toBeCalledTimes(1);
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
      expect(mockMarker.addTo.mock.calls).toEqual([[mockMap], [mockMap]]);
    });

    it("should remove the old connection markers when the store is updated", () => {
      const prevConnectionMarkers = [
        {
          marker: { remove: jest.fn() },
          station: { id: 1 }
        },
        {
          marker: { remove: jest.fn() },
          station: { id: 2 }
        }
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

    it("should create active station popups", () => {
      changeActiveStationInStore(wrapper);
      const popups = wrapper.findAll(Popup);
      expect(popups.length).toBe(1);
      popups.wrappers.forEach(() => {
        expect(mockStore.dispatch).toHaveBeenCalledWith(
          "openPopup",
          wrapper.vm.activeStation
        );
      });
    });

    it("should create connection popups", () => {
      changeConnectionsInStore(wrapper);
      const popups = wrapper.findAll(Popup);
      expect(popups.length).toBe(2);
      popups.wrappers.forEach(popup => {
        expect(popup.props().isConnection).toBe(true);
      });
    });

    it("should remove station popup if there is no active station", () => {
      changeActiveStationInStore(wrapper);
      changeConnectionsInStore(wrapper);
      wrapper.vm.$store.state.stations.activeStation = null;
      expect(wrapper.findAll(Popup).length).toBe(2);
      expect(wrapper.vm.stationMarker).toBe(null);
    });

    it("should remove connection popups if there are no connections", () => {
      changeActiveStationInStore(wrapper);
      changeConnectionsInStore(wrapper);
      wrapper.vm.$store.state.stations.connections = [];
      expect(wrapper.findAll(Popup).length).toBe(1);
    });
  });

  function changeActiveStationInStore(wrapper) {
    wrapper.vm.$store.state.stations.activeStation = getStation();
  }

  function changeConnectionsInStore(wrapper) {
    wrapper.vm.$store.state.stations.connections = [getStation(), getStation()];
  }

  function getStation() {
    const id = faker.random.number();
    const lat = parseFloat(faker.address.latitude());
    const lng = parseFloat(faker.address.longitude());
    return { id, lat, lng };
  }
});
