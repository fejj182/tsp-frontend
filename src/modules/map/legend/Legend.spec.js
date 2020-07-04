import { shallowMount } from "@vue/test-utils";
import Vue from "vue";
import Vuetify from "vuetify";
import Legend from "./Legend";
import { createLegend } from "@/plugins/leaflet";

Vue.use(Vuetify);

jest.mock("@/plugins/leaflet", () => ({
  createLegend: jest.fn()
}));

describe("Legend", () => {
  it("should create legend", () => {
    const mockMap = {};
    const wrapper = shallowMount(Legend, {
      propsData: {
        map: mockMap
      }
    });
    expect(createLegend).toBeCalledWith(mockMap, wrapper.vm.$refs.legend);
  });
});
