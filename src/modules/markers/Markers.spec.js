import Markers from "./Markers.vue";
import { mount } from "@vue/test-utils";
import faker from "faker";
import L from "leaflet";

jest.mock("leaflet", () => ({
  marker: jest.fn()
}));

describe("Markers", () => {
  describe("Active marker", () => {
    let mockMarker = {
      addTo: jest.fn(),
      remove: jest.fn()
    };
    let mockStore;
    beforeEach(() => {
      L.marker.mockReturnValue(mockMarker);
      mockStore = {
        state: {
          stations: {
            activeStation: {}
          }
        }
      };
    });

    it("should be empty when component is mounted", () => {
      const wrapper = mount(Markers, {
        mocks: {
          $store: mockStore
        }
      });
      expect(wrapper.vm.activeMarker).toBeNull();
    });

    it("should set the active marker when the store is updated", () => {
      const mockMap = {};
      const wrapper = mount(Markers, {
        mocks: {
          $store: mockStore
        },
        propsData: {
          map: mockMap
        }
      });

      const lat = parseFloat(faker.address.latitude());
      const lng = parseFloat(faker.address.longitude());
      wrapper.vm.$store.state.stations.activeStation = { lat, lng };

      expect(wrapper.vm.activeMarker).toEqual(mockMarker);
      expect(mockMarker.addTo).toHaveBeenCalledWith(mockMap);
    });

    it("should remove the old marker from the map if an active marker is already set", () => {
      const mockMap = {};
      const wrapper = mount(Markers, {
        mocks: {
          $store: mockStore
        },
        propsData: {
          map: mockMap
        }
      });

      const prevActiveMarker = { remove: jest.fn() };
      wrapper.vm.activeMarker = prevActiveMarker;

      const lat = parseFloat(faker.address.latitude());
      const lng = parseFloat(faker.address.longitude());
      wrapper.vm.$store.state.stations.activeStation = { lat, lng };

      expect(prevActiveMarker.remove).toBeCalledTimes(1);
      expect(wrapper.vm.activeMarker).toEqual(mockMarker);
      expect(mockMarker.addTo).toHaveBeenCalledWith(mockMap);
    });
  });
});
