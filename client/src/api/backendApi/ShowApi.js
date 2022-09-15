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

  getPopularItems = (params = {}) => {
    return this.getLastestItems(params);
  };

  getLastestItems = (params = {}) => {
    return this.getBriefInfoItems(params);
  };

  getUpcomingItems = () => {
    throw new Error("Show API does not have upcoming route");
  };

  getSeasons = (id) => {
    return this.client.get(`${this.endpoint.base}/${id}/seasons`);
  };
}

export default ShowApi;
