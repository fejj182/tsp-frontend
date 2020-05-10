import { shallowMount } from "@vue/test-utils";
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
          savedTrip: [],
          stops: []
        }
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
    expect(wrapper.find(Markers).exists()).toBe(true);
  });
  xit("should contain the lines", () => {
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

  it("should create panes", () => {
    const wrapper = shallowMount(Map, {
      mocks: {
        $store: mockStore
      }
    });
    expect(mockMap.createPane).toHaveBeenCalledTimes(numberOfPaneGroups);
    expect(Object.keys(wrapper.vm.panes).length).toBe(numberOfPaneGroups);
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
      wrapper.vm.panes,
      mockActiveDurationRange
    );
  });

  it("should flyTo last stop on trip", () => {
    shallowMount(Map, {
      mocks: {
        $store: mockStore
      }
    });
    mockStore.state.trip.savedTrip = [{ lat: 1, lng: 2 }];
    expect(mockMap.flyTo).toHaveBeenCalledWith([1, 2], 6, expect.any(Object));
  });

  it("should flyTo centre if trip reset", () => {
    mockStore.state.trip.savedTrip = [{ lat: 1, lng: 2 }];
    const wrapper = shallowMount(Map, {
      mocks: {
        $store: mockStore
      }
    });
    mockStore.state.trip.savedTrip = [];
    expect(mockMap.flyTo).toHaveBeenCalledWith(
      wrapper.vm.centreCoords,
      7,
      expect.any(Object)
    );
  });
});
