import { shallowMount } from "@vue/test-utils";
import L from "leaflet";
import Map from "./Map";
import faker from "faker";

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

  it("should call onMapClick function when map is clicked", () => {
    const wrapper = shallowMount(Map, {
      mocks: {
        $store: mockStore
      }
    });
    wrapper.find("#map").trigger("click");
    expect(mockOn).toHaveBeenCalledWith("click", wrapper.vm.onMapClick);
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
    it("should set onMapClick function on map mount", () => {
      const wrapper = shallowMount(Map, {
        mocks: {
          $store: mockStore
        }
      });
      expect(mockOn).toHaveBeenCalledWith("click", wrapper.vm.onMapClick);
    });

    it("should call off function if activeStation is set in store", () => {
      shallowMount(Map, {
        mocks: {
          $store: mockStore
        }
      });
      mockStore.state.stations.activeStation = {};
      expect(mockOff).toBeCalledWith("click");
    });

    it("should call on function if activeStation in store changes to null", () => {
      mockStore.state.stations.activeStation = {};
      const wrapper = shallowMount(Map, {
        mocks: {
          $store: mockStore
        }
      });
      mockStore.state.stations.activeStation = null;
      expect(mockOn.mock.calls).toEqual([
        ["click", wrapper.vm.onMapClick],
        ["click", wrapper.vm.onMapClick]
      ]);
    });

    it("should dispatch getNearestStation event", () => {
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
