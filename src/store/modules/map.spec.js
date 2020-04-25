import * as module from "./map";

describe("map", () => {
  describe("actions", () => {
    test("addPanes should commit ADD_PANES", () => {
      let panes = {};
      let commit = jest.fn();
      module.actions.addPanes({ commit }, panes);
      expect(commit).toHaveBeenCalledWith("ADD_PANES", panes);
    });
  });

  describe("mutations", () => {
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
