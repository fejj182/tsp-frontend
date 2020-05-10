import { shallowMount } from "@vue/test-utils";
import ConnectionMarkers from "./ConnectionMarkers.vue";
import DummyMarker from "@/modules/map/markers/DummyMarker.vue";
import { generateMarker } from "@/plugins/leaflet";

jest.mock("@/plugins/leaflet");

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
    test("should be same number as markers", () => {
      generateMarker.mockReturnValue({});
      const wrapper = getWrapper();
      mockState.stations.activeConnections = [{}, {}];
      expect(wrapper.findAll(DummyMarker).length).toBe(2);
    });

    test("should have correct props", () => {
      const mockMarker = { position: "earth" };
      const mockStation = { name: "station" };
      generateMarker.mockReturnValue(mockMarker);
      const wrapper = getWrapper();
      mockState.stations.activeConnections = [mockStation];
      expect(wrapper.find(DummyMarker).props().marker).toEqual(mockMarker);
      expect(wrapper.find(DummyMarker).props().station).toEqual(mockStation);
      expect(wrapper.find(DummyMarker).props().type).toEqual("CONNECTION");
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
