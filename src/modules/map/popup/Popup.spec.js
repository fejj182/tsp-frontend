import { shallowMount, mount } from "@vue/test-utils";
import Popup from "./Popup.vue";
import faker from "faker";
import Vue from "vue";
import Vuetify from "vuetify";

Vue.use(Vuetify);

describe("Popup", () => {
  let station, mockMarker, mockStore;
  beforeEach(() => {
    station = { name: faker.address.city() };
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
        },
        map: {
          map: {
            setZoom: jest.fn()
          }
        }
      }
    };
  });
  it("should bind popup to marker on mount", () => {
    const wrapper = shallowMount(Popup, {
      mocks: {
        $store: mockStore
      },
      propsData: {
        marker: mockMarker,
        station
      }
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
      propsData: {
        marker: mockMarker,
        station
      }
    });
    expect(wrapper.find(".add-to-trip").isVisible()).toBe(false);
  });

  it("should have station name as an h1", () => {
    const wrapper = shallowMount(Popup, {
      mocks: {
        $store: mockStore
      },
      propsData: {
        marker: mockMarker,
        station
      }
    });
    expect(wrapper.find("h1").text()).toBe(station.name);
  });

  it("should not auto-open popup", () => {
    const mockPopup = { openPopup: jest.fn() };
    mockMarker.bindPopup.mockReturnValue(mockPopup);
    shallowMount(Popup, {
      mocks: {
        $store: mockStore
      },
      propsData: {
        marker: mockMarker,
        station
      }
    });
    expect(mockPopup.openPopup).not.toHaveBeenCalled();
  });

  it("should auto-open popup if is active", () => {
    const mockPopup = { openPopup: jest.fn() };
    mockMarker.bindPopup.mockReturnValue(mockPopup);
    mockStore.state.stations.activeStation = station;
    shallowMount(Popup, {
      mocks: {
        $store: mockStore
      },
      propsData: {
        marker: mockMarker,
        station
      }
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
          propsData: {
            marker: mockMarker,
            station
          }
        });
        mockStore.state.trip.selectedStop = station;
        expect(mockPopup.openPopup).toHaveBeenCalled();
      });

      it("should not open popup when station doesnt have same name", () => {
        const mockPopup = { openPopup: jest.fn() };
        mockMarker.bindPopup.mockReturnValue(mockPopup);
        shallowMount(Popup, {
          mocks: {
            $store: mockStore
          },
          propsData: {
            marker: mockMarker,
            station
          }
        });
        mockStore.state.trip.selectedStop = { name: "another" };
        expect(mockPopup.openPopup).not.toHaveBeenCalled();
      });

      it("should close stop if selectedStop reset", () => {
        const mockPopup = { closePopup: jest.fn() };
        mockMarker.bindPopup.mockReturnValue(mockPopup);
        mockStore.state.trip.selectedStop = {};
        shallowMount(Popup, {
          mocks: {
            $store: mockStore
          },
          propsData: {
            marker: mockMarker,
            station
          }
        });
        mockStore.state.trip.selectedStop = null;
        expect(mockPopup.closePopup).toHaveBeenCalled();
      });
    });
  });

  describe("Add to station button", () => {
    it("should show button to add station to trip if no starting station selected", () => {
      const wrapper = shallowMount(Popup, {
        mocks: {
          $store: mockStore
        },
        propsData: {
          marker: mockMarker,
          station
        }
      });
      expect(wrapper.find("[data-test-id=add-to-station]").exists()).toBe(true);
    });

    it("should not show button to add station to trip if there are stops in store", () => {
      mockStore.state.trip.stops = [{}];
      const wrapper = shallowMount(Popup, {
        mocks: {
          $store: mockStore
        },
        propsData: {
          marker: mockMarker,
          station
        }
      });
      expect(wrapper.find("[data-test-id=add-to-station]").exists()).toBe(
        false
      );
    });

    it("should show button to add station to trip if isConnection", () => {
      mockStore.state.trip.stops = [{}];
      const wrapper = shallowMount(Popup, {
        mocks: {
          $store: mockStore
        },
        propsData: {
          marker: mockMarker,
          station,
          isConnection: true
        }
      });
      expect(wrapper.find("[data-test-id=add-to-station]").exists()).toBe(true);
    });

    it("should dispatch addToTrip", () => {
      const mockPopup = { closePopup: jest.fn() };
      mockMarker.bindPopup.mockReturnValue(mockPopup);
      const wrapper = mount(Popup, {
        mocks: {
          $store: mockStore
        },
        propsData: {
          marker: mockMarker,
          station,
          isConnection: false
        }
      });
      wrapper.find("[data-test-id=add-to-station]").trigger("click");
      expect(mockStore.dispatch).toHaveBeenCalledWith("addToTrip", station);
    });
  });
});
