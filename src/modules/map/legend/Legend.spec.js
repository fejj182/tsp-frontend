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
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("markup should not exists in DOM", done => {
    const mockMap = {};
    createLegend.mockReturnValue({});
    const wrapper = shallowMount(Legend, {
      propsData: {
        map: mockMap
      }
    });
    Vue.nextTick(() => {
      expect(wrapper.find("#legend").exists()).toBe(false);
      done();
    });
  });

  it("should create legend", () => {
    const mockMap = {};
    const wrapper = shallowMount(Legend, {
      propsData: {
        map: mockMap
      }
    });
    expect(createLegend).toHaveBeenCalledWith(
      mockMap,
      wrapper.vm.$refs.legend,
      "bottomright"
    );
  });
});
