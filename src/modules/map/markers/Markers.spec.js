// shallowMount() behaves like mount() when components are lazy loaded
// https://github.com/vuejs/vue-test-utils/issues/1279

import { mount } from "@vue/test-utils";
import Markers from "./Markers.vue";

describe("Markers", () => {
  let mockStubs = {};
  beforeEach(() => {
    jest.resetModules();
    mockStubs = {
      StartingMarkers: {
        name: "StartingMarkers",
        template: "<span></span>"
      },
      TripMarkers: {
        name: "TripMarkers",
        template: "<span></span>"
      },
      ConnectionMarkers: {
        name: "ConnectionMarkers",
        template: "<span></span>"
      }
    };
  });
  test("should contain StartingMarkers", () => {
    const wrapper = mount(Markers, {
      propsData: {
        map: {}
      },
      stubs: mockStubs
    });
    expect(wrapper.find("[data-test-id=starting-markers]").exists()).toBe(true);
    expect(
      wrapper.find("[data-test-id=starting-markers]").vm.$attrs.map
    ).toEqual({});
  });

  test("should contain TripMarkers", () => {
    const wrapper = mount(Markers, {
      propsData: {
        map: {}
      },
      stubs: mockStubs
    });
    expect(wrapper.find("[data-test-id=trip-markers]").exists()).toBe(true);
    expect(wrapper.find("[data-test-id=trip-markers]").vm.$attrs.map).toEqual(
      {}
    );
  });

  test("should contain ConnectionMarkers", () => {
    const wrapper = mount(Markers, {
      propsData: {
        map: {}
      },
      stubs: mockStubs
    });
    expect(wrapper.find("[data-test-id=connection-markers]").exists()).toBe(
      true
    );
    expect(
      wrapper.find("[data-test-id=connection-markers]").vm.$attrs.map
    ).toEqual({});
  });
});
