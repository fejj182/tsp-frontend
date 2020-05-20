import { get, post } from "@/helpers/request.js";

export default {
  create: trip => {
    return post(`${process.env.VUE_APP_API_BASE_URL}/trip-destinations`, {
      trip
    });
  },
  get: tripAlias => {
    return get(
      `${process.env.VUE_APP_API_BASE_URL}/trip-destinations/${tripAlias}`
    );
  },
  update: (tripAlias, trip) => {
    return post(
      `${process.env.VUE_APP_API_BASE_URL}/trip-destinations/${tripAlias}`,
      {
        trip
      }
    );
  }
};
