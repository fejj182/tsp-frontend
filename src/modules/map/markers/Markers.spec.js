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
  let mockStore, mockMap;
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
        trip: {
          startingStation: null,
          savedTrip: [{}]
        }
      }
    };
    mockMap = {};
  });

  describe("Starting markers", () => {
    it("should add the starting station markers to the map when the store is updated", () => {
      shallowMount(Markers, {
        mocks: {
          $store: mockStore
        },
        propsData: {
          map: mockMap
        }
      });
      mockStore.state.stations.startingStations = [getStation(), getStation()];
      setTimeout(() => {
        expect(mockMarker.addTo.mock.calls).toEqual([[mockMap], [mockMap]]);
      }, 0);
    });

    it("should remove the connection markers from the map when the starting stations are set", () => {
      shallowMount(Markers, {
        mocks: {
          $store: mockStore
        }
      });
      const station = getStation();
      mockStore.state.stations.activeConnections = [{}];
      mockStore.state.stations.startingStations = [getStation(), getStation()];
      mockStore.state.stations.activeStation = station;
      setTimeout(() => {
        expect(mockMarker.remove).toHaveBeenCalledTimes(1);
      }, 0);
    });

    it("should remove the inactive starting station markers from the map when the connections are set", () => {
      const wrapper = shallowMount(Markers, {
        mocks: {
          $store: mockStore
        }
      });
      const station = getStation();
      mockStore.state.stations.startingStations = [getStation(), getStation()];
      mockStore.state.stations.activeStation = station;
      mockStore.state.stations.activeConnections = [{}];
      setTimeout(() => {
        expect(wrapper.findAll(Popup).length).toEqual(2);
        expect(wrapper.find(Popup).props().station).toEqual(station);
        expect(mockMarker.remove).toHaveBeenCalledTimes(2);
      }, 0);
    });

    it("should set on click function on marker", () => {
      shallowMount(Markers, {
        mocks: {
          $store: mockStore
        }
      });
      mockStore.state.stations.startingStations = [getStation(), getStation()];
      setTimeout(() => {
        expect(mockMarker.on.mock.calls).toEqual([
          ["click", expect.any(Function)],
          ["click", expect.any(Function)]
        ]);
      }, 0);
    });

    it("should add them when trip is reset", () => {
      mockStore.state.stations.startingStations = [getStation(), getStation()];
      shallowMount(Markers, {
        mocks: {
          $store: mockStore
        },
        propsData: {
          map: mockMap
        }
      });
      mockStore.state.trip.savedTrip = [];
      setTimeout(() => {
        expect(mockMarker.addTo.mock.calls).toEqual([[mockMap], [mockMap]]);
      }, 0);
    });
  });

  describe("Connections", () => {
    it("should add the connections to the map when the connections are set in the store", () => {
      shallowMount(Markers, {
        mocks: {
          $store: mockStore
        },
        propsData: {
          map: mockMap
        }
      });
      mockStore.state.stations.activeConnections = [getStation(), getStation()];
      setTimeout(() => {
        expect(L.marker).toBeCalledTimes(2);
        expect(mockMarker.addTo.mock.calls).toEqual([[mockMap], [mockMap]]);
      }, 0);
    });

    it("should add the starting markers to the map when the connections are reset to empty", () => {
      shallowMount(Markers, {
        mocks: {
          $store: mockStore
        },
        propsData: {
          map: mockMap
        }
      });
      mockStore.state.stations.activeConnections = [];
      mockStore.state.stations.startingStations = [getStation(), getStation()];
      setTimeout(() => {
        expect(L.marker).toBeCalledTimes(2);
        expect(mockMarker.addTo.mock.calls).toEqual([[mockMap], [mockMap]]);
      }, 0);
    });

    it("should set on click function on marker", () => {
      shallowMount(Markers, {
        mocks: {
          $store: mockStore
        }
      });
      mockStore.state.stations.activeConnections = [getStation(), getStation()];
      setTimeout(() => {
        expect(mockMarker.on.mock.calls).toEqual([
          ["click", expect.any(Function)],
          ["click", expect.any(Function)]
        ]);
      }, 0);
    });
  });

  describe("Icons", () => {
    it("should be generated when a marker is generated", () => {
      shallowMount(Markers, {
        mocks: {
          $store: mockStore
        }
      });
      mockStore.state.stations.activeStation = getStation();
      mockStore.state.stations.activeConnections = [getStation(), getStation()];
      setTimeout(() => {
        expect(L.divIcon).toBeCalledTimes(3);
      }, 0);
    });
  });

  describe("Popups", () => {
    it("should not create Popups if there are no markers", () => {
      const wrapper = shallowMount(Markers, {
        mocks: {
          $store: mockStore
        }
      });
      expect(wrapper.find(Popup).exists()).toBe(false);
    });

    it("should create starting station popups", () => {
      const wrapper = shallowMount(Markers, {
        mocks: {
          $store: mockStore
        }
      });
      mockStore.state.stations.startingStations = [getStation(), getStation()];
      const popups = wrapper.findAll(Popup);
      setTimeout(() => {
        expect(popups.length).toBe(2);
      }, 0);
    });

    it("should create connection popups", () => {
      const wrapper = shallowMount(Markers, {
        mocks: {
          $store: mockStore
        }
      });
      mockStore.state.stations.activeConnections = [getStation(), getStation()];
      const popups = wrapper.findAll(Popup);
      setTimeout(() => {
        expect(popups.length).toBe(2);
        popups.wrappers.forEach(popup => {
          expect(popup.props().isConnection).toBe(true);
        });
      }, 0);
    });
  });

  function getStation() {
    const id = faker.random.number();
    const lat = parseFloat(faker.address.latitude());
    const lng = parseFloat(faker.address.longitude());
    return { id, lat, lng };
  }
});
