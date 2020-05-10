import { shallowMount } from "@vue/test-utils";
import Lines from "./Lines.vue";
import CoordLine from "./CoordLine.vue";
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

  describe("watch", () => {
    describe("trip", () => {
      it("should contain 1 Line if there are 2 stops in trip", () => {
        mockStore.state.trip.savedTrip = [fakeStation(), fakeStation()];
        const wrapper = shallowMount(Lines, {
          mocks: {
            $store: mockStore
          }
        });
        expect(wrapper.findAll(CoordLine).length).toBe(1);
      });
    });
  });
});
