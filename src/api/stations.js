import { post } from "@/helpers/request.js";

export default {
  getNearestStation: location => {
    return post("http://backend.test/api/stations/nearest", location);
  }
};
