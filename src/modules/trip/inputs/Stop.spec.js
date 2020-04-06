import { shallowMount } from "@vue/test-utils";
import Vue from "vue";
import Vuetify from "vuetify";
import _ from "lodash";

import Stop from "./Stop.vue";
import { fakeStation } from "@/helpers/tests";
import { state as stations } from "@/store/modules/stations";
import { state as trip } from "@/store/modules/trip";
import { toHoursAndMinutes } from "@/mappers/durationMapper";

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
  test("when stop changes, should updated selected stop in store", () => {
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

  test("when stop changes, should trigger popup to open in store", () => {
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

  it("should set value of stop from stop selected property even if selectedStop is present in store", () => {
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
      value: { ...valencia, duration: toHoursAndMinutes(valencia.duration) }
    });
  });

  it("should have the value of stop from store if selected property of stop is not present", () => {
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
      value: { ...madrid, duration: toHoursAndMinutes(madrid.duration) }
    });
  });

  it("should persist last value from store when changed to read-only", () => {
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
      value: { ...madrid, duration: toHoursAndMinutes(madrid.duration) }
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
