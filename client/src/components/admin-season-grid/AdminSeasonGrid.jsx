import "./adminSeasonGrid.scss";
import { toBritishDate } from "../../api/helper";
import CrudDataGrid from "../tables/crud-data-grid/CrudDataGrid";
import { Avatar, CardHeader } from "@mui/material";
import AdminSeasonGridToolbar from "./AdminSeasonGridToolbar";
import { useState, useCallback } from "react";

const AdminSeasonGrid = ({ seasons = [], onChange }) => {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleEpisodeDelete = useCallback(
    (id) => {
      const episodes = seasons[selectedTab].episodes.filter(
        (ep) => ep._id !== id
      );
      const newSeasons = seasons.map((s, i) =>
        i === selectedTab ? { ...s, episodes } : s
      );
      onChange && onChange(newSeasons);
    },
    [seasons, selectedTab, onChange]
  );

  const handleEpisodeEdit = useCallback(
    ({ row }) => {
      const episodes = seasons[selectedTab].episodes.map((ep) =>
        ep._id === row._id ? row : ep
      );
      const newSeasons = seasons.map((s, i) =>
        i === selectedTab ? { ...s, episodes } : s
      );
      onChange && onChange(newSeasons);
    },
    [seasons, selectedTab, onChange]
  );

  const handleSeasonDetailChange = useCallback(
    (fieldName, value) => {
      const newSeasons = seasons.map((s, i) =>
        i === selectedTab ? { ...s, [fieldName]: value } : s
      );
      onChange && onChange(newSeasons);
    },
    [seasons, selectedTab, onChange]
  );

  return (
    <div style={{ height: 800, width: "100%" }}>
      <CrudDataGrid
        rows={seasons[selectedTab]?.episodes || []}
        columns={columns}
        getRowId={(row) => row._id}
        components={{ Toolbar: AdminSeasonGridToolbar }}
        componentsProps={{
          toolbar: {
            seasons,
            selectedTab,
            onSelectedTabChange: (_, newValue) => setSelectedTab(newValue),
            onSeasonDetailChange: handleSeasonDetailChange,
          },
        }}
        onDeleteRow={handleEpisodeDelete}
        onRowEditStop={handleEpisodeEdit}
      />
    </div>
  );
};

const columns = [
  { field: "_id", headerName: "ID", flex: 1.5, minWidth: 220 },
  {
    field: "episodeNumber",
    headerName: "Episode",
    type: "number",
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
