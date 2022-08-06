import { toFullDateFormat } from "../../../api/helper";
import useBackendApi from "../../../hooks/useBackendApi";

import DataPage from "../data-page/DataPage";
import StatusCell from "../../../components/table-cells/status-cell/StatusCell";

const columns = [
  { field: "_id", headerName: "ID", flex: 2.5, filterable: false },
  { field: "title", headerName: "Title", flex: 3, filterable: false },
  {
    field: "runtime",
    headerName: "Runtime",
    filterable: false,
    valueGetter: (params) => {
      const hours = Math.floor(params.row.runtime / 60);
      const minutes = params.row.runtime % 60;
      const hourPart = hours > 0 ? `${hours}h` : "";
      const minutePart = minutes > 1 ? `${minutes}mins` : `${minutes}min`;
      return `${hourPart} ${minutePart}`;
    },
  },
  {
    field: "releaseDate",
    headerName: "Release date",
    type: "date",
    filterable: false,
    valueGetter: (params) =>
      new Date(params.row.releaseDate).toLocaleDateString("vi-VN", {
        timeZone: "utc",
      }),
  },
  {
    field: "createdAt",
    headerName: "Added at",
    type: "date",
    flex: 2,
    align: "right",
    headerAlign: "right",
    filterable: false,
    valueGetter: (params) => toFullDateFormat(params.row.createdAt),
  },
  {
    field: "isUpcomming",
    headerName: "Status",
    flex: 1.2,
    align: "right",
    headerAlign: "right",
    filterable: false,
    renderCell: (params) => <StatusCell isUpcoming={params.row.isUpcomming} />,
  },
];

const Movies = () => {
  const backendApi = useBackendApi();
  const model = {
    addItem: (item) => {},
    getItems: async (params) => {
      return (await backendApi.getItems("movie", params)).data;
    },
    updateItem: (id) => {
      console.log(id);
    },
    deleteItem: (id) => {
      console.log(id);
    },
  };

  return (
    <DataPage title="Movies" itemType="movie" columns={columns} model={model} />
  );
};

export default Movies;
