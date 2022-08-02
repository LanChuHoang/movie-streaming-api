import { toFullDateFormat } from "../../../api/helper";
import { useState, useEffect } from "react";
import useBackendApi from "../../../hooks/useBackendApi";

import AddButton from "../../../components/buttons/add-button/AddButton";
import DataTable from "../../../components/tables/data-table/DataTable";
import RoleCell from "../../../components/table-cells/role-cell/RoleCell";
import ActionCell from "../../../components/table-cells/action-cell/ActionCell";
import "./users.scss";

const columns = [
  { field: "_id", headerName: "ID", width: 250 },
  { field: "username", headerName: "Username", width: 150 },
  { field: "email", headerName: "Email", width: 200 },
  {
    field: "createdAt",
    headerName: "Join date",
    type: "date",
    width: 200,
    valueGetter: (params) => toFullDateFormat(params.row.createdAt),
  },
  {
    field: "isAdmin",
    headerName: "Role",
    renderCell: (params) => <RoleCell isAdmin={params.isAdmin} />,
  },
  {
    field: "action",
    headerName: "Action",
    width: 200,
    align: "right",
    sortable: false,
    renderCell: (_) => (
      <ActionCell
        onView={() => console.log("view")}
        onDelete={() => console.log("delete")}
      />
    ),
  },
];

const Users = () => {
  const [users, setUsers] = useState([]);
  const [selectedPage, setSelectedPage] = useState(1);
  const [sortModel, setSortModel] = useState([]);
  const [selectedIds, setSelectedIds] = useState();
  const backendApi = useBackendApi();

  useEffect(() => {
    const loadUsers = async () => {
      const params = { page: selectedPage };
      sortModel.forEach((o) => (params.sort_by = o.field + ":" + o.sort));
      console.log(params);
      const response = (await backendApi.getUsers(params)).data;

      setUsers(response.docs);
    };
    loadUsers();
  }, [selectedPage, sortModel]);

  useEffect(() => {
    selectedIds && console.log(selectedIds);
  }, [selectedIds]);

  return (
    <div className="users-container">
      <div className="users-top-container">
        <h1>Users</h1>
        <AddButton onClick={() => console.log("add")}>Add user</AddButton>
      </div>

      <div className="users-table-container">
        <DataTable
          rows={users}
          columns={columns}
          getRowId={(r) => r._id}
          totalRows={100}
          pageSize={10}
          onPageChange={(page) => setSelectedPage(page + 1)}
          onSortModelChange={(model) => setSortModel(model)}
          onSelectionModelChange={(model) => setSelectedIds(model)}
        />
      </div>
    </div>
  );
};

export default Users;
