import { shallowMount } from "@vue/test-utils";
import TripMarker from "./TripMarker.vue";
import DummyMarker from "@/modules/map/markers/DummyMarker.vue";
import { generatePositionMarker } from "@/plugins/leaflet";

jest.mock("@/plugins/leaflet");

describe("TripMarker", () => {
  let mockState;
  beforeEach(() => {
    mockState = {
      stations: {
        activeStation: []
      }
    };
  });
  test("should not load anything into dom if marker not returned", () => {
    const wrapper = getWrapper();
    expect(wrapper.find("[data-test-id=trip-marker]").exists()).toBe(false);
  });

  test("should load DummyMarker into dom if marker is returned", () => {
    const mockMarker = {};
    generatePositionMarker.mockReturnValue(mockMarker);
    const wrapper = getWrapper();
    expect(wrapper.find("[data-test-id=trip-marker]").exists()).toBe(true);
    expect(wrapper.find(DummyMarker).exists()).toBe(true);
    expect(wrapper.find(DummyMarker).props().marker).toEqual(mockMarker);
  });

  const getWrapper = () => {
    const wrapper = shallowMount(TripMarker, {
      mocks: {
        $store: {
          state: mockState
        }
      }
    });
    return wrapper;
  };
});
