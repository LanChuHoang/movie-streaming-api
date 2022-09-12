import "./upsertShow.scss";
import { useParams } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import tmdbApi from "../../../api/tmdb/tmdbApi";
import useBackendApi from "../../../hooks/useBackendApi";
import AdminImportBar from "../../../components/admin-import-bar/AdminImportBar";
import { apiOptions } from "../../../api/filterOptions";
import UpsertInput from "../../../components/inputs/upsert-input/UpsertInput";
import AdminPersonGrid from "../../../components/admin-person-grid/AdminPersonGrid";
import { toShowModel } from "../../../api/tmdb/tmdbApi.helper";
import {
  Alert,
  Backdrop,
  Button,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import AdminSeasonGrid from "../../../components/admin-season-grid/AdminSeasonGrid";

const MESSAGE = {
  loadingFail: { type: "error", label: "Failed to load resource" },
  importTmdbSuccess: { type: "success", label: "Imported successfully!" },
  importTmdbFail: { type: "error", label: "Import failed" },
  saveSuccess: { type: "success", label: "Saved successfully!" },
  noResponse: { type: "error", label: "No server response" },
  invalidId: { type: "error", label: "Invalid movie ID" },
};

const UpsertShow = () => {
  const { id } = useParams();
  const [show, setShow] = useState(defaultShow);
  const [toEditShowId, setToEditShowId] = useState({
    value: "",
    source: "", // backend-api or tmdb-api
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState();
  const [alertOpen, setAlertOpen] = useState(false);
  const backendApi = useBackendApi().show;

  const mergeShowState = (field, value) => {
    setShow({ ...show, [field]: value });
  };

  useEffect(() => {
    const loadToEditShow = async (id) => {
      setIsLoading(true);
      try {
        const toEditShow = (await backendApi.getShow(id)).data;
        setShow(toEditShow);
        setToEditShowId({ value: toEditShow._id, source: "backend-api" });
      } catch (error) {
        console.log(error);
        setAlertOpen(true);
        setMessage(MESSAGE.loadingFail);
      } finally {
        setIsLoading(false);
      }
    };
    id && loadToEditShow(id);
  }, [id, backendApi]);

  const handleShowSelect = async (tmdbShow) => {
    setIsLoading(true);
    let resultMessage;
    try {
      const tmdbShowDetail = await tmdbApi.show.getShow(tmdbShow.id);
      const newShow = toShowModel(tmdbShowDetail);
      setShow(newShow);
      setToEditShowId({ value: tmdbShow.id, source: "tmdb-api" });
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

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    console.log("handle submit");
    setIsLoading(true);
    let resultMessage;
    try {
      const { _id, _createdAt, _updatedAt, ...showData } = show;
      const upsertedShow = id
        ? (await backendApi.updateShow(id, showData)).data
        : (await backendApi.addShow(showData)).data;
      resultMessage = MESSAGE.saveSuccess;
      console.log(upsertedShow);
    } catch (error) {
      switch (error.response?.status) {
        case 400:
        case 500:
          resultMessage = error.response.data.error;
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

  const handleSeasonsChange = useCallback((newSeasons) => {
    setShow((prevShow) => ({ ...prevShow, seasons: newSeasons }));
  }, []);

  return (
    <form className="upsert-movie-container" onSubmit={handleFormSubmit}>
      <AdminImportBar
        title={id ? `Edit ${id?.slice(-4) || "show"}` : "Add show"}
        searchItems={tmdbApi.show.searchShows}
        getOptionLabel={(option) => option.name}
        renderOption={(option) => <p>{option.name}</p>}
        onItemSelect={handleShowSelect}
      />
      <div className="upsert-movie-inputs-wrapper">
        <p className="group-title">Basic Info</p>
        <div className="top-container">
          <div className="top-right-container">
            {topRightInputs.slice(0, 2).map((input) => (
              <UpsertInput
                key={input.field}
                input={input}
                value={show[input.field]}
                onChange={(e) => mergeShowState(input.field, e.target.value)}
              />
            ))}
            <div className="two-column-grid">
              {topRightInputs.slice(2, 6).map((input) => (
                <UpsertInput
                  key={input.field}
                  input={input}
                  value={show[input.field]}
                  onChange={(e) => mergeShowState(input.field, e.target.value)}
                />
              ))}
            </div>
            {topRightInputs.slice(-1).map((input) => (
              <UpsertInput
                key={input.field}
                input={input}
                value={show[input.field]}
                onChange={(e) => mergeShowState(input.field, e.target.value)}
              />
            ))}
          </div>
          <div className="top-left-container">
            {topLeftInputs.map((input) => (
              <UpsertInput
                key={input.field}
                input={input}
                value={show[input.field]}
                onChange={(e) => mergeShowState(input.field, e.target.value)}
              />
            ))}
          </div>
        </div>
        <div className="bottom-container">
          <p className="group-title">Seasons</p>
          <AdminSeasonGrid
            seasons={show.seasons}
            onChange={handleSeasonsChange}
          />
          <p className="group-title">Cast</p>
          <AdminPersonGrid
            personType="cast"
            itemType="show"
            itemId={toEditShowId}
            onPersonIdsChange={(ids) => {
              console.log("cast changed", ids);
              mergeShowState("cast", ids);
            }}
          />
          <p className="group-title directors">Directors</p>
          <AdminPersonGrid
            personType="director"
            itemType="show"
            itemId={toEditShowId}
            onPersonIdsChange={(ids) => {
              console.log("directors changed", ids);
              mergeShowState("directors", ids);
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

const defaultShow = {
  title: "",
  tagline: "",
  overview: "",
  adult: false,
  firstAirDate: "",
  lastAirDate: "",
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
  seasons: [],
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
    field: "firstAirDate",
    label: "First air date",
  },
  { field: "lastAirDate", label: "Last air date" },
  { field: "imdbID", label: "IMDB ID" },
  {
    field: "adult",
    label: "Adult",
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
    options: apiOptions.SHOW_GENRES,
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

export default UpsertShow;
