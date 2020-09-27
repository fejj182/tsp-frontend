import { shallowMount, mount } from "@vue/test-utils";
import Vue from "vue";
import Vuetify from "vuetify";
import cloneDeep from "lodash/cloneDeep";

import Stop from "./Stop.vue";
import { fakeStation } from "@/helpers/tests";
import { state as stations } from "@/store/modules/stations";
import { state as trip } from "@/store/modules/trip";
import { state as filters } from "@/store/modules/filters";
import { toHoursAndMinutes } from "@/mappers/durationMapper";
import { filterStationsOutOfRange } from "@/modules/map/panes/paneUtils";
import { mapStationsByDuration } from "@/mappers/stationFormMapper";

jest.mock("@/modules/map/panes/paneUtils");

Vue.use(Vuetify);

describe("Stop", () => {
  let mockStore, madrid, valencia;
  beforeEach(() => {
    mockStore = {
      dispatch: jest.fn(),
      state: {
        stations: cloneDeep(stations),
        trip: cloneDeep(trip),
        filters: cloneDeep(filters)
      },
      getters: {
        completeTrip: []
      }
    };
    valencia = fakeStation({ name: "valencia" });
    madrid = fakeStation({ name: "madrid" });
    filterStationsOutOfRange.mockReturnValue([]);
  });

  it("should show duration if stop has been selected", () => {
    mockStore.state.trip.savedTrip = [madrid, valencia];
    const stations = [valencia, madrid];
    const wrapper = shallowMount(Stop, {
      mocks: {
        $store: mockStore
      },
      propsData: {
        stations,
        stopNumber: 1
      }
    });
    expect(wrapper.find("[data-test-id=duration]").exists()).toBe(true);
    expect(wrapper.find("[data-test-id=duration]").text()).toContain(
      "mdi-clock-outline"
    );
    expect(wrapper.find("[data-test-id=duration]").text()).toContain(
      toHoursAndMinutes(valencia.duration)
    );
  });

  it("should not show duration if no stop has been selected", () => {
    mockStore.state.trip.savedTrip = [];
    const stations = [valencia, madrid];
    const wrapper = shallowMount(Stop, {
      mocks: {
        $store: mockStore
      },
      propsData: {
        stations,
        stopNumber: 1
      }
    });
    expect(wrapper.find("[data-test-id=duration]").exists()).toBe(false);
  });

  test("when stop changes, should updated selected stop in store", () => {
    const wrapper = shallowMount(Stop, {
      mocks: {
        $store: mockStore
      },
      propsData: {
        stations: []
      }
    });
    wrapper.find("[data-test-id=stop").vm.$emit("change", madrid);
    expect(mockStore.dispatch).toHaveBeenCalledWith("selectStop", madrid);
  });

  it("should use filtered stations as items prop in autocomplete if last stop", () => {
    const stations = [valencia, madrid];
    mockStore.state.trip.stops = [{}, {}];
    filterStationsOutOfRange.mockReturnValue([valencia]);

    const wrapper = shallowMount(Stop, {
      mocks: {
        $store: mockStore
      },
      propsData: {
        stations: stations,
        fixedStop: valencia,
        stopNumber: 2
      }
    });

    expect(wrapper.find("[data-test-id=stop]").props().items).toEqual(
      mapStationsByDuration([valencia])
    );
  });

  it("should use unfiltered stations as items prop in autocomplete if not last stop", () => {
    const stations = [valencia, madrid];
    mockStore.state.trip.stops = [{}, {}];
    filterStationsOutOfRange.mockReturnValue([valencia]);

    const wrapper = shallowMount(Stop, {
      mocks: {
        $store: mockStore
      },
      propsData: {
        stations: stations,
        fixedStop: valencia,
        stopNumber: 1
      }
    });

    expect(wrapper.find("[data-test-id=stop]").props().items).toEqual(
      mapStationsByDuration(stations)
    );
  });

  it("should set value of stop from correct stop in savedTrip", () => {
    mockStore.state.trip.savedTrip = [madrid, valencia];

    const wrapper = shallowMount(Stop, {
      mocks: {
        $store: mockStore
      },
      propsData: {
        stations: [valencia, madrid],
        stopNumber: 1
      }
    });
    expect(wrapper.find("[data-test-id=stop]").props().value).toEqual({
      text: valencia.name,
      value: { ...valencia, duration: toHoursAndMinutes(valencia.duration) }
    });
  });

  it("should have value null if there are no stations in the store", () => {
    const wrapper = shallowMount(Stop, {
      mocks: {
        $store: mockStore
      },
      propsData: {
        stations: [valencia, madrid]
      }
    });
    expect(wrapper.find("[data-test-id=stop]").props().value).toBeNull();
  });

  it("should have readonly property set from the prop", () => {
    const wrapper = shallowMount(Stop, {
      mocks: {
        $store: mockStore
      },
      propsData: {
        stations: [],
        readOnly: true
      }
    });
    expect(wrapper.find("[data-test-id=stop]").props().readonly).toEqual(true);
  });

  it("should set autofocus if last stop in form", () => {
    mockStore.state.trip.stops = [{}, {}, {}];
    const wrapper = shallowMount(Stop, {
      mocks: {
        $store: mockStore
      },
      propsData: {
        stations: [],
        stopNumber: 3
      }
    });
    expect(wrapper.find("[data-test-id=stop]").props().autofocus).toBe(true);
    wrapper.setProps({ stopNumber: 2 });
    expect(wrapper.find("[data-test-id=stop]").props().autofocus).toBe(false);
  });

  it("should appear closeable icon if last stop in form", () => {
    mockStore.state.trip.stops = [{}, {}, {}];
    const wrapper = shallowMount(Stop, {
      mocks: {
        $store: mockStore
      },
      propsData: {
        stations: [],
        stopNumber: 3
      }
    });
    expect(wrapper.find("[data-test-id=stop]").props().appendOuterIcon).toBe(
      "mdi-close"
    );
    wrapper.setProps({ stopNumber: 2 });
    expect(wrapper.find("[data-test-id=stop]").props().appendOuterIcon).toBe(
      ""
    );
  });

  it("should dispatch removeStop action when click cross", () => {
    mockStore.state.trip.stops = [{}, {}, {}];
    mockStore.state.trip.savedTrip = [{}, {}, {}];
    const wrapper = mount(Stop, {
      vuetify: new Vuetify(),
      mocks: {
        $store: mockStore
      },
      propsData: {
        stations: [],
        stopNumber: 3
      }
    });
    wrapper.find(".mdi-close").trigger("click");
    expect(mockStore.dispatch).toHaveBeenCalledWith("removeStop");
  });

  it("should dispatch removeStopAndFetchConnections action when stop before has no connections", () => {
    mockStore.state.trip.stops = [{}, { fixed: true }, {}];
    mockStore.state.trip.savedTrip = [{}, {}, {}];
    const wrapper = mount(Stop, {
      vuetify: new Vuetify(),
      mocks: {
        $store: mockStore
      },
      propsData: {
        stations: [],
        stopNumber: 3
      }
    });
    wrapper.find(".mdi-close").trigger("click");
    expect(mockStore.dispatch).toHaveBeenCalledWith(
      "removeStopAndFetchConnections"
    );
  });

  it("should dispatch remove resetTrip action when click cross only one station in trip", () => {
    mockStore.state.trip.stops = [{}, {}, {}];
    mockStore.state.trip.savedTrip = [{}];
    const wrapper = mount(Stop, {
      vuetify: new Vuetify(),
      mocks: {
        $store: mockStore
      },
      propsData: {
        stations: [],
        stopNumber: 3
      }
    });
    wrapper.find(".mdi-close").trigger("click");
    expect(mockStore.dispatch).toHaveBeenCalledWith("resetTrip");
  });
});
