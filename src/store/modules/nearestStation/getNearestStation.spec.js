import * as module from "./getNearestStation";
import stationsApi from "@/api/stations";
import faker from "faker";
import flushPromises from "flush-promises";

jest.mock("@/api/stations", () => ({ getNearestStation: jest.fn() }));

describe("stations", () => {
  describe("action", () => {
    describe("getNearestStation", () => {
      it("should call the endpoint", async () => {
        const commit = jest.fn();
        const location = {
          lat: faker.address.latitude(),
          lng: faker.address.longitude()
        };

        await module.actions.getNearestStation({ commit }, location);
        expect(stationsApi.getNearestStation).toHaveBeenCalledWith(location);
      });

      it("should commit the station to the store", async () => {
        const commit = jest.fn();
        const barcelona = {
          name: "Barcelona-Sants",
          lat: "41.379520",
          lng: "2.140624"
        };
        stationsApi.getNearestStation.mockResolvedValue(barcelona);

        await module.actions.getNearestStation({ commit }, {});
        await flushPromises();
        expect(commit).toHaveBeenCalledWith("SET_ACTIVE_STATION", barcelona);
      });
    });
    describe("setActiveStation", () => {
      it("should commit the station to the store", () => {
        const commit = jest.fn();
        const barcelona = {
          name: "Barcelona-Sants",
          lat: "41.379520",
          lng: "2.140624"
        };
        module.actions.setActiveStation({ commit }, barcelona);
        expect(commit).toHaveBeenCalledWith("SET_ACTIVE_STATION", barcelona);
      });
    });
  });

  describe("mutations", () => {
    it("should add the station to the state", () => {
      const state = {
        station: null
      };
      const station = {
        name: "Barcelona",
        lat: faker.address.latitude(),
        lng: faker.address.longitude()
      };
      module.mutations.SET_ACTIVE_STATION(state, station);
      expect(state.station).toEqual(station);
    });
  });
});
