import axiosClient from "./axiosClient";

export const itemType = {
  movie: "movie",
  show: "show",
};

export const movieCategory = {
  upcoming: "upcoming",
  popular: "",
  lastest: "",
  similar: "similar",
  none: "",
};

export const showCategory = {
  popular: "",
  lastest: "",
  similar: "similar",
  none: "",
};

const tmdbApi = {
  getItemList: (itemType, category, params = {}) => {
    console.log(params.toString());
    const path = `${itemType}${category ? `/${category}` : ""}`;
    return axiosClient.get(path, { params });
  },
  search: (itemType, params) => {
    const path = `${itemType}/search`;
    return axiosClient.get(path, { params });
  },
  getItemDetail: (itemType, id, params = {}) => {
    const path = `${itemType}/${id}`;
    return axiosClient.get(path, { params });
  },
  getSimilarItem: (itemType, id) => {
    const path = `${itemType}/${id}/similar`;
    return axiosClient.get(path, { params: {} });
  },
  getRandomMovies: async () => {
    const items = [];
    for (let i = 0; i < 3; i++) {
      const path = `movie/random`;
      const item = await axiosClient.get(path);
      items.push(item[0]);
    }
    return items;
  },
};

export default tmdbApi;
