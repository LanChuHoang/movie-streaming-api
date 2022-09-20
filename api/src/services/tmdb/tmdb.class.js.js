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

  searchItem = async (
    title,
    isMatched = (r) => r[this.fieldName.title] === title
  ) => {
    const { results } = (await this.searchItems(title)).data;
    const matchedItems = results.filter(isMatched);
    if (matchedItems.length === 0) throw new Error(`Not found`);
    if (matchedItems.length > 1)
      throw new Error(`Too many matched: ${matchedItems.length}`);
    return matchedItems[0];
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

class ShowApi extends MediaApi {
  constructor() {
    super(
      { base: "/tv", search: "/search/tv" },
      { title: "name", releaseDate: "first_air_date", overview: "overview" }
    );
  }
}

module.exports = {
  MovieApi,
  ShowApi,
};
