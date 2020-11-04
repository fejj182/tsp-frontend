import { shallowMount, mount } from "@vue/test-utils";
import Vue from "vue";
import Vuetify from "vuetify";
import VueClipboard from "vue-clipboard2";
import cloneDeep from "lodash/cloneDeep";
import flushPromises from "flush-promises";

import TripForm from "./TripForm.vue";
import tripApi from "@/api/trip";
import StartingDestination from "@/modules/trip-panel/trip-form/inputs/StartingDestination.vue";
import Stop from "@/modules/trip-panel/trip-form/inputs/Stop.vue";
import { state as trip } from "@/store/modules/trip";
import { state as stations } from "@/store/modules/stations";
import { fakeStation } from "@/helpers/tests";
import { toHoursAndMinutes } from "@/mappers/durationMapper";

jest.mock("@/api/trip", () => ({
  create: jest.fn(),
  update: jest.fn()
}));

Vue.use(Vuetify);
Vue.use(VueClipboard);

describe("TripForm", () => {
  let mockStore,
    mockRouter,
    mockRoute,
    mockStubs,
    mockReset,
    barcelona,
    valencia,
    madrid,
    mockStations;

  beforeEach(() => {
    jest.resetAllMocks();

    barcelona = fakeStation("barcelona");
    valencia = fakeStation("valencia");
    madrid = fakeStation("madrid");

    mockStations = [valencia, madrid];

    mockStore = {
      dispatch: jest.fn(),
      state: {
        stations: cloneDeep(stations),
        trip: cloneDeep(trip)
      },
      getters: {
        hasStops: false,
        completeTrip: [{}, {}]
      }
    };

    mockRouter = {
      push: jest.fn()
    };

    mockRoute = {
      name: "home"
    };

    mockReset = jest.fn();

    mockStubs = {
      StartingDestination: {
        name: "StartingDestination",
        template: "<span></span>"
      },
      Stop: {
        name: "Stop",
        template: "<span></span>"
      },
      VForm: {
        name: "v-form",
        template: "<span><slot></slot></span>",
        methods: {
          reset: mockReset
        }
      },
      VAlert: {
        name: "v-alert",
        template: "<span></span>"
      },
      VFadeTransition: {
        name: "v-fade-transition",
        template: "<span></span>"
      },
      VMenu: {
        name: "v-menu",
        template: "<span><slot></slot> </span>"
      }
    };
  });

  describe("StartingDestination", () => {
    it("should be included", () => {
      mockStore.state.trip.startingStation = {};
      mockStore.state.stations.startingStations = [{}];
      const wrapper = shallowMount(TripForm, {
        mocks: {
          $store: mockStore,
          $router: mockRouter,
          $route: mockRoute
        },
        stubs: {
          VForm: {
            name: "v-form",
            template: "<span><slot></slot></span>"
          }
        }
      });
      expect(wrapper.find(StartingDestination).exists()).toBe(true);
    });
  });
  describe("Stops", () => {
    it("should appear if there are stops in the store", () => {
      const wrapper = shallowMount(TripForm, {
        mocks: {
          $store: mockStore,
          $router: mockRouter,
          $route: mockRoute
        }
      });
      expect(wrapper.find(Stop).exists()).toBe(false);
      mockStore.state.trip.stops = { 1: barcelona };
      expect(wrapper.find(Stop).exists()).toBe(true);
    });

    it("should pass stations as items", async () => {
      mockStore.state.trip.stops = { 1: { stations: mockStations } };
      const wrapper = shallowMount(TripForm, {
        mocks: {
          $store: mockStore,
          $router: mockRouter,
          $route: mockRoute
        }
      });
      expect(wrapper.find(Stop).props().stations).toEqual(mockStations);
    });

    it("should pass stop read-only prop", () => {
      mockStore.state.trip.stops = { 1: { readOnly: true } };
      const wrapper = shallowMount(TripForm, {
        mocks: {
          $store: mockStore,
          $router: mockRouter,
          $route: mockRoute
        }
      });

      expect(wrapper.find(Stop).props().readOnly).toBe(true);
    });

    it("should pass fixedStop", () => {
      const mockStops = [{ fixed: {} }];
      mockStore.state.trip.stops = mockStops;
      const wrapper = shallowMount(TripForm, {
        mocks: {
          $store: mockStore,
          $router: mockRouter,
          $route: mockRoute
        }
      });

      expect(wrapper.find(Stop).props().fixedStop).toEqual({});
    });

    it("should pass stop number", () => {
      const mockStops = [{ fixed: {} }];
      mockStore.state.trip.stops = mockStops;
      const wrapper = shallowMount(TripForm, {
        mocks: {
          $store: mockStore,
          $router: mockRouter,
          $route: mockRoute
        }
      });

      expect(wrapper.find(Stop).props().stopNumber).toEqual(1);
    });

    describe("Total duration between stops", () => {
      test("when no stops in trip, should not show total duration between stops", () => {
        const wrapper = shallowMount(TripForm, {
          mocks: {
            $store: mockStore,
            $route: mockRoute
          }
        });
        expect(wrapper.find("[data-test-id=total-duration]").exists()).toBe(
          false
        );
      });

      test("when three stops in trip, total duration should exist", () => {
        mockStore.getters.completeTrip = [barcelona, valencia, madrid];
        const wrapper = shallowMount(TripForm, {
          mocks: {
            $store: mockStore,
            $route: mockRoute
          }
        });
        const totalDuration =
          barcelona.duration + valencia.duration + madrid.duration;
        expect(wrapper.find("[data-test-id=total-duration]").exists()).toBe(
          true
        );
        expect(wrapper.find("[data-test-id=total-duration]").text()).toBe(
          "Total travel time: " + toHoursAndMinutes(totalDuration)
        );
      });

      test("when two stops in trip, total duration should not exist", () => {
        mockStore.state.trip.stops = [barcelona, valencia];
        const wrapper = shallowMount(TripForm, {
          mocks: {
            $store: mockStore,
            $route: mockRoute
          }
        });
        expect(wrapper.find("[data-test-id=total-duration]").exists()).toBe(
          false
        );
      });
    });
  });

  describe("Multi destinations", () => {
    it("should show 1 input when there is 1 stop in the store", async () => {
      mockStore.state.trip.stops = [{ stations: mockStations }];
      const wrapper = shallowMount(TripForm, {
        mocks: {
          $store: mockStore,
          $router: mockRouter,
          $route: mockRoute
        }
      });
      expect(wrapper.findAll(Stop).length).toBe(1);
    });

    it("should show 3 inputs when there is 3 stops in the store", async () => {
      mockStore.state.trip.stops = [
        { stations: mockStations },
        { stations: mockStations },
        { stations: mockStations }
      ];
      const wrapper = shallowMount(TripForm, {
        mocks: {
          $store: mockStore,
          $router: mockRouter,
          $route: mockRoute
        }
      });
      expect(wrapper.findAll(Stop).length).toBe(3);
    });
  });

  describe("Buttons", () => {
    describe("Reset trip", () => {
      let wrapper;
      beforeEach(() => {
        mockStore.getters.hasStops = true;
        mockRoute.name = "alias";
        wrapper = mount(TripForm, {
          mocks: {
            $store: mockStore,
            $router: mockRouter,
            $route: mockRoute
          },
          stubs: mockStubs
        });
      });

      it("reset should not exist if no stops in store", () => {
        mockStore.getters.hasStops = false;
        expect(wrapper.find("[data-test-id=reset-trip]").exists()).toBe(false);
      });

      it("should reset form", () => {
        wrapper.find("[data-test-id=reset-trip]").trigger("click");
        expect(mockReset).toHaveBeenCalled();
      });

      it("should dispatch resetTrip action", () => {
        wrapper.find("[data-test-id=reset-trip]").trigger("click");
        expect(mockStore.dispatch).toHaveBeenCalledWith("resetTrip");
      });

      it("should change url to home when on alias route", () => {
        mockRoute.name = "alias";
        wrapper = mount(TripForm, {
          mocks: {
            $store: mockStore,
            $router: mockRouter,
            $route: mockRoute
          },
          stubs: mockStubs
        });
        wrapper.find("[data-test-id=reset-trip]").trigger("click");
        expect(mockRouter.push).toHaveBeenCalledWith("/planner");
      });
    });

    describe("Submit", () => {
      describe("Save trip", () => {
        it("save should not exist when component loads", () => {
          const wrapper = mount(TripForm, {
            mocks: {
              $store: mockStore,
              $router: mockRouter,
              $route: mockRoute
            },
            stubs: mockStubs
          });
          expect(wrapper.find("[data-test-id=save-trip]").exists()).toBe(false);
        });

        it("should show save button", () => {
          mockStore.getters.hasStops = true;
          const wrapper = mount(TripForm, {
            mocks: {
              $store: mockStore,
              $router: mockRouter,
              $route: mockRoute
            },
            stubs: mockStubs
          });
          expect(wrapper.find("[data-test-id=save-trip]").text()).toBe(
            "Save for later"
          );
          expect(wrapper.find(".mdi-bookmark").exists()).toBe(true);
        });

        it("should call create in tripApi", () => {
          mockStore.getters.hasStops = true;
          const wrapper = mount(TripForm, {
            mocks: {
              $store: mockStore,
              $router: mockRouter,
              $route: mockRoute
            },
            stubs: mockStubs
          });
          wrapper.find("[data-test-id=save-trip]").trigger("click");
          expect(tripApi.create).toHaveBeenCalledWith(
            mockStore.getters.completeTrip
          );
        });

        it("should not create trip if less than two stops in trip", () => {
          mockStore.getters.hasStops = true;
          mockStore.getters.completeTrip = [{}];
          const wrapper = mount(TripForm, {
            mocks: {
              $store: mockStore,
              $router: mockRouter,
              $route: mockRoute
            },
            stubs: mockStubs
          });
          wrapper.find("[data-test-id=save-trip]").trigger("click");
          expect(tripApi.create).not.toHaveBeenCalledWith(
            mockStore.getters.completeTrip
          );
        });

        it("should show success if alias is returned from api call", async () => {
          mockStore.getters.hasStops = true;
          tripApi.create.mockReturnValue({ alias: "alias" });
          const wrapper = mount(TripForm, {
            mocks: {
              $store: mockStore,
              $router: mockRouter,
              $route: mockRoute
            },
            stubs: mockStubs
          });
          wrapper.find("[data-test-id=save-trip]").trigger("click");
          await flushPromises();
          expect(wrapper.find("[data-test-id=success-alias]").exists()).toBe(
            true
          );
        });

        it("should not show success if alias not returned from api call", () => {
          mockStore.getters.hasStops = true;
          tripApi.create.mockRejectedValue("error");
          const wrapper = mount(TripForm, {
            mocks: {
              $store: mockStore,
              $router: mockRouter,
              $route: mockRoute
            },
            stubs: mockStubs
          });
          expect(wrapper.find("[data-test-id=success-alias]").exists()).toBe(
            false
          );
        });

        it("should change URL of page with trip alias", async () => {
          mockStore.getters.hasStops = true;
          tripApi.create.mockReturnValue({ alias: "alias" });
          const wrapper = mount(TripForm, {
            mocks: {
              $store: mockStore,
              $router: mockRouter,
              $route: mockRoute
            },
            stubs: mockStubs
          });
          wrapper.find("[data-test-id=save-trip]").trigger("click");
          await flushPromises();
          expect(mockRouter.push).toHaveBeenCalledWith("trip/alias");
        });
      });

      describe("Update trip", () => {
        let mockRoute;
        beforeEach(() => {
          mockRoute = {
            name: "alias",
            params: {
              alias: "some-alias"
            }
          };
        });

        it("should call tripApi update if route name is alias", () => {
          mockStore.getters.hasStops = true;
          const wrapper = mount(TripForm, {
            mocks: {
              $store: mockStore,
              $router: mockRouter,
              $route: mockRoute
            },
            stubs: mockStubs
          });
          wrapper.find("[data-test-id=save-trip]").trigger("click");
          expect(tripApi.create).not.toHaveBeenCalledWith(
            mockStore.getters.completeTrip
          );
          expect(tripApi.update).toHaveBeenCalledWith(
            mockRoute.params.alias,
            mockStore.getters.completeTrip
          );
        });

        it("should show success if trip updated", async () => {
          mockStore.getters.hasStops = true;
          tripApi.update.mockReturnValue({});
          const wrapper = mount(TripForm, {
            mocks: {
              $store: mockStore,
              $router: mockRouter,
              $route: mockRoute
            },
            stubs: mockStubs
          });
          wrapper.find("[data-test-id=save-trip]").trigger("click");
          await flushPromises();
          expect(wrapper.find("[data-test-id=success-updated]").exists()).toBe(
            true
          );
        });
      });
    });
    describe("Copy button", () => {
      it("should appear only if trip has been saved", () => {
        mockStore.getters.hasStops = true;
        mockRoute.name = "alias";
        const wrapper = mount(TripForm, {
          mocks: {
            $store: mockStore,
            $router: mockRouter,
            $route: mockRoute
          },
          stubs: mockStubs
        });
        expect(wrapper.find("[data-test-id=copy-url]").exists()).toBe(true);
      });
      it("should not appear if trip has not been saved", () => {
        const wrapper = mount(TripForm, {
          mocks: {
            $store: mockStore,
            $router: mockRouter,
            $route: mockRoute
          },
          stubs: mockStubs
        });
        expect(wrapper.find("[data-test-id=copy-url]").exists()).toBe(false);
      });
    });
  });
});
