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
  describe("getters", () => {
    describe("connectionCoordSets", () => {
      it("returns connectionsCoords", () => {
        const mockCoords = [
          [faker.address.latitude(), faker.address.longitude()]
        ];
        const state = {
          connections: [{ coords: mockCoords }, { coords: mockCoords }]
        };
        const connectionCoordSets = module.getters.connectionCoordSets(state);
        expect(connectionCoordSets).toEqual([mockCoords, mockCoords]);
      });
    });
  });
  describe("actions", () => {
    describe("getNearestStation", () => {
      let location, dispatch;
      beforeEach(() => {
        location = {
          lat: parseFloat(faker.address.latitude()),
          lng: parseFloat(faker.address.longitude())
        };
        dispatch = jest.fn();
      });
      it("should call the endpoint", async () => {
        await module.actions.getNearestStation({ dispatch }, location);
        expect(stationsApi.getNearestStation).toHaveBeenCalledWith(location);
      });

      it("should call dispatch addStationsToMap", async () => {
        const mockNearestStation = {};
        stationsApi.getNearestStation.mockReturnValue(mockNearestStation);
        await module.actions.getNearestStation({ dispatch }, location);
        await flushPromises();
        expect(dispatch).toHaveBeenCalledWith(
          "addStationsToMap",
          mockNearestStation
        );
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
        station: null
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
  });
});
