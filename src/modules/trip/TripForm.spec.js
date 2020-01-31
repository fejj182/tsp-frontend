import { shallowMount, mount } from "@vue/test-utils";
import Vue from "vue";
import Vuetify from "vuetify";
import _ from "lodash";

import TripForm from "./TripForm.vue";
import tripApi from "@/api/trip";
import FirstStop from "@/modules/trip/inputs/FirstStop.vue";
import Stop from "@/modules/trip/inputs/Stop.vue";
import { fakeStation } from "@/helpers/tests";
import { state as trip } from "@/store/modules/trip";
import { state as stations } from "@/store/modules/stations";

jest.mock("@/api/stations");
jest.mock("@/api/trip");

Vue.use(Vuetify);

describe("TripForm", () => {
  let mockStore, barcelona, valencia, madrid, mockStations;

  beforeEach(() => {
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
        hasStops: false
      }
    };
  });

  describe("FirstStop", () => {
    it("should have no stations if api call fails", async () => {
      const wrapper = shallowMount(TripForm, {
        mocks: {
          $store: mockStore
        }
      });
      expect(wrapper.find("[data-test-id=alert]").exists()).toBe(false);
      wrapper.find(FirstStop).vm.$emit("alert");
      expect(wrapper.find("[data-test-id=alert]").exists()).toBe(true);
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
  });

  describe("Multi destinations", () => {
    it("should show 1 input when there is 1 stop in the store", async () => {
      mockStore.state.trip.stops = [{ stations: mockStations }];
      const wrapper = shallowMount(TripForm, {
        mocks: {
          $store: mockStore
        }
      });
      expect(wrapper.findAll(".stop").length).toBe(1);
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
      expect(wrapper.findAll(".stop").length).toBe(3);
    });
  });

  describe("Buttons", () => {
    describe("Add destination button", () => {
      it("add should not exist when component loads", () => {
        const wrapper = shallowMount(TripForm, {
          mocks: {
            $store: mockStore
          }
        });
        expect(wrapper.find("[data-test-id=add-stop]").exists()).toBe(
          false
        );
      });

      it("should dispatch confirmStop action onClick", () => {
        mockStore.state.trip.selectedStop = barcelona;
        mockStore.getters.hasStops = true;
        const wrapper = mount(TripForm, {
          mocks: {
            $store: mockStore
          },
          stubs: {
            FirstStop: {
              name: "FirstStop",
              template: "<span></span>"
            },
            Stop: {
              name: "Stop",
              template: "<span></span>"
            },
            VFadeTransition: {
              name: "v-fade-transition",
              template: "<span></span>"
            }
          }
        });
        wrapper.find("[data-test-id=add-stop]").trigger("click");
        expect(mockStore.dispatch).toBeCalledWith("confirmStop", barcelona);
      });
    });

    describe("Reset trip", () => {
      let wrapper, mockReset;
      beforeEach(() => {
        mockReset = jest.fn();
        wrapper = mount(TripForm, {
          mocks: {
            $store: mockStore
          },
          stubs: {
            FirstStop: {
              name: "FirstStop",
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
            VFadeTransition: {
              name: "v-fade-transition",
              template: "<span></span>"
            }
          }
        });
      });

      it("reset should not exist when component loads", () => {
        const wrapper = shallowMount(TripForm, {
          mocks: {
            $store: mockStore
          }
        });
        expect(wrapper.find("[data-test-id=reset-trip]").exists()).toBe(false);
      });

      it("should reset form", () => {
        mockStore.getters.hasStops = true;
        wrapper.find("[data-test-id=reset-trip]").trigger("click");
        expect(mockReset).toHaveBeenCalled();
      });

      it("should dispatch resetTripForm action", () => {
        mockStore.getters.hasStops = true;
        wrapper.find("[data-test-id=reset-trip]").trigger("click");
        expect(mockStore.dispatch).toHaveBeenCalledWith("resetTripForm");
      });
    });

    describe("Save trip", () => {
      it("save should not exist when component loads", () => {
        const wrapper = shallowMount(TripForm, {
          mocks: {
            $store: mockStore
          }
        });
        expect(wrapper.find("[data-test-id=save-trip]").exists()).toBe(false);
      });

      it("should call create in tripApi", () => {
        mockStore.getters.hasStops = true;
        const wrapper = mount(TripForm, {
          mocks: {
            $store: mockStore
          },
          stubs: {
            FirstStop: {
              name: "FirstStop",
              template: "<span></span>"
            },
            Stop: {
              name: "Stop",
              template: "<span></span>"
            },
            VFadeTransition: {
              name: "v-fade-transition",
              template: "<span></span>"
            }
          }
        });
        wrapper.find("[data-test-id=save-trip]").trigger("submit");
        expect(tripApi.create).toHaveBeenCalledWith(wrapper.vm.trip);
      });
    });
  });
});
