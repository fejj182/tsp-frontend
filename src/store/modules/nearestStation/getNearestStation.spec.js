import * as module from "./getNearestStation";
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
    lat: "41.379520",
    lng: "2.140624"
  };
  const mockConnections = [];
  describe("action", () => {
    describe("getNearestStation", () => {
      let location, commit;
      beforeEach(() => {
        location = {
          lat: faker.address.latitude(),
          lng: faker.address.longitude()
        };
        commit = jest.fn();
      });
      it("should call the endpoint", async () => {
        await module.actions.getNearestStation({ commit }, location);
        expect(stationsApi.getNearestStation).toHaveBeenCalledWith(location);
      });

      it("should commit the station to the store", async () => {
        stationsApi.getNearestStation.mockResolvedValue(barcelona);

        await module.actions.getNearestStation({ commit }, location);
        await flushPromises();
        expect(commit).toHaveBeenCalledWith("SET_ACTIVE_STATION", barcelona);
      });
    });
    describe("changeTripFormStartingStation", () => {
      let commit;
      beforeEach(() => {
        commit = jest.fn();
      });
      it("should commit the station to the store", () => {
        module.actions.changeTripFormStartingStation({ commit }, barcelona);
        expect(commit).toHaveBeenCalledWith("SET_ACTIVE_STATION", barcelona);
      });

      it("should get the connections for starting station", () => {
        module.actions.changeTripFormStartingStation({ commit }, barcelona);
        expect(stationsApi.getConnections).toHaveBeenCalledWith(barcelona.id);
      });

      it("should commit the connections to the store", async () => {
        stationsApi.getConnections.mockResolvedValue(mockConnections);
        module.actions.changeTripFormStartingStation({ commit }, barcelona);
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
      expect(state.station).toEqual(barcelona);
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
