const movieGenres = [
  {
    id: 28,
    name: "Action",
  },
  {
    id: 12,
    name: "Adventure",
  },
  {
    id: 16,
    name: "Animation",
  },
  {
    id: 35,
    name: "Comedy",
  },
  {
    id: 80,
    name: "Crime",
  },
  {
    id: 99,
    name: "Documentary",
  },
  {
    id: 18,
    name: "Drama",
  },
  {
    id: 10751,
    name: "Family",
  },
  {
    id: 14,
    name: "Fantasy",
  },
  {
    id: 36,
    name: "History",
  },
  {
    id: 27,
    name: "Horror",
  },
  {
    id: 10402,
    name: "Music",
  },
  {
    id: 9648,
    name: "Mystery",
  },
  {
    id: 10749,
    name: "Romance",
  },
  {
    id: 878,
    name: "Science Fiction",
  },
  {
    id: 10770,
    name: "TV Movie",
  },
  {
    id: 53,
    name: "Thriller",
  },
  {
    id: 10752,
    name: "War",
  },
  {
    id: 37,
    name: "Western",
  },
];
const tvGenres = [
  {
    id: 10759,
    name: "Action & Adventure",
  },
  {
    id: 16,
    name: "Animation",
  },
  {
    id: 35,
    name: "Comedy",
  },
  {
    id: 80,
    name: "Crime",
  },
  {
    id: 99,
    name: "Documentary",
  },
  {
    id: 18,
    name: "Drama",
  },
  {
    id: 10751,
    name: "Family",
  },
  {
    id: 10762,
    name: "Kids",
  },
  {
    id: 9648,
    name: "Mystery",
  },
  {
    id: 10763,
    name: "News",
  },
  {
    id: 10764,
    name: "Reality",
  },
  {
    id: 10765,
    name: "Sci-Fi & Fantasy",
  },
  {
    id: 10766,
    name: "Soap",
  },
  {
    id: 10767,
    name: "Talk",
  },
  {
    id: 10768,
    name: "War & Politics",
  },
  {
    id: 37,
    name: "Western",
  },
];
const genresMap = new Map();
[...movieGenres, ...tvGenres].forEach((g) => {
  genresMap.set(g.id, g.name);
});

const movieOfficialLists = ["now_playing", "popular", "upcoming", "top_rated"];
const tvOfficialLists = ["on_the_air", "airing_today", "popular", "top_rated"];

const API_KEY = "8278c684ff956c8023741995ca3ce340";
const BASE_URL = `https://api.themoviedb.org/3`;
const BASE_IMAGE_URL = "http://image.tmdb.org/t/p";
const BACKDROP_IMAGE_SIZE = "/original";
const THUMBNAIL_IMAGE_SIZE = "/w300";
const POSTER_IMAGE_SIZE = "/w185";
const PROFILE_IMAGE_SIZE = "/w45";

function getSingleItemURL(type, id) {
  return `${BASE_URL}/${type}/${id}?api_key=${API_KEY}`;
}

function getBackgroundImageURL(path) {
  return path ? `${BASE_IMAGE_URL}${BACKDROP_IMAGE_SIZE}${path}` : null;
}

function getThumbnailImageURL(path) {
  return path ? `${BASE_IMAGE_URL}${THUMBNAIL_IMAGE_SIZE}${path}` : null;
}

function getPosterImageURL(path) {
  return path ? `${BASE_IMAGE_URL}${POSTER_IMAGE_SIZE}${path}` : null;
}

function getProfileImageURL(path) {
  return path ? `${BASE_IMAGE_URL}${POSTER_IMAGE_SIZE}${path}` : null;
}

function getGenresArray(genresIDs) {
  return genresIDs.map((id) => genresMap.get(id));
}

module.exports = {
  genres: genresMap,
  movieOfficialLists,
  tvOfficialLists,
  API_KEY,
  BASE_URL,
  BASE_IMAGE_URL,
  BACKDROP_IMAGE_SIZE,
  THUMBNAIL_IMAGE_SIZE,
  getSingleItemURL,
  getBackgroundImageURL,
  getThumbnailImageURL,
  getPosterImageURL,
  getProfileImageURL,
  getGenresArray,
};
