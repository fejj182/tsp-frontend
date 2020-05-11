import { shallowMount } from "@vue/test-utils";
import Lines from "./Lines.vue";
import CoordLine from "./CoordLine.vue";
import TripMarker from "@/modules/map/markers/TripMarker";
import { fakeStation } from "@/helpers/tests";

describe("Lines", () => {
  let mockStore;
  beforeEach(() => {
    mockStore = {
      state: {
        trip: {
          savedTrip: []
        }
      }
    };
  });

  describe("CoordLines", () => {
    it("should contain 1 line if there are 2 stops in trip", () => {
      const firstStation = fakeStation();
      const secondStation = fakeStation();
      mockStore.state.trip.savedTrip = [firstStation, secondStation];
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
      mockStore.state.trip.savedTrip = [
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
  });

  describe("TripMarker", () => {
    it("should not contain any markers if only 1 station in trip", () => {
      mockStore.state.trip.savedTrip = [fakeStation()];
      const wrapper = shallowMount(Lines, {
        mocks: {
          $store: mockStore
        }
      });
      expect(wrapper.findAll(TripMarker).length).toBe(0);
    });

    it("should contain marker with first trip if there are 2 stops in the trip", () => {
      const firstStation = fakeStation();
      mockStore.state.trip.savedTrip = [firstStation, fakeStation()];
      const wrapper = shallowMount(Lines, {
        mocks: {
          $store: mockStore
        }
      });
      expect(wrapper.findAll(TripMarker).length).toBe(1);
      expect(wrapper.find(TripMarker).props().station).toEqual(firstStation);
      expect(wrapper.find(TripMarker).props().position).toEqual(1);
    });

    it("should contain marker with first and second station if there are 3 stops in the trip", () => {
      const firstStation = fakeStation();
      const secondStation = fakeStation();
      mockStore.state.trip.savedTrip = [
        firstStation,
        secondStation,
        fakeStation()
      ];
      const wrapper = shallowMount(Lines, {
        mocks: {
          $store: mockStore
        }
      });
      expect(wrapper.findAll(TripMarker).length).toBe(2);
      expect(
        wrapper
          .findAll(TripMarker)
          .at(0)
          .props().station
      ).toEqual(firstStation);
      expect(
        wrapper
          .findAll(TripMarker)
          .at(1)
          .props().station
      ).toEqual(secondStation);
    });
  });
});
