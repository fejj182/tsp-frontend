import tripApi from "./trip";
import { get, post } from "@/helpers/request.js";
jest.mock("@/helpers/request.js");

describe("trip", () => {
  describe("create", () => {
    it("should call the endpoint", () => {
      process.env.VUE_APP_API_BASE_URL = "test";
      const trip = {
        0: "Barcelona",
        1: "Madrid"
      };
      tripApi.create(trip);
      expect(post).toHaveBeenCalledWith("test/trip", { trip });
    });
  });

  describe("trip", () => {
    it("should call the endpoint", () => {
      process.env.VUE_APP_API_BASE_URL = "test";
      const alias = "some-alias";
      tripApi.get(alias);
      expect(get).toHaveBeenCalledWith(`test/trip/${alias}`);
    });
  });
});
