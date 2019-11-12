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
      on: mockOn
    });
    L.tileLayer.mockReturnValue({
      addTo: jest.fn()
    });
  });
  it("should call function passed in as onClick function when map is clicked", () => {
    const mockOnClick = jest.fn();
    const wrapper = shallowMount(Map, {
      propsData: {
        onClick: mockOnClick
      }
    });
    wrapper.find("#map").trigger("click");
    expect(mockOn).toHaveBeenCalledWith("click", mockOnClick);
  });
});
