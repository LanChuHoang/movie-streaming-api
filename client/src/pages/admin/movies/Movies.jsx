import { toFullDateFormat } from "../../../api/helper";
import useBackendApi from "../../../hooks/useBackendApi";

import DataPage from "../data-page/DataPage";
import RoleCell from "../../../components/table-cells/role-cell/RoleCell";
import { RectangularProfileCell } from "../../../components/table-cells/profile-cell/ProfileCell";
import "./movies.scss";

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
    field: "isUpcoming",
    headerName: "Status",
    flex: 1.2,
    filterable: false,
    renderCell: ({ row }) =>
      row.isUpcoming ? (
        <RoleCell className="upcoming-cell">Upcoming</RoleCell>
      ) : (
        <RoleCell className="released-cell">Released</RoleCell>
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

const Movies = () => {
  const backendApi = useBackendApi();
  const model = {
    addItem: (item) => {},
    getItems: (params) => backendApi.getItems("movie", params),
    searchItems: (params) => backendApi.searchItems("movie", params),
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
