import stations from "./stations";
import { get } from "@/helpers/request.js";
jest.mock("@/helpers/request.js");

describe("stations", () => {
  beforeEach(() => {
    process.env.VUE_APP_API_BASE_URL = "test";
  });

  describe("getStations", () => {
    it("should call the endpoint", () => {
      stations.getStations();
      expect(get).toHaveBeenCalledWith("test/stations");
    });
  });

  //TODO: Add test for getConnections
});
