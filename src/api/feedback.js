import { post } from "@/helpers/request.js";

export default {
  create: (name, email, feedback) => {
    return post(`${process.env.VUE_APP_API_BASE_URL}/feedback`, {
      name,
      email,
      feedback
    });
  }
};
