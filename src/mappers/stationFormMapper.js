import { toHoursAndMinutes } from "./durationMapper";
import cloneDeep from "lodash/cloneDeep";

//Note: only used in StartingDestination
export const mapStation = station => {
  return {
    text: station.name,
    value: {
      id: station.id,
      name: station.name,
      lat: station.lat,
      lng: station.lng,
      slug: station.slug
    }
  };
};

export const mapStationByDuration = station => {
  return {
    text: station.name,
    value: {
      id: station.id,
      name: station.name,
      lat: station.lat,
      lng: station.lng,
      slug: station.slug,
      duration: station.duration,
      durationHrsAndMins: toHoursAndMinutes(station.duration)
    }
  };
};

//Note: only used in StartingDestination
export const mapStations = stations => {
  return cloneDeep(stations)
    .sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    })
    .map(station => {
      return {
        text: station.name,
        value: {
          id: station.id,
          name: station.name,
          lat: station.lat,
          lng: station.lng,
          slug: station.slug
        }
      };
    });
};

export const mapStationsByDuration = stations => {
  return cloneDeep(stations)
    .sort((a, b) => {
      if (a.duration < b.duration) {
        return -1;
      }
      if (a.duration > b.duration) {
        return 1;
      }
      return 0;
    })
    .map(station => {
      return {
        text: station.name,
        value: {
          id: station.id,
          name: station.name,
          lat: station.lat,
          lng: station.lng,
          slug: station.slug,
          duration: station.duration,
          durationHrsAndMins: toHoursAndMinutes(station.duration)
        }
      };
    });
};
