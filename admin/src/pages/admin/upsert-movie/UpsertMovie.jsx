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
import { useCallback } from "react";

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
  const backendApi = useBackendApi().movie;

  const mergeMovieState = useCallback((field, value) => {
    setMovie((prevMovie) => ({ ...prevMovie, [field]: value }));
  }, []);

  useEffect(() => {
    const loadToEditMovie = async (id) => {
      setIsLoading(true);
      try {
        const toEditMovie = (await backendApi.getItem(id)).data;
        setMovie(toEditMovie);
        setToEditMovieId({ value: toEditMovie._id, source: "backend-api" });
      } catch (error) {
        console.log(error);
        setAlertOpen(true);
        setMessage(MESSAGE.loadingFail);
      } finally {
        setIsLoading(false);
      }
    };
    id && loadToEditMovie(id);
  }, [id, backendApi]);

  const handleMovieSelect = async (tmdbMovie) => {
    setIsLoading(true);
    let resultMessage;
    try {
      const tmdbMovieDetail = await tmdbApi.movie.getMovie(tmdbMovie.id);
      const newMovie = toMovieModel(tmdbMovieDetail);
      setMovie(newMovie);
      setToEditMovieId({ value: tmdbMovie.id, source: "tmdb-api" });
      resultMessage = MESSAGE.importTmdbSuccess;
    } catch (error) {
      console.log(error);
      resultMessage = MESSAGE.importTmdbFail;
    } finally {
      setIsLoading(false);
      setAlertOpen(true);
      setMessage(resultMessage);
    }
  };

  const handleCastIdsChange = useCallback(
    (newIds) => {
      console.log("cast changed", newIds);
      mergeMovieState("cast", newIds);
    },
    [mergeMovieState]
  );

  const handleDirectorIdsChange = useCallback(
    (newIds) => {
      console.log("directors changed", newIds);
      mergeMovieState("directors", newIds);
    },
    [mergeMovieState]
  );

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    let resultMessage;
    try {
      const { _id, createdAt, updatedAt, ...movieData } = movie;
      const upsertedMovie = id
        ? (await backendApi.updateItem(id, movieData)).data
        : (await backendApi.addItem(movieData)).data;
      resultMessage = MESSAGE.saveSuccess;
      console.log("movie submited", upsertedMovie);
    } catch (error) {
      switch (error.response?.status) {
        case 400:
        case 500:
          resultMessage = { type: "error", label: error.response.data.error };
          break;
        case 404:
          resultMessage = MESSAGE.invalidId;
          break;
        default:
          resultMessage = MESSAGE.noResponse;
          break;
      }
    } finally {
      setIsLoading(false);
      setAlertOpen(true);
      setMessage(resultMessage);
    }
  };

  return (
    <form className="upsert-movie-container" onSubmit={handleFormSubmit}>
      <AdminImportBar
        title={id ? `Edit ${id?.slice(-4) || "movie"}` : "Add movie"}
        searchItems={tmdbApi.movie.searchMovies}
        getOptionLabel={(option) => option.title}
        renderOption={(option) => <p>{option.title}</p>}
        onItemSelect={handleMovieSelect}
      />
      <div className="upsert-movie-inputs-wrapper">
        <div className="upsert-inputs-group">
          <p className="group-title">Basic Info</p>
          <div className="top-container">
            <div className="top-right-container">
              <UpsertInput
                key={idInput.field}
                input={idInput}
                value={id || ""}
              />
              {topRightInputs.slice(0, 2).map((input) => (
                <UpsertInput
                  key={input.field}
                  input={input}
                  value={movie[input.field]}
                  onChange={mergeMovieState}
                />
              ))}
              <div className="two-column-grid">
                {topRightInputs.slice(2, 5).map((input) => (
                  <UpsertInput
                    key={input.field}
                    input={input}
                    value={movie[input.field]}
                    onChange={mergeMovieState}
                  />
                ))}
                <div className="two-column-grid">
                  {topRightInputs.slice(5, 7).map((input) => (
                    <UpsertInput
                      key={input.field}
                      input={input}
                      value={movie[input.field]}
                      onChange={mergeMovieState}
                    />
                  ))}
                </div>
              </div>
              {topRightInputs.slice(-1).map((input) => (
                <UpsertInput
                  key={input.field}
                  input={input}
                  value={movie[input.field]}
                  onChange={mergeMovieState}
                />
              ))}
            </div>
            <div className="top-left-container">
              {topLeftInputs.map((input) => (
                <UpsertInput
                  key={input.field}
                  input={input}
                  value={movie[input.field]}
                  onChange={mergeMovieState}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="upsert-inputs-group">
          <p className="group-title">Cast</p>
          <AdminPersonGrid
            personType="cast"
            itemType="movie"
            itemId={toEditMovieId}
            onPersonIdsChange={handleCastIdsChange}
          />
        </div>

        <div className="upsert-inputs-group">
          <p className="group-title">Directors</p>
          <AdminPersonGrid
            personType="director"
            itemType="movie"
            itemId={toEditMovieId}
            onPersonIdsChange={handleDirectorIdsChange}
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
        autoHideDuration={4000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={alertOpen}
        onClose={() => setAlertOpen(false)}
      >
        <Alert severity={message?.type === "success" ? "success" : "error"}>
          {message?.label}
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

const idInput = { field: "_id", label: "ID", readOnly: true };

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
  { field: "overview", label: "Overview", type: "multiline", rows: 3.5 },
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

const MESSAGE = {
  loadingFail: { type: "error", label: "Failed to load resource" },
  importTmdbSuccess: { type: "success", label: "Imported successfully!" },
  importTmdbFail: { type: "error", label: "Import failed" },
  saveSuccess: { type: "success", label: "Saved successfully!" },
  noResponse: { type: "error", label: "No server response" },
  invalidId: { type: "error", label: "Invalid movie ID" },
};

export default UpsertMovie;
