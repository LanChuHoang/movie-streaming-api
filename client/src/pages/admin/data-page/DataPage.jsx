import { useState, useEffect } from "react";
import PropTypes from "prop-types";

import DataTable from "../../../components/tables/data-table/DataTable";
import ActionCell from "../../../components/table-cells/action-cell/ActionCell";
import { ConfirmModal, MessageModal } from "../../../components/modals/Modals";
import "./dataPage.scss";
import AddButton from "../../../components/buttons/add-button/AddButton";

const DataPage = (props) => {
  const [items, setItems] = useState([]);
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
  const { model, itemType } = props;

  const loadItems = async () => {
    try {
      const params = { page: selectedPage };
      sortModel.forEach((o) => (params.sort_by = o.field + ":" + o.sort));
      const response = await model.getItems(params);
      setItems(response.docs);
      setPageSize(response.page_size);
      setTotalItems(response.total_documents);
    } catch (error) {
      console.log(error);
      setErrorMessage(`Something went wrong. Load ${itemType} failed`);
    }
  };

  useEffect(() => {
    loadItems();
  }, [selectedPage, sortModel]);

  const handleViewItem = (id) => {
    console.log("view", id);
  };

  const handleDeleteItem = async (id) => {
    try {
      console.log("delete", id);
      const deletedItem = await model.deleteItem(id);
      loadItems();
    } catch (error) {
      console.log(error);
      setErrorMessage(`Something went wrong. Delete ${itemType} failed`);
      setMessageModalActive(true);
    } finally {
      setConfirmModalActive(false);
    }
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      flex: 2,
      align: "right",
      headerAlign: "right",
      disableColumnMenu: true,
      sortable: false,
      renderCell: (params) => (
        <ActionCell
          onView={() => handleViewItem(params.row._id)}
          onDelete={() => {
            setConfirmModalActive(true);
            setToDeleteId(params.row._id);
          }}
        />
      ),
    },
  ];

  return (
    <div className="data-page-container">
      <div className="data-page-top-container">
        <h1>{props.title}</h1>
        {model.addItem && <AddButton>Add {itemType}</AddButton>}
      </div>

      <div className="data-page-table-container">
        <DataTable
          rows={items}
          columns={[...props.columns, ...actionColumn]}
          getRowId={(r) => r._id}
          totalRows={totalItems || 0}
          sortModel={sortModel}
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
};

export default DataPage;
