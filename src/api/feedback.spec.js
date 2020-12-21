import feedback from "./feedback";
import { post } from "@/helpers/request.js";
jest.mock("@/helpers/request.js");

describe("feedback", () => {
  beforeEach(() => {
    process.env.VUE_APP_API_BASE_URL = "test";
  });
  describe("create", () => {
    it("should call post endpoint", () => {
      feedback.create("name", "email", "feedback");
      expect(post).toHaveBeenCalledWith("test/feedback", {
        name: "name",
        email: "email",
        feedback: "feedback"
      });
    });
  });
});
