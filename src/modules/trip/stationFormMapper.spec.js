import { mapStation, mapStations } from "./stationFormMapper";
import faker from "faker";

describe("stationFormMapper", () => {
  it("should map a single station", () => {
    const station = {
      id: 1,
      name: "Barcelona",
      lat: faker.address.latitude(),
      lng: faker.address.longitude()
    };
    expect(mapStation(station)).toEqual({
      text: station.name,
      value: station
    });
  });

  it("should map and sort a list of stations by name", () => {
    const barcelona = {
      id: 1,
      name: "Barcelona",
      lat: faker.address.latitude(),
      lng: faker.address.longitude()
    };

    const madrid = {
      id: 1,
      name: "Madrid",
      lat: faker.address.latitude(),
      lng: faker.address.longitude()
    };
    expect(mapStations([madrid, barcelona])).toEqual([
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
});
