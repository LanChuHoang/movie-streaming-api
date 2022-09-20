function currentTime() {
  return new Date().toLocaleString("vi-VN");
}

function isSameDate(dateStr1, dateStr2) {
  return new Date(dateStr1).getTime() === new Date(dateStr2).getTime();
}

const baseImageUrl = "https://image.tmdb.org/t/p";

const imageSize = {
  w45: "w45",
  w92: "w92",
  w154: "w154",
  w185: "w185",
  w300: "w300",
  w342: "w342",
  w500: "w500",
  w780: "w780",
  original: "original",
};

const personJob = {
  actor: "Actor",
  director: "Director",
};

function getImageUrl(filePath, size = imageSize.w92) {
  return filePath ? `${baseImageUrl}/${size}${filePath}` : undefined;
}

function toMovieModel(tmdbMovie) {
  return {
    title: tmdbMovie.title,
    tagline: tmdbMovie.tagline,
    overview: tmdbMovie.overview,
    adult: tmdbMovie.adult,
    runtime: tmdbMovie.runtime,
    releaseDate: tmdbMovie.release_date,
    imdbID: tmdbMovie.imdb_id,
    genres: tmdbMovie.genres.map((g) => g.name),
    countries: tmdbMovie.production_countries.map((c) => c.iso_3166_1),
    posterUrl: getImageUrl(tmdbMovie.poster_path, imageSize.w185),
    thumbnailUrl: getImageUrl(tmdbMovie.backdrop_path, imageSize.w300),
    backdropUrl: getImageUrl(tmdbMovie.backdrop_path, imageSize.original),
    isUpcoming: tmdbMovie.status !== "Released",
  };
}

module.exports = {
  currentTime,
  isSameDate,
  toMovieModel,
};
