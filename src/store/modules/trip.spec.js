import * as module from "./trip";
import tripApi from "@/api/trip";
import flushPromises from "flush-promises";

jest.mock("@/api/trip", () => ({
  get: jest.fn()
}));

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
    describe("fetchTrip", () => {
      it("should dispatch fetchStartingStations", () => {
        let tripAlias = { alias: "some-alias" };
        module.actions.fetchTrip({ commit, dispatch }, tripAlias);
        expect(dispatch).toBeCalledWith("fetchStartingStations");
      });
      it("should call tripApi", () => {
        let tripAlias = { alias: "some-alias" };
        module.actions.fetchTrip({ commit, dispatch }, tripAlias);
        expect(tripApi.get).toHaveBeenCalledWith("some-alias");
      });
      it("should put first station in startingStation", async () => {
        const barcelona = { name: "Barcelona" };
        const valencia = { name: "Valencia" };
        let trip = [barcelona, valencia];
        tripApi.get.mockReturnValue(trip);
        let tripAlias = { alias: "some-alias" };
        module.actions.fetchTrip({ commit, dispatch }, tripAlias);
        await flushPromises();
        expect(commit).toHaveBeenCalledWith("LOAD_TRIP", trip);
      });
    });
    describe("selectStop", () => {
      it("should commit SELECT_STOP", () => {
        let connection = { id: "1" };
        module.actions.selectStop({ dispatch, commit }, connection);
        expect(commit).toHaveBeenCalledWith("SELECT_STOP", connection);
      });
    });
    describe("resetTrip", () => {
      it("should commit RESET_TRIP", () => {
        module.actions.resetTrip({ dispatch, commit });
        expect(commit).toHaveBeenCalledWith("RESET_TRIP");
      });

      it("should dispatch resetMap action", () => {
        module.actions.resetTrip({ dispatch, commit });
        expect(dispatch).toHaveBeenCalledWith("resetMap");
      });
    });
    describe("addNewStop", () => {
      it("should commit ADD_NEW_STOP", () => {
        let payload = { stations: {} };
        module.actions.addNewStop({ commit }, payload);
        expect(commit).toHaveBeenCalledWith("ADD_NEW_STOP", payload.stations);
      });
    });
    describe("removeStop", () => {
      test("when trip valid", () => {
        const startingDestination = {};
        const prevStations = [{}, {}];
        let state = {
          savedTrip: [startingDestination, {}],
          stops: [{ stations: prevStations }, { stations: [] }]
        };
        module.actions.removeStop({ commit, dispatch, state });
        expect(dispatch).toHaveBeenCalledWith("reloadConnections", {
          station: startingDestination,
          connections: prevStations
        });
        expect(commit).toHaveBeenCalledWith("REMOVE_STOP");
      });
      it("when trip not valid", () => {
        let state = {
          savedTrip: [],
          stops: []
        };
        module.actions.removeStop({ commit, dispatch, state });

        expect(dispatch).not.toHaveBeenCalledWith(
          "reloadConnections",
          expect.any(Object)
        );
        expect(commit).not.toHaveBeenCalledWith("REMOVE_STOP");
      });
    });
    describe("startTrip", () => {
      it("should commit ADD_STARTING_STATION", () => {
        let station = {};
        module.actions.startTrip({ dispatch, commit }, station);
        expect(commit).toHaveBeenCalledWith("ADD_STARTING_STATION", station);
      });
      it("should dispatch resetTrip", () => {
        let station = {};
        module.actions.startTrip({ dispatch, commit }, station);
        expect(dispatch).toHaveBeenCalledWith("resetTrip");
      });
      it("should dispatch confirmStop", () => {
        let station = {};
        module.actions.startTrip({ dispatch, commit }, station);
        expect(dispatch).toHaveBeenCalledWith("confirmStop", station);
      });
    });

    describe("addToTrip", () => {
      it("addToTrip should commit ADD_STARTING_STATION", () => {
        let station = {};
        module.actions.addToTrip({ dispatch, commit }, station);
        expect(commit).toHaveBeenCalledWith("ADD_STARTING_STATION", station);
      });
      it("addToTripshould dispatch resetTrip", () => {
        let station = {};
        module.actions.addToTrip({ dispatch, commit }, station);
        expect(dispatch).toHaveBeenCalledWith("resetMap");
      });
      it("should dispatch confirmStop", () => {
        let station = {};
        module.actions.addToTrip({ dispatch, commit }, station);
        expect(dispatch).toHaveBeenCalledWith("confirmStop", station);
      });
    });
    describe("selectStartingInput", () => {
      it("should commit SELECT_STARTING_STATION to the store", () => {
        let station = {};
        module.actions.selectStartingInput({ dispatch, commit }, station);
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
    describe("RESET_TRIP", () => {
      it("should clear stops from state", () => {
        let state = {
          stops: [{ connections: [] }],
          selectedStop: 1,
          savedTrip: [{}]
        };
        module.mutations.RESET_TRIP(state);
        expect(state.stops).toEqual([]);
        expect(state.selectedStop).toEqual(null);
        expect(state.savedTrip).toEqual([]);
      });
    });
    describe("ADD_NEW_STOP", () => {
      let stations;
      beforeEach(() => {
        stations = [];
      });
      it("should add stations for the next stop", () => {
        let state = {
          stops: [{ stations }]
        };
        module.mutations.ADD_NEW_STOP(state, stations);
        expect(state.stops).toEqual([
          { stations, readOnly: true },
          { stations, readOnly: false }
        ]);
      });
      it("should add selectedStop to the savedTrip", () => {
        let state = {
          stops: [{ stations }],
          savedTrip: [{}],
          selectedStop: {}
        };
        module.mutations.ADD_NEW_STOP(state, stations);
        expect(state.savedTrip).toEqual([{}, {}]);
      });
      it("should not add selectedStop to the savedTrip when it is null", () => {
        let state = {
          stops: [],
          savedTrip: [{}],
          selectedStop: null
        };
        module.mutations.ADD_NEW_STOP(state, stations);
        expect(state.savedTrip).toEqual([{}]);
      });
      it("should clear selectedStop", () => {
        let state = {
          stops: [{ stations }],
          savedTrip: [{}],
          selectedStop: {}
        };
        module.mutations.ADD_NEW_STOP(state, stations);
        expect(state.selectedStop).toBe(null);
      });
    });
    describe("REMOVE_STOP", () => {
      let stations;
      beforeEach(() => {
        stations = [];
      });
      it("should remove last stop in state", () => {
        let state = {
          stops: [
            { stations, readOnly: true },
            { stations, readOnly: true },
            { stations, readOnly: false }
          ],
          savedTrip: [{}, {}, {}, {}]
        };
        module.mutations.REMOVE_STOP(state);
        expect(state.stops).toEqual([
          { stations, readOnly: true },
          { stations, readOnly: false }
        ]);
      });

      it("should remove last stop in savedTrip", () => {
        let state = {
          stops: [{ stations, readOnly: true }, { stations, readOnly: false }],
          savedTrip: [{}, {}],
          selectedStop: {}
        };
        module.mutations.REMOVE_STOP(state);
        expect(state.savedTrip).toEqual([{}]);
      });
      it("should load selectedStop with previous last stop in trip", () => {
        let state = {
          stops: [{ stations, readOnly: true }, { stations, readOnly: false }],
          savedTrip: [{ name: "lastSavedStop" }, {}],
          selectedStop: {}
        };
        module.mutations.REMOVE_STOP(state, stations);
        expect(state.selectedStop).toEqual({ name: "lastSavedStop" });
      });
    });
    describe("ADD_STARTING_STATION", () => {
      it("should create new savedTrip", () => {
        let state = {
          savedTrip: []
        };
        const station = {};
        module.mutations.ADD_STARTING_STATION(state, station);
        expect(state.savedTrip).toEqual([station]);
      });
      it("should do nothing if trip already started", () => {
        let state = {
          startingStation: null,
          savedTrip: [{}]
        };
        const station = {};
        module.mutations.ADD_STARTING_STATION(state, station);
        expect(state.startingStation).toEqual(null);
        expect(state.savedTrip).toEqual([station]);
      });
    });
    describe("SELECT_STARTING_STATION", () => {
      it("should select starting station", () => {
        let state = {
          startingStation: null,
          savedTrip: []
        };
        const station = {};
        module.mutations.SELECT_STARTING_STATION(state, station);
        expect(state.startingStation).toEqual(station);
      });
    });
    describe("LOAD_TRIP", () => {
      let trip, barcelona, valencia, madrid;
      beforeEach(() => {
        barcelona = { name: "Barcelona" };
        valencia = { name: "Valencia" };
        madrid = { name: "Madrid" };
        trip = [barcelona, valencia, madrid];
      });
      it("should add starting station to the state", () => {
        let state = {
          startingStation: null
        };
        module.mutations.LOAD_TRIP(state, trip);
        expect(state.startingStation).toEqual(barcelona);
      });

      it("should add stops to the state", () => {
        let state = {
          stops: []
        };
        module.mutations.LOAD_TRIP(state, trip);
        expect(state.stops).toEqual([
          { readOnly: true, fixed: valencia, stations: [valencia] },
          { readOnly: true, fixed: madrid, stations: [madrid] }
        ]);
      });

      it("should add selected stop to the state", () => {
        let state = {
          selectedStop: null
        };
        module.mutations.LOAD_TRIP(state, trip);
        expect(state.selectedStop).toEqual(madrid);
      });

      it("should add savedTrip to state", () => {
        let state = {
          savedTrip: []
        };
        module.mutations.LOAD_TRIP(state, trip);
        expect(state.savedTrip).toEqual([barcelona, valencia]);
      });
    });
  });
});
