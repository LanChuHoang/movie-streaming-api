import axiosClient, { axiosPrivateClient } from "./axiosClient";
import MovieApi from "./class/MovieApi";
import PersonApi from "./class/PersonApi";
import ShowApi from "./class/ShowApi";
import UserApi from "./class/UserApi";

const userApi = new UserApi();
const movieApi = new MovieApi();
const showApi = new ShowApi();
const personApi = new PersonApi();

const backendApi = {
  user: userApi,
  movie: movieApi,
  show: showApi,
  person: personApi,
  interceptors: axiosClient.interceptors,
  axiosPrivateClient: axiosPrivateClient,
};

export default backendApi;
