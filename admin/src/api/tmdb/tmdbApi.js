import axios from "axios";

const axiosClient = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  params: { api_key: process.env.REACT_APP_TMDB_API_KEY },
});

const endpoint = {
  movie: {
    base: "/movie",
    search: "/search/movie",
  },
  show: {
    base: "/tv",
    search: "/search/tv",
  },
  person: {
    base: "/person",
    search: "/search/person",
  },
};

const movieApi = {
  searchMovies: ({ query, page = 1 }) => {
    const params = { query, page };
    return axiosClient.get(endpoint.movie.search, { params });
  },

  getMovie: async (id) => {
    const baseUrl = `${endpoint.movie.base}/${id}`;
    const [{ data: movie }, { data: videos }] = await Promise.all([
      axiosClient.get(baseUrl),
      axiosClient.get(`${baseUrl}/videos`),
    ]);
    return { ...movie, videos: videos.results };
  },

  getCredits: (movieId) => {
    return axiosClient.get(`${endpoint.movie.base}/${movieId}/credits`);
  },
};

const getSeason = (showId, seasonNumber) => {
  return axiosClient.get(
    `${endpoint.show.base}/${showId}/season/${seasonNumber}`
  );
};

const showApi = {
  searchShows: ({ query, page = 1 }) => {
    const params = { query, page };
    return axiosClient.get(endpoint.show.search, { params });
  },

  getShow: async (id) => {
    const baseUrl = `${endpoint.show.base}/${id}`;
    const [{ data: baseDetail }, { data: videos }] = await Promise.all([
      axiosClient.get(baseUrl),
      axiosClient.get(`${baseUrl}/videos`),
    ]);
    return { ...baseDetail, videos: videos.results };
  },

  getSeasons: async (showId) => {
    const baseUrl = `${endpoint.show.base}/${showId}`;
    const baseDetail = (await axiosClient.get(baseUrl)).data;
    const seasons = (
      await Promise.all(
        baseDetail.seasons.map((s) => getSeason(showId, s.season_number))
      )
    ).map((s) => s.data);
    return seasons;
  },

  getSeason: (showId, seasonNumber) => {
    return axiosClient.get(
      `${endpoint.show.base}/${showId}/season/${seasonNumber}`
    );
  },

  getCredits: (showId) => {
    return axiosClient.get(`${endpoint.show.base}/${showId}/credits`);
  },
};

const personApi = {
  searchPeople: ({ query, page = 1 }) => {
    const params = { query, page };
    return axiosClient.get(endpoint.person.search, { params });
  },

  getPerson: (id) => {
    return axiosClient.get(`${endpoint.person.base}/${id}`);
  },
};

const tmdbApi = { movie: movieApi, show: showApi, person: personApi };
export default tmdbApi;
