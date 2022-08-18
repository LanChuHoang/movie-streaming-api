import { toFullDateFormat } from "../../../api/helper";
import useBackendApi from "../../../hooks/useBackendApi";

import DataPage from "../data-page/DataPage";
import RoleCell from "../../../components/table-cells/role-cell/RoleCell";
import ProfileCell from "../../../components/table-cells/profile-cell/ProfileCell";
import "./users.scss";

const columns = [
  { field: "_id", headerName: "ID", flex: 2.5, filterable: false },
  {
    field: "username",
    headerName: "Username",
    flex: 2,
    filterable: false,
    renderCell: ({ row }) => (
      <ProfileCell avatarUrl={row.profileImage} name={row.username} />
    ),
  },
  { field: "email", headerName: "Email", flex: 2, filterable: false },
  {
    field: "isAdmin",
    headerName: "Role",
    filterable: false,
    renderCell: ({ row }) =>
      row.isAdmin ? (
        <RoleCell className="admin-cell">Admin</RoleCell>
      ) : (
        <RoleCell className="user-cell">User</RoleCell>
      ),
  },
  {
    field: "createdAt",
    headerName: "Join date",
    type: "date",
    flex: 2,
    align: "right",
    headerAlign: "right",
    filterable: false,
    valueGetter: (params) => toFullDateFormat(params.row.createdAt),
  },
];

const Users = () => {
  const backendApi = useBackendApi();
  const model = {
    addItem: () => {},
    getItems: backendApi.getUsers,
    searchItems: backendApi.searchUsers,
    updateItem: (id) => {
      console.log(id);
    },
    deleteItem: backendApi.deleteUser,
  };
  return (
    <DataPage title="Users" itemType="user" columns={columns} model={model} />
  );
};

export default Users;
