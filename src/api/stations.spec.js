import stations from "./stations";
import { get, post } from "@/helpers/request.js";
jest.mock("@/helpers/request.js");

describe("stations", () => {
  beforeEach(() => {
    process.env.VUE_APP_API_BASE_URL = "test";
  });

  describe("getStations", () => {
    it("should call the stations endpoint", () => {
      stations.getStations();
      expect(get).toHaveBeenCalledWith("test/destinations");
    });
  });

  describe("getConnections", () => {
    it("should call the connections endpoint", () => {
      stations.getConnections(1);
      expect(post).toHaveBeenCalledWith("test/destinations/connections", {
        destinationId: 1
      });
    });
  });
});
