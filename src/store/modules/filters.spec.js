import { actions, mutations } from "./filters";

describe("filters", () => {
  describe("actions", () => {
    test("updateDurationRange should commit SET_DURATION_RANGE with range", () => {
      const commit = jest.fn();
      const range = [0, 5];
      actions.updateDurationRange({ commit }, range);
      expect(commit).toHaveBeenCalledWith("SET_DURATION_RANGE", range);
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
  });
});
