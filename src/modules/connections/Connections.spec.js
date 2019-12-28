import { shallowMount } from "@vue/test-utils";
import Connections from "./Connections.vue";
import L from "leaflet";
import faker from "faker";

jest.mock("leaflet", () => ({
  geoJSON: jest.fn()
}));

describe("Connections", () => {
  let mockGeoJSON, mockStore;
  beforeEach(() => {
    mockGeoJSON = {
      addTo: jest.fn()
    };
    L.geoJSON.mockReturnValue(mockGeoJSON);
    mockStore = {
      state: {
        nearestStation: {
          connections: []
        }
      },
      getters: {
        connectionCoordSets: []
      }
    };
  });
  it("should initialize geoJson layer", () => {
    const wrapper = shallowMount(Connections, {
      mocks: {
        $store: mockStore
      }
    });
    expect(wrapper.vm.geoJsonLayer).toBeTruthy();
  });

  it("should add geoJson layer to the map", () => {
    const wrapper = shallowMount(Connections, {
      mocks: {
        $store: mockStore
      }
    });
    expect(mockGeoJSON.addTo).toHaveBeenCalledWith(wrapper.props().map);
  });

  describe("Active Connections", () => {
    let mockAddData;
    beforeEach(() => {
      mockAddData = jest.fn();
      L.geoJSON.mockReturnValue({
        addTo: jest.fn(),
        addData: mockAddData
      });
    });
    it("should add 1 connection to geoJson layer if have at least two points", () => {
      mockStore.getters.connectionCoordSets = [[fakeCoord(), fakeCoord()]];
      const wrapper = shallowMount(Connections, {
        mocks: {
          $store: mockStore
        }
      });

      wrapper.vm.$store.state.nearestStation.connections = "valencia";
      expect(mockAddData).toHaveBeenCalledTimes(1);
    });

    it("should add 4 connections to geoJson layer if has two connections with 3 points each", () => {
      mockStore.getters.connectionCoordSets = [
        [fakeCoord(), fakeCoord(), fakeCoord()],
        [fakeCoord(), fakeCoord(), fakeCoord()]
      ];
      const wrapper = shallowMount(Connections, {
        mocks: {
          $store: mockStore
        }
      });

      wrapper.vm.$store.state.nearestStation.connections = "valencia";
      expect(mockAddData).toHaveBeenCalledTimes(4);
    });

    it("should not add connections to geoJson layer empty", () => {
      const wrapper = shallowMount(Connections, {
        mocks: {
          $store: mockStore
        }
      });
      wrapper.vm.$store.state.nearestStation.connections = "valencia";
      expect(mockAddData).not.toHaveBeenCalled();
    });
  });

  function fakeCoord() {
    return [
      parseFloat(faker.address.longitude()),
      parseFloat(faker.address.latitude())
    ];
  }
});
