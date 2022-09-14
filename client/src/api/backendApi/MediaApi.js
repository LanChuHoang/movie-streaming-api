import BaseApi from "./BaseApi";

class MediaApi extends BaseApi {
  static listType = {
    popular: "",
    lastest: "",
    upcoming: "upcoming",
    similar: "similar",
  };

  getSimilarItems = (id, params = {}) => {
    return this.client.get(`${this.endpoint.base}/${id}/similar`, { params });
  };

  getList = (listType, params = {}) => {
    // todo
  };

  getCredits = (id) => {
    return this.client.get(`${this.endpoint.base}/${id}/credits`);
  };
}

export default MediaApi;
