import * as module from "./map";

describe("map", () => {
  describe("actions", () => {
    test("addMap should commit ADD_MAP", () => {
      let map = {};
      let commit = jest.fn();
      module.actions.addMap({ commit }, map);
      expect(commit).toHaveBeenCalledWith("ADD_MAP", map);
    });

    test("addPanes should commit ADD_PANES", () => {
      let panes = {};
      let commit = jest.fn();
      module.actions.addPanes({ commit }, panes);
      expect(commit).toHaveBeenCalledWith("ADD_PANES", panes);
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

    test("ADD_PANES should update panes in state", () => {
      let state = {
        panes: null
      };
      let panes = {};
      module.mutations.ADD_PANES(state, panes);
      expect(state.panes).toEqual(panes);
    });
  });
});
