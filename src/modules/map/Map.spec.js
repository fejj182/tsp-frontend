import { shallowMount } from "@vue/test-utils";
import L from "leaflet";
import Map from "./Map";
import faker from "faker";

jest.mock("leaflet", () => ({
  map: jest.fn(),
  tileLayer: jest.fn()
}));

describe("Map", () => {
  let mockOn, mockStore;

  beforeEach(() => {
    mockOn = jest.fn();
    mockStore = {
      dispatch: jest.fn()
    };
    L.map.mockReturnValue({
      setView: jest.fn(),
      once: mockOn
    });
    L.tileLayer.mockReturnValue({
      addTo: jest.fn()
    });
  });

  it("should call onMapClick function when map is clicked", () => {
    const wrapper = shallowMount(Map, {
      mocks: {
        $store: mockStore
      }
    });
    wrapper.find("#map").trigger("click");
    expect(mockOn).toHaveBeenCalledWith("click", wrapper.vm.onMapClick);
  });

  it("should call onMapClick function only once", () => {
    const wrapper = shallowMount(Map, {
      mocks: {
        $store: mockStore
      }
    });
    wrapper.find("#map").trigger("click");
    wrapper.find("#map").trigger("click");
    expect(mockOn).toHaveBeenCalledTimes(1);
  });

  it("should dispatch addMap action", () => {
    const wrapper = shallowMount(Map, {
      mocks: {
        $store: mockStore
      }
    });
    expect(mockStore.dispatch).toHaveBeenCalledWith("addMap", wrapper.vm.myMap);
  });

  describe("onMapClick", () => {
    it("should dispatch getNearestStation event", () => {
      const mockStore = { dispatch: jest.fn() };
      const wrapper = shallowMount(Map, {
        mocks: {
          $store: mockStore
        }
      });
      const lat = parseFloat(faker.address.latitude());
      const lng = parseFloat(faker.address.longitude());
      wrapper.vm.onMapClick({
        latlng: { lat, lng }
      });
      expect(mockStore.dispatch).toHaveBeenCalledWith("getNearestStation", {
        lat,
        lng
      });
    });

    it("should dispatch resetTrip event", () => {
      const mockStore = { dispatch: jest.fn() };
      const wrapper = shallowMount(Map, {
        mocks: {
          $store: mockStore
        }
      });
      const lat = parseFloat(faker.address.latitude());
      const lng = parseFloat(faker.address.longitude());
      wrapper.vm.onMapClick({
        latlng: { lat, lng }
      });
      expect(mockStore.dispatch).toHaveBeenCalledWith("resetTrip");
    });
  });
});
