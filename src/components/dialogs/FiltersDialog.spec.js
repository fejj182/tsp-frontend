import { shallowMount } from "@vue/test-utils";
import FiltersDialog from "./FiltersDialog";
import TripPanel from "@/modules/trip-panel/TripPanel";
import { createLegend } from "@/plugins/leaflet.js";
import { LEGEND_TOPRIGHT } from "@/modules/map/markers/types";
import Vue from "vue";
import Vuetify from "vuetify";

Vue.use(Vuetify);

jest.mock("@/plugins/leaflet.js");

describe("FiltersDialog", () => {
  const mockStubs = {
    VDialog: {
      name: "v-dialog",
      template: "<span><slot></slot></span>"
    }
  };
  beforeEach(() => {
    jest.resetAllMocks();
  });
  it("should contain TripPanel", () => {
    const wrapper = shallowMount(FiltersDialog, {
      stubs: mockStubs
    });
    expect(wrapper.find(TripPanel).exists()).toBe(true);
  });

  it("should close dialog when event is emitted", () => {
    const wrapper = shallowMount(FiltersDialog, {
      data() {
        return {
          dialog: true
        };
      }
    });

    expect(wrapper.find("[data-test-id=v-dialog]").attributes().value).toBe(
      "true"
    );
    wrapper.find(TripPanel).vm.$emit("close-dialog");
    expect(wrapper.find("[data-test-id=v-dialog]").attributes().value).toBe(
      undefined
    );
  });

  it("should create filter button", () => {
    const mockMap = {};
    const wrapper = shallowMount(FiltersDialog, {
      stubs: mockStubs,
      propsData: {
        map: mockMap
      }
    });
    const filterButton = wrapper.find("[data-test-id=btn-filter]");
    expect(createLegend).toHaveBeenCalledWith(
      mockMap,
      filterButton.element,
      LEGEND_TOPRIGHT,
      expect.any(Function)
    );
  });

  it("should remove button from dom", () => {
    const mockLegend = {
      remove: jest.fn()
    };
    createLegend.mockReturnValue(mockLegend);
    const wrapper = shallowMount(FiltersDialog, {
      stubs: mockStubs
    });
    expect(wrapper.find("[data-test-id=btn-filter]").exists()).toBe(false);
  });

  it("should remove filter when component destroyed", () => {
    const mockLegend = {
      remove: jest.fn()
    };
    createLegend.mockReturnValue(mockLegend);
    const wrapper = shallowMount(FiltersDialog, {
      stubs: mockStubs
    });
    wrapper.destroy();
    expect(mockLegend.remove).toHaveBeenCalled();
  });

  it("should pass function to createLegend that opens dialog", () => {
    const wrapper = shallowMount(FiltersDialog);
    expect(wrapper.find("[data-test-id=v-dialog]").exists()).toBe(true);
    expect(wrapper.find("[data-test-id=v-dialog]").props().value).toBe(false);
    wrapper.vm.open();
    expect(wrapper.find("[data-test-id=v-dialog]").props().value).toBe(true);
  });
});
