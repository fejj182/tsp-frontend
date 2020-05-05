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
          savedTrip: []
        }
      }
    };
    mockMap = {};
  });

  describe("Starting markers", () => {
    it("should add the starting station markers to the map when the store is updated", done => {
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
        done();
      }, 0);
    });

    it("should not add the starting station markers to the map when there is a saved trip", done => {
      mockStore.state.trip.savedTrip = [{}];
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
        expect(mockMarker.addTo.mock.calls).not.toEqual([[mockMap], [mockMap]]);
        done();
      }, 0);
    });

    it("should remove the connection markers from the map when the starting stations are set", done => {
      const wrapper = shallowMount(Markers, {
        mocks: {
          $store: mockStore
        }
      });
      wrapper.vm.markers = [mockMarker];
      mockStore.state.stations.startingStations = [getStation(), getStation()];
      setTimeout(() => {
        expect(mockMarker.remove).toHaveBeenCalledTimes(1);
        done();
      }, 0);
    });

    it("should set on click function on marker", done => {
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
        done();
      }, 0);
    });

    it("should re-add them to map when trip is reset", done => {
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
        done();
      }, 0);
    });
  });

  describe("Connections", () => {
    it("should add the connections to the map when the connections are set in the store", done => {
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
        done();
      }, 0);
    });

    it("should remove the inactive starting station markers from the map when the connections are set", done => {
      const wrapper = shallowMount(Markers, {
        mocks: {
          $store: mockStore
        }
      });
      wrapper.vm.markers = [mockMarker];
      mockStore.state.stations.activeConnections = [{}, {}];
      setTimeout(() => {
        expect(mockMarker.remove).toHaveBeenCalledTimes(1);
        done();
      }, 100);
    });

    it("should add the active marker to the map when the connections are reset to empty", done => {
      mockStore.state.stations.activeStation = {};
      shallowMount(Markers, {
        mocks: {
          $store: mockStore
        },
        propsData: {
          map: mockMap
        }
      });
      mockStore.state.stations.activeConnections = [];
      setTimeout(() => {
        expect(L.marker).toBeCalledTimes(1);
        expect(mockMarker.addTo).toHaveBeenCalledWith(mockMap);
        done();
      }, 0);
    });

    it("should set on click function on marker", done => {
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
        done();
      }, 0);
    });
  });

  describe("Icons", () => {
    it("should be generated when a marker is generated", done => {
      shallowMount(Markers, {
        mocks: {
          $store: mockStore
        }
      });
      mockStore.state.stations.activeStation = getStation();
      mockStore.state.stations.activeConnections = [getStation(), getStation()];
      setTimeout(() => {
        expect(L.divIcon).toBeCalledTimes(3);
        done();
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

    it("should create starting station popups", done => {
      const wrapper = shallowMount(Markers, {
        mocks: {
          $store: mockStore
        }
      });
      mockStore.state.stations.startingStations = [getStation(), getStation()];
      setTimeout(() => {
        expect(wrapper.findAll(Popup).length).toBe(2);
        done();
      }, 0);
    });

    it("should create connection popups", done => {
      const wrapper = shallowMount(Markers, {
        mocks: {
          $store: mockStore
        }
      });
      mockStore.state.stations.activeConnections = [getStation(), getStation()];
      setTimeout(() => {
        const popups = wrapper.findAll(Popup);
        expect(popups.length).toBe(2);
        popups.wrappers.forEach(popup => {
          expect(popup.props().isConnection).toBe(true);
        });
        done();
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
