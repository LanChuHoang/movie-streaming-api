import axios from "axios";
import { isDirector } from "./tmdbApi.helper";

const axiosClient = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  params: { api_key: process.env.REACT_APP_TMDB_API_KEY },
});

const endpoint = {
  movie: {
    base: "/movie",
    searchMovie: "/search/movie",
  },
  person: {
    base: "/person",
  },
};

function searchMovie({ query, page = 1 }) {
  const params = { query, page };
  return axiosClient.get(endpoint.movie.searchMovie, { params });
}

async function getMovie(id) {
  const baseUrl = `${endpoint.movie.base}/${id}`;
  const [{ data: movie }, { data: videos }] = await Promise.all([
    axiosClient.get(baseUrl),
    axiosClient.get(`${baseUrl}/videos`),
  ]);
  return { ...movie, videos: videos.results };
}

function getCastAndCrew(movieId) {
  return axiosClient.get(`${endpoint.movie.base}/${movieId}/credits`);
}

function getPerson(id) {
  return axiosClient.get(`${endpoint.person.base}/${id}`);
}

const tmdbApi = { searchMovie, getMovie, getCastAndCrew, getPerson };
export default tmdbApi;
