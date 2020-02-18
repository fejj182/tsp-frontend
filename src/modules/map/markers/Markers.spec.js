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
    on: jest.fn()
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

  describe("Starting markers", () => {
    it("should add the starting station markers to the map when the store is updated", () => {
      mockStore.state.stations.startingStations = [getStation(), getStation()];
      expect(mockMarker.addTo.mock.calls).toEqual([[mockMap], [mockMap]]);
    });

    it("should remove the inactive starting station markers from the map when the connections are set", () => {
      const station = getStation();
      mockStore.state.stations.startingStations = [getStation(), getStation()];
      mockStore.state.stations.activeStation = station;
      mockStore.state.stations.activeConnections = [];
      expect(wrapper.findAll(Popup).length).toEqual(1);
      expect(wrapper.find(Popup).props().station).toEqual(station);
      expect(mockMarker.remove).toHaveBeenCalledTimes(2);
    });

    it("should set on click function on marker", () => {
      mockStore.state.stations.startingStations = [getStation(), getStation()];
      expect(mockMarker.on.mock.calls).toEqual([
        ["click", expect.any(Function)],
        ["click", expect.any(Function)]
      ]);
    });

    it("should dispatch selectStartingInput when onStartingMarkerClick called and station not starting station", () => {
      const station = getStation();
      wrapper.vm.onStartingMarkerClick(station);
      expect(mockStore.dispatch).toHaveBeenCalledWith(
        "selectStartingInput",
        station
      );
    });

    it("should not dispatch selectStartingInput when onStartingMarkerClick called and station is starting station", () => {
      const station = getStation();
      mockStore.state.trip.startingStation = station;
      wrapper.vm.onStartingMarkerClick(station);
      expect(mockStore.dispatch).not.toHaveBeenCalledWith(
        "selectStartingInput",
        station
      );
    });
  });

  describe("Connections", () => {
    it("should add the connections to the map when the store is updated", () => {
      mockStore.state.stations.activeConnections = [getStation(), getStation()];
      expect(mockMarker.addTo.mock.calls).toEqual([[mockMap], [mockMap]]);
    });

    it("should remove the inactive old markers when connections change", () => {
      const activeStation = {
        marker: { remove: jest.fn() },
        station: getStation()
      };
      const inactiveStation = {
        marker: { remove: jest.fn() },
        station: getStation()
      };

      mockStore.state.stations.activeStation = activeStation.station;
      wrapper.vm.popups = [activeStation, inactiveStation];
      mockStore.state.stations.activeConnections = [getStation()];

      expect(inactiveStation.marker.remove).toBeCalledTimes(1);
    });

    it("should set on click function on marker", () => {
      mockStore.state.stations.activeConnections = [getStation(), getStation()];
      expect(mockMarker.on.mock.calls).toEqual([
        ["click", expect.any(Function)],
        ["click", expect.any(Function)]
      ]);
    });

    it("should dispatch selectStop when onMarkerClick called if connection not selected", () => {
      const connection = getStation();
      wrapper.vm.onConnectionMarkerClick(connection);
      expect(mockStore.dispatch).toHaveBeenCalledWith("selectStop", connection);
    });

    it("should not dispatch selectStop when onMarkerClick called if connection selected", () => {
      const connection = getStation();
      mockStore.state.trip.selectedStop = connection;
      wrapper.vm.onConnectionMarkerClick(connection);
      expect(mockStore.dispatch).not.toHaveBeenCalledWith(
        "selectStop",
        connection
      );
    });

    it("should reset click handlers of other connections", () => {
      mockStore.state.stations.activeConnections = [getStation(), getStation()];
      wrapper.vm.onConnectionMarkerClick(
        wrapper.vm.$store.state.stations.activeConnections[0]
      );
      //TODO: can we be more strict with the assertion expect.any(Function)
      expect(mockMarker.on).toHaveBeenCalledWith("click", expect.any(Function));
    });
  });

  describe("Icons", () => {
    it("should be generated when a marker is generated", () => {
      mockStore.state.stations.activeStation = getStation();
      mockStore.state.stations.activeConnections = [getStation(), getStation()];
      expect(L.divIcon).toBeCalledTimes(3);
    });
  });

  describe("Popups", () => {
    it("should not create Popups if there are no markers", () => {
      expect(wrapper.find(Popup).exists()).toBe(false);
    });

    it("should create starting station popups", () => {
      mockStore.state.stations.startingStations = [getStation(), getStation()];
      const popups = wrapper.findAll(Popup);
      expect(popups.length).toBe(2);
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
