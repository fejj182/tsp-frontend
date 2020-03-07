import { getPaneNameFromDuration } from "./paneUtils";

describe("paneUtils", () => {
  describe("getPaneNameFromDuration", () => {
    it("should return 1st pane name for duration 0", () => {
      const paneName = getPaneNameFromDuration(0);
      expect(paneName).toBe("p0");
    });

    it("should return last pane name for duration 600", () => {
      const paneName = getPaneNameFromDuration(600);
      expect(paneName).toBe("p10");
    });

    it("should return last pane name for duration 660", () => {
      const paneName = getPaneNameFromDuration(660);
      expect(paneName).toBe("p10");
    });
  });
});
