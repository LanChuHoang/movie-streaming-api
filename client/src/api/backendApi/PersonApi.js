import BaseApi from "./BaseApi";

const endpoint = {
  base: "/person",
  search: "/person/search",
};

class PersonApi extends BaseApi {
  constructor() {
    super(endpoint);
  }
}

export default PersonApi;
