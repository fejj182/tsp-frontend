import { shallowMount } from "@vue/test-utils";
import Lines from "./Lines.vue";
import L from "leaflet";
import { fakeStation } from "@/helpers/tests";

jest.mock("leaflet", () => ({
  geoJSON: jest.fn()
}));

describe("Connections", () => {
  let geoJSON, mockStore;
  beforeEach(() => {
    geoJSON = {
      addTo: jest.fn(),
      addData: jest.fn(),
      removeFrom: jest.fn()
    };
    L.geoJSON.mockReturnValue(geoJSON);
    mockStore = {
      state: {
        trip: {
          savedTrip: []
        }
      }
    };
  });
  describe("GeoJSON layer", () => {
    it("should initialize geoJson layer", () => {
      shallowMount(Lines, {
        mocks: {
          $store: mockStore
        }
      });
      expect(L.geoJSON).toHaveBeenCalled();
    });

    it("should add geoJson layer to the map", () => {
      const mockMap = {};
      shallowMount(Lines, {
        mocks: {
          $store: mockStore
        },
        propsData: {
          map: mockMap
        }
      });
      expect(geoJSON.addTo).toHaveBeenCalledWith(mockMap);
    });
  });

  describe("watch", () => {
    describe("trip", () => {
      it("should add 1 line to geoJson layer if there are at least two stops in trip", () => {
        shallowMount(Lines, {
          mocks: {
            $store: mockStore
          }
        });

        mockStore.state.trip.savedTrip = [fakeStation(), fakeStation()];
        expect(geoJSON.addData).toHaveBeenCalledTimes(1);
      });
    });
  });
});
