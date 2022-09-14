import MediaApi from "./MediaApi";

const endpoint = {
  base: "/show",
  search: "/show/search",
};

class ShowApi extends MediaApi {
  static adminBaseFields = [
    "_id",
    "posterUrl",
    "title",
    "firstAirDate",
    "lastAirDate",
    "createdAt",
  ];

  constructor() {
    super(endpoint);
  }

  getSeasons = (id) => {
    return this.client.get(`${this.endpoint.base}/${id}/seasons`);
  };
}

export default ShowApi;
