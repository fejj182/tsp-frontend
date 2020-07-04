import { shallowMount } from "@vue/test-utils";
import Vue from "vue";
import Map from "./Map";
import Markers from "@/modules/map/markers/Markers.vue";
import Lines from "@/modules/map/lines/Lines.vue";
import paneUtils from "@/modules/map/panes/paneUtils";
import { createLegend, createMap, createPanes, flyTo } from "@/plugins/leaflet";

jest.mock("leaflet", () => ({
  map: jest.fn(),
  tileLayer: jest.fn()
}));

jest.mock("@/modules/map/panes/paneUtils", () => ({
  displayPanesInRange: jest.fn()
}));

jest.mock("@/plugins/leaflet", () => ({
  createLegend: jest.fn(),
  createMap: jest.fn(),
  createPanes: jest.fn(),
  flyTo: jest.fn()
}));

describe("Map", () => {
  let mockOn, mockOff, mockStore, mockMap;

  beforeEach(() => {
    jest.resetAllMocks();
    window.innerWidth = 1000;
    mockOn = jest.fn();
    mockOff = jest.fn();
    mockStore = {
      dispatch: jest.fn(),
      state: {
        stations: {
          activeStation: null
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
  });

  it("should contain the markers", () => {
    const wrapper = shallowMount(Map, {
      mocks: {
        $store: mockStore
      }
    });
    Vue.nextTick(() => {
      expect(wrapper.find(Markers).exists()).toBe(true);
    });
  });
  it("should contain the lines", done => {
    mockStore.state.trip.savedTrip = [{}, {}];
    const wrapper = shallowMount(Map, {
      mocks: {
        $store: mockStore
      }
    });
    Vue.nextTick(() => {
      expect(wrapper.find(Lines).exists()).toBe(true);
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
        $store: mockStore
      }
    });
    expect(createMap).toBeCalledWith("map", [10, 20], 10);
  });

  it("should call create map with middle station if trip started", () => {
    mockStore.getters.completeTrip = [
      { lat: 0, lng: 1 },
      { lat: 1, lng: 2 },
      { lat: 2, lng: 3 }
    ];
    shallowMount(Map, {
      data() {
        return {
          lowZoom: 6,
          defaultCentre: [1, 2]
        };
      },
      mocks: {
        $store: mockStore
      }
    });
    expect(createMap).toBeCalledWith("map", [1, 2], 6);
  });

  it("should call create map with middle station if number stops even if trip started", () => {
    mockStore.getters.completeTrip = [
      { lat: 0, lng: 1 },
      { lat: 1, lng: 2 },
      { lat: 2, lng: 3 },
      { lat: 3, lng: 4 }
    ];
    shallowMount(Map, {
      data() {
        return {
          lowZoom: 6,
          defaultCentre: [1, 2]
        };
      },
      mocks: {
        $store: mockStore
      }
    });
    expect(createMap).toBeCalledWith("map", [1, 2], 6);
  });

  it("should call create map with low zoom when trip started", () => {
    mockStore.getters.completeTrip = [{ lat: 1, lng: 2 }];
    shallowMount(Map, {
      data() {
        return {
          lowZoom: 2
        };
      },
      mocks: {
        $store: mockStore
      }
    });
    expect(createMap).toBeCalledWith("map", [1, 2], 2);
  });

  it("should create panes", () => {
    shallowMount(Map, {
      mocks: {
        $store: mockStore
      }
    });
    expect(createPanes).toHaveBeenCalledWith(mockMap);
  });

  it("should update pane groups when component mounted", () => {
    const mockStyle = jest.fn();
    mockMap.createPane.mockReturnValue({
      style: mockStyle
    });
    const wrapper = shallowMount(Map, {
      mocks: {
        $store: mockStore
      }
    });
    const mockActiveDurationRange = [1, 2];
    mockStore.state.filters.activeDurationRange = mockActiveDurationRange;
    expect(paneUtils.displayPanesInRange).toHaveBeenCalledWith(
      wrapper.vm.mapPanes,
      mockActiveDurationRange
    );
  });

  it("should call flyTo when stop added to trip", () => {
    shallowMount(Map, {
      data() {
        return {
          fastFly: 0.1
        };
      },
      mocks: {
        $store: mockStore
      }
    });
    mockStore.getters.completeTrip = [{ lat: 1, lng: 2 }];
    expect(flyTo).toHaveBeenCalledWith(mockMap, 6, [1, 2], 0.1);
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
        $store: mockStore
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
          regularZoom: 10,
          defaultCentre: [10, 20],
          slowFly: 3
        };
      },
      mocks: {
        $store: mockStore
      }
    });
    mockStore.getters.completeTrip = [];
    expect(flyTo).toHaveBeenCalledWith(mockMap, 10, [10, 20], 3);
  });
});
