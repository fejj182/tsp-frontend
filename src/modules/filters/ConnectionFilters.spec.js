import { shallowMount, mount } from "@vue/test-utils";
import Vue from "vue";
import Vuetify from "vuetify";

import ConnectionFilters from "./ConnectionFilters.vue";

jest.mock("@/modules/map/panes/paneUtils", () => ({
  displayPanesInRange: jest.fn()
}));

Vue.use(Vuetify);

describe("ConnectionFilters", () => {
  let mockStore, mockPanes;

  beforeEach(() => {
    jest.resetAllMocks();
    mockDataApp();

    mockPanes = [];

    mockStore = {
      state: {
        map: {
          panes: mockPanes
        }
      },
      dispatch: jest.fn()
    };
  });

  it("should update pane groups when component mounted", () => {
    const wrapper = shallowMount(ConnectionFilters, {
      mocks: {
        $store: mockStore
      }
    });
    expect(mockStore.dispatch).toHaveBeenCalledWith(
      "updateDurationRange",
      wrapper.vm.paneGroupRange
    );
  });
  it("should update pane groups when slider changes", () => {
    const wrapper = mount(ConnectionFilters, {
      mocks: {
        $store: mockStore
      }
    });
    wrapper.find("input").trigger("click");
    expect(mockStore.dispatch.mock.calls).toEqual([
      ["updateDurationRange", wrapper.vm.paneGroupRange],
      ["updateDurationRange", wrapper.vm.paneGroupRange]
    ]);
  });

  it("should show thumb label", () => {
    const wrapper = mount(ConnectionFilters, {
      mocks: {
        $store: mockStore
      }
    });
    expect(
      wrapper
        .findAll(".v-slider__thumb-label")
        .at(1)
        .text()
    ).toBe("10+");
  });

  describe("thumbLabel", () => {
    it("should return 10+ instead of 10", () => {
      const wrapper = shallowMount(ConnectionFilters, {
        mocks: {
          $store: mockStore
        }
      });
      const result = wrapper.vm.thumbLabel(100);
      expect(result).toBe("10+");
    });
  });
});

const mockDataApp = () => {
  var app = document.createElement("div");
  app.setAttribute("data-app", true);
  document.body.appendChild(app);
};
