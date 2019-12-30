import * as module from "./stations";
import stationsApi from "@/api/stations";
import faker from "faker";
import flushPromises from "flush-promises";

jest.mock("@/api/stations", () => ({
  getNearestStation: jest.fn(),
  getConnections: jest.fn()
}));

describe("stations", () => {
  let barcelona = {
    id: 1,
    name: "Barcelona-Sants",
    lat: 41.37952,
    lng: 2.140624
  };
  const mockConnections = [];

  describe("actions", () => {
    describe("getNearestStation", () => {
      let location, dispatch, commit;
      beforeEach(() => {
        jest.clearAllMocks();
        location = {
          lat: parseFloat(faker.address.latitude()),
          lng: parseFloat(faker.address.longitude())
        };
        dispatch = jest.fn();
        commit = jest.fn();
      });
      it("should call the endpoint", () => {
        module.actions.getNearestStation({ dispatch, commit }, location);
        expect(stationsApi.getNearestStation).toHaveBeenCalledWith(location);
      });

      it("should call dispatch addStationsToMap", async () => {
        const mockNearestStation = {};
        stationsApi.getNearestStation.mockReturnValue(mockNearestStation);
        await module.actions.getNearestStation({ dispatch, commit }, location);
        await flushPromises();
        expect(dispatch).toHaveBeenCalledWith(
          "addStationsToMap",
          mockNearestStation
        );
      });

      it("should clear the active stations before calling the endpoint", async () => {
        module.actions.getNearestStation({ dispatch, commit }, location);
        expect(commit).toHaveBeenCalledWith("CLEAR_ACTIVE_STATION");
      });
    });
    describe("addStationsToMap", () => {
      let commit;
      beforeEach(() => {
        commit = jest.fn();
      });
      it("should commit the station to the store", () => {
        module.actions.addStationsToMap({ commit }, barcelona);
        expect(commit).toHaveBeenCalledWith("SET_ACTIVE_STATION", barcelona);
      });

      it("should clear the active stations before calling the endpoint", async () => {
        module.actions.addStationsToMap({ commit }, barcelona);
        expect(commit).toHaveBeenCalledWith("CLEAR_ACTIVE_CONNECTIONS");
      });

      it("should get the connections for starting station", () => {
        module.actions.addStationsToMap({ commit }, barcelona);
        expect(stationsApi.getConnections).toHaveBeenCalledWith(barcelona.id);
      });

      it("should commit the connections to the store", async () => {
        stationsApi.getConnections.mockResolvedValue(mockConnections);
        module.actions.addStationsToMap({ commit }, barcelona);
        await flushPromises();
        expect(commit).toHaveBeenCalledWith(
          "SET_ACTIVE_CONNECTIONS",
          mockConnections
        );
      });
    });
  });

  describe("mutations", () => {
    it("should add the station to the state", () => {
      const state = {
        activeStation: null
      };
      module.mutations.SET_ACTIVE_STATION(state, barcelona);
      expect(state.activeStation).toEqual(barcelona);
    });
    it("should add the connections to the state", () => {
      const state = {
        connections: null
      };
      module.mutations.SET_ACTIVE_CONNECTIONS(state, mockConnections);
      expect(state.connections).toEqual(mockConnections);
    });
    it("should clear active station", () => {
      const state = {
        activeStation: {}
      };
      module.mutations.CLEAR_ACTIVE_STATION(state);
      expect(state.activeStation).toBeNull();
    });

    it("should clear active connections", () => {
      const state = {
        connections: [{}]
      };
      module.mutations.CLEAR_ACTIVE_CONNECTIONS(state);
      expect(state.connections).toEqual([]);
    });
  });
});