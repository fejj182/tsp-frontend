import { get, post } from "@/helpers/request.js";

export default {
  getStations: () => {
    return get(`${process.env.VUE_APP_API_BASE_URL}/stations`);
  },
  getNearestStation: location => {
    return post(
      `${process.env.VUE_APP_API_BASE_URL}/stations/nearest`,
      location
    );
  }
};
