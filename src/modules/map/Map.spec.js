import { shallowMount } from "@vue/test-utils";
import Vue from "vue";
import isMobile from "@/plugins/isMobile";
import Map from "./Map";
import Markers from "@/modules/map/markers/Markers.vue";
import Lines from "@/modules/map/lines/Lines.vue";
import FiltersDialog from "@/components/dialogs/FiltersDialog.vue";
import paneUtils from "@/modules/map/panes/paneUtils";
import { createMap, createPanes, flyTo } from "@/plugins/leaflet";

Vue.use(isMobile);

jest.mock("leaflet", () => ({
  map: jest.fn(),
  tileLayer: jest.fn()
}));

jest.mock("@/modules/map/panes/paneUtils", () => ({
  displayPanesInRange: jest.fn()
}));

jest.mock("@/plugins/leaflet", () => ({
  createMap: jest.fn(),
  createPanes: jest.fn(),
  flyTo: jest.fn()
}));

describe("Map", () => {
  let mockOn, mockOff, mockStore, mockMap, mockPanes, mockRoute;

  beforeEach(() => {
    jest.resetAllMocks();
    window.innerWidth = 1000;
    mockOn = jest.fn();
    mockOff = jest.fn();
    mockStore = {
      dispatch: jest.fn(),
      state: {
        stations: {
          activeStation: null,
          activeConnections: []
        },
        filters: {
          activeDurationRange: []
        },
        trip: {
          stops: [],
          savedTrip: []
        }
      },
      getters: {
        completeTrip: []
      }
    };
    mockMap = {
      setView: jest.fn(),
      on: mockOn,
      off: mockOff,
      createPane: jest.fn(),
      flyTo: jest.fn()
    };
    createMap.mockReturnValue(mockMap);
    mockPanes = {};
    createPanes.mockReturnValue(mockPanes);
    mockRoute = {
      name: "route"
    };
  });

  it("should contain the markers", done => {
    const wrapper = shallowMount(Map, {
      mocks: {
        $store: mockStore,
        $route: mockRoute
      }
    });
    Vue.nextTick(() => {
      expect(wrapper.find(Markers).exists()).toBe(true);
      expect(wrapper.find(Markers).props().map).toEqual(mockMap);
      done();
    });
  });
  it("should contain the lines", done => {
    mockStore.state.trip.savedTrip = [{}, {}];
    const wrapper = shallowMount(Map, {
      mocks: {
        $store: mockStore,
        $route: mockRoute
      }
    });
    Vue.nextTick(() => {
      expect(wrapper.find(Lines).exists()).toBe(true);
      expect(wrapper.find(Lines).props().map).toEqual(mockMap);
      expect(wrapper.find(Lines).props().waitingTimeInSeconds).toEqual(
        wrapper.vm.slowFly
      );
      done();
    });
  });

  it("should not contain the lines", done => {
    const wrapper = shallowMount(Map, {
      mocks: {
        $store: mockStore,
        $route: mockRoute
      }
    });
    Vue.nextTick(() => {
      expect(wrapper.find(Lines).exists()).toBe(false);
      done();
    });
  });

  it("should contain the mobile filters if mobile and connections exist", done => {
    window.innerWidth = 500;
    mockStore.state.stations.activeStation = {};
    mockStore.getters.completeTrip = [{}];
    const wrapper = shallowMount(Map, {
      mocks: {
        $store: mockStore,
        $route: mockRoute
      }
    });
    Vue.nextTick(() => {
      expect(wrapper.find(FiltersDialog).exists()).toBe(true);
      done();
    });
  });

  it("should not contain the mobile filters if not mobile", done => {
    mockStore.state.stations.activeStation = {};
    mockStore.getters.completeTrip = [{}];
    const wrapper = shallowMount(Map, {
      mocks: {
        $store: mockStore,
        $route: mockRoute
      }
    });
    Vue.nextTick(() => {
      expect(wrapper.find(FiltersDialog).exists()).toBe(false);
      done();
    });
  });

  it("should not contain the mobile filters if connections dont exist", done => {
    window.innerWidth = 500;
    const wrapper = shallowMount(Map, {
      mocks: {
        $store: mockStore,
        $route: mockRoute
      }
    });
    Vue.nextTick(() => {
      expect(wrapper.find(FiltersDialog).exists()).toBe(false);
      done();
    });
  });

  it("should call create map with default centre and zoom", () => {
    mockStore.getters.completeTrip = [];
    shallowMount(Map, {
      data() {
        return {
          regularZoom: 10,
          defaultCentre: [10, 20]
        };
      },
      mocks: {
        $store: mockStore,
        $route: mockRoute
      }
    });
    expect(createMap).toBeCalledWith("map", [10, 20], 10);
  });

  it("should centre map with middle station coords if trip loaded", () => {
    mockStore.getters.completeTrip = [
      { lat: 0, lng: 1 },
      { lat: 1, lng: 2 },
      { lat: 2, lng: 3 }
    ];
    shallowMount(Map, {
      mocks: {
        $store: mockStore,
        $route: mockRoute
      }
    });
    expect(createMap).toBeCalledWith("map", [1, 2], expect.any(Number));
  });

  it("should centre map with middle station coords if number stops even if trip loaded", () => {
    mockStore.getters.completeTrip = [
      { lat: 0, lng: 1 },
      { lat: 1, lng: 2 },
      { lat: 2, lng: 3 },
      { lat: 3, lng: 4 }
    ];
    shallowMount(Map, {
      mocks: {
        $store: mockStore,
        $route: mockRoute
      }
    });
    expect(createMap).toBeCalledWith("map", [1, 2], expect.any(Number));
  });

  it("should shift centre up if loading trip on mobile", () => {
    window.innerWidth = 500;
    mockStore.getters.completeTrip = [
      { lat: 0, lng: 1 },
      { lat: 1, lng: 2 },
      { lat: 2, lng: 3 }
    ];
    shallowMount(Map, {
      mocks: {
        $store: mockStore,
        $route: mockRoute
      }
    });
    expect(createMap).toBeCalledWith("map", [-4, 2], expect.any(Number));
  });

  it("should call create map with low zoom when loading trip", () => {
    mockRoute.name = "alias";
    shallowMount(Map, {
      data() {
        return {
          lowZoom: 2
        };
      },
      mocks: {
        $store: mockStore,
        $route: mockRoute
      }
    });
    expect(createMap).toBeCalledWith("map", expect.any(Array), 2);
  });

  it("should call create map with very low zoom when loading trip on mobile", () => {
    window.innerWidth = 500;
    mockRoute.name = "alias";
    shallowMount(Map, {
      data() {
        return {
          lowZoom: 2
        };
      },
      mocks: {
        $store: mockStore,
        $route: mockRoute
      }
    });
    expect(createMap).toBeCalledWith("map", expect.any(Array), 1);
  });

  it("should create panes", () => {
    shallowMount(Map, {
      mocks: {
        $store: mockStore,
        $route: mockRoute
      }
    });
    expect(createPanes).toHaveBeenCalledWith(mockMap);
  });

  it("should update pane groups when component mounted", () => {
    const mockActiveDurationRange = [1, 2];
    mockStore.state.filters.activeDurationRange = mockActiveDurationRange;
    shallowMount(Map, {
      mocks: {
        $store: mockStore,
        $route: mockRoute
      }
    });
    expect(paneUtils.displayPanesInRange).toHaveBeenCalledWith(
      mockPanes,
      mockActiveDurationRange
    );
  });

  it("should update pane groups when activeDurationRange changes", () => {
    shallowMount(Map, {
      mocks: {
        $store: mockStore,
        $route: mockRoute
      }
    });
    const mockActiveDurationRange = [1, 2];
    mockStore.state.filters.activeDurationRange = mockActiveDurationRange;
    expect(paneUtils.displayPanesInRange).toHaveBeenCalledWith(
      mockPanes,
      mockActiveDurationRange
    );
  });

  it("should call flyTo when stop added to trip", () => {
    shallowMount(Map, {
      data() {
        return {
          slowFly: 1
        };
      },
      mocks: {
        $store: mockStore,
        $route: mockRoute
      }
    });
    mockStore.getters.completeTrip = [{ lat: 1, lng: 2 }];
    expect(flyTo).toHaveBeenCalledWith(mockMap, 6, [1, 2], 1);
  });

  it("should call flyTo with last stop", () => {
    shallowMount(Map, {
      data() {
        return {
          lowZoom: 5,
          slowFly: 3
        };
      },
      mocks: {
        $store: mockStore,
        $route: mockRoute
      }
    });
    mockStore.getters.completeTrip = [
      { lat: 1, lng: 2 },
      { lat: 3, lng: 4 }
    ];
    expect(flyTo).toHaveBeenCalledWith(mockMap, 5, [3, 4], 3);
  });

  it("should flyTo centre if trip reset", () => {
    mockStore.state.trip.savedTrip = [{ lat: 1, lng: 2 }];
    shallowMount(Map, {
      data() {
        return {
          lowZoom: 5,
          defaultCentre: [10, 20],
          slowFly: 3
        };
      },
      mocks: {
        $store: mockStore,
        $route: mockRoute
      }
    });
    mockStore.getters.completeTrip = [];
    expect(flyTo).toHaveBeenCalledWith(mockMap, 5, [10, 20], 3);
  });
});
