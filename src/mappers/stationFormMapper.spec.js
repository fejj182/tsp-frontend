import {
  mapStation,
  mapStations,
  mapStationByDuration,
  mapStationsByDuration
} from "./stationFormMapper";
import faker from "faker";
import { toHoursAndMinutes } from "./durationMapper";

describe("stationFormMapper", () => {
  it("should map a single station", () => {
    const station = {
      id: 1,
      name: "Barcelona",
      lat: faker.address.latitude(),
      lng: faker.address.longitude(),
      slug: "barcelona"
    };
    expect(mapStation(station)).toStrictEqual({
      text: station.name,
      value: station
    });
  });
  it("should map a single station with duration", () => {
    const station = {
      id: 1,
      name: "Barcelona",
      lat: faker.address.latitude(),
      lng: faker.address.longitude(),
      slug: "barcelona",
      duration: 90
    };
    expect(mapStationByDuration(station)).toStrictEqual({
      text: station.name,
      value: { ...station, duration: "1h 30m" }
    });
  });

  it("should map and sort a list of stations by name", () => {
    const barcelona = {
      id: 1,
      name: "Barcelona",
      lat: faker.address.latitude(),
      lng: faker.address.longitude(),
      slug: "barcelona"
    };

    const madrid = {
      id: 1,
      name: "Madrid",
      lat: faker.address.latitude(),
      lng: faker.address.longitude(),
      slug: "barcelona"
    };
    expect(mapStations([madrid, barcelona])).toStrictEqual([
      {
        text: barcelona.name,
        value: barcelona
      },
      {
        text: madrid.name,
        value: madrid
      }
    ]);
  });

  it("should map and sort a list of stations by duration", () => {
    const barcelona = {
      id: 1,
      name: "Barcelona",
      lat: faker.address.latitude(),
      lng: faker.address.longitude(),
      slug: "barcelona",
      duration: 100
    };

    const madrid = {
      id: 1,
      name: "Madrid",
      lat: faker.address.latitude(),
      lng: faker.address.longitude(),
      slug: "barcelona",
      duration: 50
    };
    expect(mapStationsByDuration([madrid, barcelona])).toStrictEqual([
      {
        text: madrid.name,
        value: { ...madrid, duration: toHoursAndMinutes(madrid.duration) }
      },
      {
        text: barcelona.name,
        value: { ...barcelona, duration: toHoursAndMinutes(barcelona.duration) }
      }
    ]);
  });
});
