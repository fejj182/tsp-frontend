import { shallowMount } from "@vue/test-utils";
import ConnectionInput from "./ConnectionInput.vue";
import { fakeStation } from "@/helpers/tests";
import Vue from "vue";
import Vuetify from "vuetify";

Vue.use(Vuetify);

describe("ConnectionInput", () => {
  it("should dispatch selectConnection on change", () => {
    const station = fakeStation();
    const mockStore = {
      dispatch: jest.fn()
    };
    const wrapper = shallowMount(ConnectionInput, {
      mocks: {
        $store: mockStore
      }
    });
    wrapper.find("[data-test-id=destination-2").vm.$emit("change", station);
    expect(mockStore.dispatch).toHaveBeenCalledWith(
      "selectConnection",
      station
    );
  });
});
