import axiosClient, { axiosPrivateClient } from "../axiosClient";

const parseFieldsParam = (params) =>
  params.fields
    ? { ...params, fields: params.fields.join(",") }
    : { ...params };

class BaseApi {
  constructor(endpoint) {
    this.endpoint = endpoint;
    this.client = axiosClient;
    this.privateClient = axiosPrivateClient;
  }

  addItem = (itemData) => {
    return this.client.post(this.endpoint.base, itemData);
  };

  getItems = (params = {}) => {
    const parsedParams = parseFieldsParam(params);
    return this.client.get(this.endpoint.base, { params: parsedParams });
  };

  searchItems = (params = {}) => {
    const parsedParams = parseFieldsParam(params);
    return this.client.get(this.endpoint.search, { params: parsedParams });
  };

  getItem = (id) => {
    return this.client.get(`${this.endpoint.base}/${id}`);
  };

  updateItem = (id, itemData) => {
    return this.client.patch(`${this.endpoint.base}/${id}`, itemData);
  };

  deleteItem = (id) => {
    return this.client.delete(`${this.endpoint.base}/${id}`);
  };

  printThis = () => {
    console.log(this);
  };
}

export default BaseApi;
