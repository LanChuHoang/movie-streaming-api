const axios = require("axios").default;
const dotenv = require("dotenv");
const { isSameDate } = require("./tmdb.helper");

dotenv.config();

const axiosClient = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  params: { api_key: process.env.TMDB_API_KEY },
  timeout: 2500,
});

class BaseApi {
  constructor(endpoint, fieldName) {
    this.endpoint = endpoint;
    this.fieldName = fieldName;
    this.client = axiosClient;
  }

  searchItems = (query) =>
    this.client.get(this.endpoint.search, { params: { query } });

  getItem = (id) => this.client.get(`${this.endpoint.base}/${id}`);

  findMatchingItem = async (title) => {
    const { results } = (await this.searchItems(title)).data;
    const isMatched = (r) => r[this.fieldName.title] === title;
    const matchedTmdb = results.find(isMatched);
    if (!matchedTmdb) throw new Error(`Not found`);
    return matchedTmdb;
  };
}

class MediaApi extends BaseApi {}

class MovieApi extends MediaApi {
  constructor() {
    super(
      { base: "/movie", search: "/search/movie" },
      { title: "title", releaseDate: "release_date", overview: "overview" }
    );
  }
}

module.exports = {
  MovieApi,
};
