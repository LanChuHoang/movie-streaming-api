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

  getRandomMovies = async () => {
    const items = [];
    for (let i = 0; i < 3; i++) {
      const { data } = await this.client.get(this.endpoint.random);
      items.push(data[0]);
    }
    return items;
  };
}

export default MovieApi;
