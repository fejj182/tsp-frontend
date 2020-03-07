import { shallowMount } from "@vue/test-utils";
import Filters from "@/modules/filters/Filters.vue";
import ConnectionFilters from "@/modules/filters/ConnectionFilters.vue";

describe("Filters", () => {
  let mockStore;
  beforeEach(() => {
    mockStore = {
      state: {
        stations: {
          activeConnections: []
        }
      }
    };
  });
  describe("ConnectionFilters", () => {
    it("should not exist by default", () => {
      const wrapper = shallowMount(Filters, {
        mocks: {
          $store: mockStore
        }
      });
      expect(wrapper.find(ConnectionFilters).exists()).toBe(false);
    });

    it("should exist if connections in store", () => {
      mockStore.state.stations.activeConnections = [{}];
      const wrapper = shallowMount(Filters, {
        mocks: {
          $store: mockStore
        }
      });
      expect(wrapper.find(ConnectionFilters).exists()).toBe(true);
    });
  });
});
