import { shallowMount } from "@vue/test-utils";
import Vue from "vue";
import Vuetify from "vuetify";

import Header from "./Header";
import ListDialog from "@/modules/dialogs/ListDialog";
import HelpDialog from "@/modules/dialogs/HelpDialog";

Vue.use(Vuetify);

describe("Header", () => {
  const mockStubs = {
    VAppBar: {
      name: "v-app-bar",
      template: "<span><slot></slot></span>"
    },
    VSpacer: {
      name: "v-spacer",
      template: "<span></span>"
    }
  };

  beforeEach(() => {
    window.innerWidth = 1000;
  });
  it("should contain logo as a link", () => {
    const wrapper = shallowMount(Header, {
      mocks: mockStubs
    });
    expect(wrapper.find("a > img").exists()).toBe(true);
  });

  it("should show h1", () => {
    const wrapper = shallowMount(Header, {
      mocks: mockStubs
    });
    wrapper.find("#logo").trigger("load");
    expect(wrapper.find("h1").isVisible()).toBe(true);
  });

  it("should hide h1 on mobile ", () => {
    window.innerWidth = 500;
    const wrapper = shallowMount(Header, {
      mocks: mockStubs
    });
    expect(wrapper.find("h1").isVisible()).toBe(false);
  });

  it("should not contain ListDialog on desktop", () => {
    const wrapper = shallowMount(Header, {
      mocks: mockStubs
    });
    expect(wrapper.find(ListDialog).exists()).toBe(false);
  });

  it("should contain ListDialog on mobile", () => {
    window.innerWidth = 500;
    const wrapper = shallowMount(Header, {
      mocks: mockStubs
    });
    expect(wrapper.find(ListDialog).exists()).toBe(true);
  });

  it("should contain HelpDialog", () => {
    const wrapper = shallowMount(Header, {
      mocks: mockStubs
    });
    expect(wrapper.find(HelpDialog).exists()).toBe(true);
  });
});
