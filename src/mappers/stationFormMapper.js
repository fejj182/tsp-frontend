import { toHoursAndMinutes } from "./durationMapper";

//Note: only used in StartingDestination
export const mapStation = station => {
  return {
    text: station.name,
    value: {
      id: station.id,
      name: station.name,
      lat: station.lat,
      lng: station.lng
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
      duration:
        station.duration > 0 // Note: to stop conversion to string twice
          ? toHoursAndMinutes(station.duration)
          : station.duration
    }
  };
};

//Note: only used in StartingDestination
export const mapStations = stations => {
  return stations
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
          lng: station.lng
        }
      };
    });
};

export const mapStationsByDuration = stations => {
  return stations
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
          duration: toHoursAndMinutes(station.duration)
        }
      };
    });
};
