import axios from "axios";

export const get = url => {
  return axios.get(url).then(response => response.data);
};

export const post = (url, body) => {
  return axios.post(url, body).then(response => response.data);
};
