import { shallowMount } from "@vue/test-utils";
import Vue from "vue";
import Vuetify from "vuetify";
import isMobile from "@/plugins/isMobile";

import Header from "./Header";
import HeaderMenu from "./HeaderMenu";
import FeedbackDialog from "@/components/dialogs/FeedbackDialog";

Vue.use(Vuetify);
Vue.use(isMobile);

describe("Header", () => {
  let mockRoute;

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
    mockRoute = {
      name: "route"
    };
  });
  it("should contain logo as a link", () => {
    const wrapper = shallowMount(Header, {
      mocks: {
        $route: mockRoute
      },
      stubs: mockStubs
    });
    expect(wrapper.find("a > img").exists()).toBe(true);
  });

  it("should contain HeaderMenu on welcome page", () => {
    mockRoute.name = "welcome";
    const wrapper = shallowMount(Header, {
      mocks: {
        $route: mockRoute
      },
      stubs: mockStubs
    });
    expect(wrapper.find(HeaderMenu).exists()).toBe(true);
  });

  it("should not contain HeaderMenu if not on welcome page", () => {
    const wrapper = shallowMount(Header, {
      mocks: {
        $route: mockRoute
      },
      stubs: mockStubs
    });
    expect(wrapper.find(HeaderMenu).exists()).toBe(false);
  });

  it("should contain Feedback Dialog", () => {
    const wrapper = shallowMount(Header, {
      mocks: {
        $route: mockRoute
      },
      stubs: mockStubs
    });
    expect(wrapper.find(FeedbackDialog).exists()).toBe(true);
  });
});
