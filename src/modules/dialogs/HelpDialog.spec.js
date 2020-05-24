import { mount } from "@vue/test-utils";
import Vue from "vue";
import Vuetify from "vuetify";
import HelpDialog from "./HelpDialog";

Vue.use(Vuetify);

describe("HelpDialog", () => {
  const mockStubs = {
    VDialog: {
      name: "v-dialog",
      template: "<span><slot></slot></span>"
    }
  };
  beforeEach(() => {
    window.innerWidth = 1000;
  });
  it("should have title about tips on desktop", () => {
    const wrapper = mount(HelpDialog, {
      stubs: mockStubs
    });
    expect(wrapper.find(".v-card__title").text()).toBe("Tips:");
  });

  it("should have h1 title about tips on desktop", () => {
    window.innerWidth = 500;
    const wrapper = mount(HelpDialog, {
      stubs: mockStubs
    });
    expect(wrapper.find(".v-card__title").text()).toBe(
      "Build, save and share your route across Europe by train."
    );
  });

  it("should contain clipboard-list icon if mobile", async () => {
    const wrapper = mount(HelpDialog, {
      stubs: mockStubs
    });
    expect(wrapper.find("[data-test-id=icon-clipboard-list]").exists()).toBe(
      false
    );
    window.innerWidth = 500;
    await Vue.nextTick(() => {
      expect(wrapper.find("[data-test-id=icon-clipboard-list]").exists()).toBe(
        true
      );
    });
  });
});
