import { shallowMount } from "@vue/test-utils";
import Markers from "./Markers.vue";
import StartingMarkers from "./StartingMarkers.vue";
import TripMarkers from "./trip/TripMarkers.vue";
import ConnectionMarkers from "./ConnectionMarkers.vue";

describe("Markers", () => {
  test("should contain StartingMarkers", () => {
    const mockMap = {};
    const wrapper = shallowMount(Markers, {
      propsData: {
        map: mockMap
      }
    });
    expect(wrapper.find(StartingMarkers).exists()).toBe(true);
    expect(wrapper.find(StartingMarkers).props().map).toEqual(mockMap);
  });

  test("should contain TripMarkers", () => {
    const mockMap = {};
    const wrapper = shallowMount(Markers, {
      propsData: {
        map: mockMap
      }
    });
    expect(wrapper.find(TripMarkers).exists()).toBe(true);
    expect(wrapper.find(TripMarkers).props().map).toEqual(mockMap);
  });

  test("should contain ConnectionMarkers", () => {
    const mockMap = {};
    const wrapper = shallowMount(Markers, {
      propsData: {
        map: mockMap
      }
    });
    expect(wrapper.find(ConnectionMarkers).exists()).toBe(true);
    expect(wrapper.find(ConnectionMarkers).props().map).toEqual(mockMap);
  });
});
