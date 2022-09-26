import "./upsertPerson.scss";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import tmdbApi from "../../../api/tmdb/tmdbApi";
import useBackendApi from "../../../hooks/useBackendApi";
import AdminImportBar from "../../../components/admin-import-bar/AdminImportBar";
import { GENDERS, JOBS } from "../../../api/filterOptions";
import UpsertInput from "../../../components/inputs/upsert-input/UpsertInput";
import {
  getImageUrl,
  imageSize,
  toPersonModel,
} from "../../../api/tmdb/tmdbApi.helper";
import {
  Alert,
  Backdrop,
  Button,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import { useCallback } from "react";
import { capitalize } from "lodash";
import ProfileCell from "../../../components/table-cells/profile-cell/ProfileCell";

const UpsertPerson = () => {
  const { id } = useParams();
  const [person, setPerson] = useState(defaultPerson);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState();
  const [alertOpen, setAlertOpen] = useState(false);
  const backendApi = useBackendApi().person;

  const mergePersonState = useCallback((field, value) => {
    setPerson((prevPerson) => ({ ...prevPerson, [field]: value }));
  }, []);

  useEffect(() => {
    const loadToEditPerson = async (id) => {
      setIsLoading(true);
      try {
        const toEditPerson = (await backendApi.getItem(id)).data;
        setPerson(toEditPerson);
      } catch (error) {
        console.log(error);
        setAlertOpen(true);
        setMessage(MESSAGE.loadingFail);
      } finally {
        setIsLoading(false);
      }
    };
    id && loadToEditPerson(id);
  }, [id, backendApi]);

  const handlePersonSelect = async (tmdbPerson) => {
    setIsLoading(true);
    let resultMessage;
    try {
      const tmdbPersonDetail = (await tmdbApi.person.getPerson(tmdbPerson.id))
        .data;
      const newPerson = toPersonModel(tmdbPersonDetail);
      setPerson(newPerson);
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
    setIsLoading(true);
    let resultMessage;
    try {
      const { _id, createdAt, updatedAt, ...personData } = person;
      const upsertedPerson = id
        ? (await backendApi.updateItem(id, personData)).data
        : (await backendApi.addItem(personData)).data;
      resultMessage = MESSAGE.saveSuccess;
      console.log("Person submited", upsertedPerson);
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
    <form className="upsert-person-container" onSubmit={handleFormSubmit}>
      <AdminImportBar
        title={id ? `Edit ${id?.slice(-4) || "person"}` : "Add person"}
        searchItems={tmdbApi.person.searchPeople}
        getOptionLabel={(option) => option.name}
        renderOption={(option) => (
          <ProfileCell
            avatarUrl={getImageUrl(option.profile_path, imageSize.w45)}
            name={option.name}
            avatarSize="small"
          />
        )}
        onItemSelect={handlePersonSelect}
      />
      <div className="upsert-person-inputs-wrapper">
        {inputs.slice(0, 1).map((input) => (
          <UpsertInput
            className={`${input.field}-person-input`}
            key={input.field}
            input={input}
            value={id || person[input.field]}
          />
        ))}
        {inputs.slice(1).map((input) => (
          <UpsertInput
            className={`${input.field}-person-input`}
            key={input.field}
            input={input}
            value={person[input.field]}
            onChange={mergePersonState}
          />
        ))}
      </div>
      <div className="upsert-person-footer">
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

const defaultPerson = {
  name: "",
  gender: "",
  dob: "",
  pob: "",
  job: "",
  biography: "",
  avatarUrl: "",
  images: [],
};

const toSelectOptions = (options) =>
  options.map((o) => ({ value: o, label: capitalize(o) }));

const inputs = [
  { field: "_id", label: "ID", readOnly: true },
  { field: "name", label: "Name" },
  {
    field: "gender",
    label: "Gender",
    type: "select",
    options: toSelectOptions(GENDERS),
  },
  { field: "dob", label: "Date of birth" },
  { field: "pob", label: "Place of birth" },
  {
    field: "job",
    label: "Job",
    type: "select",
    options: toSelectOptions(JOBS),
  },
  { field: "biography", label: "Biography", type: "multiline", rows: 3.5 },
  { field: "avatarUrl", label: "Avatar URL" },
  { field: "images", label: "Images" },
];

const MESSAGE = {
  loadingFail: { type: "error", label: "Failed to load resource" },
  importTmdbSuccess: { type: "success", label: "Imported successfully!" },
  importTmdbFail: { type: "error", label: "Import failed" },
  saveSuccess: { type: "success", label: "Saved successfully!" },
  noResponse: { type: "error", label: "No server response" },
  invalidId: { type: "error", label: "Invalid person ID" },
};

export default UpsertPerson;
