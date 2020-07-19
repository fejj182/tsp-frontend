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
    it("should initialize geoJson layer", done => {
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
      setTimeout(() => {
        expect(L.geoJSON).toHaveBeenCalledWith({
          type: "LineString",
          coordinates: [mockCoordSet[0], mockCoordSet[1]]
        });
        done();
      });
    });

    it("should add geoJson layer to the map", done => {
      shallowMount(CoordLine, {
        mocks: {
          $store: mockStore
        },
        propsData: {
          map: mockMap,
          coordSet: []
        }
      });
      setTimeout(() => {
        expect(geoJSON.addTo).toHaveBeenCalledWith(mockMap);
        done();
      });
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

      setTimeout(() => {
        wrapper.destroy();
        expect(geoJSON.remove).toHaveBeenCalled();
        done();
      });
    });
  });
});
