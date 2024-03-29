import { shallowMount } from "@vue/test-utils";
import Lines from "./Lines.vue";
import CoordLine from "./CoordLine.vue";
import { fakeStation } from "@/helpers/tests";

describe("Lines", () => {
  let mockStore, mockState;
  beforeEach(() => {
    mockState = {
      trip: {
        selectedStop: null
      }
    };
    mockStore = {
      getters: {
        completeTrip: []
      },
      state: mockState
    };
  });

  describe("CoordLines", () => {
    it("should contain 1 line if there are 2 stops in trip", () => {
      const firstStation = fakeStation();
      const secondStation = fakeStation();
      mockStore.getters.completeTrip = [firstStation, secondStation];
      const wrapper = shallowMount(Lines, {
        mocks: {
          $store: mockStore
        }
      });
      expect(wrapper.findAll(CoordLine).length).toBe(1);
      expect(wrapper.find(CoordLine).props().coordSet).toEqual([
        [firstStation.lng, firstStation.lat],
        [secondStation.lng, secondStation.lat]
      ]);
    });

    it("should contain 2 lines if there are 3 stops in trip", () => {
      mockStore.getters.completeTrip = [
        fakeStation(),
        fakeStation(),
        fakeStation()
      ];
      const wrapper = shallowMount(Lines, {
        mocks: {
          $store: mockStore
        }
      });
      expect(wrapper.findAll(CoordLine).length).toBe(2);
    });

    it("should have time to wait equal to zero when adding new stop", () => {
      mockStore.getters.completeTrip = [
        fakeStation(),
        fakeStation(),
        fakeStation()
      ];
      const wrapper = shallowMount(Lines, {
        mocks: {
          $store: mockStore
        }
      });
      expect(wrapper.find(CoordLine).props().waitingTimeBeforeCreation).toBe(0);
    });

    it("should have time to wait when last stop is updated", () => {
      mockStore.getters.completeTrip = [
        fakeStation(),
        fakeStation(),
        fakeStation()
      ];
      const wrapper = shallowMount(Lines, {
        propsData: {
          waitingTimeInSeconds: 1
        },
        mocks: {
          $store: mockStore
        }
      });
      mockStore.state.trip.selectedStop = [{ name: "Barcelona" }];
      expect(wrapper.find(CoordLine).props().waitingTimeBeforeCreation).toBe(
        1000
      );
    });
  });
});
