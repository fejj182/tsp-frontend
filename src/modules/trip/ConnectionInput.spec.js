import { shallowMount } from "@vue/test-utils";
import ConnectionInput from "./ConnectionInput.vue";
import { fakeStation } from "@/helpers/tests";
import Vue from "vue";
import Vuetify from "vuetify";
import { state as stations } from "@/store/modules/stations";
import { state as trip } from "@/store/modules/trip";
import _ from "lodash";

Vue.use(Vuetify);

describe("ConnectionInput", () => {
  let mockStore;
  beforeEach(() => {
    mockStore = {
      dispatch: jest.fn(),
      state: {
        stations: _.cloneDeep(stations),
        trip: _.cloneDeep(trip)
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
    wrapper.find("[data-test-id=connection").vm.$emit("change", station);
    expect(mockStore.dispatch).toHaveBeenCalledWith(
      "selectConnection",
      station
    );
  });

  it("should have the value null if not present in the store", () => {
    const wrapper = shallowMount(ConnectionInput, {
      mocks: {
        $store: mockStore
      },
      propsData: {
        connections: []
      }
    });
    expect(wrapper.find("[data-test-id=connection]").props().value).toBe(null);
  });

  it("should have the value set from of store if present", () => {
    const valencia = fakeStation("valencia");
    const madrid = fakeStation("madrid");
    mockStore.state.trip.selectedConnection = madrid;

    const wrapper = shallowMount(ConnectionInput, {
      mocks: {
        $store: mockStore
      },
      propsData: {
        connections: [valencia, madrid]
      }
    });
    expect(wrapper.find("[data-test-id=connection]").props().value).toEqual({
      text: madrid.name,
      value: madrid
    });
  });

  it("should use last value from store when changed to read-only", () => {
    const valencia = fakeStation("valencia");
    const madrid = fakeStation("madrid");

    const wrapper = shallowMount(ConnectionInput, {
      mocks: {
        $store: mockStore
      },
      propsData: {
        connections: [valencia, madrid]
      }
    });
    mockStore.state.trip.selectedConnection = madrid;
    wrapper.setProps({ readOnly: true });
    mockStore.state.trip.selectedConnection = valencia;

    expect(wrapper.find("[data-test-id=connection]").props().value).toEqual({
      text: madrid.name,
      value: madrid
    });
  });

  it("should have readonly property set from the prop", () => {
    const wrapper = shallowMount(ConnectionInput, {
      mocks: {
        $store: mockStore
      },
      propsData: {
        connections: [],
        readOnly: true
      }
    });
    expect(wrapper.find("[data-test-id=connection]").props().readonly).toEqual(
      true
    );
  });
});
