import { shallowMount } from "@vue/test-utils";
import Vue from "vue";
import Vuetify from "vuetify";

import Header from "./Header";

Vue.use(Vuetify);

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
    },
    TripDialog: {
      name: "TripDialog",
      template: "<span></span>"
    }
  };

  beforeEach(() => {
    window.innerWidth = 1000;
    mockRoute = {
      name: "home"
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

  it("should not contain TripDialog on desktop", () => {
    const wrapper = shallowMount(Header, {
      mocks: {
        $route: mockRoute
      },
      stubs: mockStubs
    });
    expect(wrapper.find("[data-test-id=list-dialog]").exists()).toBe(false);
  });

  it("should contain TripDialog on mobile", () => {
    window.innerWidth = 500;
    const wrapper = shallowMount(Header, {
      mocks: {
        $route: mockRoute
      },
      stubs: mockStubs
    });
    expect(wrapper.find("[data-test-id=list-dialog]").exists()).toBe(true);
  });

  it("should not contain TripDialog if route is welcome", () => {
    window.innerWidth = 500;
    mockRoute.name = "welcome";
    const wrapper = shallowMount(Header, {
      mocks: {
        $route: mockRoute
      },
      stubs: mockStubs
    });
    expect(wrapper.find("[data-test-id=list-dialog]").exists()).toBe(false);
  });
});
