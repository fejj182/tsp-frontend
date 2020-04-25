import { shallowMount } from "@vue/test-utils";
import L from "leaflet";
import Map from "./Map";
import Markers from "@/modules/map/markers/Markers.vue";
import Connections from "@/modules/map/connections/Connections.vue";

jest.mock("leaflet", () => ({
  map: jest.fn(),
  tileLayer: jest.fn()
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
    shallowMount(Map, {
      mocks: {
        $store: mockStore
      }
    });
    expect(mockMap.createPane).toHaveBeenCalledTimes(numberOfPaneGroups);
  });

  it("should dispatch panes object of correct length", () => {
    const wrapper = shallowMount(Map, {
      mocks: {
        $store: mockStore
      }
    });

    expect(Object.keys(wrapper.vm.panes).length).toBe(numberOfPaneGroups);
    expect(mockStore.dispatch).toHaveBeenCalledWith(
      "addPanes",
      wrapper.vm.panes
    );
  });

  it("should set z-index of panes", () => {
    var mockStyle = jest.fn();
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
});
