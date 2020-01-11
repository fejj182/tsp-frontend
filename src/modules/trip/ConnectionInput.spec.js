import { shallowMount } from "@vue/test-utils";
import ConnectionInput from "./ConnectionInput.vue";
import faker from "faker";
import Vue from "vue";
import Vuetify from "vuetify";

Vue.use(Vuetify);

describe("ConnectionInput", () => {
  it("should dispatch selectConnection on change", () => {
    const station = getStation();
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

  function getStation() {
    const id = faker.random.number();
    const name = faker.address.city();
    const lat = parseFloat(faker.address.latitude());
    const lng = parseFloat(faker.address.longitude());
    return { id, name, lat, lng };
  }
});
