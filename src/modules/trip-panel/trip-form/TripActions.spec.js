import { mount } from "@vue/test-utils";
import Vue from "vue";
import VueClipboard from "vue-clipboard2";
import Vuetify from "vuetify";
import TripActions from "@/modules/trip-panel/trip-form/TripActions";
import TripActionListItem from "@/modules/trip-panel/trip-form/TripActionListItem";

Vue.use(Vuetify);
Vue.use(VueClipboard);

describe("TripActions", () => {
  it("should contain the find offers button", () => {
    const wrapper = mount(TripActions, {
      stubs: {
        VMenu: {
          name: "v-menu",
          template: "<span><slot name='activator'></slot></span>"
        }
      }
    });
    expect(wrapper.find("#find-offers-btn").text()).toBe("Find...");
  });

  it("should contain the TripActionListItems", () => {
    const wrapper = mount(TripActions, {
      stubs: {
        VMenu: {
          name: "v-menu",
          template: "<span><slot name='default'></slot></span>"
        }
      }
    });
    expect(wrapper.findAll(TripActionListItem).length).toBe(3);
  });

  it("should contain the save button", () => {
    const wrapper = mount(TripActions, {
      propsData: {
        tripSaved: false
      },
      stubs: {
        VMenu: {
          name: "v-menu",
          template: "<span></span>"
        }
      }
    });
    expect(wrapper.find("[data-test-id=save-trip]").text()).toBe("Save");
  });

  it("should contain the more options button if trip already saved", () => {
    const wrapper = mount(TripActions, {
      propsData: {
        tripSaved: true
      },
      stubs: {
        VMenu: {
          name: "v-menu",
          template: "<span><slot name='activator'></slot></span>"
        }
      }
    });
    expect(wrapper.find("[data-test-id=more-options]").exists()).toBe(true);
  });

  it("should contain the trip actions list if trip already saved", () => {
    const wrapper = mount(TripActions, {
      propsData: {
        tripSaved: true
      },
      stubs: {
        VMenu: {
          name: "v-menu",
          template: "<span><slot name='default'></slot></span>"
        }
      }
    });
    expect(wrapper.find("[data-test-id=trip-actions-list]").exists()).toBe(
      true
    );
  });
});
