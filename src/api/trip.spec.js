import tripApi from "./trip";
import { get, post } from "@/helpers/request.js";
jest.mock("@/helpers/request.js");

describe("trip", () => {
  describe("create", () => {
    it("should call the create endpoint", () => {
      process.env.VUE_APP_API_BASE_URL = "test";
      const trip = {
        0: "Barcelona",
        1: "Madrid"
      };
      tripApi.create(trip);
      expect(post).toHaveBeenCalledWith("test/trip", { trip });
    });
  });

  describe("get", () => {
    it("should call the get endpoint", () => {
      process.env.VUE_APP_API_BASE_URL = "test";
      const alias = "some-alias";
      tripApi.get(alias);
      expect(get).toHaveBeenCalledWith(`test/trip/${alias}`);
    });
  });

  describe("update", () => {
    it("should call the update endpoint", () => {
      process.env.VUE_APP_API_BASE_URL = "test";
      const alias = "some-alias";
      const trip = {
        0: "Barcelona",
        1: "Madrid"
      };
      tripApi.update(alias, trip);
      expect(post).toHaveBeenCalledWith(`test/trip/${alias}`, {
        trip
      });
    });
  });
});
