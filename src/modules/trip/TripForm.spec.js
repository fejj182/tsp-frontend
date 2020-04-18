import { shallowMount, mount } from "@vue/test-utils";
import Vue from "vue";
import Vuetify from "vuetify";
import _ from "lodash";

import TripForm from "./TripForm.vue";
import tripApi from "@/api/trip";
import StartingDestination from "@/modules/trip/inputs/StartingDestination.vue";
import Stop from "@/modules/trip/inputs/Stop.vue";
import { fakeStation } from "@/helpers/tests";
import { state as trip } from "@/store/modules/trip";
import { state as stations } from "@/store/modules/stations";
import flushPromises from "flush-promises";

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
        stations: _.cloneDeep(stations),
        trip: _.cloneDeep(trip)
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
      }
    };
  });

  describe("StartingDestination", () => {
    it("should have no stations if api call fails", () => {
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
      expect(wrapper.find("[data-test-id=alert]").exists()).toBe(false);
      wrapper.find(StartingDestination).vm.$emit("alert");
      Vue.nextTick(() => {
        expect(wrapper.find("[data-test-id=alert]").exists()).toBe(true);
      });
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
    describe("Add stop button", () => {
      it("add should not exist when component loads", () => {
        const wrapper = shallowMount(TripForm, {
          mocks: {
            $store: mockStore,
            $router: mockRouter,
            $route: mockRoute
          }
        });
        expect(wrapper.find("[data-test-id=add-stop]").exists()).toBe(false);
      });

      it("should dispatch confirmStop action onClick", () => {
        mockStore.state.trip.selectedStop = barcelona;
        mockStore.getters.hasStops = true;
        const wrapper = mount(TripForm, {
          mocks: {
            $store: mockStore,
            $router: mockRouter,
            $route: mockRoute
          },
          stubs: mockStubs
        });
        wrapper.find("[data-test-id=add-stop]").trigger("click");
        expect(mockStore.dispatch).toBeCalledWith("confirmStop", barcelona);
      });

      it("should not dispatch action if selectedStop is null", () => {
        mockStore.state.trip.selectedStop = null;
        mockStore.getters.hasStops = true;
        const wrapper = mount(TripForm, {
          mocks: {
            $store: mockStore,
            $router: mockRouter,
            $route: mockRoute
          },
          stubs: mockStubs
        });
        wrapper.find("[data-test-id=add-stop]").trigger("click");
        expect(mockStore.dispatch).not.toBeCalledWith("confirmStop", null);
      });

      it("should show invalid alert if selectedStop is null", () => {
        mockStore.state.trip.selectedStop = null;
        mockStore.getters.hasStops = true;
        const wrapper = mount(TripForm, {
          mocks: {
            $store: mockStore,
            $router: mockRouter,
            $route: mockRoute
          },
          stubs: mockStubs
        });
        expect(wrapper.find("[data-test-id=invalid]").exists()).toBe(false);
        wrapper.find("[data-test-id=add-stop]").trigger("click");
        expect(wrapper.find("[data-test-id=invalid]").exists()).toBe(true);
      });
    });

    describe("Reset trip", () => {
      let wrapper;
      beforeEach(() => {
        wrapper = mount(TripForm, {
          mocks: {
            $store: mockStore,
            $router: mockRouter,
            $route: mockRoute
          },
          stubs: mockStubs
        });
      });

      it("reset should not exist when component loads", () => {
        expect(wrapper.find("[data-test-id=reset-trip]").exists()).toBe(false);
      });

      it("should reset form", () => {
        mockStore.getters.hasStops = true;
        wrapper.find("[data-test-id=reset-trip]").trigger("click");
        expect(mockReset).toHaveBeenCalled();
      });

      it("should dispatch resetTrip action", () => {
        mockStore.getters.hasStops = true;
        wrapper.find("[data-test-id=reset-trip]").trigger("click");
        expect(mockStore.dispatch).toHaveBeenCalledWith("resetTrip");
      });
    });

    describe("Submit", () => {
      let mockStubs;
      beforeEach(() => {
        mockStubs = {
          StartingDestination: {
            name: "StartingDestination",
            template: "<span></span>"
          },
          Stop: {
            name: "Stop",
            template: "<span></span>"
          },
          VFadeTransition: {
            name: "v-fade-transition",
            template: "<span></span>"
          },
          VAlert: {
            name: "v-alert",
            template: "<span></span>"
          }
        };
      });
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
          wrapper.find("[data-test-id=save-trip]").trigger("submit");
          expect(tripApi.create).toHaveBeenCalledWith(
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
          wrapper.find("[data-test-id=save-trip]").trigger("submit");
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
          wrapper.find("[data-test-id=save-trip]").trigger("submit");
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
          wrapper.find("[data-test-id=save-trip]").trigger("submit");
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
          wrapper.find("[data-test-id=save-trip]").trigger("submit");
          await flushPromises();
          expect(wrapper.find("[data-test-id=success-updated]").exists()).toBe(
            true
          );
        });
      });
    });
  });
});
