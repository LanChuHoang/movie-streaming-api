const axios = require("axios").default;
const dotenv = require("dotenv");

dotenv.config();

const axiosClient = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  params: { api_key: process.env.TMDB_API_KEY },
  timeout: 1 * 60 * 1000,
});

class TmdbBaseApi {
  constructor(endpoint, fieldName) {
    this.endpoint = endpoint;
    this.fieldName = fieldName;
    this.client = axiosClient;
  }

  searchItems = (query) =>
    this.client.get(this.endpoint.search, { params: { query } });

  getItem = (id) => this.client.get(`${this.endpoint.base}/${id}`);

  searchItem = async (title, otherFilter) => {
    const deepSearch = async (items, filterFunction) =>
      (await Promise.all(items.map(({ id }) => this.getItem(id))))
        .map((r) => r.data)
        .filter(filterFunction);

    const { results } = (await this.searchItems(title)).data;
    const basicMatchedItems = results.filter(
      (r) => r[this.fieldName.title] === title
    );
    const matchedItems =
      basicMatchedItems.length > 1 && otherFilter
        ? await deepSearch(basicMatchedItems, otherFilter)
        : basicMatchedItems;
    if (matchedItems.length === 0) throw new Error(`Not found`);
    if (matchedItems.length > 1) {
      throw new Error(`Too many matched: ${matchedItems.length}`);
    }
    return matchedItems[0];
  };
}

class TmdbMediaApi extends TmdbBaseApi {
  getVideos = async (id) => {
    const { data } = await this.client.get(
      `${this.endpoint.base}/${id}/videos`
    );
    return data.results;
  };

  getCredits = (id) => this.client.get(`${this.endpoint.base}/${id}/credits`);
}

class TmdbMovieApi extends TmdbMediaApi {
  constructor() {
    super({ base: "/movie", search: "/search/movie" }, { title: "title" });
  }
}

class TmdbShowApi extends TmdbMediaApi {
  constructor() {
    super({ base: "/tv", search: "/search/tv" }, { title: "name" });
  }

  getSeason = (showId, seasonNumber) => {
    return this.client.get(
      `${this.endpoint.base}/${showId}/season/${seasonNumber}`
    );
  };

  getSeasons = async (showId) => {
    const baseUrl = `${this.endpoint.base}/${showId}`;
    const baseDetail = (await this.client.get(baseUrl)).data;
    const seasons = (
      await Promise.all(
        baseDetail.seasons.map((s) => this.getSeason(showId, s.season_number))
      )
    ).map((s) => s.data);
    return seasons;
  };
}

class TmdbPersonApi extends TmdbBaseApi {
  constructor() {
    super({ base: "/person", search: "/search/person" }, { title: "name" });
  }
}

module.exports = {
  TmdbMovieApi,
  TmdbShowApi,
  TmdbPersonApi,
};
