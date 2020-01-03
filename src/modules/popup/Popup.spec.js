import { shallowMount } from "@vue/test-utils";
import Popup from "./Popup.vue";
import faker from "faker";

describe("Popup", () => {
  let wrapper, station, mockMarker;
  beforeEach(() => {
    mockMarker = {
      bindPopup: jest.fn()
    };
    station = { name: faker.address.city() };
    wrapper = shallowMount(Popup, {
      propsData: {
        marker: mockMarker,
        station
      }
    });
  });
  it("should bind popup to marker on mount", () => {
    const popup = wrapper.find("[data-test-id=popup]");
    expect(wrapper.vm.marker.bindPopup).toHaveBeenCalledWith(
      popup.element,
      expect.any(Object)
    );
  });

  it("should have station name as an h1", () => {
    expect(wrapper.find("h1").text()).toBe(station.name);
  });

  it("should auto-open popup if prop present", () => {
    const mockPopup = { openPopup: jest.fn() };
    mockMarker.bindPopup.mockReturnValue(mockPopup);
    shallowMount(Popup, {
      propsData: {
        marker: mockMarker,
        station,
        autoOpen: true
      }
    });
    expect(mockPopup.openPopup).toHaveBeenCalled();
  });
});
