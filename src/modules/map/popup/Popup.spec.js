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
        popups: {
          openStation: {
            name: ""
          }
        },
        trip: {
          startingStation: null,
          stops: []
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

  it("should auto-open popup if is active", () => {
    const mockPopup = { openPopup: jest.fn() };
    mockMarker.bindPopup.mockReturnValue(mockPopup);
    mockStore.state.popups.openStation = station;
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
    describe("open", () => {
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
        mockStore.state.popups.openStation = station;
        expect(mockPopup.openPopup).toHaveBeenCalled();
      });

      it("should not open popup when station is not same as in component", () => {
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
        mockStore.state.popups.openStation = { name: "another" };
        expect(mockPopup.openPopup).not.toHaveBeenCalled();
      });

      it("should close popup when station is null", () => {
        const mockPopup = { closePopup: jest.fn() };
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
        mockStore.state.popups.openStation = null;
        expect(mockPopup.closePopup).toHaveBeenCalled();
      });
    });

    describe("marker", () => {
      it("should bind popup", () => {
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
        const newMarker = { bindPopup: jest.fn() };
        wrapper.setProps({ marker: newMarker });
        expect(newMarker.bindPopup).toHaveBeenCalledWith(
          popup.element,
          expect.any(Object)
        );
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

    it("should dispatch confirmStop if isConnection when button is clicked", () => {
      const wrapper = mount(Popup, {
        mocks: {
          $store: mockStore
        },
        propsData: {
          marker: mockMarker,
          station,
          isConnection: true
        }
      });
      wrapper.find("[data-test-id=add-to-station]").trigger("click");
      expect(wrapper.vm.$store.dispatch).toHaveBeenCalledWith(
        "confirmStop",
        station
      );
    });

    it("should dispatch setStartingStation and set zoom if not connection when button is clicked", () => {
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
      expect(wrapper.vm.$store.dispatch).toHaveBeenCalledWith(
        "setStartingStation",
        station
      );
      expect(mockStore.state.map.map.setZoom).toHaveBeenCalledWith(6);
    });
  });
});
