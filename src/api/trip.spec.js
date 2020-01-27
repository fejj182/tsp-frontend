import tripApi from "./trip";
import { post } from "@/helpers/request.js";
jest.mock("@/helpers/request.js");

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
