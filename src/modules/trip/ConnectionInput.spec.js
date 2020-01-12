import { shallowMount } from "@vue/test-utils";
import ConnectionInput from "./ConnectionInput.vue";
import { fakeStation } from "@/helpers/tests";
import Vue from "vue";
import Vuetify from "vuetify";
import { state as stations } from "@/store/modules/stations";
import { state as tripform } from "@/store/modules/tripform";
import _ from "lodash";

Vue.use(Vuetify);

describe("ConnectionInput", () => {
  let mockStore;
  beforeEach(() => {
    mockStore = {
      dispatch: jest.fn(),
      state: {
        stations: _.cloneDeep(stations),
        tripform: _.cloneDeep(tripform)
      }
    };
  });
  it("should dispatch selectConnection on change", () => {
    const station = fakeStation();
    const wrapper = shallowMount(ConnectionInput, {
      mocks: {
        $store: mockStore
      },
      propsData: {
        connections: []
      }
    });
    wrapper.find("[data-test-id=destination-2").vm.$emit("change", station);
    expect(mockStore.dispatch).toHaveBeenCalledWith(
      "selectConnection",
      station
    );
  });

  it("should have the value set from of store if present", () => {
    const valencia = fakeStation("valencia");
    const madrid = fakeStation("madrid");
    mockStore.state.tripform.connectionId = madrid.id;

    const wrapper = shallowMount(ConnectionInput, {
      mocks: {
        $store: mockStore
      },
      propsData: {
        connections: [valencia, madrid]
      }
    });
    expect(wrapper.find("[data-test-id=destination-2]").props().value).toEqual({
      text: madrid.name,
      value: madrid
    });
  });
});
