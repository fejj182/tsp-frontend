import L from "leaflet";
import {
  createMap,
  createPanes,
  createLegend,
  flyTo,
  bindPopupToMarker
} from "./leaflet";
import paneConfigs from "@/modules/map/panes/paneConfigs";

jest.mock("leaflet", () => ({
  map: jest.fn(),
  tileLayer: jest.fn(),
  control: jest.fn(),
  DomUtil: {
    create: jest.fn()
  }
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

  describe("create legend", () => {
    let map, mockHTML, mockPosition, mockLegend;
    beforeEach(() => {
      map = {};
      mockHTML = {};
      mockPosition = "topright";
      mockLegend = {
        addTo: jest.fn()
      };
      L.control.mockReturnValue(mockLegend);
    });
    it("should add legend to the map ", () => {
      createLegend(map, mockHTML, mockPosition);
      expect(L.control).toHaveBeenCalledWith({ position: mockPosition });
      expect(mockLegend.addTo).toHaveBeenCalledWith(map);
    });

    it("should return legend after creation", () => {
      const legend = createLegend(map, mockHTML, mockPosition);
      expect(legend).toEqual(mockLegend);
    });

    it("should set onAdd function", () => {
      const mockOnClick = () => {};
      const mockOuterHTML = "<p></p>";
      L.DomUtil.create.mockReturnValue({});
      mockHTML = {
        $el: {
          outerHTML: mockOuterHTML
        }
      };
      const legend = createLegend(map, mockHTML, mockPosition, mockOnClick);
      const div = legend.onAdd();
      expect(div.innerHTML).toBe(mockOuterHTML);
      expect(div.onclick).toEqual(mockOnClick);
    });

    it("should not add onClickFunction if not present", () => {
      const mockOuterHTML = "<p></p>";
      L.DomUtil.create.mockReturnValue({});
      mockHTML = {
        $el: {
          outerHTML: mockOuterHTML
        }
      };
      const legend = createLegend(map, mockHTML, mockPosition);
      const div = legend.onAdd();
      expect(div.onclick).toBeUndefined();
    });
  });

  describe("Bind popup to marker", () => {
    let marker, mockPopup, mockOn, mockPopupHTML;
    beforeEach(() => {
      marker = {
        bindPopup: jest.fn()
      };
      mockOn = jest.fn();
      mockPopupHTML = "<div></div>";
      mockPopup = {
        on: mockOn
      };
      marker.bindPopup.mockReturnValue(mockPopup);
    });

    it("should call marker bindPopup", () => {
      bindPopupToMarker(marker, mockPopupHTML);
      expect(marker.bindPopup).toHaveBeenCalledWith(
        mockPopupHTML,
        expect.any(Object)
      );
    });

    it("should call return popup", () => {
      const popup = bindPopupToMarker(marker, mockPopupHTML);
      expect(popup).toEqual(mockPopup);
    });

    it("should add a listener to popupopen ", () => {
      bindPopupToMarker(marker, mockPopupHTML);
      expect(mockOn).toHaveBeenCalledWith("popupopen", expect.any(Function));
    });

    it("should add onclick function to popup button when popup opened", () => {
      const originalQuerySelector = global.document.querySelector;

      const mockQuerySelector = jest.fn();
      global.document.querySelector = mockQuerySelector;

      const mockButton = {
        onclick: null
      };
      mockQuerySelector.mockReturnValue(mockButton);
      const mockOnClick = () => {};

      bindPopupToMarker(marker, mockPopupHTML, mockOnClick, "barcelona");
      const onPopupOpen = mockOn.mock.calls[0][1];
      onPopupOpen();

      expect(mockQuerySelector).toHaveBeenCalledWith(
        ".leaflet-popup-content #barcelona"
      );
      expect(mockButton.onclick).toEqual(mockOnClick);

      global.document.querySelector = originalQuerySelector;
    });

    it("should add not add onclick function if button does not exist", () => {
      const originalQuerySelector = global.document.querySelector;

      const mockQuerySelector = jest.fn();
      global.document.querySelector = mockQuerySelector;

      mockQuerySelector.mockReturnValue(null);
      const mockOnClick = () => {};

      bindPopupToMarker(marker, mockPopupHTML, mockOnClick, "barcelona");
      const onPopupOpen = mockOn.mock.calls[0][1];
      onPopupOpen();

      expect(mockQuerySelector).toHaveBeenCalledWith(
        ".leaflet-popup-content #barcelona"
      );

      global.document.querySelector = originalQuerySelector;
    });
  });
});
