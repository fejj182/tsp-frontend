import stations from "./stations";
import { post } from "@/helpers/request.js";
import faker from "faker";
jest.mock("@/helpers/request.js");

describe("stations", () => {
  describe("getNearestStation", () => {
    it("should call the endpoint", () => {
      process.env.VUE_APP_API_BASE_URL = "test";
      const location = {
        lat: faker.address.latitude(),
        lng: faker.address.longitude
      };
      stations.getNearestStation(location);
      expect(post).toHaveBeenCalledWith("test/stations/nearest", location);
    });
  });
});
