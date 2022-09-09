import "./adminSeasonGrid.scss";
import { toBritishDate } from "../../api/helper";
import CrudDataGrid from "../tables/crud-data-grid/CrudDataGrid";
import { Avatar, CardHeader } from "@mui/material";

const AdminSeasonGrid = ({ seasons = [] }) => {
  return (
    <div style={{ height: 400, width: "100%" }}>
      <CrudDataGrid
        rows={seasons[0]?.episodes || []}
        columns={columns}
        getRowId={(row) => row._id}
      />
    </div>
  );
};

const columns = [
  { field: "_id", headerName: "ID", flex: 1.5, minWidth: 220 },
  {
    field: "episodeNumber",
    headerName: "Episode",
    editable: true,
  },
  {
    field: "title",
    headerName: "Title",
    flex: 2,
    minWidth: 220,
    editable: true,
    renderCell: ({ row }) => (
      <CardHeader
        className="episode-card-header"
        avatar={
          <Avatar src={row.thumbnailUrl} variant="rounded" alt={row.title}>
            <i className="bx bxs-movie-play" />
          </Avatar>
        }
        title={row.title}
      />
    ),
  },
  {
    field: "airDate",
    headerName: "Air date",
    minWidth: 120,
    width: 110,
    valueFormatter: ({ value }) => toBritishDate(value),
    editable: true,
  },
  { field: "runtime", headerName: "Runtime", editable: true },
  { field: "overview", headerName: "Overview", editable: true },
  { field: "thumbnailUrl", headerName: "Thumbnail URL", editable: true },
];

export default AdminSeasonGrid;
