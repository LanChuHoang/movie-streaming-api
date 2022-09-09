const baseImageUrl = "https://image.tmdb.org/t/p";

export const imageSize = {
  w92: "w92",
  w154: "w154",
  w185: "w185",
  w300: "w300",
  w342: "w342",
  w500: "w500",
  w780: "w780",
  original: "original",
};

export const personJob = {
  actor: "Actor",
  director: "Director",
};

export function getImageUrl(filePath, size = imageSize.w92) {
  return filePath ? `${baseImageUrl}/${size}${filePath}` : undefined;
}

const isTrailer = (clip) => {
  return clip.site === "YouTube" && clip.type === "Trailer";
};

export const isDirector = ({ job }) => job === "Director";

export const toMovieModel = (tmdbMovie) => {
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
    cast: undefined,
    directors: undefined,
    trailers: tmdbMovie.videos?.filter((v) => isTrailer(v)).map((v) => v.key),
    posterUrl: getImageUrl(tmdbMovie.poster_path, imageSize.w185),
    thumbnailUrl: getImageUrl(tmdbMovie.backdrop_path, imageSize.w300),
    backdropUrl: getImageUrl(tmdbMovie.backdrop_path, imageSize.original),
    isUpcoming: tmdbMovie.status !== "Released",
  };
};

export const toShowModel = (tmdbShow) => {
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
    cast: undefined,
    directors: undefined,
    trailers: tmdbShow.videos?.filter((v) => isTrailer(v)).map((v) => v.key),
    posterUrl: getImageUrl(tmdbShow.poster_path, imageSize.w185),
    thumbnailUrl: getImageUrl(tmdbShow.backdrop_path, imageSize.w300),
    backdropUrl: getImageUrl(tmdbShow.backdrop_path, imageSize.original),
    seasons: tmdbShow.seasons.map(toSeasonModel),
  };
};

const toSeasonModel = (tmdbSeason) => {
  return {
    title: tmdbSeason.name,
    seasonNumber: tmdbSeason.season_number,
    overview: tmdbSeason.overview,
    releaseDate: tmdbSeason.air_date,
    posterUrl: getImageUrl(tmdbSeason.poster_path, imageSize.w185),
    episodes: tmdbSeason.episodes.map(toEpisodeModel),
  };
};

const toEpisodeModel = (tmdbEpisode) => {
  return {
    _id: `new-episode-${tmdbEpisode.episode_number}`,
    title: tmdbEpisode.name,
    episodeNumber: tmdbEpisode.episode_number,
    airDate: tmdbEpisode.air_date,
    runtime: tmdbEpisode.runtime,
    overview: tmdbEpisode.overview,
    thumbnailUrl: getImageUrl(tmdbEpisode.still_path, imageSize.w300),
  };
};

export const toPersonModel = (tmdbPerson, job = personJob.actor) => {
  return {
    _id: `new-person-${tmdbPerson.name}`,
    name: tmdbPerson.name,
    gender: tmdbPerson.gender === 1 ? "female" : "male",
    dob: tmdbPerson.birthday,
    pob: tmdbPerson.place_of_birth,
    job: job,
    biography: tmdbPerson.biography,
    avatarUrl: getImageUrl(tmdbPerson.profile_path, imageSize.w185),
  };
};
