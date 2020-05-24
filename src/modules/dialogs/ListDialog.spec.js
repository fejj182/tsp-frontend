import { shallowMount } from "@vue/test-utils";
import Vue from "vue";
import Vuetify from "vuetify";
import ListDialog from "./ListDialog";
import TripPanel from "@/modules/trip-panel/TripPanel";

Vue.use(Vuetify);

describe("ListDialog", () => {
  it("should contain TripPanel", () => {
    const mockStubs = {
      VDialog: {
        name: "v-dialog",
        template: "<span><slot></slot></span>"
      }
    };
    const wrapper = shallowMount(ListDialog, {
      stubs: mockStubs
    });
    expect(wrapper.find(TripPanel).exists()).toBe(true);
  });
});
