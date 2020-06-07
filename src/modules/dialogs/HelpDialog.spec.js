import { mount, shallowMount } from "@vue/test-utils";
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
      "Multiple journey planner for train travel in Europe."
    );
  });

  it("should contain clipboard-list icon if mobile", () => {
    window.innerWidth = 500;
    const wrapper = shallowMount(HelpDialog, {
      stubs: mockStubs
    });
    expect(wrapper.find("[data-test-id=icon-clipboard-list]").exists()).toBe(
      true
    );
  });

  it("should not contain clipboard-list icon if not mobile", () => {
    const wrapper = shallowMount(HelpDialog, {
      stubs: mockStubs
    });
    expect(wrapper.find("[data-test-id=icon-clipboard-list]").exists()).toBe(
      false
    );
  });
});
