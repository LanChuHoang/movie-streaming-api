const axios = require("axios").default;
const config = require("./tmdb.configure");
const movieService = require("../../models/movie/movie.service");
const showService = require("../../models/show/show.service");
const personService = require("../../models/person/person.service");
const personModel = require("../../models/person/person.model");
const mongoService = require("../../services/mongo.service");
const movieModel = require("../../models/movie/movie.model");
const showModel = require("../../models/show/show.model");

async function getPage(path, page) {
  try {
    const url = `${config.BASE_URL}${path}?page=${page}&api_key=${config.API_KEY}`;
    const response = await (await axios.get(url)).data;
    return response;
  } catch (error) {
    throw error;
  }
}

async function getItemDetail(path, id) {
  try {
    const url = `${config.BASE_URL}${path}/${id}?api_key=${config.API_KEY}`;
    const response = await (await axios.get(url)).data;
    return response;
  } catch (error) {
    throw error;
  }
}

async function getTrailers(type, id) {
  const getClips = async (type, id) => {
    try {
      const url = `${config.BASE_URL}/${type}/${id}/videos?api_key=${config.API_KEY}`;
      const { data } = await axios.get(url);
      return data.results;
    } catch (error) {
      throw error;
    }
  };
  const isTrailer = (clip) => {
    return clip.site === "YouTube" && clip.type === "Trailer";
  };

  try {
    const clips = await getClips(type, id);
    if (!clips) return undefined;
    const trailers = clips.filter((c) => isTrailer(c)).map((c) => c.key);
    return trailers;
  } catch (error) {
    console.log(error);
  }
}

const loadPerson = async (id, job) => {
  try {
    const url = `${config.BASE_URL}/person/${id}?api_key=${config.API_KEY}`;
    const tmdbModel = await (await axios.get(url)).data;
    const mappedModel = {
      name: tmdbModel.name,
      gender: tmdbModel.gender === "1" ? "female" : "male",
      dob: tmdbModel.birthday,
      pob: tmdbModel.place_of_birth,
      job: job,
      biography: tmdbModel.biography,
      avatarUrl: config.getProfileImageURL(tmdbModel.profile_path),
      images: undefined,
    };
    const storedModel = await personService.addPerson(mappedModel);
    return storedModel;
  } catch (error) {
    throw error;
  }
};

async function loadCastAndDirectors(type, id) {
  try {
    const url = `${config.BASE_URL}/${type}/${id}/credits?api_key=${config.API_KEY}`;
    const { cast, crew } = await (await axios.get(url)).data;
    // Load Cast
    const castIDs = [];
    for (const c of cast) {
      const storedPerson = await personService.getPersonByName(c.name);
      if (!storedPerson) {
        // Download person data and store that person to db
        const person = await loadPerson(c.id, "Actor");
        castIDs.push(person._id);
        console.log(`+ Loadded cast ${person.name}`);
      } else {
        castIDs.push(storedPerson._id);
        console.log(`+ ${storedPerson.name} is already existed`);
      }
    }

    // Load Directors
    const directors = crew.filter(
      (c) => c.job === "Executive Producer" || c.job === "Director"
    );
    const directorIDs = [];
    for (const d of directors) {
      const storedPerson = await personService.getPersonByName(d.name);
      if (!storedPerson) {
        // Download person data and store that person to db
        const person = await loadPerson(d.id, "Director");
        directorIDs.push(person._id);
        console.log(`+ Loadded director ${person.name}`);
      } else {
        directorIDs.push(storedPerson._id);
        console.log(`+ ${storedPerson.name} is already existed`);
      }
    }
    return { castIDs, directorIDs };
  } catch (error) {
    console.log(error);
  }
}

async function updateSeasons(mappedModel, tmdbID) {
  try {
    let i = 0;
    for (const s of mappedModel.seasons) {
      const seasonNumber = s.seasonNumber;
      const url = `${config.BASE_URL}/tv/${tmdbID}/season/${seasonNumber}?api_key=${config.API_KEY}`;
      const { episodes } = await (await axios.get(url)).data;
      const mappedEpisodes = episodes.map((e) => {
        return {
          title: e.name,
          episodeNumber: e.episode_number,
          airDate: e.air_date,
          runtime: e.runtime,
          overview: e.overview,
          thumbnailUrl: config.getThumbnailImageURL(e.still_path),
          videoUrl: undefined,
        };
      });
      mappedModel.seasons[i].episodes = mappedEpisodes;
      i++;
    }
  } catch (error) {
    throw error;
  }
}

async function loadMovie(id) {
  const mapTMDBModelToLocalModel = (tmdbModel) => {
    return {
      title: tmdbModel.title,
      tagline: tmdbModel.tagline,
      overview: tmdbModel.overview,
      adult: tmdbModel.adult,
      runtime: tmdbModel.runtime,
      releaseDate: tmdbModel.release_date,
      imdbID: tmdbModel.imdb_id,
      genres: tmdbModel.genres.map((g) => g.name),
      countries: tmdbModel.production_countries.map((c) => c.iso_3166_1),
      cast: undefined, // update later
      directors: undefined, // update later
      trailers: undefined, // update later
      posterUrl: config.getPosterImageURL(tmdbModel.poster_path),
      thumbnailUrl: config.getThumbnailImageURL(tmdbModel.backdrop_path),
      backdropUrl: config.getBackgroundImageURL(tmdbModel.backdrop_path),
    };
  };
  try {
    const tmdbModel = await getItemDetail("/movie", id);
    const mappedModel = mapTMDBModelToLocalModel(tmdbModel);

    // Load the missing part
    const trailers = await getTrailers("movie", id);
    const { castIDs, directorIDs } = await loadCastAndDirectors("movie", id);
    mappedModel.trailers = trailers;
    mappedModel.cast = castIDs;
    mappedModel.directors = directorIDs;
    // for (const id of mappedModel.cast) {
    //   console.log(`${(await personModel.exists({ _id: id })) !== null}`);
    // }
    // for (const id of mappedModel.directors) {
    //   console.log(`${(await personModel.exists({ _id: id })) !== null}`);
    // }

    const storedModel = await movieService.addMovie(mappedModel);
    return storedModel;
  } catch (error) {
    throw error;
  }
}

async function loadMovies(path, numPages = 1) {
  for (let page = 1; page <= numPages; page++) {
    try {
      const { results } = await getPage(path, page);

      for (const result of results) {
        if (await movieService.exists(result.title)) {
          console.log(`- ${result.title} is already existed`);
          continue;
        }
        const loadedMovie = await loadMovie(result.id);
        console.log(`- Loaded ${loadedMovie.title}`);
      }

      console.log(
        `Loaded ${path.split("/").pop()} movies - page ${page}: ${
          results.length
        } items`
      );
    } catch (error) {
      console.log(error);
    }
  }
}

async function loadShow(id) {
  const mapTMDBModelToLocalModel = (tmdbModel) => {
    return {
      title: tmdbModel.name,
      tagline: tmdbModel.tagline,
      overview: tmdbModel.overview,
      adult: tmdbModel.adult,
      imdbID: tmdbModel.imdb_id,
      genres: tmdbModel.genres.map((g) => g.name),
      countries: tmdbModel.production_countries.map((c) => c.iso_3166_1),
      cast: undefined, // update later
      directors: undefined, // update later
      trailers: undefined, // update later
      posterUrl: config.getPosterImageURL(tmdbModel.poster_path),
      thumbnailUrl: config.getThumbnailImageURL(tmdbModel.backdrop_path),
      backdropUrl: config.getBackgroundImageURL(tmdbModel.backdrop_path),
      firstAirDate: tmdbModel.first_air_date,
      lastAirDate: tmdbModel.last_air_date,
      seasons: tmdbModel.seasons.map((s) => {
        return {
          title: s.name,
          seasonNumber: s.season_number,
          overview: s.overview,
          releaseDate: s.air_date,
          posterUrl: config.getPosterImageURL(s.poster_path),
          backdropUrl: undefined,
          episodes: undefined,
        };
      }),
    };
  };
  try {
    const tmdbModel = await getItemDetail("/tv", id);
    const mappedModel = mapTMDBModelToLocalModel(tmdbModel);

    // Load the missing part
    const trailers = await getTrailers("tv", id);
    const { castIDs, directorIDs } = await loadCastAndDirectors("tv", id);
    await updateSeasons(mappedModel, tmdbModel.id);
    mappedModel.trailers = trailers;
    mappedModel.cast = castIDs;
    mappedModel.directors = directorIDs;

    const storedModel = await showService.addShow(mappedModel);
    return storedModel;
  } catch (error) {
    throw error;
  }
}

async function loadShows(path, numPages = 1) {
  for (let page = 1; page <= numPages; page++) {
    try {
      const { results } = await getPage(path, page);

      for (const result of results) {
        if (await showService.exists(result.name)) {
          console.log(`- ${result.name} is already existed`);
          continue;
        }
        const loadedShow = await loadShow(result.id);
        console.log(`- Loaded ${loadedShow.title}`);
      }

      console.log(
        `Loaded ${path.split("/").pop()} shows - page ${page}: ${
          results.length
        } items`
      );
    } catch (error) {
      console.log(error);
    }
  }
}

async function updateDirectors() {
  const movies = await showModel.find({}, { directors: 1 });
  for (const movie of movies) {
    for (const id of movie.directors) {
      const p = await personService.updatePerson(id, { job: "Director" });
      console.log(p.name, p.job);
    }
  }
}

async function test() {
  await mongoService.connect();
  await loadMovies("/movie/popular", 10);
  // await loadMovies("/movie/upcoming", 2);
  await loadShows("/tv/popular", 10);

  // await updateDirectors();

  // console.log(await loadMovie(634649));
  // console.log(await loadShow(76479));
  // await loadShow(76479);

  // console.log(await getTrailers("movie", 634649));
  // console.log(await getTrailers("tv", 76479));

  // console.log(
  //   `Loadded cast list - ${(await loadCastAndDirectors("movie", 634649)).length} items`
  // );

  await mongoService.disconnect();
}

test();
