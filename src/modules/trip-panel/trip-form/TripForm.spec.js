import { shallowMount, mount } from "@vue/test-utils";
import Vue from "vue";
import Vuetify from "vuetify";
import cloneDeep from "lodash/cloneDeep";
import flushPromises from "flush-promises";

import TripForm from "./TripForm.vue";
import TripActions from "@/modules/trip-panel/trip-form/TripActions";
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
        template: "<span></span>"
      }
    };
  });

  describe("StartingDestination", () => {
    it("should be included", () => {
      mockStore.state.trip.startingStation = {};
      mockStore.state.stations.startingStations = [{}];
      const wrapper = shallowMount(TripForm, {
        mocks: {
          $store: mockStore
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
          $store: mockStore
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
          $store: mockStore
        }
      });
      expect(wrapper.find(Stop).props().stations).toEqual(mockStations);
    });

    it("should pass stop read-only prop", () => {
      mockStore.state.trip.stops = { 1: { readOnly: true } };
      const wrapper = shallowMount(TripForm, {
        mocks: {
          $store: mockStore
        }
      });

      expect(wrapper.find(Stop).props().readOnly).toBe(true);
    });

    it("should pass fixedStop", () => {
      const mockStops = [{ fixed: {} }];
      mockStore.state.trip.stops = mockStops;
      const wrapper = shallowMount(TripForm, {
        mocks: {
          $store: mockStore
        }
      });

      expect(wrapper.find(Stop).props().fixedStop).toEqual({});
    });

    it("should pass stop number", () => {
      const mockStops = [{ fixed: {} }];
      mockStore.state.trip.stops = mockStops;
      const wrapper = shallowMount(TripForm, {
        mocks: {
          $store: mockStore
        }
      });

      expect(wrapper.find(Stop).props().stopNumber).toEqual(1);
    });

    it("should propogate emitted event", () => {
      mockStore.state.trip.stops = [{}];
      const wrapper = shallowMount(TripForm, {
        mocks: {
          $store: mockStore
        }
      });
      wrapper.find(Stop).vm.$emit("scroll-form-to-bottom");
      expect(wrapper.emitted()["scroll-form-to-bottom"]).toBeTruthy();
    });

    describe("Total duration between stops", () => {
      test("when no stops in trip, should not show total duration between stops", () => {
        const wrapper = shallowMount(TripForm, {
          mocks: {
            $store: mockStore
          }
        });
        expect(wrapper.find("#total-duration").exists()).toBe(false);
      });

      test("when three stops in trip, total duration should exist", () => {
        mockStore.getters.completeTrip = [barcelona, valencia, madrid];
        const wrapper = shallowMount(TripForm, {
          mocks: {
            $store: mockStore
          }
        });
        const totalDuration =
          barcelona.duration + valencia.duration + madrid.duration;
        expect(wrapper.find("#total-duration").exists()).toBe(true);
        expect(wrapper.find("#total-duration").text()).toBe(
          "Total travel time: " + toHoursAndMinutes(totalDuration)
        );
      });

      test("when two stops in trip, total duration should not exist", () => {
        mockStore.state.trip.stops = [barcelona, valencia];
        const wrapper = shallowMount(TripForm, {
          mocks: {
            $store: mockStore
          }
        });
        expect(wrapper.find("#total-duration").exists()).toBe(false);
      });
    });
  });

  describe("Multi destinations", () => {
    it("should show 1 input when there is 1 stop in the store", async () => {
      mockStore.state.trip.stops = [{ stations: mockStations }];
      const wrapper = shallowMount(TripForm, {
        mocks: {
          $store: mockStore
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
          $store: mockStore
        }
      });
      expect(wrapper.findAll(Stop).length).toBe(3);
    });
  });
  describe("TripActions", () => {
    it("should not exist by default", () => {
      const wrapper = shallowMount(TripForm, {
        mocks: {
          $store: mockStore
        }
      });
      expect(wrapper.find(TripActions).exists()).toBe(false);
    });

    it("should exist if stops are present", () => {
      mockStore.getters.hasStops = true;
      const wrapper = shallowMount(TripForm, {
        mocks: {
          $store: mockStore
        }
      });
      expect(wrapper.find(TripActions).exists()).toBe(true);
    });

    describe("events", () => {
      describe("reset", () => {
        it("should reset the form", () => {
          mockStore.getters.hasStops = true;
          const wrapper = mount(TripForm, {
            mocks: {
              $store: mockStore,
              $route: mockRoute,
              $router: mockRouter
            },
            stubs: mockStubs
          });
          wrapper.find(TripActions).vm.$emit("reset-trip");
          expect(mockReset).toHaveBeenCalled();
          expect(mockRouter.push).toHaveBeenCalledWith("/");
          expect(mockStore.dispatch).toBeCalledWith("resetTrip");
          expect(mockStore.dispatch).toBeCalledWith("resetFilters");
        });
      });

      describe("save", () => {
        it("should create the trip", () => {
          mockStore.getters.hasStops = true;
          const wrapper = mount(TripForm, {
            mocks: {
              $store: mockStore,
              $route: mockRoute,
              $router: mockRouter
            },
            stubs: mockStubs
          });

          wrapper.find(TripActions).vm.$emit("save-trip");
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
          wrapper.find(TripActions).vm.$emit("save-trip");
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
          wrapper.find(TripActions).vm.$emit("save-trip");
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
          wrapper.find(TripActions).vm.$emit("save-trip");
          await flushPromises();
          expect(mockRouter.push).toHaveBeenCalledWith("trip/alias");
        });
      });

      describe("update", () => {
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
          wrapper.find(TripActions).vm.$emit("save-trip");
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
          wrapper.find(TripActions).vm.$emit("save-trip");
          await flushPromises();
          expect(wrapper.find("[data-test-id=success-updated]").exists()).toBe(
            true
          );
        });
      });
      describe("Copy button", () => {
        it("success message should show", () => {
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
          wrapper.find(TripActions).vm.$emit("copy-success");
          expect(wrapper.find("[data-test-id=copy-success]").exists()).toBe(
            true
          );
          expect(wrapper.find("[data-test-id=copy-failure]").exists()).toBe(
            false
          );
        });
      });
      it("failure message should show", () => {
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
        wrapper.find(TripActions).vm.$emit("copy-failure");
        expect(wrapper.find("[data-test-id=copy-success]").exists()).toBe(
          false
        );
        expect(wrapper.find("[data-test-id=copy-failure]").exists()).toBe(true);
      });
    });
  });
});
