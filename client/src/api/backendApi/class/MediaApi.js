import BaseApi from "./BaseApi";

class MediaApi extends BaseApi {
  static listType = {
    popular: "popular",
    lastest: "lastest",
    upcoming: "upcoming",
    similar: "similar",
  };

  static itemType = {
    movie: "movie",
    show: "show",
  };

  static briefInfoFields = ["title", "posterUrl"];

  getList = (listType, params = {}) => {
    switch (listType) {
      case MediaApi.listType.popular:
        return this.getPopularItems(params);
      case MediaApi.listType.lastest:
        return this.getLastestItems(params);
      case MediaApi.listType.upcoming:
        return this.getUpcomingItems(params);
      case MediaApi.listType.similar:
        return this.getSimilarItems(params);
      default:
        throw new Error(`Invalid List type "${listType}"`);
    }
  };

  getBriefInfoItems = (params = {}) => {
    const fields = [...(params.fields || []), MediaApi.briefInfoFields];
    return this.getItems({ ...params, fields });
  };

  getSimilarItems = (id, params = {}) => {
    return this.client.get(`${this.endpoint.base}/${id}/similar`, { params });
  };

  getCredits = (id) => {
    return this.client.get(`${this.endpoint.base}/${id}/credits`);
  };
}

export default MediaApi;
