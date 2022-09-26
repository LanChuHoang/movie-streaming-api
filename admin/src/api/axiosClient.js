import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:8000/api",
  timeout: 2500,
});

export const axiosPrivateClient = axios.create({
  baseURL: "http://localhost:8000/api",
  timeout: 2500,
  withCredentials: true,
});

export default axiosClient;
