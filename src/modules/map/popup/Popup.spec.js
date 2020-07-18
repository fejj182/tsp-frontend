import { shallowMount, mount } from "@vue/test-utils";
import { bindPopupToMarker } from "@/plugins/leaflet";
import Popup from "./Popup.vue";
import faker from "faker";
import Vue from "vue";
import Vuetify from "vuetify";

jest.mock("@/plugins/leaflet");

Vue.use(Vuetify);

describe("Popup", () => {
  let mockMarker, mockPopup, mockStore, mockProps;
  beforeEach(() => {
    jest.resetAllMocks();
    mockMarker = {
      bindPopup: jest.fn()
    };
    mockStore = {
      dispatch: jest.fn(),
      state: {
        trip: {
          startingStation: null,
          stops: [],
          selectedStop: null,
          savedTrip: []
        },
        stations: {
          activeStation: null,
          activeConnections: []
        }
      }
    };
    mockProps = {
      marker: mockMarker,
      station: { name: faker.address.city() },
      type: null
    };
    mockPopup = {
      openPopup: jest.fn(),
      remove: jest.fn()
    };
    bindPopupToMarker.mockReturnValue(mockPopup);
  });
  it("should bind popup to marker on mount", () => {
    const wrapper = shallowMount(Popup, {
      mocks: {
        $store: mockStore
      },
      propsData: mockProps
    });
    const popup = wrapper.find("#add-to-trip");
    expect(bindPopupToMarker).toHaveBeenCalledWith(
      mockMarker,
      popup.html(),
      expect.any(Function)
    );
  });

  it("should dispatch addToTrip action when onclick function of popup is called", () => {
    shallowMount(Popup, {
      mocks: {
        $store: mockStore
      },
      propsData: mockProps
    });
    const popupOnClick = bindPopupToMarker.mock.calls[0][2];
    popupOnClick();
    expect(mockStore.dispatch).toHaveBeenCalledWith(
      "addToTrip",
      mockProps.station
    );
  });

  it("should not show popup content as markup only injected into real popup", () => {
    const wrapper = shallowMount(Popup, {
      mocks: {
        $store: mockStore
      },
      propsData: mockProps
    });
    expect(wrapper.find("#add-to-trip").exists()).toBe(false);
  });

  it("should open popup when station is same as in component", () => {
    mockStore.state.trip.selectedStop = mockProps.station;
    mockStore.state.stations.activeConnections = [{}];
    shallowMount(Popup, {
      mocks: {
        $store: mockStore
      },
      propsData: mockProps
    });
    expect(mockPopup.openPopup).toHaveBeenCalled();
  });

  it("should not auto-open popup", () => {
    shallowMount(Popup, {
      mocks: {
        $store: mockStore
      },
      propsData: mockProps
    });
    expect(mockPopup.openPopup).not.toHaveBeenCalled();
  });

  it("should not open popup when station is same as in component and no connections", () => {
    mockStore.state.trip.selectedStop = mockProps.station;
    mockStore.state.stations.activeConnections = [];
    shallowMount(Popup, {
      mocks: {
        $store: mockStore
      },
      propsData: mockProps
    });
    expect(mockPopup.openPopup).not.toHaveBeenCalled();
  });

  it("should not open popup when station doesnt have same name", () => {
    mockStore.state.trip.selectedStop = { name: "another" };
    mockStore.state.stations.activeConnections = [{}];
    shallowMount(Popup, {
      mocks: {
        $store: mockStore
      },
      propsData: mockProps
    });
    expect(mockPopup.openPopup).not.toHaveBeenCalled();
  });

  describe("watch", () => {
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
        expect(bindPopupToMarker).toHaveBeenCalledTimes(2);
      });

      it("should close stop if activeStation reset", () => {
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

  describe("popup content", () => {
    beforeEach(() => {
      bindPopupToMarker.mockReturnValue(null);
    });
    it("popup content should stay in DOM if popup not created", () => {
      const wrapper = shallowMount(Popup, {
        mocks: {
          $store: mockStore
        },
        propsData: mockProps
      });
      expect(wrapper.find("#add-to-trip").exists()).toBe(true);
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

    it("should show duration if it is a connection", () => {
      mockStore.state.trip.savedTrip = [mockProps.station];
      const wrapper = shallowMount(Popup, {
        mocks: {
          $store: mockStore
        },
        propsData: mockProps
      });
      expect(wrapper.find("#duration").text()).toBe(wrapper.vm.duration);
    });

    it("should not show duration if it is not a connection", () => {
      mockStore.state.trip.savedTrip = [];
      const wrapper = shallowMount(Popup, {
        mocks: {
          $store: mockStore
        },
        propsData: mockProps
      });
      expect(wrapper.find("#duration").exists()).toBe(false);
    });

    describe("Buttons", () => {
      describe("begin trip", () => {
        it("should show begin trip button if trip if not started yet", () => {
          const wrapper = shallowMount(Popup, {
            mocks: {
              $store: mockStore
            },
            propsData: mockProps
          });
          expect(wrapper.find("[data-test-id=btn-add]").exists()).toBe(true);
        });

        it("should not show begin trip button if more than one stop in trip", () => {
          mockStore.state.trip.savedTrip = [{}];
          const wrapper = shallowMount(Popup, {
            mocks: {
              $store: mockStore
            },
            propsData: mockProps
          });
          expect(wrapper.find("[data-test-id=btn-add]").exists()).toBe(false);
        });
      });

      describe("add to trip", () => {
        it("should show begin trip button if trip started and is a connection", () => {
          mockStore.state.trip.savedTrip = [mockProps.station];
          const wrapper = shallowMount(Popup, {
            mocks: {
              $store: mockStore
            },
            propsData: mockProps
          });
          expect(wrapper.find("[data-test-id=btn-add]").exists()).toBe(true);
        });

        it("should not show begin trip button if station is not last stop in saved trip", () => {
          mockStore.state.trip.savedTrip = [mockProps.station, {}];
          const wrapper = shallowMount(Popup, {
            mocks: {
              $store: mockStore
            },
            propsData: mockProps
          });
          expect(wrapper.find("[data-test-id=btn-add]").exists()).toBe(false);
        });
      });
    });
  });

  describe("Duration", () => {});
});
