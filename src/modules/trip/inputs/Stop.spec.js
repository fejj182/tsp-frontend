import { shallowMount } from "@vue/test-utils";
import Vue from "vue";
import Vuetify from "vuetify";
import _ from "lodash";

import Stop from "./Stop.vue";
import { fakeStation } from "@/helpers/tests";
import { state as stations } from "@/store/modules/stations";
import { state as trip } from "@/store/modules/trip";

Vue.use(Vuetify);

describe("Stop", () => {
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
  it("should dispatch selectStop on change", () => {
    const station = fakeStation();
    const wrapper = shallowMount(Stop, {
      mocks: {
        $store: mockStore
      },
      propsData: {
        stations: [],
        stop: {}
      }
    });
    wrapper.find("[data-test-id=stop").vm.$emit("change", station);
    expect(mockStore.dispatch).toHaveBeenCalledWith("selectStop", station);
  });

  it("should dispatch openPopup on change", () => {
    const station = fakeStation();
    const wrapper = shallowMount(Stop, {
      mocks: {
        $store: mockStore
      },
      propsData: {
        stations: [],
        stop: {}
      }
    });
    wrapper.find("[data-test-id=stop").vm.$emit("change", station);
    expect(mockStore.dispatch).toHaveBeenCalledWith("openPopup", station);
  });

  it("should have the value null if not present in the store", () => {
    const wrapper = shallowMount(Stop, {
      mocks: {
        $store: mockStore
      },
      propsData: {
        stations: [],
        stop: {}
      }
    });
    expect(wrapper.find("[data-test-id=stop]").props().value).toBe(null);
  });

  it("should have the value set from of selected property of stop if present", () => {
    const valencia = fakeStation("valencia");
    const madrid = fakeStation("madrid");
    mockStore.state.trip.selectedStop = madrid;

    const wrapper = shallowMount(Stop, {
      mocks: {
        $store: mockStore
      },
      propsData: {
        stations: [valencia, madrid],
        stop: {
          selected: valencia
        }
      }
    });
    expect(wrapper.find("[data-test-id=stop]").props().value).toEqual({
      text: valencia.name,
      value: valencia
    });
  });

  it("should have the value set from of store if present and selected property of stop is not present", () => {
    const valencia = fakeStation("valencia");
    const madrid = fakeStation("madrid");
    mockStore.state.trip.selectedStop = madrid;

    const wrapper = shallowMount(Stop, {
      mocks: {
        $store: mockStore
      },
      propsData: {
        stations: [valencia, madrid],
        stop: {}
      }
    });
    expect(wrapper.find("[data-test-id=stop]").props().value).toEqual({
      text: madrid.name,
      value: madrid
    });
  });

  it("should use last value from store when changed to read-only", () => {
    const valencia = fakeStation("valencia");
    const madrid = fakeStation("madrid");

    const wrapper = shallowMount(Stop, {
      mocks: {
        $store: mockStore
      },
      propsData: {
        stations: [valencia, madrid],
        stop: {}
      }
    });
    mockStore.state.trip.selectedStop = madrid;
    wrapper.setProps({ readOnly: true });
    mockStore.state.trip.selectedStop = valencia;

    expect(wrapper.find("[data-test-id=stop]").props().value).toEqual({
      text: madrid.name,
      value: madrid
    });
  });

  it("should have readonly property set from the prop", () => {
    const wrapper = shallowMount(Stop, {
      mocks: {
        $store: mockStore
      },
      propsData: {
        stations: [],
        readOnly: true,
        stop: {}
      }
    });
    expect(wrapper.find("[data-test-id=stop]").props().readonly).toEqual(true);
  });
});
