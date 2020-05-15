import { shallowMount } from "@vue/test-utils";
import ConnectionMarkers from "./ConnectionMarkers.vue";
import DummyMarker from "@/modules/map/markers/DummyMarker.vue";
import {} from "./types";
import { generateMarker } from "@/plugins/leaflet";

jest.mock("@/plugins/leaflet");
jest.mock("./types", () => ({
  get SLOW() {
    return 0;
  }
}));

describe("ConnectionMarkers", () => {
  let mockState;
  beforeEach(() => {
    mockState = {
      stations: {
        activeConnections: []
      }
    };
  });
  test("should not load anything into dom on mount", () => {
    const wrapper = getWrapper();
    expect(wrapper.find("[data-test-id=connection-markers]").exists()).toBe(
      false
    );
  });

  test("should load everything into dom when state is correct", () => {
    mockState.stations.activeConnections = [{}];
    const wrapper = getWrapper();
    expect(wrapper.find("[data-test-id=connection-markers]").exists()).toBe(
      true
    );
  });

  describe("DummyMarker", () => {
    test("should be same number as markers", done => {
      generateMarker.mockReturnValue({});
      const wrapper = getWrapper();
      mockState.stations.activeConnections = [{}, {}];
      setTimeout(() => {
        expect(wrapper.findAll(DummyMarker).length).toBe(2);
        done();
      }, 0);
    });

    test("should have correct props", done => {
      const mockMarker = { position: "earth" };
      const mockStation = { name: "station" };
      generateMarker.mockReturnValue(mockMarker);
      const wrapper = getWrapper();
      mockState.stations.activeConnections = [mockStation];
      setTimeout(() => {
        expect(wrapper.find(DummyMarker).props().marker).toEqual(mockMarker);
        done();
      }, 0);
    });
  });

  const getWrapper = () => {
    const wrapper = shallowMount(ConnectionMarkers, {
      mocks: {
        $store: {
          state: mockState
        }
      }
    });
    return wrapper;
  };
});
