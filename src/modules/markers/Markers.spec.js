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
    remove: jest.fn(),
    once: jest.fn()
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
      expect(wrapper.vm.stationPoint).toBeNull();
    });

    it("should add the active marker to the map when the store is updated", () => {
      changeActiveStationInStore(wrapper);
      expect(mockMarker.addTo).toHaveBeenCalledWith(mockMap);
    });

    it("should remove the old marker from the map if an active marker is already set", () => {
      const prevStationPoint = { station: {}, marker: { remove: jest.fn() } };
      wrapper.vm.stationPoint = prevStationPoint;

      changeActiveStationInStore(wrapper);

      expect(prevStationPoint.marker.remove).toBeCalledTimes(1);
      expect(mockMarker.addTo).toHaveBeenCalledWith(mockMap);
    });

    it("should not add marker to map if active marker is reset in store", () => {
      const prevStationPoint = { station: {}, marker: {} };
      wrapper.vm.stationPoint = prevStationPoint;

      wrapper.vm.$store.state.stations.activeStation = null;

      expect(wrapper.vm.stationPoint).toEqual(prevStationPoint);
      expect(mockMarker.addTo).not.toHaveBeenCalledWith(mockMap);
    });
  });

  describe("Connections", () => {
    it("should add the connections to the map when the store is updated", () => {
      changeConnectionsInStore(wrapper);
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

      changeConnectionsInStore(wrapper);

      prevConnectionPoints.forEach(marker => {
        expect(marker.marker.remove).toBeCalledTimes(1);
        expect(mockMarker.addTo).toHaveBeenCalledWith(mockMap);
      });
    });

    it("should set on click function on marker", () => {
      changeConnectionsInStore(wrapper);
      expect(mockMarker.once.mock.calls).toEqual([
        ["click", expect.any(Function)],
        ["click", expect.any(Function)]
      ]);
    });

    it("should dispatch selectConnection when onMarkerClick called", () => {
      const connection = getStation();
      wrapper.vm.onMarkerClick(connection);
      expect(mockStore.dispatch).toHaveBeenCalledWith(
        "selectConnection",
        connection.id
      );
    });

    it("should reset click handlers of other connections", () => {
      changeConnectionsInStore(wrapper);
      wrapper.vm.onMarkerClick(wrapper.vm.$store.state.stations.connections[0]);
      //TODO: can we be more specific with the station in the callback of mockMarker.once?
      expect(mockMarker.once).toHaveBeenCalledWith(
        "click",
        expect.any(Function)
      );
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
      expect(wrapper.vm.stationPoint).toBe(null);
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
