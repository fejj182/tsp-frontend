import axios from "axios";

export const post = (url, body) => {
  return axios.post(url, body).then(response => {
    return response.data;
  });
};
