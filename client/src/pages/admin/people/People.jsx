import { toFullDateFormat } from "../../../api/helper";
import useBackendApi from "../../../hooks/useBackendApi";

import DataPage from "../data-page/DataPage";
import ProfileCell from "../../../components/table-cells/profile-cell/ProfileCell";
import RoleCell from "../../../components/table-cells/role-cell/RoleCell";
import "./people.scss";

const People = () => {
  const backendApi = useBackendApi().person;
  const model = {
    getItems: backendApi.getItems,
    searchItems: backendApi.searchItems,
    deleteItem: backendApi.deleteItem,
  };

  return (
    <DataPage
      title="People"
      itemType="person"
      columns={columns}
      model={model}
      addable
      editable
    />
  );
};

const columns = [
  { field: "_id", headerName: "ID", flex: 2.5, filterable: false },
  {
    field: "name",
    headerName: "Name",
    flex: 2.5,
    filterable: false,
    renderCell: ({ row }) => (
      <ProfileCell avatarUrl={row.avatarUrl} name={row.name} />
    ),
  },
  {
    field: "dob",
    headerName: "Born",
    type: "date",
    flex: 3,
    filterable: false,
    valueGetter: (params) => {
      const dob = new Date(params.row.dob).toLocaleDateString("vi-VN", {
        timeZone: "utc",
      });
      const pob = params.row.pob?.split(",").slice(-2).join(",") || "";
      return `${dob} ${pob}`;
    },
  },
  {
    field: "job",
    headerName: "Job",
    filterable: false,
    renderCell: ({ row }) => (
      <RoleCell className={`${row.job.toLowerCase()}-cell`}>{row.job}</RoleCell>
    ),
  },
  {
    field: "createdAt",
    headerName: "Date added",
    type: "date",
    flex: 2,
    align: "right",
    headerAlign: "right",
    filterable: false,
    valueGetter: (params) => toFullDateFormat(params.row.createdAt),
  },
];

export default People;
