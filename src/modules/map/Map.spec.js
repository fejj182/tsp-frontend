import { shallowMount } from "@vue/test-utils";
import L from "leaflet";
import Map from "./Map";

jest.mock("leaflet", () => ({
  map: jest.fn(),
  tileLayer: jest.fn()
}));

describe("Map", () => {
  let mockOn;

  beforeEach(() => {
    mockOn = jest.fn();
    L.map.mockReturnValue({
      setView: jest.fn(),
      once: mockOn
    });
    L.tileLayer.mockReturnValue({
      addTo: jest.fn()
    });
  });

  it("should call onMapClick function when map is clicked", () => {
    const wrapper = shallowMount(Map);
    wrapper.find("#map").trigger("click");
    expect(mockOn).toHaveBeenCalledWith("click", wrapper.vm.onMapClick);
  });

  it("should call onMapClick function only once", () => {
    const wrapper = shallowMount(Map);
    wrapper.find("#map").trigger("click");
    wrapper.find("#map").trigger("click");
    expect(mockOn).toHaveBeenCalledTimes(1);
  });

  describe("onMapClick", () => {
    it("should emit mapClick event", () => {
      const wrapper = shallowMount(Map);
      wrapper.vm.onMapClick("event");
      expect(wrapper.emitted().mapClick[0]).toEqual(["event"]);
    });
  });
});
