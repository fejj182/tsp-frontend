import {
  mapStations,
  mapStationByDuration,
  mapStationsByDuration
} from "./stationFormMapper";
import faker from "faker";
import { toHoursAndMinutes } from "./durationMapper";

describe("stationFormMapper", () => {
  it("should map a single station with duration", () => {
    const station = {
      id: 1,
      name: "Barcelona",
      lat: faker.address.latitude(),
      lng: faker.address.longitude(),
      slug: "barcelona",
      duration: 90,
      country: "ES"
    };
    expect(mapStationByDuration(station)).toStrictEqual({
      text: station.name,
      value: {
        ...station,
        duration: station.duration,
        durationHrsAndMins: toHoursAndMinutes(station.duration)
      }
    });
  });

  describe("mapStations", () => {
    it("should return same list of empty stations", () => {
      const noStations = [];
      expect(mapStations(noStations)).toEqual(noStations);
    });
  });

  it("should map and sort a list of stations by duration", () => {
    const barcelona = {
      id: 1,
      name: "Barcelona",
      lat: faker.address.latitude(),
      lng: faker.address.longitude(),
      slug: "barcelona",
      country: "ES",
      duration: 100
    };

    const madrid = {
      id: 1,
      name: "Madrid",
      lat: faker.address.latitude(),
      lng: faker.address.longitude(),
      slug: "barcelona",
      country: "ES",
      duration: 50
    };
    expect(mapStationsByDuration([madrid, barcelona])).toStrictEqual([
      {
        text: madrid.name,
        value: {
          ...madrid,
          duration: madrid.duration,
          durationHrsAndMins: toHoursAndMinutes(madrid.duration)
        }
      },
      {
        text: barcelona.name,
        value: {
          ...barcelona,
          duration: barcelona.duration,
          durationHrsAndMins: toHoursAndMinutes(barcelona.duration)
        }
      }
    ]);
  });
});
