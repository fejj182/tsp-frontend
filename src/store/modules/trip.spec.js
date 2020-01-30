import * as module from "./trip";

describe("popups", () => {
  describe("getters", () => {
    describe("hasStops", () => {
      it("should be false if there are no stops", () => {
        let state = {
          stops: [],
          selectedConnection: {}
        };
        expect(module.getters.hasStops(state)).toBe(false);
      });

      it("should be false if there is no selectedConnection", () => {
        let state = {
          stops: [{}],
          selectedConnection: null
        };
        expect(module.getters.hasStops(state)).toBe(false);
      });

      it("should be true if has stops and a connection has been selected", () => {
        let state = {
          stops: [{}],
          selectedConnection: {}
        };
        expect(module.getters.hasStops(state)).toBe(true);
      });
    });
  });
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
        expect(commit).toHaveBeenCalledWith("SELECT_CONNECTION", connection);
      });

      it("should dispatch openPopup action", () => {
        let connection = { id: "1" };
        module.actions.selectConnection({ dispatch, commit }, connection);
        expect(dispatch).toHaveBeenCalledWith("openPopup", connection);
      });
    });
    describe("resetTripForm", () => {
      it("should commit CLEAR_STOPS to the store", () => {
        let commit = jest.fn();
        module.actions.resetTripForm({ commit });
        expect(commit).toHaveBeenCalledWith("CLEAR_STOPS");
      });
    });
    describe("addConnectionsToForm", () => {
      it("should commit ADD_STOP_CONNECTIONS to the store", () => {
        let commit = jest.fn();
        let connections = { connections: {} };
        module.actions.addConnectionsToForm({ commit }, connections);
        expect(commit).toHaveBeenCalledWith(
          "ADD_STOP_CONNECTIONS",
          connections
        );
      });
    });
    describe("selectStartingInput", () => {
      it("should commit SELECT_STARTING_STATION to the store", () => {
        let commit = jest.fn();
        let station = {};
        module.actions.selectStartingInput({ commit }, station);
        expect(commit).toHaveBeenCalledWith("SELECT_STARTING_STATION", station);
      });
    });
  });
  describe("mutations", () => {
    describe("SELECT_CONNECTION", () => {
      it("should set the connection id", () => {
        let state = {
          selectedConnection: null
        };
        let selectedConnection = 1;
        module.mutations.SELECT_CONNECTION(state, selectedConnection);
        expect(state.selectedConnection).toEqual(selectedConnection);
      });
    });
    describe("CLEAR_STOPS", () => {
      it("should clear stops from state", () => {
        let state = {
          stops: [{ connections: [] }],
          selectedConnection: 1
        };
        module.mutations.CLEAR_STOPS(state);
        expect(state.stops).toEqual([]);
        expect(state.selectedConnection).toEqual(null);
      });
    });
    describe("ADD_STOP_CONNECTIONS", () => {
      it("should add connections for the next stop", () => {
        let state = {
          stops: [{ connections: [] }]
        };
        module.mutations.ADD_STOP_CONNECTIONS(state, { connections: [] });
        expect(state.stops).toEqual([
          { connections: [], readOnly: true },
          { connections: [] }
        ]);
      });
    });
    describe("SELECT_STARTING_STATION", () => {
      it("should add starting station", () => {
        let state = {
          startingStation: null
        };
        const station = {};
        module.mutations.SELECT_STARTING_STATION(state, station);
        expect(state.startingStation).toEqual(station);
      });
    });
  });
});
