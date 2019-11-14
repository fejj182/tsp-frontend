import { post } from "@/helpers/request.js";

export default {
  getNearestStation: location => {
    return post(
      `${process.env.VUE_APP_API_BASE_URL}/stations/nearest`,
      location
    );
  }
};
