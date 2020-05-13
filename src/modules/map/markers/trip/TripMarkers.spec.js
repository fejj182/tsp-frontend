import { shallowMount } from "@vue/test-utils";
import TripMarkers from "./TripMarkers";
import TripMarker from "./TripMarker";
import { fakeStation } from "@/helpers/tests";

describe("TripMarkers", () => {
  let mockStore;
  beforeEach(() => {
    mockStore = {
      getters: {
        completeTrip: []
      }
    };
  });

  it("should contain as many markers as stations in the tip", () => {
    const firstStation = fakeStation();
    mockStore.getters.completeTrip = [firstStation, fakeStation()];
    const wrapper = shallowMount(TripMarkers, {
      mocks: {
        $store: mockStore
      }
    });
    expect(wrapper.findAll(TripMarker).length).toBe(2);
  });
});
