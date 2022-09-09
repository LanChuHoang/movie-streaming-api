import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import DataTable from "../../../components/tables/data-table/DataTable";
import {
  DeleteActionCell,
  EditActionCell,
} from "../../../components/table-cells/action-cell/ActionCell";
import { ConfirmModal, MessageModal } from "../../../components/modals/Modals";
import "./dataPage.scss";
import AddButton from "../../../components/buttons/add-button/AddButton";
import AdminSearchBar from "../../../components/search-bar/AdminSearchBar";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { useCallback } from "react";

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
  const [confirmModalActive, setConfirmModalActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const [messageModalActive, setMessageModalActive] = useState(false);
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
      setErrorMessage(`Something went wrong. Load ${itemType} failed`);
    }
  };

  useEffect(() => {
    loadItems();
  }, [selectedPage, sortModel]);

  const handleAddItem = () => {
    navigate(`/admin/${itemType}`);
  };

  const handleSearchItems = async (query) => {
    if (!query) return;
    setQuery(query);
    setSelectedPage(1);
    setSortModel([]);
  };

  const handleEditItem = useCallback(
    (id) => {
      navigate(`/admin/${itemType}/${id}`);
    },
    [navigate, itemType]
  );

  const handleDeleteItem = async (id) => {
    try {
      console.log("delete", id);
      const deletedItem = (await model.deleteItem(id)).data;
      loadItems();
    } catch (error) {
      console.log(error);
      setErrorMessage(`Something went wrong. Delete ${itemType} failed`);
      setMessageModalActive(true);
    } finally {
      setConfirmModalActive(false);
    }
  };

  const handleDeleteRowClick = useCallback((id) => {
    setConfirmModalActive(true);
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
        active={confirmModalActive}
        confirmButtonTitle="Delete"
        onCancel={() => setConfirmModalActive(false)}
        onConfirm={() => handleDeleteItem(toDeleteId)}
      >
        Are you sure you want to delete this {itemType}?
      </ConfirmModal>
      <MessageModal
        active={messageModalActive}
        onConfirm={() => {
          setMessageModalActive(false);
          setErrorMessage(undefined);
        }}
      >
        {errorMessage}
      </MessageModal>
    </div>
  );
};

DataPage.propTypes = {
  model: PropTypes.shape({
    addItem: PropTypes.func,
    getItems: PropTypes.func,
    updateItem: PropTypes.func,
    deleteItem: PropTypes.func,
  }),
  title: PropTypes.string,
  itemType: PropTypes.string,
  columns: PropTypes.array,
  AddModal: PropTypes.elementType,
  EditModal: PropTypes.elementType,
};

export default DataPage;
