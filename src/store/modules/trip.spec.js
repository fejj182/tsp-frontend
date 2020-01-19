import * as module from "./trip";

describe("popups", () => {
  describe("actions", () => {
    describe("selectConnection", () => {
      let commit, dispatch;
      beforeEach(() => {
        commit = jest.fn();
        dispatch = jest.fn();
      });
      it("should commit to the store", () => {
        let connection = { id: "1" };
        module.actions.selectConnection({ dispatch, commit }, connection);
        expect(commit).toHaveBeenCalledWith("SELECT_CONNECTION", connection.id);
      });

      it("should dispatch openPopup action", () => {
        let connection = { id: "1" };
        module.actions.selectConnection({ dispatch, commit }, connection);
        expect(dispatch).toHaveBeenCalledWith("openPopup", connection);
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
