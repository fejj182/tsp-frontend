import { shallowMount } from "@vue/test-utils";
import { bindPopupToMarker } from "@/plugins/leaflet";
import Popup from "./Popup.vue";
import faker from "faker";
import Vue from "vue";
import Vuetify from "vuetify";

jest.mock("@/plugins/leaflet");

Vue.use(Vuetify);

describe("Popup", () => {
  let mockMarker,
    mockPopup,
    mockStore,
    mockProps,
    mockCitySlug,
    mockRouter,
    mockRoute;
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
    mockCitySlug = faker.address.city();
    mockProps = {
      marker: mockMarker,
      station: { name: faker.address.city(), slug: mockCitySlug },
      type: null
    };
    mockPopup = {
      openPopup: jest.fn(),
      remove: jest.fn()
    };
    mockRouter = {
      push: jest.fn()
    };
    mockRoute = {
      name: "route"
    };
    bindPopupToMarker.mockReturnValue(mockPopup);
  });
  it("should bind popup to marker on mount", () => {
    const wrapper = shallowMountPopup();
    const popup = wrapper.find("#popup-station-info");
    expect(bindPopupToMarker).toHaveBeenCalledWith(mockMarker, popup.html());
  });

  it("should not show popup content as markup only injected into real popup", () => {
    const wrapper = shallowMountPopup();
    expect(wrapper.find("#popup-station-info").exists()).toBe(false);
  });

  it("should open popup when station is same as in component", () => {
    mockStore.state.trip.selectedStop = mockProps.station;
    mockStore.state.stations.activeConnections = [{}];
    shallowMountPopup();
    expect(mockPopup.openPopup).toHaveBeenCalled();
  });

  it("should not auto-open popup", () => {
    shallowMountPopup();
    expect(mockPopup.openPopup).not.toHaveBeenCalled();
  });

  it("should not open popup when station is same as in component and no connections", () => {
    mockStore.state.trip.selectedStop = mockProps.station;
    mockStore.state.stations.activeConnections = [];
    shallowMountPopup();
    expect(mockPopup.openPopup).not.toHaveBeenCalled();
  });

  it("should not open popup when station doesnt have same name", () => {
    mockStore.state.trip.selectedStop = { name: "another" };
    mockStore.state.stations.activeConnections = [{}];
    shallowMountPopup();
    expect(mockPopup.openPopup).not.toHaveBeenCalled();
  });

  describe("watch", () => {
    describe("activeStation", () => {
      it("should bind popup if changed", () => {
        mockStore.state.stations.activeStation = { name: "station" };
        shallowMountPopup();
        mockStore.state.stations.activeStation = { name: "Other station" };
        expect(bindPopupToMarker).toHaveBeenCalledTimes(2);
      });

      it("should close stop if activeStation reset", () => {
        mockStore.state.stations.activeStation = {};
        shallowMountPopup();
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
      const wrapper = shallowMountPopup();
      expect(wrapper.find("#popup-station-info").exists()).toBe(true);
    });

    it("should have station name as an h1", () => {
      const wrapper = shallowMountPopup();
      expect(wrapper.find("h1").text()).toBe(mockProps.station.name);
    });

    it("should show duration if it is a connection", () => {
      mockStore.state.trip.savedTrip = [mockProps.station];
      const wrapper = shallowMountPopup();
      expect(wrapper.find("#duration").text()).toBe(wrapper.vm.duration);
    });

    it("should not show duration if it is not a connection", () => {
      mockStore.state.trip.savedTrip = [];
      const wrapper = shallowMountPopup();
      expect(wrapper.find("#duration").exists()).toBe(false);
    });
  });

  describe("Duration", () => {});

  const shallowMountPopup = () => {
    return shallowMount(Popup, {
      mocks: {
        $store: mockStore,
        $router: mockRouter,
        $route: mockRoute
      },
      propsData: mockProps
    });
  };
});
