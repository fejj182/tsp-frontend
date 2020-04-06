import faker from "faker";

export const fakeStation = stationName => {
  const id = faker.random.number();
  const name = stationName || faker.address.city();
  const lat = parseFloat(faker.address.latitude());
  const lng = parseFloat(faker.address.longitude());
  const duration = faker.random.number(999);
  return { id, name, lat, lng, duration };
};
