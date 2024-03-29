import { actions, mutations } from "./filters";
import paneConfigs from "@/modules/map/panes/paneConfigs";

describe("filters", () => {
  describe("actions", () => {
    test("updateDurationRange should commit SET_DURATION_RANGE with range", () => {
      const commit = jest.fn();
      const range = [0, 5];
      actions.updateDurationRange({ commit }, range);
      expect(commit).toHaveBeenCalledWith("SET_DURATION_RANGE", range);
    });

    test("resetFilters should commit RESET_FILTERS", () => {
      const commit = jest.fn();
      actions.resetFilters({ commit });
      expect(commit).toHaveBeenCalledWith("RESET_FILTERS");
    });
  });

  describe("mutations", () => {
    test("SET_DURATION_RANGE should update activeDurationRange in the state", () => {
      let state = {
        activeDurationRange: null
      };
      const range = [0, 5];
      mutations.SET_DURATION_RANGE(state, range);
      expect(state.activeDurationRange).toEqual(range);
    });

    test("RESET_FILTERS should update activeDurationRange", () => {
      let state = {
        activeDurationRange: null
      };
      const range = [0, paneConfigs.NUMBER_OF_PANES - 1];
      mutations.RESET_FILTERS(state);
      expect(state.activeDurationRange).toEqual(range);
    });
  });
});
