import { shallowMount } from "@vue/test-utils";
import StartingMarkers from "./StartingMarkers.vue";
import DummyMarker from "@/modules/map/markers/DummyMarker.vue";
import { generateMarker } from "@/plugins/leaflet";

jest.mock("@/plugins/leaflet");

describe("StartingMarkers", () => {
  let mockState, mockGetters;
  beforeEach(() => {
    mockState = {
      stations: {
        startingStations: [],
        activeConnections: []
      },
      trip: {
        tripReset: false
      }
    };
    mockGetters = {
      completeTrip: []
    };
  });
  test("should not load anything into dom on mount", () => {
    const wrapper = getWrapper();
    expect(wrapper.find("[data-test-id=starting-markers]").exists()).toBe(
      false
    );
  });

  test("should load everything into dom when state is correct", () => {
    mockState.stations.startingStations = [{}];
    const wrapper = getWrapper();
    expect(wrapper.find("[data-test-id=starting-markers]").exists()).toBe(true);
  });

  describe("DummyMarker", () => {
    test("should be same number as markers", done => {
      generateMarker.mockReturnValue({});
      const wrapper = getWrapper();
      mockState.stations.startingStations = [{}, {}];
      setTimeout(() => {
        expect(wrapper.findAll(DummyMarker).length).toBe(2);
        done();
      }, 0);
    });

    test("should have correct props", () => {
      const mockMarker = { position: "earth" };
      const mockStation = { name: "station" };
      generateMarker.mockReturnValue(mockMarker);
      const wrapper = getWrapper();
      mockState.stations.startingStations = [mockStation];
      setTimeout(() => {
        expect(wrapper.find(DummyMarker).props().marker).toEqual(mockMarker);
        expect(wrapper.find(DummyMarker).props().station).toEqual(mockStation);
        expect(wrapper.find(DummyMarker).props().type).toEqual("STARTING");
      }, 0);
    });

    test("should reload markers when if starting stations change", done => {
      const wrapper = getWrapper();
      mockState.stations.startingStations = [{}, {}, {}];
      setTimeout(() => {
        expect(wrapper.findAll(DummyMarker).length).toBe(3);
        done();
      }, 0);
    });
  });

  const getWrapper = () => {
    const wrapper = shallowMount(StartingMarkers, {
      mocks: {
        $store: {
          state: mockState,
          getters: mockGetters
        }
      }
    });
    return wrapper;
  };
});
