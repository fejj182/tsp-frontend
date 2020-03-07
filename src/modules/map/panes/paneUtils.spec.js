import { getPaneNameFromDuration, displayPanesInRange } from "./paneUtils";
import paneConfigs from "@/modules/map/panes/paneConfigs";

jest.mock("@/modules/map/panes/paneConfigs", () => jest.fn());

describe("paneUtils", () => {
  describe("getPaneNameFromDuration", () => {
    it("should return 1st pane name for duration 0", () => {
      paneConfigs.groups = {
        p0: {}
      };
      paneConfigs.interval = 60;
      const paneName = getPaneNameFromDuration(0);
      expect(paneName).toBe("p0");
    });

    it("should return last pane name for duration 600", () => {
      paneConfigs.groups = {
        p0: {},
        p1: {},
        p2: {}
      };
      paneConfigs.interval = 60;
      const paneName = getPaneNameFromDuration(120);
      expect(paneName).toBe("p2");
    });

    it("should return last pane name for duration 660", () => {
      paneConfigs.groups = {
        p0: {},
        p1: {},
        p2: {}
      };
      paneConfigs.interval = 60;
      const paneName = getPaneNameFromDuration(180);
      expect(paneName).toBe("p2");
    });
  });

  describe("displayPanesInRange", () => {
    it("should style to none if pane is lower than range", () => {
      paneConfigs.groups = {
        p0: {}
      };
      let mockStyle = {
        display: null
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
      paneConfigs.groups = {
        p0: {},
        p1: {},
        p2: {}
      };
      let mockStyle = {
        display: null
      };
      const panes = {
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
          style: mockStyle
        }
      };
      const range = [0, 1];
      displayPanesInRange(panes, range);
      expect(mockStyle.display).toBe("none");
    });

    it("should style to block if pane is inside range", () => {
      paneConfigs.groups = {
        p0: {},
        p1: {},
        p2: {}
      };
      let mockStyle = {
        display: null
      };
      const panes = {
        p0: {
          style: {
            display: null
          }
        },
        p1: {
          style: mockStyle
        },
        p2: {
          style: {
            display: null
          }
        }
      };
      const range = [0, 2];
      displayPanesInRange(panes, range);
      expect(mockStyle.display).toBe("block");
    });
  });
});