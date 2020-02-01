import * as module from "./trip";

describe("popups", () => {
  describe("getters", () => {
    describe("hasStops", () => {
      it("should be false if there are no stops", () => {
        let state = {
          stops: [],
          selectedStop: {}
        };
        expect(module.getters.hasStops(state)).toBe(false);
      });

      it("should be false if there is no selectedStop", () => {
        let state = {
          stops: [{}],
          selectedStop: null
        };
        expect(module.getters.hasStops(state)).toBe(false);
      });

      it("should be true if has 1 stop and a connection has been selected", () => {
        let state = {
          stops: [{}],
          selectedStop: {}
        };
        expect(module.getters.hasStops(state)).toBe(true);
      });

      it("should be true if there are more than 1 stop", () => {
        let state = {
          stops: [{}, {}],
          selectedStop: null
        };
        expect(module.getters.hasStops(state)).toBe(true);
      });
    });
    describe("completeTrip", () => {
      it("should add selectedStop to savedTrip", () => {
        let state = {
          savedTrip: [{}],
          selectedStop: {}
        };
        expect(module.getters.completeTrip(state)).toEqual([{}, {}]);
      });
      it("should return savedTrip if selectedStop is null", () => {
        let state = {
          savedTrip: [{}],
          selectedStop: null
        };
        expect(module.getters.completeTrip(state)).toEqual([{}]);
      });
    });
  });
  describe("actions", () => {
    let commit, dispatch;
    beforeEach(() => {
      commit = jest.fn();
      dispatch = jest.fn();
    });
    describe("selectStop", () => {
      it("should commit SELECT_STOP to the store", () => {
        let connection = { id: "1" };
        module.actions.selectStop({ dispatch, commit }, connection);
        expect(commit).toHaveBeenCalledWith("SELECT_STOP", connection);
      });

      it("should dispatch openPopup action", () => {
        let connection = { id: "1" };
        module.actions.selectStop({ dispatch, commit }, connection);
        expect(dispatch).toHaveBeenCalledWith("openPopup", connection);
      });
    });
    describe("resetTrip", () => {
      it("should commit CLEAR_STOPS to the store", () => {
        module.actions.resetTrip({ dispatch, commit });
        expect(commit).toHaveBeenCalledWith("CLEAR_STOPS");
      });

      it("should dispatch resetMap action", () => {
        module.actions.resetTrip({ dispatch, commit });
        expect(dispatch).toHaveBeenCalledWith("resetMap");
      });
    });
    describe("addNewStop", () => {
      it("should commit ADD_NEW_STOP to the store", () => {
        let stations = { stations: {} };
        module.actions.addNewStop({ commit }, stations);
        expect(commit).toHaveBeenCalledWith("ADD_NEW_STOP", stations);
      });
    });
    describe("selectStartingInput", () => {
      it("should commit SELECT_STARTING_STATION to the store", () => {
        let station = {};
        module.actions.selectStartingInput({ commit }, station);
        expect(commit).toHaveBeenCalledWith("SELECT_STARTING_STATION", station);
      });
    });
  });
  describe("mutations", () => {
    describe("SELECT_STOP", () => {
      it("should set the connection id", () => {
        let state = {
          selectedStop: null
        };
        let selectedStop = 1;
        module.mutations.SELECT_STOP(state, selectedStop);
        expect(state.selectedStop).toEqual(selectedStop);
      });
    });
    describe("CLEAR_STOPS", () => {
      it("should clear stops from state", () => {
        let state = {
          stops: [{ connections: [] }],
          selectedStop: 1
        };
        module.mutations.CLEAR_STOPS(state);
        expect(state.stops).toEqual([]);
        expect(state.selectedStop).toEqual(null);
      });
    });
    describe("ADD_NEW_STOP", () => {
      it("should add stations for the next stop", () => {
        let state = {
          stops: [{ stations: [] }],
          savedTrip: []
        };
        module.mutations.ADD_NEW_STOP(state, { stations: [] });
        expect(state.stops).toEqual([
          { stations: [], readOnly: true },
          { stations: [] }
        ]);
      });
      it("should add selectedStop to the savedTrip", () => {
        let state = {
          stops: [{ stations: [] }],
          savedTrip: [{}],
          selectedStop: {}
        };
        module.mutations.ADD_NEW_STOP(state, { stations: [] });
        expect(state.savedTrip).toEqual([{}, {}]);
      });
      it("should not add selectedStop to the savedTrip when it is null", () => {
        let state = {
          stops: [{ stations: [] }],
          savedTrip: [{}],
          selectedStop: null
        };
        module.mutations.ADD_NEW_STOP(state, { stations: [] });
        expect(state.savedTrip).toEqual([{}]);
      });
      it("should clear selectedStop", () => {
        let state = {
          stops: [{ stations: [] }],
          savedTrip: [{}],
          selectedStop: {}
        };
        module.mutations.ADD_NEW_STOP(state, { stations: [] });
        expect(state.selectedStop).toBe(null);
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
      it("should create new savedTrip", () => {
        let state = {
          savedTrip: []
        };
        const station = {};
        module.mutations.SELECT_STARTING_STATION(state, station);
        expect(state.savedTrip).toEqual([station]);
      });
    });
  });
});
