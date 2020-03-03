import { getPaneNameFromDuration, paneConfigs } from "./paneConfigs";

describe("paneConfigs", () => {
  describe("getPaneNameFromDuration", () => {
    it("should return 1st pane name for duration 0", () => {
      const paneName = getPaneNameFromDuration(0);
      expect(paneName).toBe(paneConfigs.p0.name);
    });

    it("should return last pane name for duration 660", () => {
      const paneName = getPaneNameFromDuration(660);
      expect(paneName).toBe(paneConfigs.p11.name);
    });

    it("should return last pane name for duration 720", () => {
      const paneName = getPaneNameFromDuration(720);
      expect(paneName).toBe(paneConfigs.p11.name);
    });
  });
});
