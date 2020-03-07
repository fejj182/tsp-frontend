import { mount } from "@vue/test-utils";
import Vue from "vue";
import Vuetify from "vuetify";
import paneUtils from "@/modules/map/panes/paneUtils";

import ConnectionFilters from "./ConnectionFilters.vue";

jest.mock("@/modules/map/panes/paneUtils", () => ({
  displayPanesInRange: jest.fn()
}));

Vue.use(Vuetify);

describe("ConnectionFilters", () => {
  let mockStore, mockPanes;

  beforeEach(() => {
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

  describe("When filter values change", () => {
    it("should update pane groups when component mounted", () => {
      const wrapper = mount(ConnectionFilters, {
        mocks: {
          $store: mockStore
        }
      });
      expect(paneUtils.displayPanesInRange).toHaveBeenCalledWith(
        mockPanes,
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
      expect(paneUtils.displayPanesInRange).toHaveBeenCalledWith(
        mockPanes,
        wrapper.vm.paneGroupRange
      );
    });
  });
});

const mockDataApp = () => {
  var app = document.createElement("div");
  app.setAttribute("data-app", true);
  document.body.appendChild(app);
};
