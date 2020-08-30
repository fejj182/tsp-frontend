import { shallowMount, mount } from "@vue/test-utils";
import Vue from "vue";
import Vuetify from "vuetify";

import FiltersSlider from "./FiltersSlider.vue";

jest.mock("@/modules/map/panes/paneUtils", () => ({
  displayPanesInRange: jest.fn()
}));

Vue.use(Vuetify);

describe("FiltersSlider", () => {
  let mockStore, mockPanes;

  beforeEach(() => {
    jest.resetAllMocks();
    mockDataApp();

    mockPanes = [];

    mockStore = {
      state: {
        map: {
          panes: mockPanes
        },
        filters: {
          activeDurationRange: [0, 6]
        }
      },
      dispatch: jest.fn()
    };
  });
  it("should update slider value from store", () => {
    mockStore.state.filters.activeDurationRange = [0, 4];
    const wrapper = shallowMount(FiltersSlider, {
      mocks: {
        $store: mockStore
      }
    });
    expect(
      wrapper.find("[data-test-id=journey-time-slider]").props().value
    ).toEqual([0, (4 * 100) / 6]);
  });

  it("should update pane groups when slider changes", () => {
    const wrapper = mount(FiltersSlider, {
      mocks: {
        $store: mockStore
      }
    });
    wrapper.find("input").trigger("click");
    expect(mockStore.dispatch).toHaveBeenCalledWith(
      "updateDurationRange",
      wrapper.vm.paneGroupRange
    );
  });

  describe("thumbLabel", () => {
    it("should show", () => {
      mockStore.state.filters.activeDurationRange = [0, 4];
      const wrapper = mount(FiltersSlider, {
        mocks: {
          $store: mockStore
        }
      });
      expect(
        wrapper
          .findAll(".v-slider__thumb-label")
          .at(1)
          .text()
      ).toBe("4");
    });

    it("should return 6+ instead of 6", () => {
      mockStore.state.filters.activeDurationRange = [0, 6];
      const wrapper = mount(FiltersSlider, {
        mocks: {
          $store: mockStore
        }
      });
      expect(
        wrapper
          .findAll(".v-slider__thumb-label")
          .at(1)
          .text()
      ).toBe("6+");
    });
  });
});

const mockDataApp = () => {
  var app = document.createElement("div");
  app.setAttribute("data-app", true);
  document.body.appendChild(app);
};
