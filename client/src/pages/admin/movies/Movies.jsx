import { toFullDateFormat } from "../../../api/helper";
import useBackendApi from "../../../hooks/useBackendApi";
import DataPage from "../data-page/DataPage";
import { RectangularProfileCell } from "../../../components/table-cells/profile-cell/ProfileCell";
import "./movies.scss";
import { Chip } from "@mui/material";

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
        <Chip size="small" className="upcoming-cell" label="Upcoming" />
      ) : (
        <Chip size="small" className="released-cell" label="Released" />
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
  const backendApi = useBackendApi().movie;

  const model = {
    getItems: backendApi.getItems,
    searchItems: backendApi.searchItems,
    deleteItem: backendApi.deleteItem,
  };

  return (
    <DataPage
      model={model}
      title="Movies"
      itemType="movie"
      columns={columns}
      addable
      editable
    />
  );
};

export default Movies;
