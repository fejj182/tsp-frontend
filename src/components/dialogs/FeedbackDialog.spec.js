import { mount } from "@vue/test-utils";
import FeedbackDialog from "./FeedbackDialog";
import feedbackApi from "@/api/feedback";

import Vue from "vue";
import Vuetify from "vuetify";

Vue.use(Vuetify);

jest.mock("@/api/feedback");

describe("FeedbackDialog", () => {
  const mockStubs = {
    VDialog: {
      name: "v-dialog",
      template: "<span><slot></slot></span>"
    }
  };
  describe("submit", () => {
    it("should submit feedback", done => {
      const wrapper = mount(FeedbackDialog, {
        data() {
          return {
            name: "name",
            email: "email",
            feedback: "feedback"
          };
        },
        stubs: mockStubs
      });
      wrapper.vm.$refs.form.validate = jest.fn(() => true);
      wrapper.find("[data-test-id=btn-submit]").trigger("submit");
      Vue.nextTick(() => {
        expect(wrapper.find("[data-test-id=feedback-success]").exists()).toBe(
          true
        );
        expect(feedbackApi.create).toHaveBeenCalledWith(
          "name",
          "email",
          "feedback"
        );
        done();
      });
    });
  });
});
