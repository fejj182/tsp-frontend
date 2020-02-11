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
