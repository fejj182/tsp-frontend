import * as module from "./map";

describe("map", () => {
  describe("actions", () => {
    test("addMap should commit ADD_MAP", () => {
      let map = {};
      let commit = jest.fn();
      module.actions.addMap({ commit }, map);
      expect(commit).toHaveBeenCalledWith("ADD_MAP", map);
    });
  });

  describe("mutations", () => {
    test("ADD_MAP should update map in state", () => {
      let state = {
        map: null
      };
      let map = {};
      module.mutations.ADD_MAP(state, map);
      expect(state.map).toEqual(map);
    });
  });
});
