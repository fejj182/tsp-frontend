import { shallowMount } from "@vue/test-utils";
import L from "leaflet";
import Map from "./Map";
import Markers from "@/modules/map/markers/Markers.vue";
import Connections from "@/modules/map/connections/Connections.vue";
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
      createPane: jest.fn()
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
  it("should contain the connections", () => {
    const wrapper = shallowMount(Map, {
      mocks: {
        $store: mockStore
      }
    });
    expect(wrapper.find(Connections).exists()).toBe(true);
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
});
