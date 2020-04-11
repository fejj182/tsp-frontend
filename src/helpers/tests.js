import faker from "faker";

export const fakeStation = (options = {}) => {
  const id = faker.random.number();
  const name = options.name || faker.address.city();
  const lat = parseFloat(faker.address.latitude());
  const lng = parseFloat(faker.address.longitude());
  const duration = faker.random.number(999);
  return { id, name, lat, lng, duration };
};
