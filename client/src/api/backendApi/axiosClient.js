import axios from "axios";

const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_BASE_URL,
  timeout: 2500,
});

export const axiosPrivateClient = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_BASE_URL,
  timeout: 2500,
  withCredentials: true,
});

export default axiosClient;
