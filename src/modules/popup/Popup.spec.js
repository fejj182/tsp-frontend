import { shallowMount, mount } from "@vue/test-utils";
import Popup from "./Popup.vue";
import faker from "faker";
import Vue from "vue";
import Vuetify from "vuetify";

Vue.use(Vuetify);

describe("Popup", () => {
  let station, mockMarker;
  beforeEach(() => {
    mockMarker = {
      bindPopup: jest.fn()
    };
    station = { name: faker.address.city() };
  });
  it("should bind popup to marker on mount", () => {
    const wrapper = shallowMount(Popup, {
      propsData: {
        marker: mockMarker,
        station
      }
    });
    const popup = wrapper.find("[data-test-id=popup]");
    expect(mockMarker.bindPopup).toHaveBeenCalledWith(
      popup.element,
      expect.any(Object)
    );
  });

  it("should have station name as an h1", () => {
    const wrapper = shallowMount(Popup, {
      propsData: {
        marker: mockMarker,
        station
      }
    });
    expect(wrapper.find("h1").text()).toBe(station.name);
  });

  it("should auto-open popup if is active", () => {
    const mockPopup = { openPopup: jest.fn() };
    mockMarker.bindPopup.mockReturnValue(mockPopup);
    shallowMount(Popup, {
      propsData: {
        marker: mockMarker,
        station,
        isActive: true
      }
    });
    expect(mockPopup.openPopup).toHaveBeenCalled();
  });

  it("should bind popup if marker prop changes", () => {
    const wrapper = shallowMount(Popup, {
      propsData: {
        marker: mockMarker,
        station
      }
    });
    const popup = wrapper.find("[data-test-id=popup]");
    const newMarker = { bindPopup: jest.fn() };
    wrapper.setProps({ marker: newMarker });
    expect(newMarker.bindPopup).toHaveBeenCalledWith(
      popup.element,
      expect.any(Object)
    );
  });

  it("should not show button to add station to trip", () => {
    const wrapper = shallowMount(Popup, {
      propsData: {
        marker: mockMarker,
        station
      }
    });
    expect(wrapper.find("[data-test-id=add-to-station]").exists()).toBe(false);
  });

  describe("Connections", () => {
    it("should show button to add station to trip", () => {
      const wrapper = shallowMount(Popup, {
        propsData: {
          marker: mockMarker,
          station,
          isConnection: true
        }
      });
      expect(wrapper.find("[data-test-id=add-to-station]").exists()).toBe(true);
    });

    it("should dispatch addStationToTrip when button is clicked", () => {
      const wrapper = mount(Popup, {
        mocks: {
          $store: {
            dispatch: jest.fn()
          }
        },
        propsData: {
          marker: mockMarker,
          station,
          isConnection: true
        }
      });
      wrapper.find("[data-test-id=add-to-station]").trigger("click");
      expect(wrapper.vm.$store.dispatch).toHaveBeenCalledWith(
        "addStationToTrip",
        station
      );
    });
  });
});
