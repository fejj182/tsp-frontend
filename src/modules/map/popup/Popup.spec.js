import { shallowMount, mount } from "@vue/test-utils";
import Popup from "./Popup.vue";
import faker from "faker";
import Vue from "vue";
import Vuetify from "vuetify";

Vue.use(Vuetify);

describe("Popup", () => {
  let mockMarker, mockStore, mockProps;
  beforeEach(() => {
    mockMarker = {
      bindPopup: jest.fn()
    };
    mockStore = {
      dispatch: jest.fn(),
      state: {
        trip: {
          startingStation: null,
          stops: [],
          selectedStop: null
        },
        stations: {
          activeStation: null
        }
      }
    };
    mockProps = {
      marker: mockMarker,
      station: { name: faker.address.city() },
      type: null
    };
  });
  it("should bind popup to marker on mount", () => {
    const wrapper = shallowMount(Popup, {
      mocks: {
        $store: mockStore
      },
      propsData: mockProps
    });
    const popup = wrapper.find(".add-to-trip");
    expect(mockMarker.bindPopup).toHaveBeenCalledWith(
      popup.element,
      expect.any(Object)
    );
  });

  it("should not show popup content as markup only injected into real popup", () => {
    const wrapper = shallowMount(Popup, {
      mocks: {
        $store: mockStore
      },
      propsData: mockProps
    });
    expect(wrapper.find(".add-to-trip").isVisible()).toBe(false);
  });

  it("should have station name as an h1", () => {
    const wrapper = shallowMount(Popup, {
      mocks: {
        $store: mockStore
      },
      propsData: mockProps
    });
    expect(wrapper.find("h1").text()).toBe(mockProps.station.name);
  });

  it("should not auto-open popup", () => {
    const mockPopup = { openPopup: jest.fn() };
    mockMarker.bindPopup.mockReturnValue(mockPopup);
    shallowMount(Popup, {
      mocks: {
        $store: mockStore
      },
      propsData: mockProps
    });
    expect(mockPopup.openPopup).not.toHaveBeenCalled();
  });

  it("should auto-open popup if is active", () => {
    const mockPopup = { openPopup: jest.fn() };
    mockMarker.bindPopup.mockReturnValue(mockPopup);
    mockStore.state.stations.activeStation = mockProps.station;
    mockProps.type = "ACTIVE";
    shallowMount(Popup, {
      mocks: {
        $store: mockStore
      },
      propsData: mockProps
    });
    expect(mockPopup.openPopup).toHaveBeenCalled();
  });

  describe("watch", () => {
    describe("selectedStop", () => {
      it("should open popup when station is same as in component", () => {
        const mockPopup = { openPopup: jest.fn() };
        mockMarker.bindPopup.mockReturnValue(mockPopup);
        shallowMount(Popup, {
          mocks: {
            $store: mockStore
          },
          propsData: mockProps
        });
        mockStore.state.trip.selectedStop = mockProps.station;
        expect(mockPopup.openPopup).toHaveBeenCalled();
      });

      it("should not open popup when station doesnt have same name", () => {
        const mockPopup = { openPopup: jest.fn() };
        mockMarker.bindPopup.mockReturnValue(mockPopup);
        shallowMount(Popup, {
          mocks: {
            $store: mockStore
          },
          propsData: mockProps
        });
        mockStore.state.trip.selectedStop = { name: "another" };
        expect(mockPopup.openPopup).not.toHaveBeenCalled();
      });
    });

    describe("activeStation", () => {
      it("should bind popup if changed", () => {
        mockStore.state.stations.activeStation = { name: "station" };
        shallowMount(Popup, {
          mocks: {
            $store: mockStore
          },
          propsData: mockProps
        });
        mockStore.state.stations.activeStation = { name: "Other station" };
        expect(mockMarker.bindPopup).toHaveBeenCalledTimes(2);
      });

      it("should close stop if activeStation reset", () => {
        const mockPopup = { remove: jest.fn() };
        mockMarker.bindPopup.mockReturnValue(mockPopup);
        mockStore.state.stations.activeStation = {};
        shallowMount(Popup, {
          mocks: {
            $store: mockStore
          },
          propsData: mockProps
        });
        mockStore.state.stations.activeStation = null;
        expect(mockPopup.remove).toHaveBeenCalled();
      });
    });
  });

  describe("Add to station button", () => {
    it("should show button to add station to trip if not started yet", () => {
      const wrapper = shallowMount(Popup, {
        mocks: {
          $store: mockStore
        },
        propsData: mockProps
      });
      expect(wrapper.find("[data-test-id=add-to-station]").exists()).toBe(true);
    });

    it("should show button to add station to trip if isConnection", () => {
      mockProps.type = "CONNECTION";
      const wrapper = shallowMount(Popup, {
        mocks: {
          $store: mockStore
        },
        propsData: mockProps
      });
      expect(wrapper.find("[data-test-id=add-to-station]").exists()).toBe(true);
    });

    it("should not show button to add station to trip if there are stops in store", () => {
      mockStore.state.trip.stops = [{}];
      const wrapper = shallowMount(Popup, {
        mocks: {
          $store: mockStore
        },
        propsData: mockProps
      });
      expect(wrapper.find("[data-test-id=add-to-station]").exists()).toBe(
        false
      );
    });

    it("should dispatch addToTrip", () => {
      const mockPopup = { remove: jest.fn() };
      mockMarker.bindPopup.mockReturnValue(mockPopup);
      const wrapper = mount(Popup, {
        mocks: {
          $store: mockStore
        },
        propsData: mockProps
      });
      wrapper.find("[data-test-id=add-to-station]").trigger("click");
      expect(mockStore.dispatch).toHaveBeenCalledWith(
        "addToTrip",
        mockProps.station
      );
    });
  });
});
