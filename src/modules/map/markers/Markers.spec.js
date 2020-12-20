// shallowMount() behaves like mount() when components are lazy loaded
// https://github.com/vuejs/vue-test-utils/issues/1279

import { shallowMount } from "@vue/test-utils";
import Markers from "./Markers.vue";
import StartingMarkers from "./StartingMarkers";
import TripMarkers from "./StartingMarkers";
import ConnectionMarkers from "./StartingMarkers";

describe("Markers", () => {
  beforeEach(() => {
    jest.resetModules();
  });
  test("should contain StartingMarkers", () => {
    const wrapper = shallowMount(Markers, {
      propsData: {
        map: {}
      }
    });
    expect(wrapper.find(StartingMarkers).exists()).toBe(true);
    expect(wrapper.find(StartingMarkers).props().map).toEqual({});
  });

  test("should contain TripMarkers", () => {
    const wrapper = shallowMount(Markers, {
      propsData: {
        map: {}
      }
    });
    expect(wrapper.find(TripMarkers).exists()).toBe(true);
    expect(wrapper.find(TripMarkers).props().map).toEqual({});
  });

  test("should contain ConnectionMarkers", () => {
    const wrapper = shallowMount(Markers, {
      propsData: {
        map: {}
      }
    });
    expect(wrapper.find(ConnectionMarkers).exists()).toBe(true);
    expect(wrapper.find(ConnectionMarkers).props().map).toEqual({});
  });
});
