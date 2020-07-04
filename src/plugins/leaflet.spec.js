import L from "leaflet";
import { createMap, createPanes, createLegend, flyTo } from "./leaflet";
import paneConfigs from "@/modules/map/panes/paneConfigs";

jest.mock("leaflet", () => ({
  map: jest.fn(),
  tileLayer: jest.fn(),
  control: jest.fn()
}));

jest.mock("@/modules/map/panes/paneConfigs");

describe("leaflet plugin", () => {
  describe("create map", () => {
    it("should create map", () => {
      const mockSetView = jest.fn();
      const mockAddTo = jest.fn();
      const mockMap = {
        setView: mockSetView
      };
      L.map.mockReturnValue(mockMap);
      L.tileLayer.mockReturnValue({
        addTo: mockAddTo
      });

      createMap("map", [1.23, 3.45], 6);

      expect(L.map).toBeCalledWith("map");
      expect(L.tileLayer).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Object)
      );
      expect(mockAddTo).toHaveBeenCalledWith(mockMap);
      expect(mockSetView).toBeCalledWith([1.23, 3.45], 6);
    });
  });

  describe("create panes", () => {
    it("should call map create pane according to paneConfigs", () => {
      paneConfigs.NUMBER_OF_PANES = 10;
      const map = {
        createPane: jest.fn()
      };
      map.createPane.mockReturnValue({
        style: {
          zIndex: 0
        }
      });
      createPanes(map);
      expect(map.createPane).toHaveBeenCalledTimes(10);
    });

    it("should return panes as object containing created panes", () => {
      paneConfigs.NUMBER_OF_PANES = 1;
      const map = {
        createPane: jest.fn()
      };
      const mockPane = {
        style: {
          zIndex: 0
        }
      };
      map.createPane.mockReturnValue(mockPane);
      const panes = createPanes(map);
      expect(panes.p0).toEqual(mockPane);
      expect(panes.p0.style.zIndex).toBe(650);
    });
  });

  describe("flyTo", () => {
    it("should call map flyTo", () => {
      const map = {
        flyTo: jest.fn()
      };
      const zoom = 6;
      const coords = [1, 2];
      const duration = 3;

      flyTo(map, zoom, coords, duration);
      expect(map.flyTo).toHaveBeenCalledWith(coords, zoom, {
        duration: duration,
        easeLinearity: 0.1
      });
    });
  });

  describe("create legend", () => {});
  it("should add legend to the map ", () => {
    const mockLegend = {
      addTo: jest.fn()
    };
    L.control.mockReturnValue(mockLegend);

    const map = {};
    const mockHTML = {};
    createLegend(map, mockHTML);
    expect(mockLegend.addTo).toHaveBeenCalledWith(map);
  });
});
