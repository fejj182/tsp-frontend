import { shallowMount } from "@vue/test-utils";
import L from "leaflet";
import Map from "./Map";

jest.mock("leaflet", () => ({
  map: jest.fn(),
  tileLayer: jest.fn()
}));

describe("Map", () => {
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

  it("should create map", () => {
    shallowMount(Map, {
      mocks: {
        $store: mockStore
      }
    });
    expect(L.map).toBeCalledWith("map");
  });

  it("should create 12 panes for grouping the markers into hours", () => {
    shallowMount(Map, {
      mocks: {
        $store: mockStore
      }
    });
    expect(mockMap.createPane).toHaveBeenCalledTimes(12);
  });

  it("should dispatch panes object", () => {
    const wrapper = shallowMount(Map, {
      mocks: {
        $store: mockStore
      }
    });

    expect(Object.keys(wrapper.vm.panes).length).toBe(12);
    expect(mockStore.dispatch).toHaveBeenCalledWith(
      "addPanes",
      wrapper.vm.panes
    );
  });

  it("should dispatch addMap action", () => {
    const wrapper = shallowMount(Map, {
      mocks: {
        $store: mockStore
      }
    });
    expect(mockStore.dispatch).toHaveBeenCalledWith("addMap", wrapper.vm.myMap);
  });
});
