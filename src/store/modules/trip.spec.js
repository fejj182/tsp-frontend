import * as module from "./trip";

describe("popups", () => {
  describe("actions", () => {
    describe("selectConnection", () => {
      let commit, dispatch;
      beforeEach(() => {
        commit = jest.fn();
        dispatch = jest.fn();
      });
      it("should commit SELECT_CONNECTION to the store", () => {
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
    describe("resetTrip", () => {
      it("should commit CLEAR_CONNECTION to the store", () => {
        let commit = jest.fn();
        module.actions.resetTrip({ commit });
        expect(commit).toHaveBeenCalledWith("CLEAR_CONNECTION");
      });

      it("should commit CLEAR_STOPS to the store", () => {
        let commit = jest.fn();
        module.actions.resetTrip({ commit });
        expect(commit).toHaveBeenCalledWith("CLEAR_STOPS");
      });
    });
    describe("setStopConnections", () => {
      it("should commit ADD_STOP_CONNECTIONS to the store", () => {
        let commit = jest.fn();
        let connections = { connections: {} };
        module.actions.setStopConnections({ commit }, connections);
        expect(commit).toHaveBeenCalledWith(
          "ADD_STOP_CONNECTIONS",
          connections
        );
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
    describe("CLEAR_STOPS", () => {
      it("should clear stops from state", () => {
        let state = {
          stops: [{ connections: [] }]
        };
        module.mutations.CLEAR_STOPS(state);
        expect(state.stops).toEqual([]);
      });
    });
    describe("ADD_STOP_CONNECTIONS", () => {
      it("should add connections for the next stop", () => {
        const connections = { connections: [] };
        let state = {
          stops: [connections]
        };
        module.mutations.ADD_STOP_CONNECTIONS(state, connections);
        expect(state.stops).toEqual([connections, connections]);
      });
    });
  });
});
