import { shallowMount } from "@vue/test-utils";
import StartInput from "./StartInput.vue";
import stationsApi from "@/api/stations";
import Vue from "vue";
import Vuetify from "vuetify";
import faker from "faker";
import flushPromises from "flush-promises";
import mapStation from "./stationFormMapper";

jest.mock("@/api/stations");

Vue.use(Vuetify);

describe("StartInput", () => {
  describe("on component loading", () => {
    it("should get stations when component mounted", () => {
      shallowMount(StartInput);
      expect(stationsApi.getStations).toHaveBeenCalledTimes(1);
    });

    it("should load stations from api into props", async () => {
      let enabledStations = [getStation(), getStation(), getStation()];
      stationsApi.getStations.mockResolvedValue(enabledStations);

      const wrapper = shallowMount(StartInput);
      await flushPromises();
      const mappedStations = enabledStations.map(station =>
        mapStation(station)
      );
      expect(wrapper.vm.stations).toEqual(mappedStations);
    });

    it("should have no stations if api call fails", async () => {
      stationsApi.getStations.mockRejectedValue("Failed");

      const wrapper = shallowMount(StartInput);
      await flushPromises();
      expect(wrapper.vm.stations).toEqual([]);
    });

    it("should emit an alert if fails", async () => {
      stationsApi.getStations.mockRejectedValue("Failed");

      const wrapper = shallowMount(StartInput);
      await flushPromises();
      expect(wrapper.emitted().alert.length).toBe(1);
    });
  });

  function getStation() {
    const id = faker.random.number();
    const name = faker.address.city();
    const lat = parseFloat(faker.address.latitude());
    const lng = parseFloat(faker.address.longitude());
    return { id, name, lat, lng };
  }
});
