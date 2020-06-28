import { shallowMount } from "@vue/test-utils";
import Vue from "vue";
import L from "leaflet";
import Map from "./Map";
import Markers from "@/modules/map/markers/Markers.vue";
import Lines from "@/modules/map/lines/Lines.vue";
import paneUtils from "@/modules/map/panes/paneUtils";

jest.mock("leaflet", () => ({
  map: jest.fn(),
  tileLayer: jest.fn()
}));

jest.mock("@/modules/map/panes/paneUtils", () => ({
  displayPanesInRange: jest.fn()
}));

describe("Map", () => {
  const numberOfPaneGroups = 11;
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
    L.map.mockReturnValue(mockMap);
    L.tileLayer.mockReturnValue({
      addTo: jest.fn()
    });
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
  it("should contain the lines", () => {
    mockStore.state.trip.savedTrip = [{}, {}];
    const wrapper = shallowMount(Map, {
      mocks: {
        $store: mockStore
      }
    });
    expect(wrapper.find(Lines).exists()).toBe(true);
  });

  it("should create map", () => {
    shallowMount(Map, {
      mocks: {
        $store: mockStore
      }
    });
    expect(L.map).toBeCalledWith("map");
  });

  it("should setView", () => {
    shallowMount(Map, {
      mocks: {
        $store: mockStore
      }
    });
    expect(mockMap.setView).toBeCalledWith(expect.any(Array), 7);
  });

  it("should setView with zoom 6 on mobile", () => {
    window.innerWidth = 500;
    shallowMount(Map, {
      mocks: {
        $store: mockStore
      }
    });
    expect(mockMap.setView).toBeCalledWith(expect.any(Array), 6);
  });

  it("should setView with data from middle stop on trip", () => {
    mockStore.getters.completeTrip = [
      { lat: 0, lng: 1 },
      { lat: 1, lng: 2 },
      { lat: 2, lng: 3 }
    ];
    shallowMount(Map, {
      mocks: {
        $store: mockStore
      }
    });
    expect(mockMap.setView).toBeCalledWith([1, 2], 6);
  });

  it("should setView with data from middle stop on trip even number", () => {
    mockStore.getters.completeTrip = [
      { lat: 0, lng: 1 },
      { lat: 1, lng: 2 },
      { lat: 2, lng: 3 },
      { lat: 3, lng: 4 }
    ];
    shallowMount(Map, {
      mocks: {
        $store: mockStore
      }
    });
    expect(mockMap.setView).toBeCalledWith([1, 2], 6);
  });

  it("should create panes", () => {
    const wrapper = shallowMount(Map, {
      mocks: {
        $store: mockStore
      }
    });
    expect(mockMap.createPane).toHaveBeenCalledTimes(numberOfPaneGroups);
    expect(Object.keys(wrapper.vm.mapPanes).length).toBe(numberOfPaneGroups);
  });

  it("should set z-index of panes", () => {
    const mockStyle = jest.fn();
    mockMap.createPane.mockReturnValue({
      style: mockStyle
    });
    shallowMount(Map, {
      mocks: {
        $store: mockStore
      }
    });

    expect(mockStyle.zIndex).toEqual(650);
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

  it("should flyTo last stop on trip", () => {
    shallowMount(Map, {
      mocks: {
        $store: mockStore
      }
    });
    mockStore.getters.completeTrip = [{ lat: 1, lng: 2 }];
    expect(mockMap.flyTo).toHaveBeenCalledWith([1, 2], 6, expect.any(Object));
  });

  it("should flyTo centre if trip reset", () => {
    mockStore.state.trip.savedTrip = [{ lat: 1, lng: 2 }];
    shallowMount(Map, {
      mocks: {
        $store: mockStore
      }
    });
    mockStore.getters.completeTrip = [];

    expect(mockMap.flyTo).toHaveBeenCalledWith(
      expect.any(Array),
      7,
      expect.any(Object)
    );
  });
});
