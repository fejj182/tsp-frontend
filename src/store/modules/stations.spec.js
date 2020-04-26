import * as module from "./stations";
import stationsApi from "@/api/stations";
import flushPromises from "flush-promises";

jest.mock("@/api/stations", () => ({
  setStartingStation: jest.fn(),
  getConnections: jest.fn(),
  getStations: jest.fn()
}));

describe("stations", () => {
  let station = {};
  const connections = [{}, {}];

  describe("actions", () => {
    describe("confirmStop", () => {
      let commit, dispatch;
      beforeEach(() => {
        commit = jest.fn();
        dispatch = jest.fn();
      });
      it("should commit the station to the store", () => {
        module.actions.confirmStop({ dispatch, commit }, station);
        expect(commit).toHaveBeenCalledWith("SET_ACTIVE_STATION", station);
      });

      it("should clear the active connections before calling the endpoint", async () => {
        module.actions.confirmStop({ dispatch, commit }, station);
        expect(commit).toHaveBeenCalledWith("CLEAR_ACTIVE_CONNECTIONS");
      });

      it("should get the connections for starting station", () => {
        module.actions.confirmStop({ dispatch, commit }, station);
        expect(stationsApi.getConnections).toHaveBeenCalledWith(station.id);
      });

      it("should dispatch addNewStop", async () => {
        stationsApi.getConnections.mockResolvedValue(connections);
        module.actions.confirmStop({ dispatch, commit }, station);
        await flushPromises();
        expect(dispatch).toHaveBeenCalledWith("addNewStop", {
          stations: connections
        });
      });

      it("should commit the connections to the store", async () => {
        stationsApi.getConnections.mockResolvedValue(connections);
        module.actions.confirmStop({ dispatch, commit }, station);
        await flushPromises();
        expect(commit).toHaveBeenCalledWith(
          "SET_ACTIVE_CONNECTIONS",
          connections
        );
      });
      describe("reloadConnections", () => {
        it("should commit SET_ACTIVE_STATION", () => {
          module.actions.reloadConnections(
            { commit },
            { station, connections }
          );
          expect(commit).toHaveBeenCalledWith("SET_ACTIVE_STATION", station);
        });

        it("should commit CLEAR_ACTIVE_CONNECTIONS", () => {
          module.actions.reloadConnections(
            { commit },
            { station, connections }
          );
          expect(commit).toHaveBeenCalledWith("CLEAR_ACTIVE_CONNECTIONS");
        });

        it("should commit SET_ACTIVE_CONNECTIONS", () => {
          module.actions.reloadConnections(
            { commit },
            { station, connections }
          );
          expect(commit).toHaveBeenCalledWith(
            "SET_ACTIVE_CONNECTIONS",
            connections
          );
        });
      });
      describe("fetchStartingStations", () => {
        it("should call the stationsApi and commit stations to state", async () => {
          const mockStations = [{}, {}];
          stationsApi.getStations.mockReturnValue(mockStations);
          module.actions.fetchStartingStations({
            commit
          });
          await flushPromises();
          expect(stationsApi.getStations).toHaveBeenCalled();
          expect(commit).toHaveBeenCalledWith(
            "SET_STARTING_STATIONS",
            mockStations
          );
        });
      });
    });
    describe("resetMap", () => {
      it("should commit RESET_MAP", () => {
        let commit = jest.fn();
        module.actions.resetMap({ commit });
        expect(commit).toHaveBeenCalledWith("RESET_MAP");
      });
    });
  });

  describe("mutations", () => {
    test("SET_ACTIVE_STATION should add the station to the state", () => {
      const state = {
        activeStation: null
      };
      module.mutations.SET_ACTIVE_STATION(state, station);
      expect(state.activeStation).toEqual(station);
    });
    test("SET_ACTIVE_CONNECTIONS should add the connections to the state", () => {
      const state = {
        activeConnections: null
      };
      module.mutations.SET_ACTIVE_CONNECTIONS(state, connections);
      expect(state.activeConnections).toEqual(connections);
    });

    test("CLEAR_ACTIVE_CONNECTIONS should clear active connections", () => {
      const state = {
        activeConnections: [{}]
      };
      module.mutations.CLEAR_ACTIVE_CONNECTIONS(state);
      expect(state.activeConnections).toEqual([]);
    });

    test("RESET_MAP should clear active station and connections", () => {
      const state = {
        activeStation: {},
        activeConnections: [{}]
      };
      module.mutations.RESET_MAP(state);
      expect(state.activeStation).toBeNull();
      expect(state.activeConnections).toEqual([]);
    });

    test("SET_STARTING_STATIONS should set starting stations in the state", () => {
      const mockStations = [{}, {}];
      const state = {
        startingStations: []
      };
      module.mutations.SET_STARTING_STATIONS(state, mockStations);
      expect(state.startingStations).toEqual(mockStations);
    });
  });
});
