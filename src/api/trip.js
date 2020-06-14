import { get, post } from "@/helpers/request.js";

export default {
  create: trip => {
    return post(`${process.env.VUE_APP_API_BASE_URL}/trip`, {
      trip
    });
  },
  get: tripAlias => {
    return get(`${process.env.VUE_APP_API_BASE_URL}/trip/${tripAlias}`);
  },
  update: (tripAlias, trip) => {
    return post(`${process.env.VUE_APP_API_BASE_URL}/trip/${tripAlias}`, {
      trip
    });
  }
};
