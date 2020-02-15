import Markers from "./Markers.vue";
import { shallowMount } from "@vue/test-utils";
import faker from "faker";
import L from "leaflet";
import Popup from "@/modules/map/popup/Popup.vue";

jest.mock("leaflet", () => ({
  marker: jest.fn(),
  divIcon: jest.fn()
}));

describe("Markers", () => {
  let mockStore, wrapper, mockMap;
  const mockMarker = {
    addTo: jest.fn(),
    remove: jest.fn(),
    once: jest.fn()
  };

  beforeEach(() => {
    jest.resetAllMocks();
    L.marker.mockReturnValue(mockMarker);
    mockStore = {
      dispatch: jest.fn(),
      state: {
        stations: {
          activeStation: null,
          activeConnections: [],
          startingStations: []
        },
        map: {
          map: {}
        },
        trip: {
          startingStation: null
        }
      }
    };
    mockMap = mockStore.state.map.map;
    wrapper = shallowMount(Markers, {
      mocks: {
        $store: mockStore
      }
    });
  });

  describe("Active marker", () => {
    it("should add the active marker to the map when the store is updated", () => {
      mockStore.state.stations.activeStation = getStation();
      expect(mockMarker.addTo).toHaveBeenCalledWith(mockMap);
    });

    it("should not add marker to map if active marker is reset in store", () => {
      const prevStationPoint = { station: {}, marker: {} };
      wrapper.vm.stationPoint = prevStationPoint;

      mockStore.state.stations.activeStation = null;

      expect(wrapper.vm.stationPoint).toEqual(prevStationPoint);
      expect(mockMarker.addTo).not.toHaveBeenCalledWith(mockMap);
    });
  });

  describe("Starting markers", () => {
    it("should add the starting station markers to the map when the store is updated", () => {
      mockStore.state.stations.startingStations = [getStation(), getStation()];
      expect(mockMarker.addTo.mock.calls).toEqual([[mockMap], [mockMap]]);
    });

    it("should remove the inactive starting station markers from the map when the connections are set", () => {
      const station = getStation();
      let otherStation = getStation();
      mockStore.state.stations.startingStations = [station, otherStation];
      mockStore.state.trip.startingStation = station;
      mockStore.state.stations.activeConnections = [];
      expect(wrapper.findAll(Popup).length).toEqual(1);
      expect(wrapper.find(Popup).props().station).toEqual(station);
      expect(mockMarker.remove).toHaveBeenCalledTimes(1);
    });
  });

  describe("Connections", () => {
    it("should add the connections to the map when the store is updated", () => {
      mockStore.state.stations.activeConnections = [getStation(), getStation()];
      expect(mockMarker.addTo.mock.calls).toEqual([[mockMap], [mockMap]]);
    });

    it("should remove the old connection markers when the store is updated", () => {
      const prevConnectionPoints = [
        {
          marker: { remove: jest.fn() },
          station: { id: 1 }
        },
        {
          marker: { remove: jest.fn() },
          station: { id: 2 }
        }
      ];
      wrapper.vm.connectionPoints.push(
        prevConnectionPoints[0],
        prevConnectionPoints[1]
      );

      mockStore.state.stations.activeConnections = [getStation(), getStation()];

      prevConnectionPoints.forEach(marker => {
        expect(marker.marker.remove).toBeCalledTimes(1);
        expect(mockMarker.addTo).toHaveBeenCalledWith(mockMap);
      });
    });

    it("should set on click function on marker", () => {
      mockStore.state.stations.activeConnections = [getStation(), getStation()];
      expect(mockMarker.once.mock.calls).toEqual([
        ["click", expect.any(Function)],
        ["click", expect.any(Function)]
      ]);
    });

    it("should dispatch selectStop when onMarkerClick called", () => {
      const connection = getStation();
      wrapper.vm.onMarkerClick(connection);
      expect(mockStore.dispatch).toHaveBeenCalledWith("selectStop", connection);
    });

    it("should reset click handlers of other connections", () => {
      mockStore.state.stations.activeConnections = [getStation(), getStation()];
      wrapper.vm.onMarkerClick(
        wrapper.vm.$store.state.stations.activeConnections[0]
      );
      //TODO: can we be more specific with the station in the callback of mockMarker.once?
      expect(mockMarker.once).toHaveBeenCalledWith(
        "click",
        expect.any(Function)
      );
    });
  });

  describe("Icons", () => {
    it("should be generated when a marker is generated", () => {
      mockStore.state.stations.activeStation = getStation();
      mockStore.state.trip.startingStation = getStation();
      mockStore.state.stations.activeConnections = [getStation(), getStation()];
      expect(L.divIcon).toBeCalledTimes(3);
    });
  });

  describe("Popups", () => {
    it("should not create Popups if there are no markers", () => {
      expect(wrapper.find(Popup).exists()).toBe(false);
    });

    it("should create active station popups", () => {
      mockStore.state.stations.activeStation = getStation();
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
      mockStore.state.stations.activeConnections = [getStation(), getStation()];
      const popups = wrapper.findAll(Popup);
      expect(popups.length).toBe(2);
      popups.wrappers.forEach(popup => {
        expect(popup.props().isConnection).toBe(true);
      });
    });
  });

  function getStation() {
    const id = faker.random.number();
    const lat = parseFloat(faker.address.latitude());
    const lng = parseFloat(faker.address.longitude());
    return { id, lat, lng };
  }
});
