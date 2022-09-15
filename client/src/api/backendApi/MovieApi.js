import MediaApi from "./MediaApi";

const endpoint = {
  base: "/movie",
  search: "/movie/search",
  random: "/movie/random",
};

class MovieApi extends MediaApi {
  constructor() {
    super(endpoint);
  }

  getRandomMovies = (amount = 1) => {
    const params = { params: { limit: amount } };
    return this.client.get(this.endpoint.random, params);
  };
}

export default MovieApi;
