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

function toShowModel(tmdbShow) {
  return {
    title: tmdbShow.name,
    tagline: tmdbShow.tagline,
    overview: tmdbShow.overview,
    adult: tmdbShow.adult,
    firstAirDate: tmdbShow.first_air_date,
    lastAirDate: tmdbShow.last_air_date,
    imdbID: tmdbShow.imdb_id,
    genres: tmdbShow.genres.map((g) => g.name),
    countries: tmdbShow.production_countries.map((c) => c.iso_3166_1),
    posterUrl: getImageUrl(tmdbShow.poster_path, imageSize.w185),
    thumbnailUrl: getImageUrl(tmdbShow.backdrop_path, imageSize.w300),
    backdropUrl: getImageUrl(tmdbShow.backdrop_path, imageSize.original),
  };
}

function toPersonModel(tmdbPerson) {
  return {
    name: tmdbPerson.name,
    gender: tmdbPerson.gender === 1 ? "female" : "male",
    dob: tmdbPerson.birthday,
    dod: tmdbPerson.deathday,
    pob: tmdbPerson.place_of_birth,
    job: parseJob(tmdbPerson),
    biography: tmdbPerson.biography,
    avatarUrl: getImageUrl(tmdbPerson.profile_path, imageSize.w185),
    imdbID: tmdbPerson.imdb_id,
    tmdbID: tmdbPerson.id,
  };
}

function getImageUrl(filePath, size = imageSize.w92) {
  return filePath ? `${baseImageUrl}/${size}${filePath}` : undefined;
}

const parseJob = ({ known_for_department }) => {
  switch (known_for_department) {
    case "Acting":
      return personJob.actor;
    case "Directing":
      return personJob.director;
    default:
      return personJob.actor;
  }
};

const isDirector = ({ job }) => job === "Director";
const isTrailer = (clip) => {
  return clip.official && clip.site === "YouTube" && clip.type === "Trailer";
};

module.exports = {
  currentTime,
  isSameDate,
  toMovieModel,
  toShowModel,
  toPersonModel,
  isDirector,
  isTrailer,
};
