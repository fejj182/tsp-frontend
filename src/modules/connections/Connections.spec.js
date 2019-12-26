import { shallowMount } from "@vue/test-utils";
import Connections from "./Connections.vue";
import L from "leaflet";

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
    it("should add connections to geoJson layer if not empty", () => {
      const mockAddData = jest.fn();
      L.geoJSON.mockReturnValue({
        addTo: jest.fn(),
        addData: mockAddData
      });
      const wrapper = shallowMount(Connections, {
        mocks: {
          $store: mockStore
        }
      });
      expect(wrapper.vm.activeConnections).toEqual([]);
      const valencia = [{ name: "valencia", coords: [] }];
      wrapper.vm.$store.state.nearestStation.connections = valencia;
      expect(mockAddData).toHaveBeenCalled();
    });
  });
});
