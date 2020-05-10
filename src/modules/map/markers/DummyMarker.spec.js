import { shallowMount } from "@vue/test-utils";
import DummyMarker from "./DummyMarker.vue";
import Popup from "@/modules/map/popup/Popup.vue";

describe("DummyMarker", () => {
  test("should contain a popup", () => {
    const wrapper = shallowMount(DummyMarker);
    expect(wrapper.find(Popup).exists()).toBe(true);
  });

  test("should remove marker on destroy", () => {
    const mockRemove = jest.fn();
    const wrapper = shallowMount(DummyMarker, {
      propsData: {
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

    test("should contain the type", () => {
      const mockType = "ACTIVE";
      const wrapper = shallowMount(DummyMarker, {
        propsData: {
          type: mockType
        }
      });
      expect(wrapper.find(Popup).props().type).toEqual(mockType);
    });
  });
});
