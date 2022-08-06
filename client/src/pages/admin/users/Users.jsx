import { toFullDateFormat } from "../../../api/helper";
import useBackendApi from "../../../hooks/useBackendApi";

import DataPage from "../data-page/DataPage";
import RoleCell from "../../../components/table-cells/role-cell/RoleCell";

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
  const backendApi = useBackendApi();
  const model = {
    getItems: async (params) => {
      return (await backendApi.getUsers(params)).data;
    },
    updateItem: (id) => {
      console.log(id);
    },
    deleteItem: async (id) => {
      return (await backendApi.deleteUser(id)).data;
    },
  };
  return (
    <DataPage title="Users" itemType="user" columns={columns} model={model} />
  );
};

export default Users;
