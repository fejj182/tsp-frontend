import { shallowMount, mount } from "@vue/test-utils";
import Vue from "vue";
import Vuetify from "vuetify";
import Welcome from "./Welcome";
import StartingDestination from "@/modules/trip-panel/trip-form/inputs/StartingDestination";
import MaxJourneyTime from "@/modules/trip-panel/trip-form/inputs/MaxJourneyTime";

Vue.use(Vuetify);

describe("Welcome", () => {
  let mockStore;
  beforeEach(() => {
    jest.resetAllMocks();
    mockStore = {
      dispatch: jest.fn()
    };
  });

  it("should fetch starting stations", () => {
    shallowMount(Welcome, {
      mocks: {
        $store: mockStore
      }
    });
    expect(mockStore.dispatch).toHaveBeenCalledWith("fetchStartingStations");
  });

  it("should contain StartingDestination", () => {
    const wrapper = shallowMount(Welcome, {
      mocks: {
        $store: mockStore
      }
    });
    expect(wrapper.find(StartingDestination).exists()).toBe(true);
  });

  it("should contain MaxJourneyTime", () => {
    const wrapper = shallowMount(Welcome, {
      mocks: {
        $store: mockStore
      }
    });
    expect(wrapper.find(MaxJourneyTime).exists()).toBe(true);
  });

  it("should contain submit button", () => {
    const wrapper = shallowMount(Welcome, {
      mocks: {
        $store: mockStore
      }
    });
    expect(wrapper.find("#find-destinations-btn").exists()).toBe(true);
  });

  it("should contain title", () => {
    const wrapper = shallowMount(Welcome, {
      mocks: {
        $store: mockStore
      }
    });
    expect(wrapper.find("[data-test-id=welcome-title]").exists()).toBe(true);
  });

  it("should use mobile background image", () => {
    window.innerWidth = 500;
    const mobileMockRequire = jest.fn();
    const mobileSpy = jest.mock(
      "@/assets/onur-k-D5Plb33eKZc-unsplash.jpg",
      mobileMockRequire,
      {
        virtual: true
      }
    );
    const desktopMockRequire = jest.fn();
    const desktopspy = jest.mock(
      "@/assets/charles-forerunner-gapYVvUg1M8-unsplash.jpg",
      desktopMockRequire,
      {
        virtual: true
      }
    );

    const wrapper = shallowMount(Welcome, {
      mocks: {
        $store: mockStore
      }
    });

    expect(mobileMockRequire).toBeCalled();
    expect(desktopMockRequire).not.toBeCalled();
  });

  it("should use desktop background image", () => {
    window.innerWidth = 1000;
    const mobileMockRequire = jest.fn();
    const mobileSpy = jest.mock(
      "@/assets/onur-k-D5Plb33eKZc-unsplash.jpg",
      mobileMockRequire,
      {
        virtual: true
      }
    );
    const desktopMockRequire = jest.fn();
    const spy = jest.mock(
      "@/assets/charles-forerunner-gapYVvUg1M8-unsplash.jpg",
      desktopMockRequire,
      {
        virtual: true
      }
    );

    shallowMount(Welcome, {
      mocks: {
        $store: mockStore
      }
    });

    expect(mobileMockRequire).not.toBeCalled();
    expect(desktopMockRequire).toBeCalled();
  });

  describe("submit button", () => {
    let mockRouter, mockStubs, mockStore, mockDispatch, mockStartingStation;

    beforeEach(() => {
      mockRouter = { push: jest.fn() };
      mockStubs = {
        StartingDestination: {
          name: "StartingDestination",
          template: "<span></span>"
        },
        MaxJourneyTime: {
          name: "MaxJourneyTime",
          template: "<span></span>"
        }
      };
      mockDispatch = jest.fn();
      mockStartingStation = {};
      mockStore = {
        dispatch: mockDispatch,
        state: {
          trip: {
            startingStation: mockStartingStation
          }
        }
      };
    });
    it("should dispatch startTrip action when startingStation is in the store", () => {
      const wrapper = mount(Welcome, {
        mocks: {
          $store: mockStore,
          $router: mockRouter
        },
        stubs: mockStubs
      });
      wrapper.find("#find-destinations-btn").trigger("submit");
      expect(mockDispatch).toHaveBeenCalledWith(
        "startTrip",
        mockStartingStation
      );
    });

    it("should push new url to router", () => {
      const wrapper = mount(Welcome, {
        mocks: {
          $router: mockRouter,
          $store: mockStore
        },
        stubs: mockStubs
      });
      wrapper.find("#find-destinations-btn").trigger("submit");
      expect(mockRouter.push).toHaveBeenCalledWith("/planner");
    });

    it("should validate the form", () => {
      const mockValidate = jest.fn();
      const wrapper = mount(Welcome, {
        mocks: {
          $router: mockRouter,
          $store: mockStore
        },
        stubs: mockStubs
      });
      wrapper.vm.$refs.form.validate = mockValidate;
      wrapper.find("#find-destinations-btn").trigger("submit");
      expect(mockValidate).toHaveBeenCalled();
    });

    it("should not dispatch or push if station has not been set", () => {
      mockStore.state.trip.startingStation = null;
      const wrapper = mount(Welcome, {
        mocks: {
          $router: mockRouter,
          $store: mockStore
        },
        stubs: mockStubs
      });
      wrapper.find("#find-destinations-btn").trigger("submit");
      expect(mockDispatch).not.toHaveBeenCalledWith(
        "startTrip",
        expect.any(Object)
      );
      expect(mockRouter.push).not.toHaveBeenCalled();
    });

    it("should change startingStation on emitting event", () => {
      mockStore.state.trip.startingStation = null;
      const mockStartingStation = {};
      const wrapper = shallowMount(Welcome, {
        mocks: {
          $router: mockRouter,
          $store: mockStore
        }
      });
      wrapper.vm.$refs.form.validate = jest.fn();
      wrapper
        .find(StartingDestination)
        .vm.$emit("change-station", mockStartingStation);
      wrapper.vm.onSubmit();
      expect(mockDispatch).toHaveBeenCalledWith(
        "startTrip",
        mockStartingStation
      );
    });
  });
});
