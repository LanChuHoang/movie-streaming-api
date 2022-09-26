import { useState } from "react";
import { GridToolbarContainer } from "@mui/x-data-grid";
import {
  Button,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import "./adminPersonGridToolbar.scss";
import useBackendApi from "../../hooks/useBackendApi";

const MESSAGE = {
  success: "Added",
  duplicateId: "The ID is already added",
  invalidId: "Invalid ID",
  notFoundId: "Not found any matched ID",
  noResponse: "No server response",
};

const AdminPersonGridToolbar = ({
  validateNewRowId,
  onNewRowSave,
  numRows,
  numStoredRows,
  onUpdateClick,
}) => {
  const [toAddId, setToAddId] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState();
  const [isAdding, setIsAdding] = useState(false);
  const backendApi = useBackendApi().person;
  const isAllStored = numStoredRows === numRows;

  const handleSaveClick = async () => {
    if (!toAddId) {
      setMessage(MESSAGE.invalidId);
      return;
    }

    setIsLoading(true);
    const isValidId = validateNewRowId(toAddId);
    if (!isValidId) {
      setIsLoading(false);
      setMessage(MESSAGE.duplicateId);
      return;
    }

    try {
      const newPerson = (await backendApi.getItem(toAddId)).data;
      setMessage(MESSAGE.success);
      onNewRowSave(newPerson);
    } catch (error) {
      switch (error.response?.status) {
        case 400:
          setMessage(MESSAGE.invalidId);
          break;
        case 404:
          setMessage(MESSAGE.notFoundId);
          break;
        default:
          setMessage(MESSAGE.noResponse);
          break;
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GridToolbarContainer className="admin-person-grid-toolbar-container">
      <div className="toolbar-buttons-container">
        <Button
          color="secondary"
          className="toolbar-button left-button"
          startIcon={<i className="bx bx-plus"></i>}
          onClick={() => setIsAdding(true)}
          variant="text"
        >
          Add
        </Button>
        {numRows !== 0 && (
          <div className={`status ${isAllStored ? "done" : "warning"}`}>
            {`Included people ${numStoredRows}/${numRows}`}
          </div>
        )}
        <Button
          color="secondary"
          className="toolbar-button"
          disabled={isAllStored}
          onClick={onUpdateClick}
          variant="outlined"
        >
          Update
        </Button>
      </div>
      <div className={`add-row-inputs ${isAdding ? "" : "hidden"}`}>
        <FormControl size="small">
          <Select
            className="input-source-select"
            defaultValue={inputSource[0].value}
          >
            {inputSource.map((src) => (
              <MenuItem key={src.value} size="small" value={src.value}>
                {src.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          size="small"
          label="ID"
          error={message && message !== MESSAGE.success}
          helperText={message}
          onInput={() => {
            message && setMessage();
          }}
          onBlur={(e) => {
            setToAddId(e.target.value);
          }}
        />
        <div className="buttons-wrapper">
          <IconButton disabled={isLoading} onClick={handleSaveClick}>
            {isLoading ? (
              <i className="bx bx-loader-alt bx-spin"></i>
            ) : (
              <i className="bx bx-check"></i>
            )}
          </IconButton>
          <IconButton
            className="cancel-button"
            disabled={isLoading}
            onClick={() => setIsAdding(false)}
          >
            <i className="bx bx-x"></i>
          </IconButton>
        </div>
      </div>
    </GridToolbarContainer>
  );
};

const inputSource = [
  {
    value: "backend-api",
    label: "From database",
  },
];

export default AdminPersonGridToolbar;
