import { shallowMount } from "@vue/test-utils";
import L from "leaflet";
import Map from "./Map";

jest.mock("leaflet", () => ({
  map: jest.fn(),
  tileLayer: jest.fn()
}));

describe("Map", () => {
  let mockOn, mockOff, mockStore;

  beforeEach(() => {
    jest.resetAllMocks();
    mockOn = jest.fn();
    mockOff = jest.fn();
    mockStore = {
      dispatch: jest.fn(),
      state: {
        stations: {
          activeStation: null
        }
      }
    };
    L.map.mockReturnValue({
      setView: jest.fn(),
      on: mockOn,
      off: mockOff
    });
    L.tileLayer.mockReturnValue({
      addTo: jest.fn()
    });
  });

  it("should dispatch addMap action", () => {
    const wrapper = shallowMount(Map, {
      mocks: {
        $store: mockStore
      }
    });
    expect(mockStore.dispatch).toHaveBeenCalledWith("addMap", wrapper.vm.myMap);
  });
});
