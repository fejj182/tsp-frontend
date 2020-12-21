import { shallowMount } from "@vue/test-utils";
import TripForm from "@/modules/trip-panel/trip-form/TripForm";
import TripOverlay from "./TripOverlay";

import Vue from "vue";
import Vuetify from "vuetify";

Vue.use(Vuetify);

describe("TripOverlay", () => {
  it("should scroll to bottom when event emitted", () => {
    document.getElementById = jest.fn();
    document.getElementById.mockReturnValue({ scrollHeight: 100 });

    const wrapper = shallowMount(TripOverlay);
    wrapper.find(TripForm).vm.$emit("scroll-form-to-bottom");
    expect(document.getElementById("overlay-trip-form").scrollTop).toBe(100);
  });
});
