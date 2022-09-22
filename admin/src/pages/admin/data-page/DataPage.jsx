import { useState, useEffect, useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import DataTable from "../../../components/tables/data-table/DataTable";
import {
  DeleteActionCell,
  EditActionCell,
} from "../../../components/table-cells/action-cell/ActionCell";
import "./dataPage.scss";
import AddButton from "../../../components/buttons/add-button/AddButton";
import AdminSearchBar from "../../../components/search-bar/AdminSearchBar";
import { useNavigate } from "react-router-dom";
import { Alert, Button, Snackbar } from "@mui/material";
import CenterModal from "../../../components/modals/center-modal/CenterModal";

const DataPage = ({
  model,
  title,
  itemType,
  columns: initialColumns,
  addable = false,
  editable = false,
}) => {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState();
  const [totalItems, setTotalItems] = useState();
  const [pageSize, setPageSize] = useState();
  const [selectedPage, setSelectedPage] = useState(1);
  const [sortModel, setSortModel] = useState([
    { field: "createdAt", sort: "desc" },
  ]);
  const [toDeleteId, setToDeleteId] = useState();
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [message, setMessage] = useState();
  const [messageAlertOpen, setMessageAlertOpen] = useState(false);
  const navigate = useNavigate();

  const loadItems = async () => {
    try {
      let response;
      if (query) {
        const params = { query, page: selectedPage };
        response = (await model.searchItems(params)).data;
      } else {
        const params = { page: selectedPage };
        sortModel.forEach((o) => (params.sort = o.field + ":" + o.sort));
        response = (await model.getItems(params)).data;
      }
      setItems(response.docs);
      setPageSize(response.pageSize);
      setTotalItems(response.totalDocuments);
    } catch (error) {
      console.log(error);
      setMessageAlertOpen(true);
      setMessage(MESSAGE.loadItemsFailed);
    }
  };

  useEffect(() => {
    loadItems();
  }, [selectedPage, sortModel]);

  const handleAddItem = () => {
    navigate(`/${itemType}/add`);
  };

  const handleSearchItems = async (query) => {
    if (!query) return;
    setQuery(query);
    setSelectedPage(1);
    setSortModel([]);
  };

  const handleEditItem = useCallback(
    (id) => {
      navigate(`/${itemType}/${id}`);
    },
    [navigate, itemType]
  );

  const handleDeleteItem = async (id) => {
    try {
      const deletedItem = (await model.deleteItem(id)).data;
      console.log("deleted", deletedItem);
      setMessageAlertOpen(true);
      setMessage(MESSAGE.deleteSuccess);
      loadItems();
    } catch (error) {
      console.log(error);
      setMessageAlertOpen(true);
      setMessage(MESSAGE.deleteFailed);
    } finally {
      setConfirmModalOpen(false);
    }
  };

  const handleDeleteRowClick = useCallback((id) => {
    setConfirmModalOpen(true);
    setToDeleteId(id);
  }, []);

  const columns = useMemo(
    () => [
      ...initialColumns,
      {
        field: "actions",
        type: "actions",
        flex: 1.2,
        getActions: (params) =>
          editable
            ? [
                <DeleteActionCell
                  onClick={() => handleDeleteRowClick(params.id)}
                />,
                <EditActionCell onClick={() => handleEditItem(params.id)} />,
              ]
            : [
                <DeleteActionCell
                  onClick={() => handleDeleteRowClick(params.id)}
                />,
              ],
      },
    ],
    [initialColumns, editable, handleDeleteRowClick, handleEditItem]
  );

  return (
    <div className="data-page-container">
      <div className="data-page-top-container">
        <h1>{title}</h1>
        <div className="data-page-tool-bar">
          <AdminSearchBar
            className="view-items-search-bar"
            onInputValue={(inputValue) => {
              if (!inputValue && query) {
                setQuery("");
                setSelectedPage(1);
                setSortModel([{ field: "createdAt", sort: "desc" }]);
              }
            }}
            onSearch={handleSearchItems}
          />
          {addable && (
            <AddButton onClick={() => handleAddItem()}>
              Add {itemType}
            </AddButton>
          )}
        </div>
      </div>

      <div className="data-page-table-container">
        <DataTable
          rows={items}
          columns={columns}
          getRowId={(r) => r._id}
          totalRows={totalItems || 0}
          sortModel={sortModel}
          page={selectedPage - 1}
          pageSize={pageSize}
          onPageChange={(page) => setSelectedPage(page + 1)}
          onSortModelChange={(model) => setSortModel(model)}
        />
      </div>

      <ConfirmModal
        open={confirmModalOpen}
        onClose={(agreed) => {
          setConfirmModalOpen(false);
          agreed && handleDeleteItem(toDeleteId);
        }}
        itemType={itemType}
      />
      <Snackbar
        autoHideDuration={4000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={messageAlertOpen}
        onClose={() => setMessageAlertOpen(false)}
      >
        <Alert severity={message?.type === "success" ? "success" : "error"}>
          {message?.label}
        </Alert>
      </Snackbar>
    </div>
  );
};

const MESSAGE = {
  deleteSuccess: {
    type: "success",
    label: "Deleted successfully!",
  },
  deleteFailed: {
    type: "error",
    label: "Failed to delete item",
  },
  loadItemsFailed: {
    type: "error",
    label: "Failed to load resource",
  },
};

DataPage.propTypes = {
  model: PropTypes.shape({
    getItems: PropTypes.func,
    searchItems: PropTypes.func,
    deleteItem: PropTypes.func,
  }),
  title: PropTypes.string,
  itemType: PropTypes.string,
  columns: PropTypes.array,
  addable: PropTypes.bool,
  editable: PropTypes.bool,
};

const ConfirmModal = ({ open, onClose, itemType = "item" }) => {
  return (
    <CenterModal
      open={open}
      onClose={() => onClose(false)}
      className="confirm-modal-container"
    >
      <p>Are you sure you want to delete this {itemType}?</p>
      <div className="confirm-modal-buttons">
        <Button className="cancel-button" onClick={() => onClose(false)}>
          Cancel
        </Button>
        <Button
          className="delete-button"
          color="error"
          onClick={() => onClose(true)}
        >
          Delete
        </Button>
      </div>
    </CenterModal>
  );
};

export default DataPage;
