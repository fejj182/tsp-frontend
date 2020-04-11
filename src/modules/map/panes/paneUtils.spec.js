import {
  getPaneNameFromDuration,
  filterStationsOutOfRange,
  displayPanesInRange
} from "./paneUtils";
import paneConfigs from "@/modules/map/panes/paneConfigs";

jest.mock("@/modules/map/panes/paneConfigs", () => jest.fn());

describe("paneUtils", () => {
  describe("getPaneNameFromDuration", () => {
    it("should return 1st pane name for duration 0", () => {
      paneConfigs.NUMBER_OF_PANES = 1;
      paneConfigs.INTERVAL = 60;
      const paneName = getPaneNameFromDuration(0);
      expect(paneName).toBe("p0");
    });

    it("should return last pane name for duration 600", () => {
      paneConfigs.NUMBER_OF_PANES = 3;
      paneConfigs.INTERVAL = 60;
      const paneName = getPaneNameFromDuration(120);
      expect(paneName).toBe("p2");
    });

    it("should return last pane name for duration 660", () => {
      paneConfigs.NUMBER_OF_PANES = 3;
      paneConfigs.INTERVAL = 60;
      const paneName = getPaneNameFromDuration(180);
      expect(paneName).toBe("p2");
    });
  });

  describe("filterStationsOutOfRange", () => {
    test("when last station duration too long, only return first station ", () => {
      const stations = [{ duration: 15 }, { duration: 25 }];
      paneConfigs.NUMBER_OF_PANES = 4;
      paneConfigs.INTERVAL = 10;
      const filteredStations = filterStationsOutOfRange(stations, [0, 2]);
      expect(filteredStations).toEqual([{ duration: 15 }]);
    });

    test("when first station duration too short, only return last station ", () => {
      const stations = [{ duration: 15 }, { duration: 25 }];
      paneConfigs.NUMBER_OF_PANES = 4;
      paneConfigs.INTERVAL = 10;
      const filteredStations = filterStationsOutOfRange(stations, [2, 3]);
      expect(filteredStations).toEqual([{ duration: 25 }]);
    });

    test("when last station duration longer than highest pane, return both stations ", () => {
      const stations = [{ duration: 15 }, { duration: 25 }];
      paneConfigs.NUMBER_OF_PANES = 3;
      paneConfigs.INTERVAL = 10;
      const filteredStations = filterStationsOutOfRange(stations, [0, 2]);
      expect(filteredStations).toEqual([{ duration: 15 }, { duration: 25 }]);
    });
  });

  describe("displayPanesInRange", () => {
    let panes;
    beforeEach(() => {
      panes = {
        p0: {
          style: {
            display: null
          }
        },
        p1: {
          style: {
            display: null
          }
        },
        p2: {
          style: {
            display: null
          }
        }
      };
    });
    it("should style to none if pane is lower than range", () => {
      paneConfigs.NUMBER_OF_PANES = 1;
      let mockStyle = {
        display: "block"
      };
      const panes = {
        p0: {
          style: mockStyle
        }
      };
      const range = [5, 10];
      displayPanesInRange(panes, range);
      expect(mockStyle.display).toBe("none");
    });

    it("should style to none if pane is higher than range", () => {
      paneConfigs.NUMBER_OF_PANES = 3;
      const range = [0, 1];
      displayPanesInRange(panes, range);
      expect(panes.p0.style.display).toBe("block");
      expect(panes.p1.style.display).toBe("none");
      expect(panes.p2.style.display).toBe("none");
    });

    it("should style to none if pane is lower than range", () => {
      paneConfigs.NUMBER_OF_PANES = 3;
      const range = [1, 2];
      displayPanesInRange(panes, range);
      expect(panes.p0.style.display).toBe("none");
      expect(panes.p1.style.display).toBe("block");
      expect(panes.p2.style.display).toBe("block");
    });

    it("should style to block if pane is same as highest limit", () => {
      paneConfigs.NUMBER_OF_PANES = 3;
      const range = [0, 2];
      displayPanesInRange(panes, range);
      expect(panes.p0.style.display).toBe("block");
      expect(panes.p1.style.display).toBe("block");
      expect(panes.p2.style.display).toBe("block");
    });
  });
});
