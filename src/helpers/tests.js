import faker from "faker";

export const fakeStation = (options = {}) => {
  const id = options.id || faker.random.number();
  const name = options.name || faker.address.city();
  const lat = options.lat || parseFloat(faker.address.latitude());
  const lng = options.lng || parseFloat(faker.address.longitude());
  const duration = options.duration || faker.random.number(999);
  const country = options.country || faker.address.countryCode();
  return { id, name, lat, lng, duration, country };
};
