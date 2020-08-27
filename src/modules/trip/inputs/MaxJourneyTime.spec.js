import { shallowMount } from "@vue/test-utils";
import Vue from "vue";
import Vuetify from "vuetify";
import MaxJourneyTime from "./MaxJourneyTime";

Vue.use(Vuetify);

describe("MaxJourneyTime", () => {
  it("should use hours in data object as input items", () => {
    const mockHours = [{ text: "2 hours", value: 2 }];
    const wrapper = shallowMount(MaxJourneyTime, {
      data() {
        return {
          hours: mockHours
        };
      }
    });
    expect(
      wrapper.find("[data-test-id=max-journey-time-input]").props().items
    ).toEqual(mockHours);
  });

  it("should dispatch updateDurationRange with number of hours", () => {
    const mockHours = 2;
    const mockDispatch = jest.fn();
    const wrapper = shallowMount(MaxJourneyTime, {
      mocks: {
        $store: {
          dispatch: mockDispatch
        }
      }
    });
    wrapper
      .find("[data-test-id=max-journey-time-input]")
      .vm.$emit("change", mockHours);
    expect(mockDispatch).toHaveBeenCalledWith("updateDurationRange", [
      0,
      mockHours
    ]);
  });
});
