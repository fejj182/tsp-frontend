import { post } from "@/helpers/request.js";

export default {
  create: trip => {
    return post(`${process.env.VUE_APP_API_BASE_URL}/trip`, { trip });
  }
};
