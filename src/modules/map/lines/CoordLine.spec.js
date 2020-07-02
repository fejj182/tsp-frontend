import { shallowMount } from "@vue/test-utils";
import CoordLine from "./CoordLine.vue";
import L from "leaflet";

jest.mock("leaflet", () => ({
  geoJSON: jest.fn()
}));

describe("CoordLine", () => {
  let geoJSON, mockStore, mockMap;
  beforeEach(() => {
    geoJSON = {
      addTo: jest.fn(),
      remove: jest.fn()
    };
    L.geoJSON.mockReturnValue(geoJSON);
    mockStore = {
      state: {
        trip: {
          savedTrip: []
        }
      }
    };
    mockMap = {};
  });
  describe("GeoJSON layer", () => {
    it("should initialize geoJson layer", () => {
      const mockCoordSet = [10, 20];
      shallowMount(CoordLine, {
        mocks: {
          $store: mockStore
        },
        propsData: {
          map: mockMap,
          coordSet: mockCoordSet
        }
      });
      expect(L.geoJSON).toHaveBeenCalledWith({
        type: "LineString",
        coordinates: [mockCoordSet[0], mockCoordSet[1]]
      });
    });

    it("should add geoJson layer to the map", () => {
      shallowMount(CoordLine, {
        mocks: {
          $store: mockStore
        },
        propsData: {
          map: mockMap,
          coordSet: []
        }
      });
      expect(geoJSON.addTo).toHaveBeenCalledWith(mockMap);
    });

    it("should save line to local data", () => {
      const wrapper = shallowMount(CoordLine, {
        mocks: {
          $store: mockStore
        },
        propsData: {
          map: mockMap,
          coordSet: []
        }
      });
      wrapper.destroy();
      expect(geoJSON.remove).toHaveBeenCalled();
    });
  });
});
