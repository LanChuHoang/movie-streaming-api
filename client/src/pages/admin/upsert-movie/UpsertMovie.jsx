import "./upsertMovie.scss";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import tmdbApi from "../../../api/tmdb/tmdbApi";
import useBackendApi from "../../../hooks/useBackendApi";
import AdminImportBar from "../../../components/admin-import-bar/AdminImportBar";
import { apiOptions } from "../../../api/filterOptions";
import UpsertInput from "../../../components/inputs/upsert-input/UpsertInput";
import AdminPersonGrid from "../../../components/admin-person-grid/AdminPersonGrid";
import { toMovieModel } from "../../../api/tmdb/tmdbApi.helper";
import {
  Alert,
  Backdrop,
  Button,
  CircularProgress,
  Snackbar,
} from "@mui/material";

const MESSAGE = {
  success: "Saved successfully!",
  noResponse: "No server response",
  invalidId: "Invalid movie ID",
};

const UpsertMovie = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(defaultMovie);
  const [toEditMovieId, setToEditMovieId] = useState({
    value: "",
    source: "", // backend-api or tmdb-api
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState();
  const [alertOpen, setAlertOpen] = useState(false);
  const backendApi = useBackendApi();

  const mergeMovieState = (field, value) => {
    setMovie({ ...movie, [field]: value });
  };

  useEffect(() => {
    const loadToEditMovie = async (id) => {
      try {
        const toEditMovie = (await backendApi.getItemDetail("movie", id)).data;
        setMovie(toEditMovie);
        setToEditMovieId({ value: toEditMovie._id, source: "backend-api" });
      } catch (error) {
        console.log(error);
      }
    };
    id && loadToEditMovie(id);
  }, [id, backendApi]);

  const handleMovieSelect = async (tmdbMovie) => {
    const tmdbMovieDetail = await tmdbApi.getMovie(tmdbMovie.id);
    const newMovie = toMovieModel(tmdbMovieDetail);
    setMovie(newMovie);
    setToEditMovieId({ value: tmdbMovie.id, source: "tmdb-api" });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    let result;
    try {
      const { _id, _createdAt, _updatedAt, ...movieData } = movie;
      const upsertedMovie = id
        ? (await backendApi.updateMovie(id, movieData)).data
        : (await backendApi.addMovie(movieData)).data;
      result = MESSAGE.success;
      console.log(upsertedMovie);
    } catch (error) {
      switch (error.response?.status) {
        case 400:
        case 500:
          result = error.response.data.error;
          break;
        case 404:
          result = MESSAGE.invalidId;
          break;
        default:
          result = MESSAGE.noResponse;
          break;
      }
    } finally {
      setIsLoading(false);
      setAlertOpen(true);
      setMessage(result);
    }
  };

  return (
    <form className="upsert-movie-container" onSubmit={handleFormSubmit}>
      <AdminImportBar
        title={id ? `Edit ${id?.slice(-4) || "movie"}` : "Add movie"}
        searchItems={tmdbApi.searchMovie}
        getOptionLabel={(option) => option.title}
        renderOption={(option) => <p>{option.title}</p>}
        onItemSelect={handleMovieSelect}
      />
      <div className="upsert-movie-inputs-wrapper">
        <p className="group-title">Basic Info</p>
        <div className="top-container">
          <div className="top-right-container">
            {topRightInputs.slice(0, 2).map((input) => (
              <UpsertInput
                key={input.field}
                input={input}
                value={movie[input.field]}
                onChange={(e) => mergeMovieState(input.field, e.target.value)}
              />
            ))}
            <div className="two-column-grid">
              {topRightInputs.slice(2, 5).map((input) => (
                <UpsertInput
                  key={input.field}
                  input={input}
                  value={movie[input.field]}
                  onChange={(e) => mergeMovieState(input.field, e.target.value)}
                />
              ))}
              <div className="two-column-grid">
                {topRightInputs.slice(5, 7).map((input) => (
                  <UpsertInput
                    key={input.field}
                    input={input}
                    value={movie[input.field]}
                    onChange={(e) =>
                      mergeMovieState(input.field, e.target.value)
                    }
                  />
                ))}
              </div>
            </div>
            {topRightInputs.slice(-1).map((input) => (
              <UpsertInput
                key={input.field}
                input={input}
                value={movie[input.field]}
                onChange={(e) => mergeMovieState(input.field, e.target.value)}
              />
            ))}
          </div>
          <div className="top-left-container">
            {topLeftInputs.map((input) => (
              <UpsertInput
                key={input.field}
                input={input}
                value={movie[input.field]}
                onChange={(e) => mergeMovieState(input.field, e.target.value)}
              />
            ))}
          </div>
        </div>
        <div className="bottom-container">
          <p className="group-title">Cast</p>
          <AdminPersonGrid
            personType="cast"
            movieId={toEditMovieId}
            onPersonIdsChange={(ids) => {
              console.log("cast changed", ids);
              mergeMovieState("cast", ids);
            }}
          />
          <p className="group-title directors">Directors</p>
          <AdminPersonGrid
            personType="director"
            movieId={toEditMovieId}
            onPersonIdsChange={(ids) => {
              console.log("directors changed", ids);
              mergeMovieState("directors", ids);
            }}
          />
        </div>
      </div>
      <div className="upsert-movie-footer">
        <Button className="submit-button" type="submit" variant="contained">
          Save
        </Button>
      </div>

      <Backdrop open={isLoading}>
        <CircularProgress />
      </Backdrop>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={alertOpen}
        onClose={() => setAlertOpen(false)}
      >
        <Alert severity={message === MESSAGE.success ? "success" : "error"}>
          {message}
        </Alert>
      </Snackbar>
    </form>
  );
};

const defaultMovie = {
  title: "",
  tagline: "",
  overview: "",
  adult: false,
  runtime: "",
  releaseDate: "",
  imdbID: "",
  genres: [],
  countries: [],
  cast: [],
  directors: [],
  trailers: [],
  posterUrl: "",
  backdropUrl: "",
  thumbnailUrl: "",
  videoUrl: "",
  isUpcoming: false,
};

const TRUE_FALSE = [
  {
    value: false,
    label: "False",
  },
  {
    value: true,
    label: "True",
  },
];

const topRightInputs = [
  { field: "title", label: "Title" },
  { field: "tagline", label: "Tagline" },
  {
    field: "runtime",
    label: "Runtime",
    adornment: { position: "end", unit: "min" },
  },
  { field: "releaseDate", label: "Release date" },
  { field: "imdbID", label: "IMDB ID" },
  {
    field: "adult",
    label: "Adult",
    type: "select",
    options: TRUE_FALSE,
  },
  {
    field: "isUpcoming",
    label: "Upcoming",
    type: "select",
    options: TRUE_FALSE,
  },
  { field: "overview", label: "Overview", type: "multiline", rows: 6 },
];

const topLeftInputs = [
  {
    field: "genres",
    label: "Genres",
    type: "multiselect",
    options: apiOptions.MOVIE_GENRES,
  },
  {
    field: "countries",
    label: "Countries",
    type: "multiselect",
    options: apiOptions.COUNTRIES,
  },
  {
    field: "trailers",
    label: "Trailers",
    type: "creatable-multiselect",
    options: [],
  },
  { field: "posterUrl", label: "Poster URL" },
  { field: "thumbnailUrl", label: "Thumbnail URL" },
  { field: "backdropUrl", label: "Backdrop URL" },
  { field: "videoUrl", label: "Video URL" },
];

export default UpsertMovie;