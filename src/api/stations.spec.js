import stations from "./stations";
import { post } from "@/helpers/request.js";
jest.mock("@/helpers/request.js");

describe("stations", () => {
  describe("getNearestStation", () => {
    it("should call the endpoint", () => {
      process.env.VUE_APP_API_BASE_URL = "test";
      const location = { lat: "123", lon: "456" };
      stations.getNearestStation(location);
      expect(post).toHaveBeenCalledWith("test/stations/nearest", location);
    });
  });
});
