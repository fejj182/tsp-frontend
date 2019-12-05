import stations from "./stations";
import { get, post } from "@/helpers/request.js";
import faker from "faker";
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

  describe("getNearestStation", () => {
    it("should call the endpoint", () => {
      const location = {
        lat: faker.address.latitude(),
        lng: faker.address.longitude
      };
      stations.getNearestStation(location);
      expect(post).toHaveBeenCalledWith("test/stations/nearest", location);
    });
  });
});
