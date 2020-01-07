import * as module from "./tripform";

describe("popups", () => {
  describe("actions", () => {
    describe("selectConnection", () => {
      it("should commit to the store", () => {
        let commit = jest.fn();
        let connection = {};
        module.actions.selectConnection({ commit }, connection);
        expect(commit).toHaveBeenCalledWith("SELECT_CONNECTION", connection);
      });
    });
  });
  describe("mutations", () => {
    describe("SELECT_CONNECTION", () => {
      it("should set the connection id", () => {
        let state = {
          connectionId: null
        };
        let connectionId = 1;
        module.mutations.SELECT_CONNECTION(state, connectionId);
        expect(state.connectionId).toEqual(connectionId);
      });
    });
  });
});
