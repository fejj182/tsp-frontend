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
    describe("clearConnection", () => {
      it("should commit to the store", () => {
        let commit = jest.fn();
        module.actions.clearConnection({ commit });
        expect(commit).toHaveBeenCalledWith("CLEAR_CONNECTION");
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
    describe("CLEAR_CONNECTION", () => {
      it("should clear the connection id", () => {
        let state = {
          connectionId: 1
        };
        module.mutations.CLEAR_CONNECTION(state);
        expect(state.connectionId).toEqual(null);
      });
    });
  });
});
