import { shallowMount } from "@vue/test-utils";
import DummyMarker from "./DummyMarker.vue";
import Popup from "@/modules/map/popup/Popup.vue";

describe("DummyMarker", () => {
  let mockStation = {};
  test("should contain a popup", () => {
    const wrapper = shallowMount(DummyMarker, {
      propsData: {
        station: {}
      }
    });
    expect(wrapper.find(Popup).exists()).toBe(true);
  });

  test("should not contain a popup if dont have station", () => {
    const wrapper = shallowMount(DummyMarker);
    expect(wrapper.find(Popup).exists()).toBe(false);
  });

  test("should remove marker on destroy", () => {
    const mockRemove = jest.fn();
    const wrapper = shallowMount(DummyMarker, {
      propsData: {
        station: mockStation,
        marker: {
          remove: mockRemove
        }
      }
    });
    wrapper.destroy();
    expect(mockRemove).toHaveBeenCalled();
  });

  describe("Popup", () => {
    test("should contain the marker", () => {
      const mockMarker = {};
      const wrapper = shallowMount(DummyMarker, {
        propsData: {
          station: mockStation,
          marker: mockMarker
        }
      });
      expect(wrapper.find(Popup).props().marker).toEqual(mockMarker);
    });

    test("should contain the station", () => {
      const mockStation = {};
      const wrapper = shallowMount(DummyMarker, {
        propsData: {
          station: mockStation
        }
      });
      expect(wrapper.find(Popup).props().station).toEqual(mockStation);
    });
  });
});
