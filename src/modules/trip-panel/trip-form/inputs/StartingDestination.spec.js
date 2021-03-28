import { shallowMount, mount } from "@vue/test-utils";
import Vue from "vue";
import Vuetify from "vuetify";
import cloneDeep from "lodash/cloneDeep";

import StartingDestination from "./StartingDestination.vue";
import { mapStations } from "@/mappers/stationFormMapper";
import { fakeStation } from "@/helpers/tests";
import { state as trip } from "@/store/modules/trip";

jest.mock("@/api/stations");

Vue.use(Vuetify);

describe("StartingDestination", () => {
  let enabledStations, station, mockStore, mockRoute;
  beforeEach(() => {
    jest.resetAllMocks();
    station = fakeStation();
    enabledStations = [fakeStation(), fakeStation(), fakeStation()];
    mockStore = {
      dispatch: jest.fn(),
      state: {
        trip: cloneDeep(trip),
        stations: {
          startingStations: []
        }
      },
      getters: {
        getStationsByCountries: countries => {
          return enabledStations;
        }
      }
    };
    mockRoute = {
      name: "name"
    };
  });
  describe("Autocomplete items", () => {
    it("should load stations", async () => {
      mockStore.state.stations.startingStations = enabledStations;
      const wrapper = shallowMount(StartingDestination, {
        mocks: {
          $store: mockStore,
          $route: mockRoute
        }
      });
      const mappedStations = mapStations(enabledStations);
      expect(
        wrapper.find("[data-test-id=starting-destination]").props().items
      ).toEqual(mappedStations);
    });

    it("should load starting station first", async () => {
      mockStore.state.trip.startingStation = station;
      const wrapper = shallowMount(StartingDestination, {
        mocks: {
          $store: mockStore,
          $route: mockRoute
        }
      });
      expect(
        wrapper.find("[data-test-id=starting-destination]").props().value
      ).toEqual(station);
    });

    it("should get stations by selected countries ", async () => {
      const selectedCountries = ["ES", "FR"];
      const getStationsByCountries = jest.fn();
      getStationsByCountries.mockReturnValue(enabledStations);
      mockStore.getters.getStationsByCountries = getStationsByCountries;

      shallowMount(StartingDestination, {
        data() {
          return {
            selectedCountries
          };
        },
        mocks: {
          $store: mockStore,
          $route: mockRoute
        }
      });

      expect(getStationsByCountries).toHaveBeenCalledWith(selectedCountries);
    });

    it("should create country categories from stations", () => {
      const fr = fakeStation({ country: "FR" });
      const es = fakeStation({ country: "ES" });
      const es2 = fakeStation({ country: "ES" });

      mockStore.state.stations.startingStations = [fr, es, es2];
      const wrapper = mount(StartingDestination, {
        vuetify: new Vuetify(),
        mocks: {
          $store: mockStore,
          $route: mockRoute
        }
      });
      expect(wrapper.vm.countries).toEqual(["FR", "ES"]);
    });
  });

  describe("Toggling countries", () => {
    it("should clear selected station if not included in list of selected countries", () => {
      const station = fakeStation({ country: "PT" });
      const wrapper = shallowMount(StartingDestination, {
        mocks: {
          $store: mockStore,
          $route: mockRoute
        },
        data() {
          return {
            selectedStation: station,
            selectedCountries: ["ES", "FR"]
          };
        }
      });

      expect(
        wrapper.find("[data-test-id=starting-destination]").props().value
      ).toBe(station);

      wrapper.vm.clearSelectedStationIfNotInSelectedCountries();

      expect(
        wrapper.find("[data-test-id=starting-destination]").props().value
      ).toBe(null);
    });

    it("should not clear selected station if included in list of selected countries", () => {
      const station = fakeStation({ country: "ES" });
      const wrapper = shallowMount(StartingDestination, {
        mocks: {
          $store: mockStore,
          $route: mockRoute
        },
        data() {
          return {
            selectedStation: station,
            selectedCountries: ["ES", "FR"]
          };
        }
      });

      expect(
        wrapper.find("[data-test-id=starting-destination]").props().value
      ).toBe(station);

      wrapper.vm.clearSelectedStationIfNotInSelectedCountries();

      expect(
        wrapper.find("[data-test-id=starting-destination]").props().value
      ).toBe(station);
    });
  });

  describe("On change", () => {
    it("should emit change-station event if route name is welcome", async done => {
      mockRoute.name = "welcome";
      const wrapper = shallowMount(StartingDestination, {
        mocks: {
          $store: mockStore,
          $router: {
            push: jest.fn()
          },
          $route: mockRoute
        }
      });
      wrapper
        .find("[data-test-id=starting-destination]")
        .vm.$emit("change", station);

      Vue.nextTick(() => {
        expect(wrapper.emitted()["change-station"][0]).toEqual([station]);
        done();
      });
    });

    it("should dispatch startTrip on change if route is not welcome", () => {
      mockRoute.name = "notWelcome";
      const wrapper = shallowMount(StartingDestination, {
        mocks: {
          $store: mockStore,
          $router: {
            push: jest.fn()
          },
          $route: mockRoute
        }
      });
      wrapper
        .find("[data-test-id=starting-destination]")
        .vm.$emit("change", station);
      expect(mockStore.dispatch).toBeCalledWith("startTrip", station);
    });

    it("should not dispatch startTrip on change if route is not welcome and station is null", () => {
      mockRoute.name = "notWelcome";
      const wrapper = shallowMount(StartingDestination, {
        mocks: {
          $store: mockStore,
          $router: {
            push: jest.fn()
          },
          $route: mockRoute
        }
      });
      wrapper
        .find("[data-test-id=starting-destination]")
        .vm.$emit("change", null);
      expect(mockStore.dispatch).not.toBeCalledWith("startTrip", station);
    });
  });

  describe("inner icon", () => {
    it("should be present on welcome route", () => {
      mockRoute.name = "welcome";
      const wrapper = shallowMount(StartingDestination, {
        mocks: {
          $store: mockStore,
          $route: mockRoute
        }
      });
      expect(
        wrapper.find("[data-test-id=starting-destination").props()
          .prependInnerIcon
      ).toBe("mdi-train");
    });

    it("should not be present if not on welcome route", () => {
      mockRoute.name = "notwelcome";
      const wrapper = shallowMount(StartingDestination, {
        mocks: {
          $store: mockStore,
          $route: mockRoute
        }
      });
      expect(
        wrapper.find("[data-test-id=starting-destination").props()
          .prependInnerIcon
      ).toBe("");
    });
  });

  describe("validation rules", () => {
    it("should contain validation function if route is welcome", () => {
      mockRoute.name = "welcome";
      const wrapper = shallowMount(StartingDestination, {
        mocks: {
          $store: mockStore,
          $route: mockRoute
        }
      });
      const validationFunction = wrapper
        .find("[data-test-id=starting-destination]")
        .props().rules[0];
      expect(validationFunction(true)).toBe(true);
      expect(validationFunction(false)).toBe(false);
    });

    it("should contain empty array if route is not welcome", () => {
      mockRoute.name = "notwelcome";
      const wrapper = shallowMount(StartingDestination, {
        mocks: {
          $store: mockStore,
          $route: mockRoute
        }
      });
      expect(
        wrapper.find("[data-test-id=starting-destination]").props().rules.length
      ).toBe(0);
    });
  });
});
