import MediaApi from "./MediaApi";

class MovieApi extends MediaApi {
  constructor() {
    super(endpoint);
  }

  getRandomMovies = (amount = 1) => {
    const params = { params: { limit: amount } };
    return this.client.get(this.endpoint.random, params);
  };

  getPopularItems = (params = {}) => {
    return this.getLastestItems(params);
  };

  getLastestItems = (params = {}) => {
    const upcoming = false;
    return this.getBriefInfoItems({ ...params, upcoming });
  };

  getUpcomingItems = (params = {}) => {
    const upcoming = true;
    return this.getBriefInfoItems({ ...params, upcoming });
  };
}

const endpoint = {
  base: "/movie",
  search: "/movie/search",
  random: "/movie/random",
};

export default MovieApi;
