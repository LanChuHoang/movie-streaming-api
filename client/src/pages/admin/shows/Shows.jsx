import ShowApi from "../../../api/backendApi/ShowApi";
import { toFullDateFormat } from "../../../api/helper";
import { RectangularProfileCell } from "../../../components/table-cells/profile-cell/ProfileCell";
import useBackendApi from "../../../hooks/useBackendApi";

import DataPage from "../data-page/DataPage";

const Shows = () => {
  const showApi = useBackendApi().show;
  const model = {
    getItems: (params) =>
      showApi.getItems({ ...params, fields: ShowApi.adminBaseFields }),
    searchItems: (params) =>
      showApi.searchItems({ ...params, fields: ShowApi.adminBaseFields }),
    deleteItem: showApi.deleteItem,
  };

  return (
    <DataPage
      model={model}
      title="Shows"
      itemType="show"
      columns={columns}
      addable
      editable
    />
  );
};

const columns = [
  { field: "_id", headerName: "ID", flex: 2.5, filterable: false },
  {
    field: "title",
    headerName: "Title",
    flex: 4,
    filterable: false,
    renderCell: ({ row }) => (
      <RectangularProfileCell imgUrl={row.posterUrl} name={row.title} />
    ),
  },
  {
    field: "firstAirDate",
    headerName: "First air",
    type: "date",
    filterable: false,
    valueGetter: (params) =>
      new Date(params.row.firstAirDate).toLocaleDateString("vi-VN", {
        timeZone: "utc",
      }),
  },
  {
    field: "lastAirDate",
    headerName: "Last air",
    type: "date",
    filterable: false,
    valueGetter: (params) =>
      new Date(params.row.lastAirDate).toLocaleDateString("vi-VN", {
        timeZone: "utc",
      }),
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

export default Shows;
