import * as module from "./getNearestStation";
import stationsApi from "@/api/stations";
import faker from "faker";

jest.mock("@/api/stations", () => ({ getNearestStation: jest.fn() }));

describe("stations", () => {
  describe("action", () => {
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
      const location = {
        lat: faker.address.latitude(),
        lng: faker.address.longitude()
      };

      const station = await module.actions.getNearestStation(
        { commit },
        location
      );
      expect(commit).toHaveBeenCalledWith(
        "FETCH_NEAREST_STATION_SUCCESS",
        station
      );
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
      module.mutations.FETCH_NEAREST_STATION_SUCCESS(state, station);
      expect(state.station).toEqual(station);
    });
  });
});
