import { shallowMount } from "@vue/test-utils";
import ActiveMarker from "./ActiveMarker.vue";
import DummyMarker from "@/modules/map/markers/DummyMarker.vue";
import { generateMarker } from "@/plugins/leaflet";

jest.mock("@/plugins/leaflet");

describe("ActiveMarker", () => {
  let mockState;
  beforeEach(() => {
    mockState = {
      stations: {
        activeStation: []
      }
    };
  });
  test("should not load anything into dom on mount", () => {
    const wrapper = getWrapper();
    expect(wrapper.find("[data-test-id=active-marker]").exists()).toBe(false);
  });

  test("should load everything into dom when state is correct", () => {
    generateMarker.mockReturnValue({});
    const wrapper = getWrapper();
    mockState.stations.activeStation = {};
    expect(wrapper.find("[data-test-id=active-marker]").exists()).toBe(true);
  });

  describe("DummyMarker", () => {
    test("should be same number as markers", () => {
      generateMarker.mockReturnValue({});
      const wrapper = getWrapper();
      mockState.stations.activeStation = {};
      expect(wrapper.find(DummyMarker).exists()).toBe(true);
    });

    test("should have correct props", () => {
      const mockMarker = { position: "earth" };
      const mockStation = { name: "station" };
      generateMarker.mockReturnValue(mockMarker);
      const wrapper = getWrapper();
      mockState.stations.activeStation = mockStation;
      expect(wrapper.find(DummyMarker).props().marker).toEqual(mockMarker);
      expect(wrapper.find(DummyMarker).props().station).toEqual(mockStation);
      expect(wrapper.find(DummyMarker).props().type).toEqual("ACTIVE");
    });
  });

  const getWrapper = () => {
    const wrapper = shallowMount(ActiveMarker, {
      mocks: {
        $store: {
          state: mockState
        }
      }
    });
    return wrapper;
  };
});
