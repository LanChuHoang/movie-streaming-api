import { toFullDateFormat } from "../../../api/helper";
import { useState, useEffect } from "react";
import useBackendApi from "../../../hooks/useBackendApi";

import AddButton from "../../../components/buttons/add-button/AddButton";
import DataTable from "../../../components/tables/data-table/DataTable";
import RoleCell from "../../../components/table-cells/role-cell/RoleCell";
import ActionCell from "../../../components/table-cells/action-cell/ActionCell";
import { ConfirmModal, MessageModal } from "../../../components/modals/Modals";
import "./users.scss";

const columns = [
  { field: "_id", headerName: "ID", flex: 3, filterable: false },
  { field: "username", headerName: "Username", flex: 1.5, filterable: false },
  { field: "email", headerName: "Email", flex: 2, filterable: false },
  {
    field: "createdAt",
    headerName: "Join date",
    type: "date",
    flex: 2,
    filterable: false,
    valueGetter: (params) => toFullDateFormat(params.row.createdAt),
  },
  {
    field: "isAdmin",
    headerName: "Role",
    filterable: false,
    renderCell: (params) => <RoleCell isAdmin={params.row.isAdmin} />,
  },
];

const Users = () => {
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState();
  const [pageSize, setPageSize] = useState();
  const [selectedPage, setSelectedPage] = useState(1);
  const [sortModel, setSortModel] = useState([
    { field: "createdAt", sort: "desc" },
  ]);
  const [toDeleteId, setToDeleteId] = useState();
  const [confirmModalActive, setConfirmModalActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const [messageModalActive, setMessageModalActive] = useState(false);
  const backendApi = useBackendApi();

  const loadUsers = async () => {
    const params = { page: selectedPage };
    sortModel.forEach((o) => (params.sort_by = o.field + ":" + o.sort));
    const response = (await backendApi.getUsers(params)).data;
    setUsers(response.docs);
    setPageSize(response.page_size);
    setTotalUsers(response.total_documents);
  };
  useEffect(() => {
    loadUsers();
  }, [selectedPage, sortModel]);

  const handleViewUser = (id) => {
    console.log("view", id);
  };

  const handleDeleteUser = async (id) => {
    try {
      console.log("delete", id);
      const deletedUser = (await backendApi.deleteUser(id)).data;
      loadUsers();
    } catch (error) {
      console.log(error);
      setErrorMessage("Something went wrong. Delete user failed");
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
          onView={() => handleViewUser(params.row._id)}
          onDelete={() => {
            setConfirmModalActive(true);
            setToDeleteId(params.row._id);
          }}
        />
      ),
    },
  ];

  return (
    <div className="users-container">
      <div className="users-top-container">
        <h1>Users</h1>
      </div>

      <div className="users-table-container">
        <DataTable
          rows={users}
          columns={[...columns, ...actionColumn]}
          getRowId={(r) => r._id}
          totalRows={totalUsers || 0}
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
        onConfirm={() => handleDeleteUser(toDeleteId)}
      >
        Are you sure you want to delete this user?
      </ConfirmModal>
      <MessageModal
        active={messageModalActive}
        onConfirm={() => setMessageModalActive(false)}
      >
        {errorMessage}
      </MessageModal>
    </div>
  );
};

export default Users;
